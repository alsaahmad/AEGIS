/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_EMERGENCY_API_URL: string;
  readonly VITE_AMBULANCE_API_URL: string;
  readonly VITE_HOSPITAL_API_URL: string;
  readonly VITE_TRAFFIC_API_URL: string;
  readonly VITE_WS_URL: string;
  readonly VITE_AMBULANCE_WS_URL: string;
  readonly VITE_HOSPITAL_WS_URL: string;
  readonly VITE_TRAFFIC_WS_URL: string;
  readonly VITE_DEMO_HOSPITAL_ID: string;
  readonly VITE_MAPBOX_TOKEN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
