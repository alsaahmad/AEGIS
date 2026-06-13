import math
from typing import List, Optional
from uuid import UUID

from fastapi import FastAPI
from pydantic import BaseModel, Field

app = FastAPI(title="Smart Emergency Grid Hospital Recommendation", version="0.1.0")

class Coordinate(BaseModel):
    lat: float
    lng: float

class HospitalInput(BaseModel):
    id: UUID
    name: str
    lat: float
    lng: float
    total_icu_beds: int = Field(..., ge=0)
    available_icu_beds: int = Field(..., ge=0)
    specializations: List[str]
    phone: Optional[str] = None
    current_load: float = Field(0.35, ge=0, le=1)

class RecommendRequest(BaseModel):
    severity: str
    required_specialization: str
    ambulance_location: Coordinate
    hospitals: Optional[List[HospitalInput]] = None

class HospitalRecommendation(BaseModel):
    id: UUID
    name: str
    score: float
    eta_minutes: int
    distance_km: float
    specialization_match: bool
    available_icu_beds: int
    current_load: float
    reasons: List[str]

MOCK_HOSPITALS = [
    HospitalInput(id="c7d92ea3-66e1-52cf-a149-8db02ea83615", name="LifeLine Cardiac Institute", lat=12.9765, lng=77.5993, total_icu_beds=32, available_icu_beds=12, specializations=["cardiac", "general"], phone="+91-80-4000-1001", current_load=0.44),
    HospitalInput(id="b4f2e10c-5bd0-5743-8ead-c52fe8b692a5", name="City Trauma Center", lat=12.9652, lng=77.6080, total_icu_beds=24, available_icu_beds=7, specializations=["trauma", "general"], phone="+91-80-4000-1002", current_load=0.62),
    HospitalInput(id="eecafa82-b9b1-5871-9be6-53c3fd607cff", name="Metro Burns & Critical Care", lat=12.9871, lng=77.5854, total_icu_beds=18, available_icu_beds=5, specializations=["burns", "trauma"], phone="+91-80-4000-1003", current_load=0.52),
    HospitalInput(id="e61a6f5e-e0c9-5954-a5c6-bd1d68ffd81d", name="Namma General Hospital", lat=12.9529, lng=77.5741, total_icu_beds=40, available_icu_beds=18, specializations=["general", "trauma"], phone="+91-80-4000-1004", current_load=0.38),
    HospitalInput(id="0b6bbe27-5eee-516e-92a4-f0608e743683", name="East Bengaluru Medical", lat=12.9822, lng=77.6364, total_icu_beds=28, available_icu_beds=9, specializations=["cardiac", "trauma", "general"], phone="+91-80-4000-1005", current_load=0.57),
    HospitalInput(id="2d85469e-6668-541e-9b02-f9052668dc03", name="Greenview ICU Network", lat=12.9436, lng=77.6101, total_icu_beds=16, available_icu_beds=3, specializations=["general", "cardiac"], phone="+91-80-4000-1006", current_load=0.79),
    HospitalInput(id="dd97a204-8392-5fba-96c7-6d8c57df356c", name="North Star Emergency Care", lat=13.0044, lng=77.5907, total_icu_beds=20, available_icu_beds=10, specializations=["trauma", "cardiac"], phone="+91-80-4000-1007", current_load=0.41),
    HospitalInput(id="ff5d3809-5ff6-5b1c-aa50-310881f7296a", name="South City Multispecialty", lat=12.9260, lng=77.5842, total_icu_beds=30, available_icu_beds=11, specializations=["general", "burns", "trauma"], phone="+91-80-4000-1008", current_load=0.49),
    HospitalInput(id="e75ae093-f638-5938-818a-ae145b69d80b", name="RapidCare Pediatrics & General", lat=12.9700, lng=77.5518, total_icu_beds=14, available_icu_beds=6, specializations=["general"], phone="+91-80-4000-1009", current_load=0.34),
    HospitalInput(id="23242742-d5bf-5810-9529-beaefd18500e", name="Apex Neuro Cardiac Hospital", lat=12.9918, lng=77.6200, total_icu_beds=26, available_icu_beds=8, specializations=["cardiac", "trauma", "neuro"], phone="+91-80-4000-1010", current_load=0.65),
]

@app.get("/health")
def health():
    return {"status": "UP", "service": "hospital-recommendation"}

def haversine_km(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
    r = 6371.0088
    dlat = math.radians(lat2 - lat1)
    dlng = math.radians(lng2 - lng1)
    a = math.sin(dlat/2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlng/2)**2
    return r * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

def inverse(value: float, softness: float) -> float:
    return 1.0 / (1.0 + max(value, 0.0) / softness)

def score_hospital(h: HospitalInput, req: RecommendRequest) -> HospitalRecommendation:
    required = req.required_specialization.lower()
    specs = [s.lower() for s in h.specializations]
    exact_match = required in specs
    specialization_score = 1.0 if exact_match else (0.65 if "general" in specs else 0.15)
    bed_score = min(1.0, h.available_icu_beds / max(h.total_icu_beds * 0.35, 1))
    distance = haversine_km(req.ambulance_location.lat, req.ambulance_location.lng, h.lat, h.lng)
    eta = max(1, round((distance / 38.0) * 60.0))
    eta_score = inverse(eta, 15.0)
    load_score = 1.0 - h.current_load

    if req.severity.upper() == "CRITICAL" and h.available_icu_beds <= 0:
        bed_score = 0.0

    score = 0.35 * specialization_score + 0.30 * bed_score + 0.25 * eta_score + 0.10 * load_score
    reasons = []
    if exact_match:
        reasons.append(f"{required} specialization available")
    elif "general" in specs:
        reasons.append("general emergency coverage available")
    if h.available_icu_beds > 0:
        reasons.append(f"{h.available_icu_beds} ICU beds available")
    reasons.append(f"ETA about {eta} min")
    reasons.append(f"load {round(h.current_load * 100)}%")
    return HospitalRecommendation(
        id=h.id,
        name=h.name,
        score=round(score, 3),
        eta_minutes=eta,
        distance_km=round(distance, 2),
        specialization_match=exact_match,
        available_icu_beds=h.available_icu_beds,
        current_load=h.current_load,
        reasons=reasons,
    )

@app.post("/recommend/hospital")
def recommend(req: RecommendRequest):
    hospitals = req.hospitals or MOCK_HOSPITALS
    ranked = sorted([score_hospital(h, req) for h in hospitals], key=lambda x: x.score, reverse=True)
    return {
        "severity": req.severity.upper(),
        "required_specialization": req.required_specialization,
        "top_hospitals": [r.model_dump(mode="json") for r in ranked[:3]],
    }
