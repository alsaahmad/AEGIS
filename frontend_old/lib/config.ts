export const EMERGENCY_API = process.env.NEXT_PUBLIC_EMERGENCY_API_URL || "http://localhost:8081";
export const AMBULANCE_API = process.env.NEXT_PUBLIC_AMBULANCE_API_URL || "http://localhost:8082";
export const HOSPITAL_API = process.env.NEXT_PUBLIC_HOSPITAL_API_URL || "http://localhost:8083";
export const TRAFFIC_API = process.env.NEXT_PUBLIC_TRAFFIC_API_URL || "http://localhost:8084";
export const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "http://localhost:8081/ws";
export const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

export const AMBULANCE_WS_URL = process.env.NEXT_PUBLIC_AMBULANCE_WS_URL || `${AMBULANCE_API}/ws`;
export const HOSPITAL_WS_URL = process.env.NEXT_PUBLIC_HOSPITAL_WS_URL || `${HOSPITAL_API}/ws`;
export const TRAFFIC_WS_URL = process.env.NEXT_PUBLIC_TRAFFIC_WS_URL || `${TRAFFIC_API}/ws`;
