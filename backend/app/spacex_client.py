# backend/app/spacex_client.py

from __future__ import annotations
import requests
from datetime import datetime
from typing import Any


class SpaceXClient:
    """
    Thin HTTP client for the public SpaceX v4 API.
    Responsible ONLY for fetching and normalizing raw data.
    """

    def __init__(self, base_url: str):
        self.base_url = base_url.rstrip("/")

    def _get(self, path: str) -> Any:
        url = f"{self.base_url}/{path.lstrip('/')}"
        resp = requests.get(url, timeout=30)
        resp.raise_for_status()
        return resp.json()

    def fetch_launches(self, limit: int = 120) -> list[dict]:
        """
        Fetch recent SpaceX launches.
        Returns newest launches first.
        """
        launches = self._get("/launches")

        # Sort newest → oldest
        launches.sort(key=lambda x: x.get("date_utc", ""), reverse=True)

        return launches[:limit]

    @staticmethod
    def parse_date(date_utc: str) -> datetime:
        """
        Parse SpaceX ISO timestamps safely.
        Example input: 2020-05-30T19:22:00.000Z
        """
        if not date_utc:
            raise ValueError("Missing date_utc")

        # Normalize Z → +00:00 for Python
        if date_utc.endswith("Z"):
            date_utc = date_utc[:-1] + "+00:00"

        return datetime.fromisoformat(date_utc)
