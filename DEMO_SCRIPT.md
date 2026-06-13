# Hackathon Demo Script — Smart Emergency Grid

## Scenario

A student collapses near a library entrance. A citizen presses SOS from the mobile web page. The system performs AI severity prediction, ambulance assignment, green corridor activation, hospital recommendation, hospital notification, and live dashboard updates.

## Pre-demo setup

1. Start stack:
   ```bash
   docker compose up --build
   ```
2. Open tabs:
   - Citizen App: http://localhost:3000/sos
   - Command Center: http://localhost:3000/command-center
   - Hospital Dashboard: http://localhost:3000/hospital-dashboard
3. Optional: set `NEXT_PUBLIC_MAPBOX_TOKEN` in `.env` for live Mapbox maps. Without it, the UI shows polished map placeholders.

## Demo flow

### 1. Citizen SOS

On `/sos`, use:

- Injury type: `cardiac arrest`
- Victim count: `1`
- Description: `Person collapsed near the library entrance and may not be breathing normally.`

Click **SOS**, then **Report Emergency**.

Expected Citizen App output:

```text
Emergency reported. LifeLine AI is assessing severity and dispatching help.
Status: SOS reported
```

Expected Command Center stream:

```text
EMERGENCY_REPORTED
```

### 2. AI severity assessment

The emergency-service asynchronously calls the FastAPI severity service.

Expected emergency-service logs:

```text
POST /predict/severity -> { severity: CRITICAL, confidence: 0.91 }
```

Expected dashboards:

```text
SEVERITY_ASSESSED
Severity: CRITICAL
```

### 3. Ambulance assignment

Ambulance service ranks available vehicles with:

- 40% distance via Haversine
- 30% congestion factor
- 20% ETA
- 10% equipment match

Expected dashboard event:

```text
AMBULANCE_ASSIGNED
Ambulance KA-SEG-100X dispatched
ETA: 3-8 min
```

### 4. Route optimization + green corridor

Route optimization service receives a graph of ~30 intersections and returns an A* path plus traffic signal IDs.

Expected traffic-service event:

```text
GREEN_CORRIDOR_ACTIVATED
Activated N signals until <timestamp>
```

Command Center should show green corridor highlight if Mapbox token is configured.

### 5. Hospital recommendation and notification

Hospital recommendation service ranks hospitals by:

- 35% specialization match
- 30% ICU bed availability
- 25% distance/ETA
- 10% current load

Expected Hospital Dashboard card:

```text
CRITICAL
cardiac arrest
ETA countdown
Ambulance <id>
ICU bay pre-reserved
```

Expected hospital-service log:

```text
Mock push to hospital dashboard: { incomingPatientSeverity=CRITICAL, injuryType=cardiac arrest, etaMinutes=... }
```

### 6. Volunteer alert

Run:

```bash
curl -X POST http://localhost:8081/api/v1/volunteers/alert \
  -H 'Content-Type: application/json' \
  -d '{"emergencyId":"<emergency_id>"}'
```

Expected output:

```json
{
  "emergencyId": "...",
  "notifiedCount": 2,
  "volunteers": [
    {
      "name": "Asha Rao",
      "distanceKm": 0.6,
      "response": "ACKNOWLEDGED",
      "firstAidTips": ["Check responsiveness and normal breathing", "Start hands-only CPR..."]
    }
  ]
}
```

### 7. Arrival and handoff

Run:

```bash
curl -X POST http://localhost:8081/api/v1/emergencies/<emergency_id>/arrival
curl -X POST http://localhost:8081/api/v1/emergencies/<emergency_id>/handoff
```

Expected Command Center stream:

```text
ARRIVED
COMPLETED
```

## Closing line for judges

"Smart Emergency Grid turns the most chaotic minutes of an emergency into one AI-coordinated response system — severity, ambulance, traffic, hospital, volunteers, and live command visibility from the first second."
