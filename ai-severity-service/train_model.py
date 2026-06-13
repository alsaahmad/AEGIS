from pathlib import Path
import joblib
from sklearn.pipeline import Pipeline, FeatureUnion
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import FunctionTransformer
from sklearn.metrics import classification_report
from sklearn.model_selection import train_test_split
import pandas as pd

from generate_dataset import generate
from severity_model import TextBuilder

DATA_PATH = Path("synthetic_severity_dataset.csv")
MODEL_PATH = Path("severity_model.joblib")

def train():
    if DATA_PATH.exists():
        df = pd.read_csv(DATA_PATH)
    else:
        df = generate(240)
        df.to_csv(DATA_PATH, index=False)
    X = df[["victim_count", "injury_type", "incident_description"]]
    y = df["severity"]
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    model = Pipeline([
        ("text", TextBuilder()),
        ("tfidf", TfidfVectorizer(ngram_range=(1, 2), min_df=1)),
        ("clf", LogisticRegression(max_iter=1000, class_weight="balanced")),
    ])
    model.fit(X_train, y_train)
    preds = model.predict(X_test)
    print(classification_report(y_test, preds))
    joblib.dump(model, MODEL_PATH)
    print(f"Saved {MODEL_PATH}")

if __name__ == "__main__":
    train()
