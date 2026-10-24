from fastapi.testclient import TestClient

from app.main import app, sleeps

client = TestClient(app)

VALID = {"sleep_date":"2026-10-24", "hours":8, "quality":4}



def setup_function():
    sleeps.clear()


def test_create_and_list_sleep():
    res = client.post("/sleeps", json=VALID)
    assert res.status_code == 201
    assert res.json()["id"] == 1
    assert len(client.get("/sleeps").json()) == 1

def test_rejects_invalid_quality():
    res = client.post("/sleeps", json={**VALID, "quality": 6})
    assert res.status_code == 422