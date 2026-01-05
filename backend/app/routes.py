from __future__ import annotations
from flask import Blueprint, current_app, request
from sqlalchemy import select

from .db import get_session
from .models import Launch
from .spacex_client import SpaceXClient
from .metrics import compute_metrics, make_auditable_brief

bp = Blueprint("api", __name__, url_prefix="/api")


@bp.post("/ingest/launches")
def ingest_launches():
    settings = current_app.config["SETTINGS"]
    limit = int(request.args.get("limit", "120"))

    client = SpaceXClient(settings.spacex_api_base)
    raw = client.fetch_launches(limit=limit)

    inserted = 0
    updated = 0

    with get_session() as db:
        for item in raw:
            spacex_id = item.get("id")
            if not spacex_id:
                continue

            existing = db.execute(
                select(Launch).where(Launch.spacex_id == spacex_id)
            ).scalar_one_or_none()

            payloads = item.get("payloads") or []
            cores = item.get("cores") or []
            cores_reused = sum(1 for c in cores if c.get("reused") is True)

            data = {
                "spacex_id": spacex_id,
                "name": item.get("name") or "Unknown",
                "date_utc": client.parse_date(item["date_utc"]),
                "upcoming": bool(item.get("upcoming", False)),
                "success": item.get("success", None),
                "rocket_id": item.get("rocket", None),
                "flight_number": item.get("flight_number", None),
                "payloads_count": len(payloads),
                "cores_reused": cores_reused if cores else None,
            }

            if existing is None:
                db.add(Launch(**data))
                inserted += 1
            else:
                for k, v in data.items():
                    setattr(existing, k, v)
                updated += 1

        db.commit()

    return {"status": "ok", "inserted": inserted, "updated": updated, "limit": limit}


@bp.get("/launches")
def list_launches():
    limit = int(request.args.get("limit", "50"))

    with get_session() as db:
        rows = db.execute(
            select(Launch).order_by(Launch.date_utc.desc()).limit(limit)
        ).scalars().all()

    def to_dict(x: Launch) -> dict:
        return {
            "id": x.id,
            "name": x.name,
            "date_utc": x.date_utc.isoformat(),
            "upcoming": x.upcoming,
            "success": x.success,
            "flight_number": x.flight_number,
            "rocket_id": x.rocket_id,
            "payloads_count": x.payloads_count,
            "cores_reused": x.cores_reused,
        }

    return {"items": [to_dict(x) for x in rows], "count": len(rows)}


@bp.get("/metrics")
def metrics():
    with get_session() as db:
        launches = db.execute(select(Launch)).scalars().all()

    m = compute_metrics(launches)
    return {
        "total": m.total,
        "successes": m.successes,
        "failures": m.failures,
        "success_rate": round(m.success_rate, 4),
        "upcoming": m.upcoming,
        "avg_days_between_recent": (
            round(m.avg_days_between_recent, 2) if m.avg_days_between_recent else None
        ),
        "cadence": m.cadence,
    }


@bp.get("/brief")
def brief():
    with get_session() as db:
        launches = db.execute(select(Launch)).scalars().all()

    m = compute_metrics(launches)
    return make_auditable_brief(m)
