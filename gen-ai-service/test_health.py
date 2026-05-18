"""
Smoke tests for gen-ai-service.
Run: pytest test_health.py -v
"""
import pytest
import os

os.environ.setdefault("DATABASE_URL", "")
os.environ.setdefault("GEMINI_API_KEY", "")

from app import app


@pytest.fixture
def client():
    from fastapi.testclient import TestClient
    return TestClient(app)


def test_health(client):
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["service"] == "gen-ai-service"
    assert "gemini_model" in data
    assert isinstance(data.get("gemini_key_configured"), bool)


def test_chat_fallback(client):
    """Chat should return fallback response when LLM is not configured."""
    response = client.post("/chat", json={"message": "What is RSI?"})
    assert response.status_code == 200
    data = response.json()
    assert "reply" in data
    assert len(data["reply"]) > 10


def test_suggest_answer_fallback(client):
    response = client.post(
        "/suggest-answer",
        json={
            "questionTitle": "What is RSI?",
            "questionBody": "I see RSI on the charts, what does it mean?",
            "tags": ["Technical Analysis"],
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert "suggestion" in data
