# AEGIS — Local Running Guide

This guide covers running the **new TanStack/Vite frontend** against the existing AEGIS backend ecosystem on your machine.

## Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| Node.js | 22+ | Frontend dev server & build |
| npm | 10+ | Frontend dependencies |
| Java JDK | 17+ | Spring Boot microservices |
| Maven | 3.9+ | Backend build |
| Python | 3.11+ | AI microservices (optional if using Docker) |
| Docker & Docker Compose | Latest | Recommended full-stack startup |
| PostgreSQL | 16 | Database (via Docker or local) |

## Quick Start (Docker — recommended)

From the repository root:

```bash
docker compose up --build
```

Wait until all health checks pass, then open:

- **Frontend:** http://localhost:3000
- **Emergency API:** http://localhost:8081/actuator/health
- **Ambulance API:** http://localhost:8082/actuator/health
- **Hospital API:** http://localhost:8083/actuator/health
- **Traffic API:** http://localhost:8084/actuator/health

### Docker note for browser API URLs

The frontend runs in your **browser**, not inside the Docker network. Keep `VITE_*_API_URL` values pointing at **localhost** ports (defaults in `.env`), even when services run in Docker with published ports.

## Manual Startup (without Docker)

### 1. Environment

Copy and adjust env files:

```bash
cp .env.example .env
cp .env.example .env.local
cp frontend/.env.local frontend/.env.local
```

Key variables are listed below.

### 2. Database

Start PostgreSQL and apply init scripts from `database/init/` (or use Docker for postgres only):

```bash
docker compose up postgres -d
```

### 3. Python AI services

```bash
# Terminal 1 — Severity AI (8001)
cd ai-severity-service
pip install -r requirements.txt
uvicorn app:app --host 0.0.0.0 --port 8001

# Terminal 2 — Route optimization (8002)
cd route-optimization-service
pip install -r requirements.txt
uvicorn app:app --host 0.0.0.0 --port 8002

# Terminal 3 — Hospital recommendation (8003)
cd hospital-recommendation-service
pip install -r requirements.txt
uvicorn app:app --host 0.0.0.0 --port 8003
```

### 4. Spring Boot services

From `backend/`:

```bash
# Emergency (8081) — orchestrates AI + other services
mvn -pl emergency-service -am spring-boot:run

# Ambulance (8082)
mvn -pl ambulance-service -am spring-boot:run

# Hospital (8083)
mvn -pl hospital-service -am spring-boot:run

# Traffic (8084)
mvn -pl traffic-service -am spring-boot:run
```

Or run each module from your IDE with `SERVER_PORT` set appropriately.

### 5. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:3000

Production build:

```bash
cd frontend
npm run build
npm run preview
```

## Required Environment Variables

### Root / frontend (Vite — browser exposed)

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_EMERGENCY_API_URL` | `http://localhost:8081` | Emergency REST API |
| `VITE_AMBULANCE_API_URL` | `http://localhost:8082` | Ambulance REST API |
| `VITE_HOSPITAL_API_URL` | `http://localhost:8083` | Hospital REST API |
| `VITE_TRAFFIC_API_URL` | `http://localhost:8084` | Traffic REST API |
| `VITE_WS_URL` | `http://localhost:8081/ws` | Emergency STOMP/SockJS |
| `VITE_AMBULANCE_WS_URL` | `http://localhost:8082/ws` | Ambulance WebSocket |
| `VITE_HOSPITAL_WS_URL` | `http://localhost:8083/ws` | Hospital WebSocket |
| `VITE_TRAFFIC_WS_URL` | `http://localhost:8084/ws` | Traffic WebSocket |
| `VITE_DEMO_HOSPITAL_ID` | UUID in `.env.example` | Hospital dashboard filter |
| `VITE_MAPBOX_TOKEN` | (empty) | Optional map token |

### Database (Docker / Spring)

| Variable | Default |
|----------|---------|
| `POSTGRES_DB` | `smart_emergency_grid` |
| `POSTGRES_USER` | `seg_user` |
| `POSTGRES_PASSWORD` | `seg_password` |

## Service URLs

| Service | Port | Health / Base |
|---------|------|---------------|
| Frontend | 3000 | http://localhost:3000 |
| PostgreSQL | 5432 | localhost:5432 |
| AI Severity | 8001 | http://localhost:8001/health |
| Route Optimization | 8002 | http://localhost:8002/health |
| Hospital Recommendation | 8003 | http://localhost:8003/health |
| Emergency Service | 8081 | http://localhost:8081/actuator/health |
| Ambulance Service | 8082 | http://localhost:8082/actuator/health |
| Hospital Service | 8083 | http://localhost:8083/actuator/health |
| Traffic Service | 8084 | http://localhost:8084/actuator/health |

## End-to-End Test Flow

1. Start all services (Docker or manual).
2. Open http://localhost:3000/login → choose **Citizen** role.
3. Go to **Citizen → Emergency** tab → tap **SOS** or use Voice SOS.
4. Confirm POST to `http://localhost:8081/api/v1/emergencies` succeeds (Network tab).
5. Open **Command Center** (`/command`) in another tab — incident appears via WebSocket.
6. Open **Hospital** (`/hospital`) — incoming patient notification via hospital WebSocket.
7. On hospital patients tab, use **Accept** / **Handoff** → POST `/arrival` and `/handoff`.

## Troubleshooting

### Frontend build fails on `npm install`

Use legacy peer deps (already configured in `frontend/.npmrc`):

```bash
npm install --legacy-peer-deps
```

### CORS errors in browser

Spring services allow `*` origins. Python AI services now include CORS middleware. If you still see CORS errors, confirm you are calling the correct port and not mixing `http`/`https`.

### WebSocket shows "Connecting"

- Ensure emergency service is up: `http://localhost:8081/actuator/health`
- Confirm `VITE_WS_URL` is `http://localhost:8081/ws` (SockJS, not `ws://`)
- Check browser console for SockJS/STOMP errors

### Emergency POST returns 500

- Verify Python AI services (8001–8003) are healthy
- Check emergency-service logs for downstream URL failures
- Ensure PostgreSQL is running and seeded

### Hospital dashboard empty

- Default demo hospital ID must match backend-assigned hospital (`VITE_DEMO_HOSPITAL_ID`)
- Hospital WebSocket uses `VITE_HOSPITAL_WS_URL` (port 8083)

### Docker frontend cannot reach APIs

Browser calls `localhost:8081` etc. — ensure backend ports are published in `docker-compose.yml` (they are by default).

## Authentication

The AEGIS backend has **no auth middleware**. The frontend login flow is UI-only (role selection + local profile storage). No JWT or session tokens are required for API calls.
