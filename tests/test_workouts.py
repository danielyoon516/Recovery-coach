from fastapi.testclient import TestClient

from app.main import app, workouts

client = TestClient(app)

VALID = {"workout_date": "2026-10-24", "type": "run", "duration_min": 40, "rpe": 6}


def setup_function():
    workouts.clear()


def test_health():
    assert client.get("/health").json() == {"status": "ok"}


def test_create_and_list_workout():
    res = client.post("/workouts", json=VALID)
    assert res.status_code == 201
    assert res.json()["id"] == 1
    assert len(client.get("/workouts").json()) == 1


def test_rejects_invalid_rpe():
    res = client.post("/workouts", json={**VALID, "rpe": 11})
    assert res.status_code == 422
