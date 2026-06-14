import { useEffect, useState } from "react";
import { WS_TOPICS } from "@/config/constants";
import { useWebSocket } from "@/hooks/useWebSocket";
import { displaySeverity, formatTimestamp, mapBackendSeverity } from "@/lib/ws-utils";

export interface CommandIncident {
  id: string;
  type: string;
  severity: "critical" | "high" | "medium" | "low";
  location: string;
  status: string;
  assignedUnit?: string;
  eta?: string;
}

export interface CommandAmbulance {
  id: string;
  callsign: string;
  driver: string;
  status: string;
  speed: number;
}

export interface CommandLog {
  timestamp: string;
  message: string;
}

export function useCommandDashboard() {
  const { subscribe, connected } = useWebSocket();
  const [incidents, setIncidents] = useState<CommandIncident[]>([]);
  const [ambulances, setAmbulances] = useState<CommandAmbulance[]>([]);
  const [logs, setLogs] = useState<CommandLog[]>([]);

  const addLog = (message: string) => {
    setLogs((prev) => [{ timestamp: formatTimestamp(new Date()), message }, ...prev.slice(0, 49)]);
  };

  useEffect(() => {
    return subscribe(WS_TOPICS.DASHBOARD, (data) => {
      const type = String(data.type ?? "");
      const eid = String(data.emergencyId ?? "");
      if (!eid) return;

      if (type === "EMERGENCY_REPORTED") {
        const injuryType = String(data.injuryType ?? "Emergency");
        setIncidents((prev) => {
          if (prev.some((i) => i.id === eid)) return prev;
          return [
            {
              id: eid,
              type: injuryType,
              severity: mapBackendSeverity(String(data.severity ?? "HIGH")),
              location: "Active zone",
              status: "active",
            },
            ...prev,
          ];
        });
        addLog(`Emergency reported: ${injuryType}`);
      }

      if (type === "SEVERITY_ASSESSED") {
        setIncidents((prev) =>
          prev.map((i) =>
            i.id === eid
              ? { ...i, severity: mapBackendSeverity(String(data.severity ?? i.severity)) }
              : i,
          ),
        );
        addLog(`Severity assessed: ${data.severity}`);
      }

      if (type === "AMBULANCE_ASSIGNED") {
        const aid = String(data.ambulanceId ?? "");
        const eta = typeof data.eta === "number" ? `${data.eta}m` : undefined;
        if (aid) {
          setAmbulances((prev) => {
            if (prev.some((a) => a.id === aid)) {
              return prev.map((a) =>
                a.id === aid ? { ...a, status: "on-mission", speed: 45 } : a,
              );
            }
            return [
              {
                id: aid,
                callsign: aid.substring(0, 8).toUpperCase(),
                driver: "Assigned crew",
                status: "on-mission",
                speed: 45,
              },
              ...prev,
            ];
          });
        }
        setIncidents((prev) =>
          prev.map((i) =>
            i.id === eid ? { ...i, status: "en-route", assignedUnit: aid, eta } : i,
          ),
        );
        addLog(`Ambulance dispatched${eta ? ` · ETA ${eta}` : ""}`);
      }

      if (type === "HOSPITAL_NOTIFIED" || type === "HOSPITAL_ASSIGNED") {
        addLog(`Hospital assigned: ${data.hospitalName ?? "unknown"}`);
      }

      if (type === "COMPLETED") {
        setIncidents((prev) =>
          prev.map((i) => (i.id === eid ? { ...i, status: "resolved" } : i)),
        );
        addLog("Emergency completed");
      }
    });
  }, [subscribe]);

  const activeIncidents = incidents.filter((i) => i.status !== "resolved");

  return {
    incidents: activeIncidents,
    allIncidents: incidents,
    ambulances,
    logs,
    connected,
    displaySeverity,
  };
}
