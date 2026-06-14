/** Flatten backend DashboardEvent { type, emergencyId, payload } for UI handlers. */
export function normalizeWsEvent(raw: Record<string, unknown>): Record<string, unknown> {
  const payload =
    raw.payload && typeof raw.payload === "object" && !Array.isArray(raw.payload)
      ? (raw.payload as Record<string, unknown>)
      : {};

  const lat = payload.lat ?? payload.locationLat;
  const lng = payload.lng ?? payload.locationLng;
  const location =
    typeof lat === "number" && typeof lng === "number" ? { lat, lng } : undefined;

  return {
    ...payload,
    type: raw.type,
    emergencyId: String(raw.emergencyId ?? payload.emergencyId ?? payload.id ?? ""),
    status: payload.status ?? raw.status,
    severity: payload.severity ?? payload.incomingPatientSeverity ?? "HIGH",
    hospitalId: payload.hospitalId ?? payload.assignedHospitalId,
    hospitalName: payload.hospitalName ?? payload.name,
    ambulanceId: payload.assignedAmbulanceId ?? payload.ambulanceId,
    eta: payload.eta ?? payload.etaMinutes,
    etaMinutes: payload.etaMinutes ?? payload.eta,
    location,
    injuryType: payload.injuryType,
    victimCount: payload.victimCount,
    confidence: payload.confidence,
    trafficSignalCount: Array.isArray(payload.trafficSignalIds)
      ? payload.trafficSignalIds.length
      : payload.trafficSignalCount,
    timestamp: raw.timestamp,
  };
}

export function formatTime(seconds: number): string {
  const safe = Math.max(0, Math.floor(seconds));
  const mins = Math.floor(safe / 60);
  const secs = safe % 60;
  return `${mins}m ${secs.toString().padStart(2, "0")}s`;
}

export function formatTimestamp(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function parseErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "object" && error !== null && "message" in error) {
    return String((error as { message: unknown }).message);
  }
  return "An unexpected error occurred";
}

export function displaySeverity(severity: string): string {
  if (severity === "MEDIUM") return "MODERATE";
  return severity;
}
