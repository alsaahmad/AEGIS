import { useEffect, useRef, useState } from "react";
import { config } from "@/config/env";
import { WS_TOPICS } from "@/config/constants";
import { useWebSocket } from "@/hooks/useWebSocket";
import { displaySeverity, mapBackendSeverity, parseErrorMessage } from "@/lib/ws-utils";
import { emergencyService } from "@/services/emergency.service";

export interface HospitalIncomingPatient {
  id: string;
  type: string;
  severity: "critical" | "high" | "medium" | "low";
  ambulanceId: string;
  victims: number;
  location: string;
  eta: number;
  vitals: { hr: number; spo2: number; bp: string; gcs: number };
  arrived?: boolean;
}

export function useHospitalIncoming() {
  const { subscribe, connected } = useWebSocket(config.hospitalWsUrl);
  const [incoming, setIncoming] = useState<HospitalIncomingPatient[]>([]);
  const [icuAvailable, setIcuAvailable] = useState(12);
  const [error, setError] = useState<string | null>(null);
  const intervalsRef = useRef<Map<string, ReturnType<typeof setInterval>>>(new Map());

  const startCountdown = (id: string) => {
    if (intervalsRef.current.has(id)) clearInterval(intervalsRef.current.get(id)!);
    const interval = setInterval(() => {
      setIncoming((prev) =>
        prev.map((p) =>
          p.id === id && !p.arrived ? { ...p, eta: Math.max(0, p.eta - 1) } : p,
        ),
      );
    }, 60000);
    intervalsRef.current.set(id, interval);
  };

  useEffect(() => {
    return subscribe(WS_TOPICS.DASHBOARD, (data) => {
      const type = String(data.type ?? "");
      const hospitalId = String(data.hospitalId ?? "");
      if (hospitalId && hospitalId !== config.demoHospitalId) return;

      if (type === "HOSPITAL_NOTIFIED" || type === "HOSPITAL_ASSIGNED") {
        const eid = String(data.emergencyId ?? "");
        if (!eid) return;

        setIncoming((prev) => {
          if (prev.some((p) => p.id === eid)) return prev;
          const etaMin = Number(data.etaMinutes ?? data.eta ?? 5);
          startCountdown(eid);
          return [
            ...prev,
            {
              id: eid,
              type: String(data.injuryType ?? "Emergency"),
              severity: mapBackendSeverity(String(data.severity ?? "HIGH")),
              ambulanceId: String(data.ambulanceId ?? "Unknown"),
              victims: Number(data.victimCount ?? 1),
              location: "En route",
              eta: etaMin,
              vitals: { hr: 94, spo2: 91, bp: "145/95", gcs: 14 },
            },
          ];
        });

        if (typeof data.availableIcuBeds === "number") {
          setIcuAvailable(data.availableIcuBeds);
        }
      }

      if (type === "ARRIVED") {
        const eid = String(data.emergencyId ?? "");
        setIncoming((prev) =>
          prev.map((p) => (p.id === eid ? { ...p, arrived: true, eta: 0 } : p)),
        );
      }

      if (type === "ICU_BEDS_UPDATED" && typeof data.availableIcuBeds === "number") {
        setIcuAvailable(data.availableIcuBeds);
      }
    });
  }, [subscribe]);

  useEffect(
    () => () => {
      intervalsRef.current.forEach(clearInterval);
    },
    [],
  );

  const confirmArrival = async (id: string) => {
    try {
      setError(null);
      await emergencyService.confirmArrival(id);
      setIncoming((prev) =>
        prev.map((p) => (p.id === id ? { ...p, arrived: true, eta: 0 } : p)),
      );
    } catch (err) {
      setError(parseErrorMessage(err));
    }
  };

  const confirmHandoff = async (id: string) => {
    try {
      setError(null);
      await emergencyService.confirmHandoff(id);
      setIncoming((prev) => prev.filter((p) => p.id !== id));
      const interval = intervalsRef.current.get(id);
      if (interval) {
        clearInterval(interval);
        intervalsRef.current.delete(id);
      }
    } catch (err) {
      setError(parseErrorMessage(err));
    }
  };

  return {
    incoming,
    icuAvailable,
    connected,
    error,
    confirmArrival,
    confirmHandoff,
    displaySeverity,
  };
}
