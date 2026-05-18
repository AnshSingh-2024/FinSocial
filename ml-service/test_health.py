"""
Smoke tests for ml-service.
Run: pytest test_health.py -v

/predict uses live yfinance when DATABASE_URL is unset. If Yahoo returns no rows,
the API responds with 422 — that is expected in CI or offline and is not mock data.
"""
import os

import pytest

# Prevent actual model loading in tests
os.environ.setdefault("DATABASE_URL", "")

from app import app  # noqa: E402 — after env


@pytest.fixture
def client():
    app.config["TESTING"] = True
    with app.test_client() as c:
        yield c


def test_health_endpoint(client):
    response = client.get("/health")
    assert response.status_code == 200
    data = response.get_json()
    assert data["status"] == "ok"
    assert data["service"] == "ml-service"


def test_predict_endpoint_accepts_ticker(client):
    """Live market data via yfinance; 422 if history is unavailable (rate limit, network, symbol)."""
    response = client.post(
        "/predict",
        json={"ticker": "RELIANCE.NS"},
        content_type="application/json",
    )
    assert response.status_code in (200, 422)
    data = response.get_json()
    if response.status_code == 200:
        assert "verdict" in data
        assert "confidence" in data
        assert data["verdict"] in ["BUY", "SELL", "HOLD"]
        assert 0 <= data["confidence"] <= 100
    else:
        assert "error" in data
        assert data.get("ticker") == "RELIANCE.NS"


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
