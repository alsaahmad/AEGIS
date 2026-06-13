# Smart Emergency Grid

An AI-first emergency response operating system built as a hackathon-ready full-stack monorepo.

It coordinates:

- Citizen SOS reporting
- AI severity classification
- Ambulance ranking and assignment
- Route optimization with Dijkstra/A*
- Green corridor traffic signal activation
- Hospital recommendation and ICU reservation
- Volunteer alerts with first-aid guidance
- Real-time STOMP/WebSocket dashboards

## Architecture

```text
smart-emergency-grid/
├── backend/
│   ├── common/                  # shared JPA entities, DTOs, enums, utilities
│   ├── emergency-service/       # SOS entrypoint, orchestration, volunteer alerts, central websocket
│   ├── ambulance-service/       # fleet, GPS updates, assignment algorithm
│   ├── hospital-service/        # hospital data, ICU bed updates, hospital notification
│   └── traffic-service/         # traffic signals, green corridor activation/reversion
├── ai-severity-service/         # FastAPI + scikit-learn severity classifier
├── route-optimization-service/  # FastAPI Dijkstra/A* route optimizer
├── hospital-recommendation-service/ # FastAPI hospital ranking engine
├── frontend/                    # Next.js citizen, hospital, command-center pages
└── database/                    # PostgreSQL schema, seed data, demo road graph
```

## One-command demo startup

```bash
cd smart-emergency-grid
cp .env.example .env
# Optional: add NEXT_PUBLIC_MAPBOX_TOKEN to .env

docker compose up --build
```

Open:

- Citizen App: http://localhost:3000/sos
- Hospital Dashboard: http://localhost:3000/hospital-dashboard
- Command Center: http://localhost:3000/command-center

## Services and ports

| Service | Port | Health |
|---|---:|---|
| PostgreSQL | 5432 | `pg_isready` |
| emergency-service | 8081 | http://localhost:8081/actuator/health |
| ambulance-service | 8082 | http://localhost:8082/actuator/health |
| hospital-service | 8083 | http://localhost:8083/actuator/health |
| traffic-service | 8084 | http://localhost:8084/actuator/health |
| severity-ai | 8001 | http://localhost:8001/health |
| route-optimization | 8002 | http://localhost:8002/health |
| hospital-recommendation | 8003 | http://localhost:8003/health |
| frontend | 3000 | http://localhost:3000 |

## Database schema

DDL is in:

- `database/schema.sql`
- `database/init/01_schema.sql`

Seed data is in:

- `database/seed.sql`
- `database/init/02_seed.sql`

Demo road network:

- `database/road-network-demo.json`
- `route-optimization-service/sample-road-network-request.json`

Tables:

- `emergencies`
- `ambulances`
- `hospitals`
- `traffic_signals`
- `volunteers`
- `emergency_logs`

The schema includes the requested columns plus practical MVP columns such as `victim_count`, `injury_type`, `equipment_level`, `current_load_pct`, and `priority_expires_at`.

## Core REST APIs

All Java APIs use `/api/v1` versioning.

### Phase 3 — Report SOS

`POST http://localhost:8081/api/v1/emergencies`

Request:

```json
{
  "citizenId": "citizen-demo-001",
  "location": { "lat": 12.9716, "lng": 77.5946 },
  "incidentDescription": "Person collapsed near the library entrance and may not be breathing normally.",
  "victimCount": 1,
  "injuryType": "cardiac arrest"
}
```

Response:

```json
{
  "emergencyId": "8d7c...",
  "status": "REPORTED",
  "message": "Emergency reported. LifeLine AI is assessing severity and dispatching help.",
  "createdAt": "2026-06-12T06:46:00Z"
}
```

What happens asynchronously:

1. Emergency saved with `REPORTED`
2. WebSocket broadcast to `/topic/dashboard`
3. AI severity service called
4. Ambulance assigned
5. Route optimized
6. Green corridor activated
7. Hospital recommended and notified

### Phase 4 — AI severity prediction

`POST http://localhost:8001/predict/severity`

```json
{
  "victim_count": 1,
  "injury_type": "cardiac arrest",
  "incident_description": "unconscious not breathing chest pain"
}
```

Response:

```json
{
  "severity": "CRITICAL",
  "confidence": 0.91,
  "model_probability": 0.84,
  "keyword_boost": 0.35
}
```

Training assets:

- `ai-severity-service/generate_dataset.py` creates 240 synthetic examples
- `ai-severity-service/train_model.py` trains and serializes `severity_model.joblib`
- `ai-severity-service/app.py` fuses scikit-learn probability with keyword safety rules

### Phase 5 — Ambulance assignment

`POST http://localhost:8082/api/v1/ambulances/assign`

The service ranks `AVAILABLE` ambulances by:

- Distance: 40%
- Traffic congestion: 30%
- ETA: 20%
- Equipment match: 10%

Includes Haversine calculation in `common/DistanceUtils.java` and the scoring algorithm in `AmbulanceAssignmentService.java`.

### Phase 6 — Route optimization

`POST http://localhost:8002/optimize/route`

Uses either:

- `algorithm: "dijkstra"`
- `algorithm: "astar"`

See `route-optimization-service/sample-road-network-request.json`.

Green corridor activation:

`POST http://localhost:8084/api/v1/traffic/activate-corridor`

```json
{
  "emergencyId": "<uuid>",
  "trafficSignalIds": ["<uuid>", "<uuid>"],
  "predictedArrivalSeconds": 360
}
```

The traffic service sets signals to `GREEN_PRIORITY`, stores a reversion time, logs the event, and reverts expired corridors on a schedule.

### Phase 7 — Hospital recommendation and notification

`POST http://localhost:8003/recommend/hospital`

Ranking weights:

- Specialization match: 35%
- ICU availability: 30%
- Distance/ETA: 25%
- Current load: 10%

Hospital notification:

`POST http://localhost:8083/api/v1/hospitals/{id}/notify`

Reserves one ICU bed and broadcasts to the dashboard.

### Phase 8 — WebSocket topics

STOMP endpoint:

```text
/ws
```

Topics:

```text
/topic/emergency/{id}
/topic/dashboard
/topic/ambulance/{id}/location
```

Ambulance GPS push:

`POST http://localhost:8082/api/v1/ambulances/{id}/location`

```json
{ "lat": 12.9721, "lng": 77.5961 }
```

### Phase 9 — Volunteer alert network

`POST http://localhost:8081/api/v1/volunteers/alert`

```json
{ "emergencyId": "<uuid>" }
```

The service finds available volunteers within 2km by Haversine, sends mock push notifications, attaches first-aid tips from `first-aid-tips.json`, and logs responses.

## Frontend pages

### Citizen App

`frontend/app/sos/page.tsx`

Features:

- Large SOS button
- Geolocation capture
- Incident description, victim count, injury type
- POST `/api/v1/emergencies`
- Live STOMP tracker
- Mapbox ambulance/emergency markers

### Hospital Dashboard

`frontend/app/hospital-dashboard/page.tsx`

Features:

- Subscribes to `/topic/dashboard`
- Incoming patient alert cards
- ETA countdown timer
- Editable ICU bed availability
- Active incoming patient table sorted by ETA

### Command Center

`frontend/app/command-center/page.tsx`

Features:

- Full-screen Mapbox command map
- Emergency, ambulance, hospital, corridor layers
- Live WebSocket updates
- Active incident sidebar
- Summary stats

## Development without Docker

Backend:

```bash
cd backend
mvn -q -pl emergency-service -am spring-boot:run
mvn -q -pl ambulance-service -am spring-boot:run
mvn -q -pl hospital-service -am spring-boot:run
mvn -q -pl traffic-service -am spring-boot:run
```

FastAPI:

```bash
cd ai-severity-service
pip install -r requirements.txt
python generate_dataset.py && python train_model.py
uvicorn app:app --reload --port 8001
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

## Hackathon pitch line

"Smart Emergency Grid turns panic into a live AI command center — triage, dispatch, traffic, hospitals, volunteers, and real-time visibility from the first second."
