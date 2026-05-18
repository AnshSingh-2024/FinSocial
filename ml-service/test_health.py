"""
Smoke tests for ml-service.
Run: pytest test_health.py -v
"""
import pytest
import sys
import os

# Prevent actual model loading in tests
os.environ.setdefault("DATABASE_URL", "")

from app import app


@pytest.fixture
def client():
    app.config["TESTING"] = True
    with app.test_client() as client:
        yield client


def test_health_endpoint(client):
    response = client.get("/health")
    assert response.status_code == 200
    data = response.get_json()
    assert data["status"] == "ok"
    assert data["service"] == "ml-service"


def test_predict_endpoint_accepts_ticker(client):
    response = client.post(
        "/predict",
        json={"ticker": "RELIANCE.NS"},
        content_type="application/json",
    )
    assert response.status_code == 200
    data = response.get_json()
    assert "verdict" in data
    assert "confidence" in data
    assert data["verdict"] in ["BUY", "SELL", "HOLD"]
    assert 0 <= data["confidence"] <= 100


def test_sentiment_batch_endpoint(client):
    response = client.post(
        "/sentiment-batch",
        json={"texts": ["Markets surged today on strong earnings."]},
        content_type="application/json",
    )
    assert response.status_code == 200
    data = response.get_json()
    assert "results" in data
    assert len(data["results"]) == 1
    assert data["results"][0]["label"] in ["bullish", "bearish", "neutral"]
