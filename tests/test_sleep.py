from fastapi.testclient import TestClient


VALID = {"sleep_date": "2026-10-24", "hours": 8, "quality": 4}


def test_create_and_list_sleep(client: TestClient):
    res = client.post("/sleeps", json=VALID)
    assert res.status_code == 201
    assert res.json()["id"] == 1
    assert len(client.get("/sleeps").json()) == 1


def test_rejects_invalid_quality(client: TestClient):
    res = client.post("/sleeps", json={**VALID, "quality": 6})
    assert res.status_code == 422


def test_get_sleep(client: TestClient):
    res = client.post("/sleeps", json=VALID)
    sleep_id = res.json()["id"]
    res = client.get(f"/sleeps/{sleep_id}")
    assert res.status_code == 200
    assert res.json()["sleep_date"] == VALID["sleep_date"]


def test_get_missing_sleep(client: TestClient):
    res = client.get("/sleeps/9999")
    assert res.status_code == 404


def test_update_sleep(client: TestClient):
    res = client.post("/sleeps", json=VALID)
    sleep_id = res.json()["id"]

    res = client.patch(f"/sleeps/{sleep_id}", json={"hours": 1})
    assert res.status_code == 200
    assert res.json()["hours"] == 1
    assert res.json()["sleep_date"] == VALID["sleep_date"]


def test_update_missing_sleep(client: TestClient):
    res = client.patch("/sleeps/9999", json={"hours": 1})
    assert res.status_code == 404


def test_delete_sleep(client: TestClient):
    res = client.post("/sleeps", json=VALID)
    sleep_id = res.json()["id"]

    res = client.delete(f"/sleeps/{sleep_id}")
    assert res.status_code == 204

    res = client.get(f"/sleeps/{sleep_id}")
    assert res.status_code == 404


def test_delete_missing_sleep(client: TestClient):
    res = client.delete("/sleeps/9999")
    assert res.status_code == 404
