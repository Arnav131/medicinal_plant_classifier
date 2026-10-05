"""
FastAPI application – Medicinal Plant Identification backend.

Single endpoint:

    POST /predict
        Accepts: multipart/form-data  (field name: ``image``)
        Returns: JSON with prediction, metadata, and reference images.
"""

from __future__ import annotations

import os
from pathlib import Path

from dotenv import load_dotenv

# Load .env BEFORE any module reads env vars
_env_path = Path(__file__).resolve().parent / ".env"
load_dotenv(_env_path)

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles

from inference import PlantClassifier
from metadata import PlantMetadataStore
from image_search import search_plant_images

# ── Paths ─────────────────────────────────────────────────────────────
BACKEND_DIR    = Path(__file__).resolve().parent
PROJECT_ROOT   = BACKEND_DIR.parent.parent

def _resolve_asset(filename: str) -> Path:
    if (BACKEND_DIR / filename).exists():
        return BACKEND_DIR / filename
    return PROJECT_ROOT / filename

CHECKPOINT     = Path(os.getenv("MODEL_CHECKPOINT", str(_resolve_asset("trainedd_cnn_model.pt"))))
PROPERTIES_CSV = Path(os.getenv("PROPERTIES_CSV",  str(_resolve_asset("properties.csv"))))

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}
MAX_FILE_SIZE_MB   = 10

# ── Bootstrap model & metadata ────────────────────────────────────────
classifier = PlantClassifier(CHECKPOINT)
metadata_store = PlantMetadataStore(PROPERTIES_CSV)

# ── FastAPI app ───────────────────────────────────────────────────────
app = FastAPI(
    title="Medicinal Plant Identifier API",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],          # tighten in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health():
    return {"status": "ok", "model": "mobilenet_v3_large", "classes": len(classifier.class_names)}


@app.post("/predict")
async def predict(image: UploadFile = File(...)):
    # ── Validate file type ────────────────────────────────────────────
    ext = Path(image.filename or "").suffix.lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type '{ext}'. Accepted: {', '.join(ALLOWED_EXTENSIONS)}",
        )

    # ── Read & validate size ──────────────────────────────────────────
    contents = await image.read()
    size_mb = len(contents) / (1024 * 1024)
    if size_mb > MAX_FILE_SIZE_MB:
        raise HTTPException(
            status_code=400,
            detail=f"Image too large ({size_mb:.1f} MB). Maximum is {MAX_FILE_SIZE_MB} MB.",
        )

    # ── Predict ───────────────────────────────────────────────────────
    try:
        plant_name, class_index, confidence = classifier.predict_bytes(contents)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {exc}")

    # ── Metadata ──────────────────────────────────────────────────────
    meta = metadata_store.get(plant_name)
    if meta is None:
        meta = {
            "botanical_name":     "Not available",
            "common_name":        plant_name,
            "family":             "Not available",
            "parts_used":         "Not available",
            "medicinal_property": "Not available",
            "side_effects":       "Not available",
        }

    # ── Reference images ──────────────────────────────────────────────
    ref_images = await search_plant_images(
        plant_name,
        botanical_name=meta.get("botanical_name"),
    )

    return JSONResponse({
        "prediction": {
            "plant_name":  plant_name,
            "class_index": class_index,
            "confidence":  confidence,
        },
        "metadata": meta,
        "reference_images": ref_images,
    })


# ── Serve Built Frontend (Single-service deployment on Render) ─────────
FRONTEND_DIST = Path(__file__).resolve().parent.parent / "frontend" / "dist"

if FRONTEND_DIST.exists():
    # Mount assets folder
    assets_dir = FRONTEND_DIST / "assets"
    if assets_dir.exists():
        app.mount("/assets", StaticFiles(directory=str(assets_dir)), name="assets")

    # Serve index.html or static files for all other client routes
    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str):
        # Don't intercept API routes or docs
        if full_path in ("predict", "health", "docs", "openapi.json"):
            raise HTTPException(status_code=404, detail="Not found")
        file_path = FRONTEND_DIST / full_path
        if full_path and file_path.is_file():
            return FileResponse(file_path)
        return FileResponse(FRONTEND_DIST / "index.html")

