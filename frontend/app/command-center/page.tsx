"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, X } from "lucide-react";
import dynamic from "next/dynamic";
import { useWebSocket } from "@/hooks/useWebSocket";
import { COORDINATION_STAGES, WS_TOPICS } from "@/lib/constants";
import { displaySeverity, formatTimestamp } from "@/lib/utils";

const CommandMap = dynamic(() => import("@/components/CommandMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-slate-900">
      <p className="text-slate-400">Loading map...</p>
    </div>
  ),
});

interface Emergency {
  id: string;
  status: string;
  severity: string;
  location: { lat: number; lng: number };
  injuryType: string;
  victimCount: number;
  ambulanceAssigned?: string;
  hospitalAssigned?: string;
}

interface Ambulance {
  id: string;
  status: string;
  location: { lat: number; lng: number };
  emergencyId?: string;
}

interface CoordinationStatus {
  stage: string;
  message: string;
  progress: number;
}

interface LogEntry {
  timestamp: string;
  message: string;
}

export default function CommandCenter() {
  const [emergencies, setEmergencies] = useState<Map<string, Emergency>>(new Map());
  const [ambulances, setAmbulances] = useState<Map<string, Ambulance>>(new Map());
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [coordination, setCoordination] = useState<Map<string, CoordinationStatus>>(new Map());
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [layersVisible, setLayersVisible] = useState({
    emergencies: true,
    ambulances: true,
    hospitals: true,
    corridors: true,
  });

  const { subscribe } = useWebSocket();

  const addLog = (message: string) => {
    setLogs((prev) => [{ timestamp: formatTimestamp(new Date()), message }, ...prev.slice(0, 49)]);
  };

  const setCoord = (id: string, stage: string, message: string, progress: number) => {
    setCoordination((prev) => new Map(prev).set(id, { stage, message, progress }));
  };

  useEffect(() => {
    return subscribe(WS_TOPICS.DASHBOARD, (data) => {
      const type = String(data.type ?? "");
      const eid = String(data.emergencyId ?? data.id ?? "");
      if (!eid) return;

      if (type === "EMERGENCY_REPORTED") {
        const loc = data.location as { lat: number; lng: number } | undefined;
        const emergency: Emergency = {
          id: eid,
          status: "REPORTED",
          severity: String(data.severity ?? "HIGH"),
          location: loc ?? { lat: Number(data.lat ?? 12.9716), lng: Number(data.lng ?? 77.5946) },
          injuryType: String(data.injuryType ?? "Emergency"),
          victimCount: Number(data.victimCount ?? 1),
        };
        setEmergencies((prev) => new Map(prev).set(eid, emergency));
        setSelectedId(eid);
        setCoord(eid, "INTAKE", "Emergency intake in progress", 10);
        addLog(`🚨 Emergency reported: ${emergency.injuryType}`);
      }

      if (type === "SEVERITY_ASSESSED") {
        setEmergencies((prev) => {
          const next = new Map(prev);
          const e = next.get(eid);
          if (e) next.set(eid, { ...e, severity: displaySeverity(String(data.severity)) });
          return next;
        });
        setCoord(eid, "SEVERITY_ANALYSIS", `Severity: ${data.severity}`, 25);
        addLog(`🔴 Severity assessed: ${data.severity}`);
      }

      if (type === "AMBULANCE_ASSIGNED") {
        const aid = String(data.ambulanceId ?? "");
        const loc = data.location as { lat: number; lng: number } | undefined;
        if (aid) {
          setAmbulances((prev) =>
            new Map(prev).set(aid, {
              id: aid,
              status: "EN_ROUTE",
              location: loc ?? { lat: 12.97, lng: 77.59 },
              emergencyId: eid,
            })
          );
        }
        setEmergencies((prev) => {
          const next = new Map(prev);
          const e = next.get(eid);
          if (e) next.set(eid, { ...e, status: "ASSIGNED", ambulanceAssigned: aid });
          return next;
        });
        setCoord(eid, "DISPATCH", `Ambulance ${aid.substring(0, 8)} dispatched`, 40);
        addLog(`🚑 Ambulance dispatched (ETA ${data.eta ?? "?"} min)`);
      }

      if (type === "GREEN_CORRIDOR_ACTIVATED") {
        setCoord(eid, "ROUTING", `Green corridor: ${data.trafficSignalCount ?? 0} signals`, 55);
        addLog(`🟢 Green corridor activated`);
      }

      if (type === "HOSPITAL_NOTIFIED" || type === "HOSPITAL_ASSIGNED" || type === "HOSPITAL_SELECTED") {
        setEmergencies((prev) => {
          const next = new Map(prev);
          const e = next.get(eid);
          if (e) next.set(eid, { ...e, hospitalAssigned: String(data.hospitalName ?? "") });
          return next;
        });
        setCoord(eid, "TRANSIT", `Hospital: ${data.hospitalName}`, 70);
        addLog(`🏥 Hospital assigned: ${data.hospitalName}`);
      }

      if (type === "EN_ROUTE") {
        setEmergencies((prev) => {
          const next = new Map(prev);
          const e = next.get(eid);
          if (e) next.set(eid, { ...e, status: "ROUTED" });
          return next;
        });
      }

      if (type === "ARRIVED") {
        setEmergencies((prev) => {
          const next = new Map(prev);
          const e = next.get(eid);
          if (e) next.set(eid, { ...e, status: "ARRIVED" });
          return next;
        });
        setCoord(eid, "ARRIVAL", "Ambulance at hospital", 85);
        addLog("✓ Ambulance arrived");
      }

      if (type === "COMPLETED") {
        setEmergencies((prev) => {
          const next = new Map(prev);
          const e = next.get(eid);
          if (e) next.set(eid, { ...e, status: "COMPLETED" });
          return next;
        });
        setCoord(eid, "HANDOFF", "Patient handoff complete", 100);
        addLog("✓ Emergency completed");
      }
    });
  }, [subscribe]);

  const active = Array.from(emergencies.values()).filter((e) => e.status !== "COMPLETED");
  const selected = selectedId ? emergencies.get(selectedId) : null;
  const selectedCoord = selectedId ? coordination.get(selectedId) : null;

  const stats = {
    active: active.length,
    critical: active.filter((e) => e.severity === "CRITICAL").length,
    enRoute: Array.from(ambulances.values()).filter((a) => a.status === "EN_ROUTE").length,
  };

  return (
    <div className="flex h-screen bg-slate-900 text-white overflow-hidden">
      <div className="w-96 bg-gradient-to-b from-slate-800 to-slate-900 border-r border-slate-700 flex flex-col">
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            <h1 className="text-2xl font-bold">COMMAND CENTER</h1>
          </div>
          <p className="text-slate-400 text-sm">Smart Emergency Grid</p>
        </div>
        <div className="grid grid-cols-2 gap-3 p-4">
          <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
            <p className="text-slate-400 text-xs">ACTIVE</p>
            <p className="text-3xl font-bold">{stats.active}</p>
          </div>
          <div className="bg-red-900/20 rounded-lg p-4 border border-red-700/30">
            <p className="text-red-300 text-xs">CRITICAL</p>
            <p className="text-3xl font-bold text-red-400">{stats.critical}</p>
          </div>
          <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600 col-span-2">
            <p className="text-slate-400 text-xs">EN ROUTE</p>
            <p className="text-3xl font-bold">{stats.enRoute}</p>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {active
            .sort((a, b) => {
              const o: Record<string, number> = { CRITICAL: 0, HIGH: 1, MODERATE: 2, LOW: 3 };
              return (o[a.severity] ?? 4) - (o[b.severity] ?? 4);
            })
            .map((e) => (
              <button
                key={e.id}
                onClick={() => setSelectedId(e.id)}
                className={`w-full text-left p-4 rounded-lg border-2 transition ${
                  selectedId === e.id ? "bg-slate-700 border-blue-500" : "bg-slate-700/50 border-slate-600"
                }`}
              >
                <p className="font-semibold text-sm">{e.injuryType}</p>
                <p className="text-xs text-slate-500 mt-1">{e.id.substring(0, 12)}...</p>
                <p className="text-xs mt-2 text-slate-400">{e.severity} · {e.victimCount} victim(s)</p>
              </button>
            ))}
        </div>
      </div>

      <div className="flex-1 relative">
        <CommandMap
          emergencies={Array.from(emergencies.values())}
          ambulances={Array.from(ambulances.values())}
          selectedEmergencyId={selectedId}
          layersVisible={layersVisible}
        />
        <div className="absolute top-6 right-6 bg-slate-800/90 rounded-lg border border-slate-600 p-4 space-y-2 backdrop-blur">
          <p className="text-xs font-semibold text-slate-400 uppercase">Layers</p>
          {(["emergencies", "ambulances", "hospitals", "corridors"] as const).map((key) => (
            <label key={key} className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={layersVisible[key]}
                onChange={(e) => setLayersVisible((p) => ({ ...p, [key]: e.target.checked }))}
              />
              {key}
            </label>
          ))}
        </div>
      </div>

      <div className="w-96 bg-gradient-to-b from-slate-800 to-slate-900 border-l border-slate-700 flex flex-col">
        {selected && selectedCoord ? (
          <>
            <div className="p-6 border-b border-slate-700 flex justify-between items-start">
              <div>
                <h2 className="text-lg font-bold">Incident Details</h2>
                <span className="inline-block mt-2 px-3 py-1 rounded-full bg-red-600 text-sm font-bold">{selected.severity}</span>
              </div>
              <button onClick={() => setSelectedId(null)}><X size={20} /></button>
            </div>
            <div className="p-4 space-y-2 border-b border-slate-700 text-sm">
              <div className="flex justify-between"><span className="text-slate-400">Type</span><span>{selected.injuryType}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Status</span><span className="text-blue-400">{selected.status}</span></div>
              {selected.ambulanceAssigned && (
                <div className="flex justify-between"><span className="text-slate-400">Ambulance</span><span>{selected.ambulanceAssigned.substring(0, 8)}</span></div>
              )}
              {selected.hospitalAssigned && (
                <div className="flex justify-between"><span className="text-slate-400">Hospital</span><span>{selected.hospitalAssigned}</span></div>
              )}
            </div>
            <div className="p-4 border-b border-slate-700">
              <p className="text-xs text-slate-400 uppercase mb-2">Coordination</p>
              <p className="text-sm font-semibold mb-2">{selectedCoord.message}</p>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all" style={{ width: `${selectedCoord.progress}%` }} />
              </div>
              <p className="text-xs text-slate-400 mt-1">{selectedCoord.progress}%</p>
              <div className="mt-4 space-y-1">
                {COORDINATION_STAGES.map((s) => (
                  <div key={s.id} className={`text-xs py-1 px-2 rounded ${s.id === selectedCoord.stage ? "bg-blue-900 text-blue-100" : "text-slate-500"}`}>
                    {s.label}
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center p-6 text-slate-500">
            <div className="text-center">
              <AlertTriangle size={32} className="mx-auto mb-2 opacity-50" />
              <p>Select an incident</p>
            </div>
          </div>
        )}
        <div className="flex-1 overflow-y-auto p-4 border-t border-slate-700">
          <p className="text-xs text-slate-400 uppercase mb-2">Activity Log</p>
          {logs.map((log, i) => (
            <div key={i} className="text-xs py-2 border-l-2 border-slate-600 pl-3 mb-2">
              <p className="text-slate-500">{log.timestamp}</p>
              <p>{log.message}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
