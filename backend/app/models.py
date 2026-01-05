from sqlalchemy import String, Integer, Float, Boolean, DateTime, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column
from datetime import datetime

from .db import Base


class Launch(Base):
    __tablename__ = "launches"
    __table_args__ = (UniqueConstraint("spacex_id", name="uq_launch_spacex_id"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    spacex_id: Mapped[str] = mapped_column(String(64), nullable=False)
    name: Mapped[str] = mapped_column(String(256), nullable=False)
    date_utc: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    upcoming: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    success: Mapped[bool | None] = mapped_column(Boolean, nullable=True)

    rocket_id: Mapped[str | None] = mapped_column(String(64), nullable=True)
    flight_number: Mapped[int | None] = mapped_column(Integer, nullable=True)

    # Some useful signals (often present; safe to be null)
    cores_reused: Mapped[int | None] = mapped_column(Integer, nullable=True)
    payloads_count: Mapped[int | None] = mapped_column(Integer, nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
