import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Ambulance,
  Brain,
  Building2,
  Server,
  Siren,
  Timer,
  Wifi,
  Zap,
} from "lucide-react";
import { SectionCard, SeverityBadge, StatCard } from "@/components/design-system";
import { AdminShell, type AdminTab } from "@/components/roles/admin-shell";
import ProfileHeader from "@/components/profile/profile-header";
import { LiveMap, type MapMarker } from "@/components/live-map";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { heatmapZones, livesSavedData, responseTimeData, utilizationData } from "@/lib/mock-data";
import { useCommandDashboard } from "@/hooks/useCommandDashboard";

export const Route = createFileRoute("/command")({
  head: () => ({
    meta: [{ title: "Admin Command Center · AEGIS" }],
  }),
  component: AdminPortal,
});

interface ActiveIncident {
  id: string;
  type: string;
  severity: "critical" | "high" | "medium" | "low";
  location: string;
  status: string;
  assignedUnit?: string;
  eta?: string;
}

const COLORS = { emergency: "#E63946", medical: "#0284C7", success: "#22C55E" };

function AdminPortal() {
  const [tab, setTab] = useState<AdminTab>("operations");
  const [pulse, setPulse] = useState(0);
  const dashboard = useCommandDashboard();

  const incidents: ActiveIncident[] = dashboard.incidents;
  const ambulances = dashboard.ambulances.length
    ? dashboard.ambulances
    : [{ id: "—", callsign: "Awaiting dispatch", driver: "—", status: "available", speed: 0 }];

  const hospitals = [
    { name: "City Care", er: 12, icu: 8 },
    { name: "Yashoda", er: 6, icu: 3 },
    { name: "Apollo Trauma", er: 9, icu: 5 },
  ];

  const volunteers = [
    { name: "Aarav Sharma", skill: "CPR", status: "responding" },
    { name: "Ananya Patel", skill: "EMT-Basic", status: "responding" },
    { name: "Kavya Nair", skill: "RN", status: "available" },
  ];

  useEffect(() => {
    const i = setInterval(() => setPulse((p) => p + 1), 4000);
    return () => clearInterval(i);
  }, []);

  const markers: MapMarker[] =
    incidents.length > 0
      ? incidents.slice(0, 4).map((e, index) => ({
          id: e.id,
          type: "emergency" as const,
          x: 15 + index * 20,
          y: 80 - index * 15,
          active: true,
          label: e.id.substring(0, 8),
        }))
      : [{ id: "idle", type: "hospital", x: 50, y: 50, label: "No active incidents" }];

  const activeCount = incidents.filter((e) => e.status !== "resolved").length;

  return (
    <AdminShell activeTab={tab} onTabChange={setTab} alertCount={activeCount}>
      {tab === "operations" && (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Active Incidents" value={activeCount} hint="+4 past hour" icon={Siren} accent="emergency" />
            <StatCard label="Avg Response" value="6m 52s" hint="↓ 34% baseline" icon={Timer} accent="success" />
            <StatCard label="Fleet Available" value="2 / 5" icon={Ambulance} accent="medical" />
            <StatCard label="ER Capacity" value="35 beds" icon={Building2} accent="warning" />
          </div>
          <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
            <SectionCard
              title="City-Wide Emergency Map"
              description="Live GPS overlays"
              actions={
                <span className="flex items-center gap-1 text-[10px] font-bold text-[#525866]">
                  <Wifi className={`h-3.5 w-3.5 ${dashboard.connected ? "text-success" : "text-warning"}`} />
                  {dashboard.connected ? "Live" : "Connecting"}
                </span>
              }
            >
              <LiveMap className="h-[420px]" markers={markers} route={{ from: [15, 80], via: [[30, 65]], to: [80, 20] }} showCorridor />
            </SectionCard>
            <SectionCard title="Live Emergency Feed">
              <div className="max-h-[420px] space-y-2 overflow-y-auto">
                {incidents.length === 0 ? (
                  <p className="py-8 text-center text-xs text-[#525866]">
                    No active emergencies — feed updates in real time via WebSocket.
                  </p>
                ) : (
                  incidents.map((e) => (
                  <div key={e.id} className="rounded-xl bg-[#F8F9FB] p-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#111111]">{e.id}</span>
                      <SeverityBadge severity={e.severity} />
                    </div>
                    <p className="mt-1 text-xs font-semibold text-[#111111]">{e.type}</p>
                    <p className="text-[10px] text-[#525866]">{e.location} · {e.status}</p>
                  </div>
                  ))
                )}
              </div>
            </SectionCard>
          </div>
          <SectionCard title="Green Corridor Control" description="Active transit overrides">
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="rounded-xl border border-success/30 bg-success/5 p-3 text-center">
                  <Zap className="mx-auto h-4 w-4 text-success" />
                  <p className="mt-1 text-[10px] font-bold text-[#111111]">Signal {n}</p>
                  <p className="text-[9px] font-bold text-success">GREEN</p>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      )}

      {tab === "emergencies" && (
        <SectionCard title="Emergency Timeline" description="All active and recent incidents">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E5E7EB] text-left text-[10px] font-bold uppercase text-[#525866]">
                <th className="pb-3">ID</th>
                <th className="pb-3">Type</th>
                <th className="pb-3">Severity</th>
                <th className="pb-3">Location</th>
                <th className="pb-3">Unit</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {incidents.map((e) => (
                <tr key={e.id} className="border-b border-[#E5E7EB]">
                  <td className="py-3 font-bold">{e.id}</td>
                  <td className="py-3">{e.type}</td>
                  <td className="py-3"><SeverityBadge severity={e.severity} /></td>
                  <td className="py-3 text-[#525866]">{e.location}</td>
                  <td className="py-3 font-mono text-xs">{e.assignedUnit ?? "—"}</td>
                  <td className="py-3 capitalize text-medical">{e.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </SectionCard>
      )}

      {tab === "hospitals" && (
        <div className="grid gap-4 md:grid-cols-3">
          {hospitals.map((h) => (
            <div key={h.name} className="rounded-2xl bg-white p-5 ring-1 ring-[#E5E7EB]">
              <Building2 className="h-5 w-5 text-medical" />
              <p className="mt-2 font-bold text-[#111111]">{h.name}</p>
              <div className="mt-3 grid grid-cols-2 gap-2 text-center text-xs">
                <div className="rounded-lg bg-medical/10 p-2 font-bold text-medical">ER {h.er}</div>
                <div className="rounded-lg bg-warning/10 p-2 font-bold text-warning">ICU {h.icu}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "ambulances" && (
        <SectionCard title="Ambulance Fleet Monitoring">
          <div className="space-y-2">
            {ambulances.map((a) => (
              <div key={a.id} className="flex items-center gap-4 rounded-xl bg-[#F8F9FB] p-4">
                <Ambulance className={`h-5 w-5 ${a.status === "available" ? "text-success" : "text-[#E63946]"}`} />
                <div className="flex-1">
                  <p className="text-sm font-bold text-[#111111]">{a.callsign}</p>
                  <p className="text-xs text-[#525866]">{a.driver}</p>
                </div>
                <span className="text-xs font-bold capitalize text-[#525866]">{a.status}</span>
                <span className="font-mono text-sm font-bold">{a.speed > 0 ? `${a.speed} km/h` : "—"}</span>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {tab === "volunteers" && (
        <SectionCard title="Volunteer Activity Monitoring">
          {volunteers.map((v) => (
            <div key={v.name} className="mb-3 flex items-center justify-between rounded-xl bg-[#F8F9FB] p-4 last:mb-0">
              <div className="flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-[#E63946]/10 text-sm font-bold text-[#E63946]">{v.name[0]}</div>
                <div>
                  <p className="text-sm font-bold text-[#111111]">{v.name}</p>
                  <p className="text-xs text-[#525866]">{v.skill}</p>
                </div>
              </div>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${v.status === "responding" ? "bg-[#E63946]/10 text-[#E63946]" : "bg-success/10 text-success"}`}>
                {v.status}
              </span>
            </div>
          ))}
        </SectionCard>
      )}

      {tab === "analytics" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <SectionCard title="Response Time Analytics">
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={responseTimeData}>
                <CartesianGrid stroke="#E5E7EB" strokeDasharray="3 3" />
                <XAxis dataKey="month" stroke="#525866" fontSize={11} />
                <YAxis stroke="#525866" fontSize={11} />
                <Tooltip contentStyle={{ background: "#FFF", border: "1px solid #E5E7EB", borderRadius: 8 }} />
                <Area type="monotone" dataKey="before" name="Before" stroke={COLORS.emergency} fill={COLORS.emergency} fillOpacity={0.1} />
                <Area type="monotone" dataKey="after" name="After AEGIS" stroke={COLORS.success} fill={COLORS.success} fillOpacity={0.1} />
              </AreaChart>
            </ResponsiveContainer>
          </SectionCard>
          <SectionCard title="Daily Lives Saved">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={livesSavedData}>
                <CartesianGrid stroke="#E5E7EB" strokeDasharray="3 3" />
                <XAxis dataKey="day" stroke="#525866" fontSize={11} />
                <YAxis stroke="#525866" fontSize={11} />
                <Tooltip contentStyle={{ background: "#FFF", border: "1px solid #E5E7EB", borderRadius: 8 }} />
                <Bar dataKey="lives" fill={COLORS.success} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </SectionCard>
          <SectionCard title="Fleet Utilization" className="lg:col-span-2">
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={utilizationData}>
                <CartesianGrid stroke="#E5E7EB" strokeDasharray="3 3" />
                <XAxis dataKey="hour" stroke="#525866" fontSize={11} interval={2} />
                <YAxis stroke="#525866" fontSize={11} />
                <Tooltip contentStyle={{ background: "#FFF", border: "1px solid #E5E7EB", borderRadius: 8 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="ambulances" stroke={COLORS.emergency} strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="hospitals" stroke={COLORS.medical} strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </SectionCard>
        </div>
      )}

      {tab === "heatmaps" && (
        <SectionCard title="Incident Heatmaps" description="6-hour risk forecast">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {heatmapZones.map((z) => (
              <div key={z.name} className="rounded-xl bg-[#F8F9FB] p-4">
                <div className="flex justify-between text-sm font-bold text-[#111111]">
                  <span>{z.name}</span>
                  <span className="text-[#E63946]">{z.risk}%</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-white">
                  <div className="h-full bg-[#E63946]" style={{ width: `${z.risk}%` }} />
                </div>
                <p className="mt-1 text-[10px] text-[#525866]">{z.incidents} incidents / 30 days</p>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {tab === "health" && (
        <SectionCard title="System Health Dashboard">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "GPS Latency", value: "12 ms", ok: true },
              { label: "API Gateway", value: "99.98%", ok: true },
              { label: "Signal Overrides", value: "384 paired", ok: true },
              { label: "Database Uptime", value: "99.998%", ok: true },
            ].map((m) => (
              <div key={m.label} className="rounded-xl bg-white p-4 text-center ring-1 ring-[#E5E7EB]">
                <Server className="mx-auto h-5 w-5 text-[#525866]" />
                <p className="mt-2 text-[10px] font-bold uppercase text-[#525866]">{m.label}</p>
                <p className="text-xl font-bold text-[#111111]">{m.value}</p>
                <p className="text-[10px] font-bold text-success">● Optimal</p>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {tab === "ai" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <SectionCard title="AI Recommendations" description={`Dispatch pulse #${pulse}`}>
            <div className="rounded-xl border border-[#E63946]/20 bg-[#E63946]/5 p-4">
              <p className="text-xs font-bold text-[#E63946]">Active trigger · EMG-1258</p>
              <p className="mt-1 text-sm text-[#111111]">Recommend AMB-1083 (Score 96%) · ETA 4m 12s</p>
            </div>
            {[
              { unit: "AMB-1083", score: 96, picked: true },
              { unit: "AMB-1102", score: 82, picked: false },
              { unit: "AMB-1057", score: 74, picked: false },
            ].map((r) => (
              <div key={r.unit} className={`mt-3 rounded-xl p-3 ${r.picked ? "bg-success/10 ring-1 ring-success/30" : "bg-[#F8F9FB]"}`}>
                <div className="flex justify-between text-sm font-bold">
                  <span>{r.unit}</span>
                  <span>{r.score}%</span>
                </div>
              </div>
            ))}
          </SectionCard>
          <SectionCard title="Predictive Analytics" description="Smart city insights">
            <div className="space-y-3 text-sm">
              {[
                "NH-24 corridor: 92% accident risk next 6h — pre-position 2 ALS units",
                "Sector 62: Cardiac events spike 18:00–21:00 — alert volunteer network",
                "City Care ICU at 85% — divert non-critical to Yashoda",
              ].map((insight) => (
                <div key={insight} className="flex gap-2 rounded-lg bg-[#F8F9FB] p-3">
                  <Brain className="h-4 w-4 shrink-0 text-medical" />
                  <p className="text-xs text-[#525866]">{insight}</p>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      )}

      {tab === "profile" && (
        <div className="space-y-4">
          <ProfileHeader name="Grid Admin" subtitle="Authority: Level 3 · Region: Delhi NCR" role="admin" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl bg-white p-5 ring-1 ring-[#E5E7EB]">
              <p className="text-[10px] font-bold uppercase text-[#525866]">System Permissions</p>
              <p className="mt-2 font-bold text-[#111111]">Emergency overrides · Audit access · Configuration</p>
            </div>
            <div className="rounded-2xl bg-white p-5 ring-1 ring-[#E5E7EB]">
              <p className="text-[10px] font-bold uppercase text-[#525866]">Region</p>
              <p className="mt-2 font-bold text-[#111111]">Delhi NCR</p>
            </div>
            <div className="rounded-2xl bg-white p-5 ring-1 ring-[#E5E7EB]">
              <p className="text-[10px] font-bold uppercase text-[#525866]">Audit Activity</p>
              <p className="mt-2 font-bold text-[#111111]">Last login · 2h ago · 14 actions</p>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
