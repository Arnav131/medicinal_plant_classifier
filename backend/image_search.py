"""
Google Custom Search – server-side image search.

Uses the Google Custom Search JSON API to fetch reference images for a
predicted plant.  API keys are read from environment variables and are
**never** exposed to the frontend.
"""

from __future__ import annotations

import os
from typing import Dict, List

import httpx

GOOGLE_API_KEY          = os.getenv("GOOGLE_API_KEY", "")
GOOGLE_SEARCH_ENGINE_ID = os.getenv("GOOGLE_SEARCH_ENGINE_ID", "")

SEARCH_URL = "https://www.googleapis.com/customsearch/v1"


async def search_plant_images(
    plant_name: str,
    botanical_name: str | None = None,
    num_results: int = 6,
) -> List[Dict[str, str]]:
    """
    Search Google Images for *plant_name* and return up to *num_results*
    image objects.

    Each result dict contains:
      - ``url``    – direct image URL
      - ``title``  – page title / snippet
      - ``source`` – page URL where the image was found

    Returns an **empty list** (never raises) when the API key is missing
    or the request fails, so the caller can always fall back gracefully.
    """
    if not GOOGLE_API_KEY or not GOOGLE_SEARCH_ENGINE_ID:
        return []

    # Build a descriptive query
    query_parts = [plant_name, "plant"]
    if botanical_name and botanical_name.lower() != "not available":
        query_parts.insert(0, botanical_name)
    query = " ".join(query_parts)

    params = {
        "key":        GOOGLE_API_KEY,
        "cx":         GOOGLE_SEARCH_ENGINE_ID,
        "q":          query,
        "searchType": "image",
        "num":        min(num_results, 10),
        "imgSize":    "large",
        "safe":       "active",
    }

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.get(SEARCH_URL, params=params)
            resp.raise_for_status()
            data = resp.json()
    except Exception:
        return []

    results: List[Dict[str, str]] = []
    for item in data.get("items", [])[:num_results]:
        results.append({
            "url":    item.get("link", ""),
            "title":  item.get("title", ""),
            "source": item.get("image", {}).get("contextLink", ""),
        })

    return results
