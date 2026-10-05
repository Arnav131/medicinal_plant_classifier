"""
Inference module – loads the trained CbMOGEO plant-classification model
and exposes a single ``predict_image`` helper that mirrors the notebook's
evaluation preprocessing exactly.

Model details (extracted from the project checkpoint):
  - Backbone : MobileNetV3-Large (torchvision)
  - Classifier: nn.Sequential(Dropout(0.2), Linear(960, 150))
  - Image size: 224×224
  - Normalization: ImageNet mean/std
"""

from __future__ import annotations

import io
from pathlib import Path
from typing import Tuple, List

import torch
import torch.nn as nn
from torchvision import transforms
from torchvision.models import mobilenet_v3_large
from PIL import Image

# ── Constants (same as the notebook) ──────────────────────────────────
IMAGENET_MEAN = (0.485, 0.456, 0.406)
IMAGENET_STD  = (0.229, 0.224, 0.225)
IMG_SIZE      = 224


def _build_model(num_classes: int, dropout: float = 0.2) -> nn.Module:
    """Recreate the exact architecture used during CbMOGEO training."""
    model = mobilenet_v3_large(weights=None)          # no pretrained – we load our own
    # Replace classifier to match the checkpoint structure:
    # classifier.0 = Dropout, classifier.1 = Linear
    in_features = model.classifier[0].in_features     # 960
    model.classifier = nn.Sequential(
        nn.Dropout(p=dropout),
        nn.Linear(in_features, num_classes),
    )
    return model


class PlantClassifier:
    """Thin wrapper around the trained PyTorch model."""

    def __init__(self, checkpoint_path: str | Path, device: str | None = None):
        self.device = torch.device(
            device or ("cuda" if torch.cuda.is_available() else "cpu")
        )

        # ── Load checkpoint ───────────────────────────────────────────
        ckpt = torch.load(checkpoint_path, map_location=self.device, weights_only=False)
        self.class_names: List[str] = ckpt["class_names"]
        self.image_size: int       = ckpt.get("image_size", IMG_SIZE)
        backbone_name: str         = ckpt.get("backbone", "mobilenet_v3_large")

        if backbone_name != "mobilenet_v3_large":
            raise RuntimeError(
                f"Expected mobilenet_v3_large backbone, got '{backbone_name}'. "
                "Update inference.py if the model architecture has changed."
            )

        num_classes = len(self.class_names)
        self.model = _build_model(num_classes)
        self.model.load_state_dict(ckpt["model_state_dict"])
        self.model.to(self.device)
        self.model.eval()

        # ── Eval transform (identical to cb_eval_transform in notebook) ─
        self.transform = transforms.Compose([
            transforms.Resize((self.image_size, self.image_size)),
            transforms.ToTensor(),
            transforms.Normalize(IMAGENET_MEAN, IMAGENET_STD),
        ])

    # ── Public API ────────────────────────────────────────────────────
    def predict(self, image: Image.Image) -> Tuple[str, int, float]:
        """
        Classify a single PIL Image.

        Returns
        -------
        plant_name : str
            Human-readable class name.
        class_index : int
            Zero-based class index (0–149).
        confidence : float
            Softmax probability of the predicted class (0–100 %).
        """
        image = image.convert("RGB")
        tensor = self.transform(image).unsqueeze(0).to(self.device)

        with torch.no_grad():
            logits = self.model(tensor)
            probs  = torch.softmax(logits, dim=1)
            confidence, class_idx = probs.max(dim=1)

        idx  = class_idx.item()
        conf = round(confidence.item() * 100, 2)
        name = self.class_names[idx]
        return name, idx, conf

    def predict_bytes(self, image_bytes: bytes) -> Tuple[str, int, float]:
        """Convenience wrapper that accepts raw image bytes."""
        image = Image.open(io.BytesIO(image_bytes))
        return self.predict(image)
