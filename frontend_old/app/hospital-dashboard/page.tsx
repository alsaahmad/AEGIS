"use client";

import { useEffect, useRef, useState } from "react";
import { AlertCircle, CheckCircle2, Volume2 } from "lucide-react";
import { useWebSocket } from "@/hooks/useWebSocket";
import StatusBadge from "@/components/StatusBadge";
import EtaCountdown from "@/components/EtaCountdown";
import { WS_TOPICS } from "@/lib/constants";
import { displaySeverity } from "@/lib/utils";
import { EMERGENCY_API, HOSPITAL_WS_URL } from "@/lib/config";

const DEMO_HOSPITAL_ID = process.env.NEXT_PUBLIC_DEMO_HOSPITAL_ID || "c7d92ea3-66e1-52cf-a149-8db02ea83615";

interface IncomingPatient {
  emergencyId: string;
  severity: string;
  injuryType: string;
  victimCount: number;
  etaSeconds: number;
  ambulanceId: string;
  arrivedAt?: string;
}

interface AlertItem {
  id: string;
  message: string;
  timestamp: string;
}

export default function HospitalDashboard() {
  const [patients, setPatients] = useState<Map<string, IncomingPatient>>(new Map());
  const [activeId, setActiveId] = useState<string | null>(null);
  const [showArrival, setShowArrival] = useState(false);
  const [arrivalPatient, setArrivalPatient] = useState<IncomingPatient | null>(null);
  const [icuAvailable, setIcuAvailable] = useState(12);
  const [icuTotal, setIcuTotal] = useState(32);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const intervalsRef = useRef<Map<string, ReturnType<typeof setInterval>>>(new Map());

  const { subscribe } = useWebSocket(HOSPITAL_WS_URL);

  const playSound = () => {
    if (!soundEnabled) return;
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = 800;
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch { /* ignore */ }
  };

  const addAlert = (message: string) => {
    setAlerts((prev) => [
      { id: `${Date.now()}`, message, timestamp: new Date().toLocaleTimeString("en-IN") },
      ...prev.slice(0, 19),
    ]);
  };

  const startCountdown = (id: string) => {
    if (intervalsRef.current.has(id)) clearInterval(intervalsRef.current.get(id)!);
    const interval = setInterval(() => {
      setPatients((prev) => {
        const next = new Map(prev);
        const p = next.get(id);
        if (!p || p.arrivedAt) return prev;
        const updated = { ...p, etaSeconds: Math.max(0, p.etaSeconds - 1) };
        next.set(id, updated);
        if (updated.etaSeconds === 0) {
          clearInterval(interval);
          intervalsRef.current.delete(id);
        }
        return next;
      });
    }, 1000);
    intervalsRef.current.set(id, interval);
  };

  useEffect(() => {
    return subscribe(WS_TOPICS.DASHBOARD, (data) => {
      const type = String(data.type ?? "");
      const hospitalId = String(data.hospitalId ?? "");
      if (hospitalId && hospitalId !== DEMO_HOSPITAL_ID) return;

      if (type === "HOSPITAL_NOTIFIED" || type === "HOSPITAL_ASSIGNED") {
        const eid = String(data.emergencyId);
        if (!eid) return;
        setPatients((prev) => {
          if (prev.has(eid)) return prev;
          const etaMin = Number(data.etaMinutes ?? data.eta ?? 5);
          const patient: IncomingPatient = {
            emergencyId: eid,
            severity: displaySeverity(String(data.severity ?? data.incomingPatientSeverity ?? "HIGH")),
            injuryType: String(data.injuryType ?? "Emergency"),
            victimCount: Number(data.victimCount ?? 1),
            etaSeconds: etaMin * 60,
            ambulanceId: String(data.ambulanceId ?? "Unknown"),
          };
          startCountdown(eid);
          setActiveId((cur) => cur ?? eid);
          addAlert(`Incoming: ${patient.injuryType} (${patient.severity})`);
          playSound();
          if (typeof data.availableIcuBeds === "number") setIcuAvailable(data.availableIcuBeds);
          return new Map(prev).set(eid, patient);
        });
      }

      if (type === "ARRIVED") {
        const eid = String(data.emergencyId);
        setPatients((prev) => {
          const p = prev.get(eid);
          if (!p) return prev;
          const updated = { ...p, arrivedAt: new Date().toISOString(), etaSeconds: 0 };
          setArrivalPatient(updated);
          setShowArrival(true);
          playSound();
          addAlert("Ambulance arrived");
          return new Map(prev).set(eid, updated);
        });
      }

      if (type === "ICU_BEDS_UPDATED" && typeof data.availableIcuBeds === "number") {
        setIcuAvailable(data.availableIcuBeds);
        if (typeof data.totalIcuBeds === "number") setIcuTotal(data.totalIcuBeds);
      }
    });
  }, [subscribe, soundEnabled]);

  useEffect(() => () => intervalsRef.current.forEach(clearInterval), []);

  const sorted = Array.from(patients.values())
    .filter((p) => !p.arrivedAt || showArrival)
    .sort((a, b) => {
      const order: Record<string, number> = { CRITICAL: 0, HIGH: 1, MODERATE: 2, LOW: 3 };
      const d = (order[a.severity] ?? 4) - (order[b.severity] ?? 4);
      return d !== 0 ? d : a.etaSeconds - b.etaSeconds;
    });

  const confirmArrival = async (id: string) => {
    await fetch(`${EMERGENCY_API}/api/v1/emergencies/${id}/arrival`, { method: "POST" });
    setShowArrival(false);
  };

  const confirmHandoff = async (id: string) => {
    await fetch(`${EMERGENCY_API}/api/v1/emergencies/${id}/handoff`, { method: "POST" });
    setPatients((prev) => { const n = new Map(prev); n.delete(id); return n; });
    setShowArrival(false);
  };

  if (showArrival && arrivalPatient) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full border-4 border-red-600">
          <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-6">
            <h2 className="text-2xl font-bold">🚑 AMBULANCE ARRIVED</h2>
            <p className="text-red-100">Incoming patient requires immediate attention</p>
          </div>
          <div className="p-8 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div><p className="text-sm text-gray-600">Severity</p><StatusBadge severity={arrivalPatient.severity} size="lg" /></div>
              <div><p className="text-sm text-gray-600">Injury</p><p className="text-xl font-bold">{arrivalPatient.injuryType}</p></div>
            </div>
            <div className={`p-4 rounded-lg border-2 ${icuAvailable > 0 ? "bg-green-50 border-green-300" : "bg-red-50 border-red-300"}`}>
              <p className="font-bold">{icuAvailable} / {icuTotal} ICU beds available</p>
            </div>
            <div className="flex gap-4">
              <button onClick={() => confirmArrival(arrivalPatient.emergencyId)} className="flex-1 bg-green-600 text-white font-bold py-3 rounded-lg">Confirm Arrival</button>
              <button onClick={() => confirmHandoff(arrivalPatient.emergencyId)} className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-lg">Handoff to Staff</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b sticky top-0 z-40 px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Hospital Command Center</h1>
          <p className="text-gray-600 text-sm">Smart Emergency Grid Integration</p>
        </div>
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className={`p-3 rounded-lg border-2 ${soundEnabled ? "border-blue-300 bg-blue-50 text-blue-600" : "border-gray-300"}`}
        >
          <Volume2 size={24} />
        </button>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-600">
            <p className="text-gray-600 text-sm">ICU Beds</p>
            <p className="text-4xl font-bold">{icuAvailable}</p>
            <p className="text-xs text-gray-500">of {icuTotal} total</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-600">
            <p className="text-gray-600 text-sm">Incoming</p>
            <p className="text-4xl font-bold">{sorted.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-600">
            <p className="text-gray-600 text-sm">Status</p>
            <p className="text-lg font-bold text-green-600 flex items-center gap-2"><CheckCircle2 size={20} /> Live</p>
          </div>
        </div>
        <h2 className="text-2xl font-bold mb-6">Incoming Patients</h2>
        {sorted.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center text-gray-500">
            <AlertCircle size={48} className="mx-auto mb-4 opacity-40" />
            <p>No incoming patients — dashboard updates in real-time</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sorted.map((p) => (
              <div
                key={p.emergencyId}
                onClick={() => setActiveId(p.emergencyId)}
                className={`bg-white rounded-lg shadow-lg border-l-4 p-6 cursor-pointer ${activeId === p.emergencyId ? "border-red-600 ring-2 ring-red-200" : "border-gray-300"}`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <StatusBadge severity={p.severity} />
                      <span className="font-bold text-lg">{p.injuryType}</span>
                    </div>
                    <p className="text-sm text-gray-600">Ambulance: {p.ambulanceId.substring(0, 12)}</p>
                  </div>
                  {p.arrivedAt ? (
                    <span className="text-green-600 font-bold">ARRIVED</span>
                  ) : (
                    <EtaCountdown etaSeconds={p.etaSeconds} />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        <h2 className="text-2xl font-bold mt-10 mb-4">Activity Log</h2>
        <div className="bg-white rounded-lg shadow divide-y max-h-64 overflow-y-auto">
          {alerts.length === 0 ? <p className="p-6 text-gray-500 text-center">No activity yet</p> :
            alerts.map((a) => (
              <div key={a.id} className="p-4">
                <p className="font-medium">{a.message}</p>
                <p className="text-xs text-gray-500">{a.timestamp}</p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
