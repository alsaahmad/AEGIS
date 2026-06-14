import { config } from "@/config/env";
import { apiRequest } from "./api-client";

const BASE = `${config.trafficApiUrl}/api/v1/traffic`;

export const trafficService = {
  activateCorridor(payload: Record<string, unknown>) {
    return apiRequest(`${BASE}/activate-corridor`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  listSignals() {
    return apiRequest<Record<string, unknown>[]>(`${BASE}/signals`);
  },
};
