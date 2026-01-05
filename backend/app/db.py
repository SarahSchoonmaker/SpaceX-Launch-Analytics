from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase

_ENGINE = None
_SessionLocal = None


class Base(DeclarativeBase):
    pass


def init_db(database_url: str) -> None:
    global _ENGINE, _SessionLocal
    _ENGINE = create_engine(database_url, echo=False, future=True)
    _SessionLocal = sessionmaker(bind=_ENGINE, autoflush=False, autocommit=False, future=True)

    # Import models before create_all
    from . import models  # noqa: F401
    Base.metadata.create_all(_ENGINE)


def get_session():
    if _SessionLocal is None:
        raise RuntimeError("DB not initialized. Call init_db() first.")
    return _SessionLocal()
