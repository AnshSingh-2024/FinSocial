FROM python:3.10-slim

WORKDIR /app

ARG INSTALL_NLP=false

RUN apt-get update && apt-get install -y --no-install-recommends curl && rm -rf /var/lib/apt/lists/*

# Default: slim image for Render (no PyTorch/FinBERT — avoids OOM on 512MB instances)
COPY requirements-render.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Local/full stack: docker build --build-arg INSTALL_NLP=true
RUN if [ "$INSTALL_NLP" = "true" ]; then \
      pip install --no-cache-dir torch==2.3.0 --index-url https://download.pytorch.org/whl/cpu \
      && pip install --no-cache-dir -r requirements-nlp.txt; \
    fi

COPY . .

# Model ships in repo (models/xgboost_stock_model.pkl). Train locally, do not train at image build (OOM on Render).
ENV DISABLE_FINBERT=1
ENV PYTHONUNBUFFERED=1

HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=5 \
  CMD curl -sf http://localhost:5001/health || exit 1

EXPOSE 5001
CMD ["gunicorn", "--bind", "0.0.0.0:5001", "--workers", "1", "--threads", "2", "--timeout", "120", "app:app"]
