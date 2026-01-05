import os
from flask import Flask
from flask_cors import CORS

from .config import Settings
from .db import init_db
from .routes import bp as api_bp


def create_app() -> Flask:
    app = Flask(__name__)

    settings = Settings.from_env()
    app.config["SETTINGS"] = settings

    # CORS
    origins = [o.strip() for o in settings.cors_origins.split(",") if o.strip()]
    CORS(app, resources={r"/api/*": {"origins": origins or "*"}})

    # DB
    init_db(settings.database_url)

    # Routes
    app.register_blueprint(api_bp)

    @app.get("/health")
    def health():
        return {"status": "ok"}

    return app
