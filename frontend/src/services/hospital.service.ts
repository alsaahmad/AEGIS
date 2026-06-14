import { config } from "@/config/env";
import { apiRequest } from "./api-client";
import type { HospitalRecord } from "./types";

const BASE = `${config.hospitalApiUrl}/api/v1/hospitals`;

export const hospitalService = {
  list() {
    return apiRequest<HospitalRecord[]>(BASE);
  },

  updateBeds(id: string, beds: { availableIcuBeds?: number; availableErBeds?: number }) {
    return apiRequest(`${BASE}/${id}`, {
      method: "PUT",
      body: JSON.stringify(beds),
    });
  },

  notify(id: string, payload: Record<string, unknown>) {
    return apiRequest(`${BASE}/${id}/notify`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
};
