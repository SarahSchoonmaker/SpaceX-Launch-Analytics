from __future__ import annotations
from datetime import datetime
from dataclasses import dataclass
from typing import Iterable
import math

from .models import Launch


def _days_between(d1: datetime, d2: datetime) -> float:
    return abs((d1 - d2).total_seconds()) / 86400.0


def cadence_classification(avg_days_between: float) -> str:
    if avg_days_between < 7:
        return "High"
    if avg_days_between <= 21:
        return "Medium"
    return "Low"


@dataclass(frozen=True)
class Metrics:
    total: int
    successes: int
    failures: int
    success_rate: float
    upcoming: int
    avg_days_between_recent: float | None
    cadence: str | None


def compute_metrics(launches: list[Launch]) -> Metrics:
    if not launches:
        return Metrics(
            total=0,
            successes=0,
            failures=0,
            success_rate=0.0,
            upcoming=0,
            avg_days_between_recent=None,
            cadence=None,
        )

    total = len(launches)
    upcoming = sum(1 for x in launches if x.upcoming)

    completed = [x for x in launches if not x.upcoming and x.success is not None]
    successes = sum(1 for x in completed if x.success is True)
    failures = sum(1 for x in completed if x.success is False)
    denom = max(1, len(completed))
    success_rate = successes / denom

    # Cadence from last 10 completed launches (newest-first assumed elsewhere)
    completed_sorted = sorted(
        [x for x in launches if not x.upcoming],
        key=lambda x: x.date_utc,
        reverse=True,
    )
    last_n = completed_sorted[:10]
    if len(last_n) < 2:
        return Metrics(total, successes, failures, success_rate, upcoming, None, None)

    gaps = []
    for i in range(len(last_n) - 1):
        gaps.append(_days_between(last_n[i].date_utc, last_n[i + 1].date_utc))

    avg_gap = sum(gaps) / len(gaps)
    cadence = cadence_classification(avg_gap)

    return Metrics(
        total=total,
        successes=successes,
        failures=failures,
        success_rate=success_rate,
        upcoming=upcoming,
        avg_days_between_recent=avg_gap,
        cadence=cadence,
    )


def make_auditable_brief(metrics: Metrics) -> dict:
    """
    Deterministic, auditable summary facts (no LLM).
    This is what you'd feed to an LLM to rephrase, if desired.
    """
    return {
        "facts": {
            "total_launches_in_db": metrics.total,
            "completed_successes": metrics.successes,
            "completed_failures": metrics.failures,
            "completed_success_rate": round(metrics.success_rate, 4),
            "upcoming_count": metrics.upcoming,
            "avg_days_between_recent_launches": (
                round(metrics.avg_days_between_recent, 2)
                if metrics.avg_days_between_recent is not None
                else None
            ),
            "cadence_classification": metrics.cadence,
        },
        "interpretation_rules": {
            "cadence": {
                "High": "< 7 days",
                "Medium": "7–21 days",
                "Low": "> 21 days",
            }
        },
        "note": "All facts computed deterministically; suitable for structured AI summarization.",
    }
