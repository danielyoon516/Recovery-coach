from fastapi.testclient import TestClient

VALID = {"workout_date": "2026-10-24", "type": "run", "duration_min": 40, "rpe": 6}


def test_create_and_list_workout(client: TestClient):
    res = client.post("/workouts", json=VALID)
    assert res.status_code == 201
    assert res.json()["id"] == 1
    assert len(client.get("/workouts").json()) == 1


def test_rejects_invalid_rpe(client: TestClient):
    res = client.post("/workouts", json={**VALID, "rpe": 11})
    assert res.status_code == 422
