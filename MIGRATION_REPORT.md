# AEGIS Frontend Migration Report

Migration of **lifeline-AI-FINALBOSS** (TanStack Start / Vite) frontend to the existing AEGIS backend ecosystem.

**Date:** 2026-06-14  
**Status:** Integration complete — frontend builds with zero errors; backend wiring ported from `frontend_old`.

---

## Summary

The new frontend was a **demo-only UI** with no backend calls. This migration added:

- Centralized `VITE_*` configuration
- REST service layer for all Spring microservices
- STOMP/SockJS WebSocket hooks
- Live integration on Citizen (SOS), Command Center, and Hospital portals
- CORS on Python AI services
- Updated Docker Compose and env files for Vite

---

## Frontend Files Modified

| File | Change |
|------|--------|
| `frontend/package.json` | Added `@stomp/stompjs`, `sockjs-client`, `@types/sockjs-client` |
| `frontend/package-lock.json` | Regenerated |
| `frontend/.npmrc` | Added `legacy-peer-deps=true` |
| `frontend/vite.config.ts` | Dev server port 3000, host binding |
| `frontend/Dockerfile` | Created for Vite dev server |
| `frontend/.env.local` | Created with service URLs |
| `frontend/src/vite-env.d.ts` | Created — VITE_* type definitions |
| `frontend/src/routes/citizen.tsx` | SOS → emergency API + WebSocket tracking |
| `frontend/src/routes/command.tsx` | Live incident feed via WebSocket |
| `frontend/src/routes/hospital.tsx` | Incoming patients + arrival/handoff API |

## Frontend Files Created

| Path | Purpose |
|------|---------|
| `frontend/src/config/env.ts` | Central env config (no hardcoded URLs) |
| `frontend/src/config/constants.ts` | WS topics, injury types, timeouts |
| `frontend/src/services/api-client.ts` | Fetch wrapper + error handling |
| `frontend/src/services/emergency.service.ts` | Emergency REST client |
| `frontend/src/services/ambulance.service.ts` | Ambulance REST client |
| `frontend/src/services/hospital.service.ts` | Hospital REST client |
| `frontend/src/services/traffic.service.ts` | Traffic REST client |
| `frontend/src/services/types.ts` | Shared API types |
| `frontend/src/services/index.ts` | Barrel export |
| `frontend/src/lib/ws-utils.ts` | WebSocket event normalization |
| `frontend/src/hooks/useWebSocket.ts` | STOMP/SockJS hook |
| `frontend/src/hooks/useGeolocation.ts` | Browser geolocation hook |
| `frontend/src/hooks/useCitizenEmergency.ts` | Citizen SOS + tracking state |
| `frontend/src/hooks/useCommandDashboard.ts` | Command center live feed |
| `frontend/src/hooks/useHospitalIncoming.ts` | Hospital incoming + handoff |

## Backend Files Modified

| File | Change |
|------|--------|
| `ai-severity-service/app.py` | Added FastAPI CORS middleware |
| `route-optimization-service/app.py` | Added FastAPI CORS middleware |
| `hospital-recommendation-service/app.py` | Added FastAPI CORS middleware |
| `docker-compose.yml` | `NEXT_PUBLIC_*` → `VITE_*` for frontend service |
| `.env.example` | Added VITE_* variables |

## Root Env Files Created/Updated

| File | Status |
|------|--------|
| `.env` | Created |
| `.env.local` | Created |
| `.env.example` | Updated |

---

## Endpoint Mappings

### Frontend → Backend (implemented)

| Frontend usage | Method | Backend endpoint | Service |
|----------------|--------|------------------|---------|
| Citizen SOS (`useCitizenEmergency`) | POST | `/api/v1/emergencies` | emergency-service :8081 |
| Hospital Accept (`confirmArrival`) | POST | `/api/v1/emergencies/{id}/arrival` | emergency-service :8081 |
| Hospital Handoff (`confirmHandoff`) | POST | `/api/v1/emergencies/{id}/handoff` | emergency-service :8081 |
| Citizen tracking | WS subscribe | `/topic/dashboard` via `/ws` | emergency-service :8081 |
| Command center feed | WS subscribe | `/topic/dashboard` via `/ws` | emergency-service :8081 |
| Hospital incoming feed | WS subscribe | `/topic/dashboard` via `/ws` | hospital-service :8083 |

### Service clients (available, not yet wired to UI)

| Service module | Method | Endpoint | Service |
|----------------|--------|----------|---------|
| `emergencyService.getById` | GET | `/api/v1/emergencies/{id}` | :8081 |
| `emergencyService.getActive` | GET | `/api/v1/emergencies/active` | :8081 |
| `emergencyService.updateStatus` | POST | `/api/v1/emergencies/{id}/status` | :8081 |
| `emergencyService.alertVolunteers` | POST | `/api/v1/volunteers/alert` | :8081 |
| `ambulanceService.list` | GET | `/api/v1/ambulances` | :8082 |
| `ambulanceService.assign` | POST | `/api/v1/ambulances/assign` | :8082 |
| `ambulanceService.updateLocation` | POST | `/api/v1/ambulances/{id}/location` | :8082 |
| `hospitalService.list` | GET | `/api/v1/hospitals` | :8083 |
| `hospitalService.updateBeds` | PUT | `/api/v1/hospitals/{id}` | :8083 |
| `hospitalService.notify` | POST | `/api/v1/hospitals/{id}/notify` | :8083 |
| `trafficService.activateCorridor` | POST | `/api/v1/traffic/activate-corridor` | :8084 |
| `trafficService.listSignals` | GET | `/api/v1/traffic/signals` | :8084 |

### Internal only (not called from frontend)

| Endpoint | Service | Called by |
|----------|---------|-----------|
| POST `/predict/severity` | ai-severity :8001 | emergency-service |
| POST `/optimize/route` | route-optimization :8002 | emergency-service |
| POST `/recommend/hospital` | hospital-recommendation :8003 | emergency-service |

### Env variable migration

| Old (`frontend_old`) | New (`frontend`) |
|----------------------|------------------|
| `NEXT_PUBLIC_EMERGENCY_API_URL` | `VITE_EMERGENCY_API_URL` |
| `NEXT_PUBLIC_AMBULANCE_API_URL` | `VITE_AMBULANCE_API_URL` |
| `NEXT_PUBLIC_HOSPITAL_API_URL` | `VITE_HOSPITAL_API_URL` |
| `NEXT_PUBLIC_TRAFFIC_API_URL` | `VITE_TRAFFIC_API_URL` |
| `NEXT_PUBLIC_WS_URL` | `VITE_WS_URL` |
| `NEXT_PUBLIC_*_WS_URL` | `VITE_*_WS_URL` |
| `NEXT_PUBLIC_DEMO_HOSPITAL_ID` | `VITE_DEMO_HOSPITAL_ID` |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | `VITE_MAPBOX_TOKEN` |

---

## Build Verification

```
cd frontend && npm run build
```

**Result:** Success (client + SSR bundles, no TypeScript errors).

---

## Unresolved Issues

1. **Ambulance & volunteer portals** — Still use simulated data; REST/WebSocket clients exist but are not wired to UI.
2. **Login/auth** — UI-only role selection; backend has no auth — no JWT integration possible without backend changes.
3. **Mapbox / real GPS map** — `LiveMap` is SVG-based; `VITE_MAPBOX_TOKEN` reserved for future Mapbox integration.
4. **Workflow orchestrator (8085)** — Not in Docker Compose; endpoints not used by new frontend.
5. **Docker frontend + browser localhost** — Works when ports are published; document if running frontend outside Docker against containerized backends.
6. **npm peer dependency** — `framer-motion@10` vs React 19 requires `--legacy-peer-deps` (configured in `.npmrc`).

---

## Recommended Improvements

1. Wire **ambulance portal** to `ambulanceService.updateLocation` and ambulance WebSocket topics.
2. Wire **volunteer portal** to `emergencyService.alertVolunteers` and volunteer topics.
3. Add React Query hooks around service layer for caching and retry.
4. Replace SVG `LiveMap` with Mapbox using `VITE_MAPBOX_TOKEN`.
5. Add integration tests (Playwright) for SOS → command → hospital flow.
6. Add Spring Security or API keys if deploying beyond local dev.
7. Deploy frontend with `npm run build` + static/nginx instead of `vite dev` in production Docker image.
8. Align `workflow-orchestrator` paths or remove unused module to reduce confusion.

---

## Reference: Prior frontend (`frontend_old`)

The old Next.js app in `frontend_old/` had working integrations on:

- `app/sos/page.tsx` → POST emergencies + WS dashboard
- `app/command-center/page.tsx` → WS dashboard
- `app/hospital-dashboard/page.tsx` → WS hospital + arrival/handoff

Those patterns were ported to the new role-based routes under `frontend/src/routes/`.
