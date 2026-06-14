import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Activity,
  Bed,
  BedDouble,
  CheckCircle2,
  Clock,
  HeartPulse,
  MapPin,
  Users,
  Wrench,
} from "lucide-react";
import { SectionCard, SeverityBadge, StatCard } from "@/components/design-system";
import { HospitalShell, type HospitalTab } from "@/components/roles/hospital-shell";
import ProfileHeader from "@/components/profile/profile-header";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useHospitalIncoming } from "@/hooks/useHospitalIncoming";

export const Route = createFileRoute("/hospital")({
  head: () => ({ meta: [{ title: "Hospital Operations · AEGIS" }] }),
  component: HospitalPortal,
});

const occupancyData = [
  { hour: "06", er: 45, icu: 72 },
  { hour: "09", er: 68, icu: 80 },
  { hour: "12", er: 82, icu: 85 },
  { hour: "15", er: 74, icu: 78 },
  { hour: "18", er: 86, icu: 88 },
  { hour: "21", er: 62, icu: 75 },
];

function HospitalPortal() {
  const [tab, setTab] = useState<HospitalTab>("overview");
  const [beds, setBeds] = useState({ icu: 8, er: 12, ward: 32, ot: 3 });
  const { incoming, icuAvailable, connected, error, confirmArrival, confirmHandoff } =
    useHospitalIncoming();

  const readinessScore = Math.round(((beds.icu / 20 + beds.er / 24 + beds.ot / 6) / 3) * 100);

  const handleAccept = async (id: string) => {
    const p = incoming.find((x) => x.id === id);
    if (!p) return;
    await confirmArrival(id);
    if (p.severity === "critical") setBeds((b) => ({ ...b, icu: Math.max(0, b.icu - 1) }));
    else setBeds((b) => ({ ...b, er: Math.max(0, b.er - 1) }));
  };

  const handleHandoff = async (id: string) => {
    await confirmHandoff(id);
  };

  return (
    <HospitalShell
      activeTab={tab}
      onTabChange={setTab}
      statusBadge={
        <span
          className={`rounded-full px-3 py-1 text-xs font-bold ${connected ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}
        >
          {connected ? "Live · Accepting trauma" : "Connecting..."}
        </span>
      }
    >
      {error && (
        <div className="mx-4 mt-4 rounded-xl border border-[#E63946]/30 bg-[#E63946]/5 p-3 text-sm font-semibold text-[#E63946]">
          {error}
        </div>
      )}
      {tab === "overview" && (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Incoming" value={incoming.length} hint="Ambulances en-route" icon={HeartPulse} accent="emergency" />
            <StatCard label="ICU Available" value={`${icuAvailable}/20`} icon={BedDouble} accent="warning" />
            <StatCard label="ER Bays" value={`${beds.er}/24`} icon={Bed} accent="medical" />
            <StatCard label="Readiness Score" value={`${readinessScore}%`} hint="Emergency capacity" icon={Activity} accent="success" />
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <SectionCard title="Critical Alerts" description="Requires immediate action">
              <div className="space-y-2">
                <div className="flex items-center gap-3 rounded-lg border border-[#E63946]/20 bg-[#E63946]/5 p-3">
                  <HeartPulse className="h-5 w-5 text-[#E63946]" />
                  <div>
                    <p className="text-sm font-bold text-[#111111]">
                      {incoming[0]
                        ? `${incoming[0].id.substring(0, 8)} arriving in ${incoming[0].eta} min`
                        : "No critical arrivals pending"}
                    </p>
                    <p className="text-xs text-[#525866]">
                      {incoming[0] ? `${incoming[0].type} · ICU prep may be required` : "Dashboard live via WebSocket"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg border border-warning/20 bg-warning/5 p-3">
                  <Wrench className="h-5 w-5 text-warning" />
                  <div>
                    <p className="text-sm font-bold text-[#111111]">Ventilator utilization at 75%</p>
                    <p className="text-xs text-[#525866]">12 of 16 units active</p>
                  </div>
                </div>
              </div>
            </SectionCard>
            <SectionCard title="Ambulance Arrival Tracking">
              {incoming.slice(0, 2).map((p) => (
                <div key={p.id} className="flex items-center justify-between border-b border-[#E5E7EB] py-3 last:border-0">
                  <div>
                    <p className="text-sm font-bold text-[#111111]">{p.ambulanceId}</p>
                    <p className="text-xs text-[#525866]">{p.type}</p>
                  </div>
                  <span className="flex items-center gap-1 text-sm font-bold text-warning">
                    <Clock className="h-4 w-4" /> {p.eta}m
                  </span>
                </div>
              ))}
            </SectionCard>
          </div>
        </div>
      )}

      {tab === "patients" && (
        <SectionCard title="Emergency Queue" description="Incoming patient feed with live vitals">
          {incoming.length === 0 ? (
            <div className="py-12 text-center">
              <CheckCircle2 className="mx-auto h-10 w-10 text-success" />
              <p className="mt-2 text-sm font-semibold text-[#111111]">No incoming cases</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-[#E5E7EB] text-[10px] font-bold uppercase text-[#525866]">
                    <th className="pb-3 pr-4">Case</th>
                    <th className="pb-3 pr-4">Severity</th>
                    <th className="pb-3 pr-4">Ambulance</th>
                    <th className="pb-3 pr-4">ETA</th>
                    <th className="pb-3 pr-4">Vitals</th>
                    <th className="pb-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {incoming.map((e) => (
                    <tr key={e.id} className="border-b border-[#E5E7EB]">
                      <td className="py-4 pr-4">
                        <p className="font-bold text-[#111111]">{e.id}</p>
                        <p className="text-xs text-[#525866]">{e.type}</p>
                        <p className="flex items-center gap-1 text-[10px] text-[#525866]">
                          <MapPin className="h-3 w-3" /> {e.location}
                        </p>
                      </td>
                      <td className="py-4 pr-4">
                        <SeverityBadge severity={e.severity} />
                      </td>
                      <td className="py-4 pr-4 font-mono text-xs">{e.ambulanceId}</td>
                      <td className="py-4 pr-4 font-bold text-warning">{e.eta}m</td>
                      <td className="py-4 pr-4 font-mono text-[10px]">
                        HR {e.vitals.hr} · SpO₂ {e.vitals.spo2}% · GCS {e.vitals.gcs}
                      </td>
                      <td className="py-4">
                        <div className="flex gap-1">
                          <button type="button" onClick={() => void handleAccept(e.id)} className="rounded-lg bg-success px-3 py-1.5 text-xs font-bold text-white">
                            Accept
                          </button>
                          <button type="button" onClick={() => void handleHandoff(e.id)} className="rounded-lg border border-[#E63946]/30 px-3 py-1.5 text-xs font-bold text-[#E63946]">
                            Handoff
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </SectionCard>
      )}

      {tab === "beds" && (
        <div className="grid gap-6 lg:grid-cols-2">
          {(
            [
              ["icu", "ICU Trauma Beds", 20, "warning"],
              ["er", "ER Emergency Bays", 24, "medical"],
              ["ward", "General Ward", 180, "success"],
              ["ot", "Operation Theatres", 6, "emergency"],
            ] as const
          ).map(([key, label, max, accent]) => (
            <SectionCard key={key} title={label} description={`${beds[key]} of ${max} available`}>
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => setBeds((b) => ({ ...b, [key]: Math.max(0, b[key] - 1) }))} className="h-9 w-9 rounded-lg ring-1 ring-[#E5E7EB]">−</button>
                <div className="h-3 flex-1 overflow-hidden rounded-full bg-[#F8F9FB]">
                  <div className="h-full bg-medical" style={{ width: `${(beds[key] / max) * 100}%` }} />
                </div>
                <button type="button" onClick={() => setBeds((b) => ({ ...b, [key]: b[key] + 1 }))} className="h-9 w-9 rounded-lg ring-1 ring-[#E5E7EB]">+</button>
              </div>
            </SectionCard>
          ))}
        </div>
      )}

      {tab === "staff" && (
        <SectionCard title="Staff Scheduling" description="On-call emergency personnel">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E5E7EB] text-[10px] font-bold uppercase text-[#525866]">
                <th className="pb-3 text-left">Name</th>
                <th className="pb-3 text-left">Role</th>
                <th className="pb-3 text-left">Shift</th>
                <th className="pb-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: "Dr. Karan Verma", role: "Trauma Surgeon", shift: "06:00–14:00", status: "In surgery", ok: false },
                { name: "Dr. Meera Iyer", role: "ER Cardiologist", shift: "08:00–20:00", status: "Available", ok: true },
                { name: "S. Nurse Ananya Nair", role: "Trauma Coordinator", shift: "07:00–19:00", status: "Available", ok: true },
                { name: "Dr. Rakesh Verma", role: "Triage Director", shift: "08:00–20:00", status: "Available", ok: true },
              ].map((s) => (
                <tr key={s.name} className="border-b border-[#E5E7EB]">
                  <td className="py-3 font-semibold text-[#111111]">{s.name}</td>
                  <td className="py-3 text-[#525866]">{s.role}</td>
                  <td className="py-3 font-mono text-xs text-[#525866]">{s.shift}</td>
                  <td className="py-3">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${s.ok ? "bg-success/10 text-success" : "bg-[#E63946]/10 text-[#E63946]"}`}>
                      {s.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </SectionCard>
      )}

      {tab === "resources" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <SectionCard title="Equipment Tracking">
            {[
              { name: "Ventilators", used: 12, total: 16 },
              { name: "Defibrillators", used: 4, total: 8 },
              { name: "Portable X-Ray", used: 2, total: 3 },
            ].map((eq) => (
              <div key={eq.name} className="mb-4 last:mb-0">
                <div className="flex justify-between text-xs font-bold text-[#111111]">
                  <span>{eq.name}</span>
                  <span>{eq.used}/{eq.total}</span>
                </div>
                <div className="mt-1 h-2 overflow-hidden rounded-full bg-[#F8F9FB]">
                  <div className="h-full bg-medical" style={{ width: `${(eq.used / eq.total) * 100}%` }} />
                </div>
              </div>
            ))}
          </SectionCard>
          <SectionCard title="Blood Bank & Oxygen">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-[#F8F9FB] p-4 text-center">
                <p className="text-[10px] font-bold uppercase text-[#525866]">O− Units</p>
                <p className="text-2xl font-bold text-[#E63946]">14</p>
              </div>
              <div className="rounded-xl bg-[#F8F9FB] p-4 text-center">
                <p className="text-[10px] font-bold uppercase text-[#525866]">O₂ Capacity</p>
                <p className="text-2xl font-bold text-success">88%</p>
              </div>
            </div>
          </SectionCard>
        </div>
      )}

      {tab === "analytics" && (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <StatCard label="Avg Handover" value="5.8 min" icon={Clock} accent="medical" />
            <StatCard label="Bed Occupancy" value="86%" icon={BedDouble} accent="warning" />
            <StatCard label="Weekly Admissions" value="142" icon={Users} accent="success" />
          </div>
          <SectionCard title="Ward Occupancy Forecast" description="24-hour projection">
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={occupancyData}>
                <CartesianGrid stroke="#E5E7EB" strokeDasharray="3 3" />
                <XAxis dataKey="hour" stroke="#525866" fontSize={11} />
                <YAxis stroke="#525866" fontSize={11} />
                <Tooltip contentStyle={{ background: "#FFF", border: "1px solid #E5E7EB", borderRadius: 8 }} />
                <Area type="monotone" dataKey="er" name="ER %" stroke="#0284C7" fill="#0284C7" fillOpacity={0.1} />
                <Area type="monotone" dataKey="icu" name="ICU %" stroke="#E63946" fill="#E63946" fillOpacity={0.1} />
              </AreaChart>
            </ResponsiveContainer>
          </SectionCard>
        </div>
      )}

      {tab === "profile" && (
        <div className="space-y-4">
          <ProfileHeader name="City Care Hospital" subtitle={"Trauma Hub · ER-7"} role="hospital" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl bg-white p-5 ring-1 ring-[#E5E7EB]">
              <p className="text-[10px] font-bold uppercase text-[#525866]">Departments</p>
              <p className="mt-2 font-bold text-[#111111]">ER · ICU · Trauma · Pediatrics</p>
            </div>
            <div className="rounded-2xl bg-white p-5 ring-1 ring-[#E5E7EB]">
              <p className="text-[10px] font-bold uppercase text-[#525866]">On-Call Staff</p>
              <p className="mt-2 font-bold text-[#111111]">Dr. Meera Iyer · Dr. Karan Verma · 24 nurses</p>
            </div>
            <div className="rounded-2xl bg-white p-5 ring-1 ring-[#E5E7EB]">
              <p className="text-[10px] font-bold uppercase text-[#525866]">Performance</p>
              <p className="mt-2 font-bold text-[#111111]">Avg Handover 5.8m · Readiness 86%</p>
            </div>
          </div>
        </div>
      )}

      {tab === "settings" && (
        <SectionCard title="Hospital Settings" description="Sync with metropolitan dispatch">
          <div className="space-y-4">
            {[
              { label: "Auto-accept critical cases", on: true },
              { label: "Broadcast bed availability", on: true },
              { label: "Alert when ICU below 20%", on: true },
              { label: "Share vitals with ambulances", on: false },
            ].map((setting) => (
              <div key={setting.label} className="flex items-center justify-between rounded-lg bg-[#F8F9FB] px-4 py-3">
                <span className="text-sm font-semibold text-[#111111]">{setting.label}</span>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${setting.on ? "bg-success/10 text-success" : "bg-[#E5E7EB] text-[#525866]"}`}>
                  {setting.on ? "ON" : "OFF"}
                </span>
              </div>
            ))}
          </div>
        </SectionCard>
      )}
    </HospitalShell>
  );
}
