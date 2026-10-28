from fastapi.testclient import TestClient


def test_health(client: TestClient):
    assert client.get("/health").json() == {"status": "ok"}
