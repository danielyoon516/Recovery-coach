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


def test_get_workout(client: TestClient):
    res = client.post("/workouts", json=VALID)
    workout_id = res.json()["id"]

    res = client.get(f"/workouts/{workout_id}")
    assert res.status_code == 200
    assert res.json()["type"] == VALID["type"]


def test_get_missing_workout(client: TestClient):
    res = client.get("/workouts/9999")
    assert res.status_code == 404


def test_update_workout(client: TestClient):
    res = client.post("/workouts", json=VALID)
    workout_id = res.json()["id"]

    res = client.patch(f"/workouts/{workout_id}", json={"rpe": 9})
    assert res.status_code == 200
    assert res.json()["rpe"] == 9
    assert res.json()["type"] == VALID["type"]


def test_update_missing_workout(client: TestClient):
    res = client.patch("/workouts/9999", json={"rpe": 9})
    assert res.status_code == 404
