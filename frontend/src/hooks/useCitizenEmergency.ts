import { useCallback, useEffect, useState } from "react";
import { DEFAULT_LOCATION, WS_TOPICS } from "@/config/constants";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useWebSocket } from "@/hooks/useWebSocket";
import { displaySeverity, parseErrorMessage } from "@/lib/ws-utils";
import { emergencyService } from "@/services/emergency.service";

const SEGMENT_INJURY: Record<"Accident" | "Medical" | "Fire", string> = {
  Accident: "fracture",
  Medical: "chest pain",
  Fire: "burn",
};

export interface TrackingStep {
  label: string;
  done: boolean;
}

export function useCitizenEmergency() {
  const { fallback, loading: geoLoading, error: geoError } = useGeolocation();
  const { subscribe, connected } = useWebSocket();

  const [emergencyId, setEmergencyId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [severity, setSeverity] = useState<string | null>(null);
  const [ambulanceId, setAmbulanceId] = useState<string | null>(null);
  const [hospitalName, setHospitalName] = useState<string | null>(null);
  const [etaMinutes, setEtaMinutes] = useState<number | null>(null);
  const [steps, setSteps] = useState<TrackingStep[]>([]);

  const markStep = useCallback((label: string) => {
    setSteps((prev) => {
      if (prev.some((s) => s.label === label)) {
        return prev.map((s) => (s.label === label ? { ...s, done: true } : s));
      }
      return [...prev, { label, done: true }];
    });
  }, []);

  const reportEmergency = useCallback(
    async (segment: "Accident" | "Medical" | "Fire" | null, description?: string) => {
      setIsSubmitting(true);
      setError(null);
      setSteps([{ label: "SOS received", done: true }]);

      try {
        const injuryType = segment ? SEGMENT_INJURY[segment] : "other";
        const incidentDescription =
          description?.trim() ||
          `Emergency reported via AEGIS citizen portal (${segment ?? "general"}) near coordinates ${fallback.lat.toFixed(4)}, ${fallback.lng.toFixed(4)}.`;

        const ack = await emergencyService.create({
          citizenId: `citizen-${Date.now()}`,
          location: fallback,
          incidentDescription,
          victimCount: 1,
          injuryType,
        });

        setEmergencyId(ack.emergencyId);
        markStep("Ambulance dispatched");
        return ack.emergencyId;
      } catch (err) {
        setError(parseErrorMessage(err));
        return null;
      } finally {
        setIsSubmitting(false);
      }
    },
    [fallback, markStep],
  );

  useEffect(() => {
    if (!emergencyId) return;

    return subscribe(WS_TOPICS.DASHBOARD, (data) => {
      if (String(data.emergencyId) !== emergencyId) return;
      const type = String(data.type ?? "");

      if (type === "SEVERITY_ASSESSED" && data.severity) {
        setSeverity(displaySeverity(String(data.severity)));
      }
      if (type === "AMBULANCE_ASSIGNED") {
        setAmbulanceId(String(data.ambulanceId ?? ""));
        if (typeof data.eta === "number") setEtaMinutes(data.eta);
        markStep("Ambulance dispatched");
      }
      if (type === "GREEN_CORRIDOR_ACTIVATED") {
        markStep("Green corridor active");
      }
      if (type === "HOSPITAL_NOTIFIED" || type === "HOSPITAL_ASSIGNED" || type === "HOSPITAL_SELECTED") {
        if (data.hospitalName) setHospitalName(String(data.hospitalName));
        markStep("Hospital alerted");
      }
      if (type === "COMPLETED") {
        markStep("Patient handover");
      }
    });
  }, [emergencyId, subscribe, markStep]);

  return {
    emergencyId,
    isSubmitting,
    error,
    severity,
    ambulanceId,
    hospitalName,
    etaMinutes,
    steps,
    connected,
    geoLoading,
    geoError,
    location: fallback,
    reportEmergency,
    defaultLocation: DEFAULT_LOCATION,
  };
}
