import { config } from "@/config/env";
import { apiRequest } from "./api-client";
import type { AmbulanceRecord, GeoLocation } from "./types";

const BASE = `${config.ambulanceApiUrl}/api/v1/ambulances`;

export const ambulanceService = {
  list() {
    return apiRequest<AmbulanceRecord[]>(BASE);
  },

  assign(emergencyId: string) {
    return apiRequest(`${BASE}/assign`, {
      method: "POST",
      body: JSON.stringify({ emergencyId }),
    });
  },

  updateLocation(id: string, location: GeoLocation) {
    return apiRequest(`${BASE}/${id}/location`, {
      method: "POST",
      body: JSON.stringify(location),
    });
  },
};
