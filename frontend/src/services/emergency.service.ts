import { config } from "@/config/env";
import { apiRequest } from "./api-client";
import type { CreateEmergencyPayload, EmergencyAck, EmergencySnapshot } from "./types";

const BASE = `${config.emergencyApiUrl}/api/v1/emergencies`;

export const emergencyService = {
  create(payload: CreateEmergencyPayload) {
    return apiRequest<EmergencyAck>(BASE, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  getById(id: string) {
    return apiRequest<EmergencySnapshot>(`${BASE}/${id}`);
  },

  getActive() {
    return apiRequest<EmergencySnapshot[]>(`${BASE}/active`);
  },

  updateStatus(id: string, status: string) {
    return apiRequest(`${BASE}/${id}/status`, {
      method: "POST",
      body: JSON.stringify({ status }),
    });
  },

  confirmArrival(id: string) {
    return apiRequest<void>(`${BASE}/${id}/arrival`, { method: "POST" });
  },

  confirmHandoff(id: string) {
    return apiRequest<void>(`${BASE}/${id}/handoff`, { method: "POST" });
  },

  alertVolunteers(payload: Record<string, unknown>) {
    return apiRequest(`${config.emergencyApiUrl}/api/v1/volunteers/alert`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
};
