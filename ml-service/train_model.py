"""
Train XGBoost model using StockHistory data already in Postgres.
Falls back to synthetic data if the DB has no history yet.
"""
import os
import pandas as pd
import numpy as np
import xgboost as xgb
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import joblib

DATABASE_URL = os.environ.get("DATABASE_URL", "")


def calculate_technical_indicators(df):
    df = df.copy()
    df['SMA_20'] = df['close'].rolling(window=20).mean()
    df['SMA_50'] = df['close'].rolling(window=50).mean()

    delta = df['close'].diff()
    gain = delta.where(delta > 0, 0).rolling(window=14).mean()
    loss = (-delta.where(delta < 0, 0)).rolling(window=14).mean()
    rs = gain / (loss + 1e-9)
    df['RSI'] = 100 - (100 / (1 + rs))

    exp1 = df['close'].ewm(span=12, adjust=False).mean()
    exp2 = df['close'].ewm(span=26, adjust=False).mean()
    df['MACD'] = exp1 - exp2
    df['MACD_Signal'] = df['MACD'].ewm(span=9, adjust=False).mean()

    df['BB_Mid'] = df['close'].rolling(window=20).mean()
    df['BB_Upper'] = df['BB_Mid'] + 2 * df['close'].rolling(window=20).std()
    df['BB_Lower'] = df['BB_Mid'] - 2 * df['close'].rolling(window=20).std()

    return df.dropna()


def load_from_db():
    """Load all StockHistory rows from Postgres."""
    if not DATABASE_URL:
        return None
    try:
        from sqlalchemy import create_engine, text
        engine = create_engine(DATABASE_URL)
        with engine.connect() as conn:
            result = conn.execute(text("""
                SELECT sh.date, sh.open, sh.high, sh.low, sh.close, sh.volume, s.ticker
                FROM "StockHistory" sh
                JOIN "Stock" s ON sh."stockId" = s.id
                ORDER BY s.ticker, sh.date
            """))
            rows = result.fetchall()
        if not rows:
            return None
        df = pd.DataFrame(rows, columns=['date', 'open', 'high', 'low', 'close', 'volume', 'ticker'])
        df['date'] = pd.to_datetime(df['date'])
        print(f"Loaded {len(df)} rows from database across {df['ticker'].nunique()} tickers")
        return df
    except Exception as e:
        print(f"DB load failed: {e}")
        return None


def make_synthetic_data(n=2000):
    """Generate synthetic OHLCV data for a random walk so training can still proceed."""
    print("Generating synthetic training data...")
    np.random.seed(42)
    prices = 1000 + np.cumsum(np.random.randn(n) * 10)
    df = pd.DataFrame({
        'close': prices,
        'open':  prices * (1 + np.random.randn(n) * 0.005),
        'high':  prices * (1 + np.abs(np.random.randn(n)) * 0.01),
        'low':   prices * (1 - np.abs(np.random.randn(n)) * 0.01),
        'volume': np.random.randint(100000, 5000000, n).astype(float),
    })
    return df


def prepare_features(raw_df):
    all_dfs = []
    for ticker, grp in raw_df.groupby('ticker') if 'ticker' in raw_df.columns else [('synth', raw_df)]:
        grp = grp.sort_values('date') if 'date' in grp.columns else grp
        grp = calculate_technical_indicators(grp)
        grp['Target'] = (grp['close'].shift(-1) > grp['close']).astype(int)
        grp = grp.iloc[:-1]
        all_dfs.append(grp)

    combined = pd.concat(all_dfs)
    features = ['open', 'high', 'low', 'close', 'volume',
                'SMA_20', 'SMA_50', 'RSI', 'MACD', 'MACD_Signal', 'BB_Upper', 'BB_Lower']
    return combined[features], combined['Target']


def train_model():
    raw = load_from_db()
    if raw is None or raw.empty:
        raw = make_synthetic_data()

    X, y = prepare_features(raw)
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    print(f"Training XGBoost on {len(X_train)} samples...")
    model = xgb.XGBClassifier(
        n_estimators=100,
        learning_rate=0.1,
        max_depth=5,
        random_state=42,
        eval_metric='logloss',
    )
    model.fit(X_train, y_train)

    accuracy = accuracy_score(y_test, model.predict(X_test))
    print(f"Test accuracy: {accuracy:.4f}")

    os.makedirs('models', exist_ok=True)
    joblib.dump(model, 'models/xgboost_stock_model.pkl')
    print("Model saved to models/xgboost_stock_model.pkl")


if __name__ == "__main__":
    train_model()
