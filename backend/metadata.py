"""
Metadata lookup – reads ``properties.csv`` and exposes a function to
retrieve documented plant information by label (class name).
"""

from __future__ import annotations

from pathlib import Path
from typing import Dict, Optional

import pandas as pd


class PlantMetadataStore:
    """Thin read-only wrapper around the project's properties CSV."""

    def __init__(self, csv_path: str | Path):
        self.csv_path = Path(csv_path)
        if not self.csv_path.exists():
            raise FileNotFoundError(f"Metadata CSV not found: {self.csv_path}")

        try:
            self.df = pd.read_csv(self.csv_path, encoding="utf-8")
        except UnicodeDecodeError:
            self.df = pd.read_csv(self.csv_path, encoding="latin-1")
        # Normalise column names to lowercase/stripped for safety
        self.df.columns = [c.strip().lower() for c in self.df.columns]
        # Build a lookup keyed by the ``label`` column (= class name)
        self._lookup: Dict[str, Dict] = {}
        for _, row in self.df.iterrows():
            label = str(row.get("label", "")).strip()
            if label:
                self._lookup[label] = row.to_dict()

    def get(self, plant_name: str) -> Optional[Dict]:
        """
        Return metadata for *plant_name* or ``None`` if not found.

        The returned dict always contains the keys the frontend expects,
        filling missing / NaN values with safe defaults.
        """
        row = self._lookup.get(plant_name)
        if row is None:
            return None

        def _safe(val: object, default: str = "Not available") -> str:
            if val is None:
                return default
            s = str(val).strip()
            if s == "" or s.lower() == "nan":
                return default
            s = s.replace("\xff", " ").replace("\ufffd", " ")
            s = " ".join(s.split())
            return s or default

        return {
            "botanical_name":     _safe(row.get("botanical_name")),
            "common_name":        _safe(row.get("common_name")),
            "family":             _safe(row.get("family")),
            "parts_used":         _safe(row.get("parts_used")),
            "medicinal_property": _safe(row.get("medicinal_property")),
            "side_effects":       _safe(row.get("side_effects")),
        }
