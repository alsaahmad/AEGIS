function env(key: string, fallback = ""): string {
  const value = import.meta.env[key];
  return typeof value === "string" && value.length > 0 ? value : fallback;
}

/** Client-side service URLs — all values come from VITE_* environment variables. */
export const config = {
  emergencyApiUrl: env("VITE_EMERGENCY_API_URL", "http://localhost:8081"),
  ambulanceApiUrl: env("VITE_AMBULANCE_API_URL", "http://localhost:8082"),
  hospitalApiUrl: env("VITE_HOSPITAL_API_URL", "http://localhost:8083"),
  trafficApiUrl: env("VITE_TRAFFIC_API_URL", "http://localhost:8084"),
  wsUrl: env("VITE_WS_URL", "http://localhost:8081/ws"),
  ambulanceWsUrl: env("VITE_AMBULANCE_WS_URL", "http://localhost:8082/ws"),
  hospitalWsUrl: env("VITE_HOSPITAL_WS_URL", "http://localhost:8083/ws"),
  trafficWsUrl: env("VITE_TRAFFIC_WS_URL", "http://localhost:8084/ws"),
  demoHospitalId: env("VITE_DEMO_HOSPITAL_ID", "c7d92ea3-66e1-52cf-a149-8db02ea83615"),
  mapboxToken: env("VITE_MAPBOX_TOKEN", ""),
} as const;
