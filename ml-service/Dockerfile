FROM python:3.10-slim

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends curl && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
# Install CPU-only torch to keep image size manageable
RUN pip install --no-cache-dir torch==2.3.0 --index-url https://download.pytorch.org/whl/cpu \
    && pip install --no-cache-dir -r requirements.txt

COPY . .

# Train the model at build time (offline) so the pickle ships in the image.
# If yfinance can't reach the internet during build, it will fail silently
# and the app will fall back to heuristics.
RUN python train_model.py || echo "Model training skipped (no internet at build time)"

HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:5001/health || exit 1

EXPOSE 5001
CMD ["python", "app.py"]
