import os
from dataclasses import dataclass
from dotenv import load_dotenv

load_dotenv()


@dataclass(frozen=True)
class Settings:
    database_url: str
    spacex_api_base: str
    cors_origins: str

    @staticmethod
    def from_env() -> "Settings":
        return Settings(
            database_url=os.getenv("DATABASE_URL", "sqlite:///missioncontrol.db"),
            spacex_api_base=os.getenv("SPACEX_API_BASE", "https://api.spacexdata.com/v4"),
            cors_origins=os.getenv("CORS_ORIGINS", "http://localhost:5173"),
        )
