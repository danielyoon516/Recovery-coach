
# Recovery Coach

A web application for tracking workouts (type, duration, RPE) and sleep, built for athletes trying to balance training and recovery.

## Features
- Log workouts (date, type, duration, RPE)
- Log sleep (date, hours, quality)
- View, update, and delete entries
- Automatic input validation
- Automated tests

## Roadmap
- React frontend
- Training-load metrics based on workout history
- Readiness recommendation: whether to train or rest on a given day
- Deployment

## Tech Stack
- **Backend:** FastAPI
- **Database:** PostgreSQL in Docker
- **ORM:** SQLModel
- **Testing:** pytest with in-memory SQLite
- **Formatting:** ruff

## Getting Started
1. Clone the repo:
   ```
   git clone https://github.com/danielyoon516/Recovery-coach.git
   cd Recovery-coach
   ```
2. Create your environment file:
   ```
   cp .env.example .env
   ```
3. Start Postgres:
   ```
   docker compose up -d
   ```
4. Create and activate a virtual environment:
   ```
   python -m venv .venv
   source .venv/bin/activate
   ```
5. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
6. Run the server:
   ```
   uvicorn app.main:app --reload
   ```
7. Open the interactive API docs at `http://localhost:8000/docs`.

## Running Tests
```
python -m pytest -v
```
Tests run against an isolated in-memory SQLite database, so they never touch real Postgres data. They cover both successful requests and error cases, such as invalid input (`422`) and missing entries (`404`).

## API Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/health` | Health check |
| GET | `/workouts` | List all workouts |
| POST | `/workouts` | Create a workout |
| GET | `/workouts/{workout_id}` | Get a workout by ID |
| PATCH | `/workouts/{workout_id}` | Partially update a workout |
| DELETE | `/workouts/{workout_id}` | Delete a workout |
| GET | `/sleeps` | List all sleep entries |
| POST | `/sleeps` | Create a sleep entry |
| GET | `/sleeps/{sleep_id}` | Get a sleep entry by ID |
| PATCH | `/sleeps/{sleep_id

