# MissionControl AI — SpaceX Launch Analytics (Flask + React)

MissionControl AI is a full-stack analytics dashboard that ingests SpaceX launch data, calculates launch frequency and reliability metrics using reproducible, rule-based analytics, and exposes a structured JSON summary suitable for safe, explainable AI summarization.

---

![MissionControl Dashboard](frontend/src/images/spacex.png)

## Tech Stack

- **Backend:** Python, Flask, SQLAlchemy
- **Database:** SQLite (default)
- **Frontend:** React, Vite, Material UI
- **Data Source:** SpaceX API (v4)

---

## Prerequisites

Ensure the following are installed:

### Python

```bash
python --version


Backend (Flask API)

cd backend
python -m venv .venv
source ./.venv/Scripts/activate   # Windows (Git Bash)
pip install -r requirements.txt


Create a .env file in backend/:

# SQLite (default)
DATABASE_URL=sqlite:///missioncontrol.db

# Optional Postgres example
# DATABASE_URL=postgresql+psycopg2://postgres:postgres@localhost:5432/missioncontrol

SPACEX_API_BASE=https://api.spacexdata.com/v4
CORS_ORIGINS=http://localhost:5173


Start the backend:

python run.py
```

![MissionControl Dashboard](frontend/images/spacex.png)

Frontend (React Dashboard)
cd ../frontend
npm install

Root Setup (One-command dev)

From the project root:

cd ..
npm install

Running the App (Single Command)

From the project root:

npm run dev

---

## Prerequisites

Ensure the following are installed:

- **Python 3.10+**
- **Node.js 18+**
- **npm**

Verify installations:

```bash
python --version
node --version
npm --version

cd backend
python -m venv .venv
source ./.venv/Scripts/activate   # Windows (Git Bash)
pip install -r requirements.txt

# SQLite (default)
DATABASE_URL=sqlite:///missioncontrol.db

# Optional Postgres example
# DATABASE_URL=postgresql+psycopg2://postgres:postgres@localhost:5432/missioncontrol

SPACEX_API_BASE=https://api.spacexdata.com/v4
CORS_ORIGINS=http://localhost:5173

Start the backend:
python run.py


cd ../frontend
npm install


From the project root:

npm install



```
