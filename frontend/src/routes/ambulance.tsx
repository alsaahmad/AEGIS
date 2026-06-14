import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Fuel,
  Gauge,
  MessageSquare,
  Radio,
  Timer,
  Users,
  Zap,
} from "lucide-react";
import { SectionCard, StatCard } from "@/components/design-system";
import { AmbulanceShell, type AmbulanceTab } from "@/components/roles/ambulance-shell";
import { LiveMap } from "@/components/live-map";
import ProfileHeader from "@/components/profile/profile-header";

export const Route = createFileRoute("/ambulance")({
  head: () => ({ meta: [{ title: "Ambulance Mission Control · AEGIS" }] }),
  component: AmbulancePortal,
});

function AmbulancePortal() {
  const [tab, setTab] = useState<AmbulanceTab>("mission");
  const [started, setStarted] = useState(false);
  const [vitals, setVitals] = useState({ bp: "145/95", spo2: 91, hr: 94 });
  const [eta, setEta] = useState(4);
  const [distance, setDistance] = useState(1.8);
  const [checklist, setChecklist] = useState([
    { id: 1, text: "Acknowledge dispatch", done: true },
    { id: 2, text: "Navigate to patient", done: true },
    { id: 3, text: "Patient stabilized", done: false },
    { id: 4, text: "En-route to hospital", done: false },
    { id: 5, text: "ER handover complete", done: false },
  ]);

  useEffect(() => {
    if (!started) return;
    const interval = setInterval(() => {
      setVitals((v) => ({
        hr: Math.round(v.hr + (Math.random() > 0.5 ? 1 : -1)),
        spo2: Math.min(100, Math.max(80, v.spo2 + (Math.random() > 0.7 ? 1 : -1))),
        bp: v.bp,
      }));
      setDistance((d) => Math.max(0, +(d - 0.1).toFixed(1)));
      setEta((e) => Math.max(1, e - 1));
    }, 8000);
    return () => clearInterval(interval);
  }, [started]);

  const mapProps = {
    showCorridor: true as const,
    route: { from: [15, 80], via: [[35, 65], [55, 50]] as [number, number][], to: [80, 20] as [number, number] },
    markers: [
      { id: "pat", type: "emergency" as const, x: 15, y: 80, label: "Patient", active: true },
      { id: "us", type: "ambulance" as const, x: started ? 55 : 32, y: started ? 50 : 68, label: "A-1083", active: true },
      { id: "h", type: "hospital" as const, x: 80, y: 20, label: "City Care" },
      { id: "s1", type: "signal" as const, x: 28, y: 72 },
      { id: "s2", type: "signal" as const, x: 48, y: 56 },
    ],
  };

  return (
    <AmbulanceShell
      activeTab={tab}
      onTabChange={setTab}
      missionStatus={
        <span className="rounded-full bg-[#E63946] px-3 py-1 text-[10px] font-bold">EMG-1258 · Active</span>
      }
    >
      {(tab === "mission" || tab === "navigation") && (
        <div className="relative">
          <LiveMap className="min-h-[55vh] rounded-none border-0 lg:min-h-[65vh]" {...mapProps} />
          <div className="absolute bottom-0 left-0 right-0 space-y-0">
            <div className="mx-4 mb-4 rounded-2xl bg-white/95 p-4 shadow-lg backdrop-blur-md ring-1 ring-[#E5E7EB]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase text-[#525866]">Next turn</p>
                  <p className="text-sm font-bold text-[#111111]">Continue NH-24 Bypass</p>
                </div>
                <span className="rounded-lg bg-medical/10 px-3 py-1.5 text-sm font-bold text-medical">800m</span>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
                <div>
                  <p className="text-[#525866]">ETA</p>
                  <p className="font-bold text-[#111111]">{started ? `${eta} min` : "—"}</p>
                </div>
                <div>
                  <p className="text-[#525866]">Distance</p>
                  <p className="font-bold text-[#111111]">{distance} km</p>
                </div>
                <div>
                  <p className="text-[#525866]">Corridor</p>
                  <p className="font-bold text-success">6 signals</p>
                </div>
              </div>
              {!started && (
                <button
                  type="button"
                  onClick={() => {
                    setStarted(true);
                    setChecklist((prev) => prev.map((c) => (c.id <= 3 ? { ...c, done: true } : c)));
                  }}
                  className="mt-3 w-full rounded-xl bg-[#E63946] py-2.5 text-sm font-bold text-white"
                >
                  Start Route Sync
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {tab === "mission" && (
        <div className="grid gap-4 p-4 lg:grid-cols-2">
          <SectionCard title="Mission Checklist" description="EMG-1258 timeline">
            <ul className="space-y-2">
              {checklist.map((c) => (
                <li
                  key={c.id}
                  className="flex cursor-pointer items-center gap-3 rounded-lg p-2 hover:bg-[#F8F9FB]"
                  onClick={() => setChecklist((prev) => prev.map((x) => (x.id === c.id ? { ...x, done: !x.done } : x)))}
                >
                  <CheckCircle2 className={`h-5 w-5 ${c.done ? "text-success" : "text-[#E5E7EB]"}`} />
                  <span className={`text-sm ${c.done ? "text-[#525866] line-through" : "text-[#111111]"}`}>{c.text}</span>
                </li>
              ))}
            </ul>
          </SectionCard>
          <SectionCard title="Dispatch Notes" description="From command center">
            <div className="rounded-xl border border-warning/20 bg-warning/5 p-3 text-xs text-[#525866]">
              <p className="flex items-center gap-1.5 font-bold text-warning">
                <AlertCircle className="h-4 w-4" /> Clinical advisory
              </p>
              <p className="mt-2 leading-relaxed">
                56-year-old male, collapsed at Sector 62 market. Volunteer VOL-202 performing CPR on scene.
              </p>
            </div>
          </SectionCard>
        </div>
      )}

      {tab === "patient" && (
        <div className="space-y-4 p-4 lg:max-w-2xl">
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Heart Rate", value: vitals.hr, unit: "bpm", color: "text-[#E63946]" },
              { label: "SpO₂", value: vitals.spo2, unit: "%", color: "text-medical" },
              { label: "Blood Pressure", value: vitals.bp, unit: "mmHg", color: "text-success" },
            ].map((v) => (
              <div key={v.label} className="rounded-2xl bg-white p-4 text-center ring-1 ring-[#E5E7EB]">
                <p className="text-[10px] font-bold uppercase text-[#525866]">{v.label}</p>
                <p className={`mt-1 text-2xl font-bold font-mono ${v.color}`}>{v.value}</p>
                <p className="text-[10px] text-[#525866]">{v.unit}</p>
              </div>
            ))}
          </div>
          <SectionCard title="Patient Details" description="Streaming to City Care ER">
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <Field k="Age / Sex" v="56M" />
              <Field k="Chief Complaint" v="Cardiac distress" />
              <Field k="Severity" v="Critical" />
              <Field k="Assigned Hospital" v="City Care · ER Bay 3" />
              <Field k="GCS Score" v="14 / 15" />
              <Field k="Allergies" v="None reported" />
            </dl>
          </SectionCard>
          <SectionCard title="Communication Center" description="Live links">
            <div className="flex gap-2">
              {["Dispatch", "Hospital ER", "Volunteer"].map((ch) => (
                <button key={ch} type="button" className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#F8F9FB] py-3 text-xs font-bold ring-1 ring-[#E5E7EB]">
                  <MessageSquare className="h-4 w-4" /> {ch}
                </button>
              ))}
            </div>
          </SectionCard>
        </div>
      )}

      {tab === "vehicle" && (
        <div className="space-y-4 p-4 lg:max-w-3xl">
          <div className="grid gap-4 sm:grid-cols-2">
            <StatCard label="Fuel Level" value="68%" hint="~240 km range" icon={Fuel} accent="warning" />
            <StatCard label="Vehicle Status" value="Operational" hint="Last service 12 days ago" icon={Gauge} accent="success" />
          </div>
          <SectionCard title="Crew Information" description="Unit A-1083 · ALS">
            {[
              { name: "Vivaan Sharma", role: "Lead EMT / Driver", status: "On mission" },
              { name: "Neha Kapoor", role: "Paramedic", status: "On mission" },
            ].map((member) => (
              <div key={member.name} className="flex items-center justify-between border-b border-[#E5E7EB] py-3 last:border-0">
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-[#525866]" />
                  <div>
                    <p className="text-sm font-semibold text-[#111111]">{member.name}</p>
                    <p className="text-xs text-[#525866]">{member.role}</p>
                  </div>
                </div>
                <span className="rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-bold text-success">{member.status}</span>
              </div>
            ))}
          </SectionCard>
          <SectionCard title="Equipment Status">
            <div className="grid grid-cols-2 gap-2 text-xs">
              {["AED", "Ventilator", "Defibrillator", "O₂ Tank", "Stretcher", "Trauma Kit"].map((eq) => (
                <div key={eq} className="flex items-center justify-between rounded-lg bg-[#F8F9FB] px-3 py-2">
                  <span className="font-semibold text-[#111111]">{eq}</span>
                  <CheckCircle2 className="h-4 w-4 text-success" />
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      )}

      {tab === "history" && (
        <div className="space-y-3 p-4 lg:max-w-2xl">
          <SectionCard title="Response Time Analytics" description="Unit A-1083 · Last 7 days">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <p className="text-2xl font-bold text-[#111111]">5.2m</p>
                <p className="text-[10px] text-[#525866]">Avg response</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-success">12</p>
                <p className="text-[10px] text-[#525866]">Missions today</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-medical">98%</p>
                <p className="text-[10px] text-[#525866]">On-time rate</p>
              </div>
            </div>
          </SectionCard>
          {[
            { id: "EMG-1212", type: "Motorcycle trauma", time: "09:40 AM", status: "Handed over" },
            { id: "EMG-1201", type: "Pediatric hypoxia", time: "07:15 AM", status: "Admitted" },
          ].map((h) => (
            <div key={h.id} className="rounded-xl bg-white p-4 ring-1 ring-[#E5E7EB]">
              <div className="flex justify-between">
                <span className="text-sm font-bold text-[#111111]">{h.id}</span>
                <span className="text-[10px] font-bold text-success">{h.status}</span>
              </div>
              <p className="text-xs text-[#525866]">{h.type} · {h.time}</p>
            </div>
          ))}
        </div>
      )}

      {tab === "profile" && (
        <div className="space-y-4 p-4 lg:max-w-md">
          <ProfileHeader name="Vivaan Sharma" subtitle="EMT-ALS · License EMT-DL-4421 · Unit A-1083" role="ambulance" />
          {[
            { icon: Timer, label: "Shift", value: "06:00 – 18:00" },
            { icon: Radio, label: "Radio Channel", value: "Grid-7 Alpha" },
            { icon: Zap, label: "Green Corridors", value: "847 activations" },
          ].map((row) => (
            <div key={row.label} className="flex items-center gap-3 rounded-xl bg-white p-4 ring-1 ring-[#E5E7EB]">
              <row.icon className="h-5 w-5 text-[#525866]" />
              <div>
                <p className="text-[10px] font-bold uppercase text-[#525866]">{row.label}</p>
                <p className="text-sm font-semibold text-[#111111]">{row.value}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </AmbulanceShell>
  );
}

function Field({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <dt className="text-[10px] font-bold uppercase text-[#525866]">{k}</dt>
      <dd className="font-semibold text-[#111111]">{v}</dd>
    </div>
  );
}
