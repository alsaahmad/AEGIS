export const WS_TOPICS = {
  DASHBOARD: "/topic/dashboard",
  EMERGENCY: (id: string) => `/topic/emergency/${id}`,
  AMBULANCE_LOCATION: (id: string) => `/topic/ambulance/${id}/location`,
};

export const SEVERITY_LEVELS = {
  CRITICAL: { label: "Critical", color: "red", icon: "🔴", priority: 0 },
  HIGH: { label: "High", color: "orange", icon: "🟠", priority: 1 },
  MEDIUM: { label: "Medium", color: "yellow", icon: "🟡", priority: 2 },
  MODERATE: { label: "Moderate", color: "yellow", icon: "🟡", priority: 2 },
  LOW: { label: "Low", color: "green", icon: "🟢", priority: 3 },
  UNKNOWN: { label: "Unknown", color: "green", icon: "⚪", priority: 4 },
} as const;

export const COORDINATION_STAGES = [
  { id: "INTAKE", label: "Intake", description: "Receiving emergency report" },
  { id: "SEVERITY_ANALYSIS", label: "Analysis", description: "AI analyzing severity" },
  { id: "DISPATCH", label: "Dispatch", description: "Assigning ambulance" },
  { id: "ROUTING", label: "Routing", description: "Optimizing route" },
  { id: "TRANSIT", label: "Transit", description: "En route to hospital" },
  { id: "ARRIVAL", label: "Arrival", description: "Ambulance at hospital" },
  { id: "HANDOFF", label: "Handoff", description: "Patient handed to staff" },
] as const;

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

export const CONFIG = {
  WS_RECONNECT_DELAY: 3000,
  WS_MAX_RECONNECT_ATTEMPTS: 5,
  API_TIMEOUT: 15000,
  GEOLOCATION_TIMEOUT: 10000,
};
