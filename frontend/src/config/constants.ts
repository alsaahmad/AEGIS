export const WS_TOPICS = {
  DASHBOARD: "/topic/dashboard",
  EMERGENCY: (id: string) => `/topic/emergency/${id}`,
  AMBULANCE_LOCATION: (id: string) => `/topic/ambulance/${id}/location`,
  HOSPITAL: (id: string) => `/topic/hospital/${id}`,
} as const;

export const INJURY_TYPES = [
  { value: "cardiac arrest", label: "Cardiac Arrest" },
  { value: "severe bleeding", label: "Severe Bleeding" },
  { value: "unconscious", label: "Unconscious" },
  { value: "chest pain", label: "Chest Pain" },
  { value: "respiratory distress", label: "Respiratory Distress" },
  { value: "fracture", label: "Fracture" },
  { value: "burn", label: "Burn" },
  { value: "poisoning", label: "Poisoning" },
  { value: "other", label: "Other Emergency" },
] as const;

export const COORDINATION_STAGES = [
  { id: "INTAKE", label: "Intake" },
  { id: "SEVERITY_ANALYSIS", label: "Analysis" },
  { id: "DISPATCH", label: "Dispatch" },
  { id: "ROUTING", label: "Routing" },
  { id: "TRANSIT", label: "Transit" },
  { id: "ARRIVAL", label: "Arrival" },
  { id: "HANDOFF", label: "Handoff" },
] as const;

export const CONFIG = {
  WS_RECONNECT_DELAY: 3000,
  API_TIMEOUT: 15000,
  GEOLOCATION_TIMEOUT: 10000,
} as const;

/** Default coordinates (Ghaziabad/NCR) when geolocation is unavailable. */
export const DEFAULT_LOCATION = { lat: 28.6692, lng: 77.4538 } as const;
