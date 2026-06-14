from pathlib import Path
from typing import Dict, Tuple
import subprocess
import sys

import joblib
import numpy as np
import pandas as pd
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

import severity_model  # noqa: F401 - registers TextBuilder for joblib unpickling

MODEL_PATH = Path("severity_model.joblib")

CRITICAL_KEYWORDS = {
    "unconscious": 0.25,
    "not breathing": 0.35,
    "no breathing": 0.35,
    "bleeding heavily": 0.25,
    "heavy bleeding": 0.25,
    "chest pain": 0.22,
    "cardiac": 0.3,
    "heart attack": 0.3,
    "stroke": 0.28,
    "seizure": 0.18,
    "trapped": 0.22,
    "multiple victims": 0.2,
    "blue lips": 0.25,
    "smoke inhalation": 0.18,
}
MEDIUM_KEYWORDS = {
    "fracture": 0.16,
    "broken": 0.16,
    "deep cut": 0.12,
    "difficulty breathing": 0.18,
    "vomiting": 0.10,
    "dizzy": 0.08,
    "burn": 0.12,
}

class SeverityRequest(BaseModel):
    victim_count: int = Field(..., ge=1, le=100)
    injury_type: str
    incident_description: str

class SeverityResponse(BaseModel):
    severity: str
    confidence: float
    model_probability: float
    keyword_boost: float

app = FastAPI(title="LifeLine AI Severity Service", version="0.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def load_model():
    global model
    if not MODEL_PATH.exists():
        subprocess.check_call([sys.executable, "train_model.py"])
    model = joblib.load(MODEL_PATH)

@app.get("/health")
def health():
    return {"status": "UP", "service": "severity-ai"}

def keyword_score(text: str, victim_count: int) -> Tuple[str, float]:
    lower = text.lower()
    critical = sum(weight for kw, weight in CRITICAL_KEYWORDS.items() if kw in lower)
    medium = sum(weight for kw, weight in MEDIUM_KEYWORDS.items() if kw in lower)
    if victim_count >= 3:
        critical += 0.15
    elif victim_count == 2:
        medium += 0.07
    if critical >= 0.25:
        return "CRITICAL", min(critical, 0.45)
    if medium >= 0.16:
        return "MEDIUM", min(medium, 0.30)
    return "LOW", 0.0

@app.post("/predict/severity", response_model=SeverityResponse)
def predict(req: SeverityRequest):
    df = pd.DataFrame([req.model_dump()])
    probabilities = model.predict_proba(df)[0]
    classes = list(model.classes_)
    idx = int(np.argmax(probabilities))
    model_label = classes[idx]
    model_conf = float(probabilities[idx])

    rule_label, boost = keyword_score(f"{req.injury_type} {req.incident_description}", req.victim_count)
    label = model_label
    confidence = model_conf

    # Safety-first fusion: keyword criticality can override model if evidence is strong.
    if rule_label == "CRITICAL" and boost >= 0.25:
        label = "CRITICAL"
        confidence = max(model_conf, 0.74 + boost)
    elif rule_label == "MEDIUM" and model_label == "LOW":
        label = "MEDIUM"
        confidence = max(model_conf, 0.62 + boost)
    else:
        confidence = min(0.99, model_conf + boost)

    return SeverityResponse(
        severity=label,
        confidence=round(float(min(confidence, 0.99)), 2),
        model_probability=round(model_conf, 2),
        keyword_boost=round(boost, 2),
    )
