import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  AlertTriangle,
  Brain,
  Building2,
  ChevronRight,
  Clock,
  Droplets,
  Heart,
  MapPin,
  MessageCircle,
  Mic,
  MicOff,
  Phone,
  PhoneCall,
  Pill,
  Share2,
  Shield,
  Siren,
  Users,
} from "lucide-react";
import { SectionCard } from "@/components/design-system";
import { CitizenShell, type CitizenTab } from "@/components/roles/citizen-shell";
import { LiveMap } from "@/components/live-map";
import ProfileHeader from "@/components/profile/profile-header";
import { useCitizenEmergency } from "@/hooks/useCitizenEmergency";

export const Route = createFileRoute("/citizen")({
  head: () => ({ meta: [{ title: "Citizen Portal · AEGIS" }] }),
  component: CitizenPortal,
});

function CitizenPortal() {
  const [tab, setTab] = useState<CitizenTab>("home");
  const [sos, setSos] = useState(false);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [activeSegment, setActiveSegment] = useState<"Accident" | "Medical" | "Fire" | null>(null);
  const emergency = useCitizenEmergency();

  const triggerSos = async (segment: "Accident" | "Medical" | "Fire" | null, description?: string) => {
    setActiveSegment(segment);
    setSos(true);
    const id = await emergency.reportEmergency(segment, description);
    if (id) setTab("tracking");
  };

  useEffect(() => {
    if (!listening) return;
    const phrases = [
      "I am reporting an emergency",
      "I am reporting a road accident near Sector 62 Crossing,",
      "I am reporting a road accident near Sector 62 Crossing, two cars crashed.",
      "I am reporting a road accident near Sector 62 Crossing, two cars crashed, driver has head injury.",
    ];
    let i = 0;
    const id = setInterval(() => {
      setTranscript(phrases[i]);
      i++;
      if (i >= phrases.length) {
        clearInterval(id);
        setListening(false);
        void triggerSos("Accident", phrases[phrases.length - 1]);
      }
    }, 1200);
    return () => clearInterval(id);
  }, [listening]);

  return (
    <CitizenShell
      activeTab={tab}
      onTabChange={setTab}
      header={
        <span className="rounded-full bg-success/10 px-2.5 py-1 text-[10px] font-bold text-success">
          Verified
        </span>
      }
    >
      {tab === "home" && (
        <HomeView
          onSos={() => setTab("emergency")}
          onTrack={() => setTab("tracking")}
          sos={sos}
          emergencyId={emergency.emergencyId}
          etaMinutes={emergency.etaMinutes}
          ambulanceId={emergency.ambulanceId}
        />
      )}
      {tab === "emergency" && (
        <EmergencyView
          sos={sos}
          error={emergency.error}
          isSubmitting={emergency.isSubmitting}
          severity={emergency.severity}
          onSos={() => void triggerSos(activeSegment)}
          onSegmentSos={(segment) => void triggerSos(segment)}
          listening={listening}
          setListening={setListening}
          transcript={transcript}
          setTranscript={setTranscript}
          activeSegment={activeSegment}
          setActiveSegment={setActiveSegment}
          onTrack={() => setTab("tracking")}
        />
      )}
      {tab === "tracking" && <TrackingView sos={sos} emergency={emergency} />}
      {tab === "history" && <HistoryView />}
      {tab === "profile" && <ProfileView />}
    </CitizenShell>
  );
}

function HomeView({
  onSos,
  onTrack,
  sos,
  emergencyId,
  etaMinutes,
  ambulanceId,
}: {
  onSos: () => void;
  onTrack: () => void;
  sos: boolean;
  emergencyId: string | null;
  etaMinutes: number | null;
  ambulanceId: string | null;
}) {
  return (
    <div className="space-y-4 p-4">
      <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-[#E5E7EB]">
        <p className="text-sm font-semibold text-[#111111]">Good afternoon, Aarav</p>
        <p className="mt-1 text-xs text-[#525866]">Sector 62, Noida · GPS active</p>
        {sos && emergencyId && (
          <button
            type="button"
            onClick={onTrack}
            className="mt-3 flex w-full items-center justify-between rounded-xl bg-[#E63946]/10 px-4 py-3 text-left"
          >
            <div>
              <p className="text-xs font-bold text-[#E63946]">Active emergency in progress</p>
              <p className="text-[10px] text-[#525866]">
                {ambulanceId ? `${ambulanceId.substring(0, 8).toUpperCase()} en route` : "Dispatching ambulance"}
                {etaMinutes != null ? ` · ETA ${etaMinutes}m` : ""}
              </p>
            </div>
            <ChevronRight className="h-4 w-4 text-[#E63946]" />
          </button>
        )}
      </div>

      <button
        type="button"
        onClick={onSos}
        className="flex w-full items-center gap-4 rounded-2xl bg-[#E63946] p-5 text-left text-white shadow-lg active:scale-[0.98]"
      >
        <div className="grid h-14 w-14 place-items-center rounded-full bg-white/20">
          <Siren className="h-7 w-7" />
        </div>
        <div>
          <p className="text-lg font-bold">One-Tap SOS</p>
          <p className="text-xs text-white/80">Instant dispatch to nearest responders</p>
        </div>
      </button>

      <div className="grid grid-cols-2 gap-3">
        {[
          { icon: Brain, label: "AI First Aid", sub: "Step-by-step guide" },
          { icon: Building2, label: "Nearby Hospitals", sub: "4 within 6 km" },
          { icon: MessageCircle, label: "Emergency Chat", sub: "Talk to dispatcher" },
          { icon: Share2, label: "Share Location", sub: "Notify family" },
        ].map((item) => (
          <button
            key={item.label}
            type="button"
            className="rounded-xl bg-white p-4 text-left ring-1 ring-[#E5E7EB] active:scale-[0.98]"
          >
            <item.icon className="h-5 w-5 text-[#E63946]" />
            <p className="mt-2 text-xs font-bold text-[#111111]">{item.label}</p>
            <p className="text-[10px] text-[#525866]">{item.sub}</p>
          </button>
        ))}
      </div>

      <SectionCard title="Medical Profile Summary" description="Shared with responders during SOS">
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="rounded-lg bg-[#F8F9FB] p-2">
            <Droplets className="mx-auto h-4 w-4 text-[#E63946]" />
            <p className="mt-1 font-bold">O+</p>
          </div>
          <div className="rounded-lg bg-[#F8F9FB] p-2">
            <AlertTriangle className="mx-auto h-4 w-4 text-warning" />
            <p className="mt-1 font-bold">Penicillin</p>
          </div>
          <div className="rounded-lg bg-[#F8F9FB] p-2">
            <Heart className="mx-auto h-4 w-4 text-medical" />
            <p className="mt-1 font-bold">Hypertension</p>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}

function EmergencyView({
  sos,
  error,
  isSubmitting,
  severity,
  onSos,
  onSegmentSos,
  listening,
  setListening,
  transcript,
  setTranscript,
  activeSegment,
  setActiveSegment,
  onTrack,
}: {
  sos: boolean;
  error: string | null;
  isSubmitting: boolean;
  severity: string | null;
  onSos: () => void;
  onSegmentSos: (segment: "Accident" | "Medical" | "Fire") => void;
  listening: boolean;
  setListening: (v: boolean) => void;
  transcript: string;
  setTranscript: (v: string) => void;
  activeSegment: "Accident" | "Medical" | "Fire" | null;
  setActiveSegment: (v: "Accident" | "Medical" | "Fire" | null) => void;
  onTrack: () => void;
}) {
  return (
    <div className="space-y-4 p-4">
      {error && (
        <div className="rounded-xl border border-[#E63946]/30 bg-[#E63946]/5 p-3 text-xs font-semibold text-[#E63946]">
          {error}
        </div>
      )}
      <div className="rounded-3xl bg-white p-6 text-center shadow-sm ring-1 ring-[#E5E7EB]">
        <button
          type="button"
          disabled={isSubmitting}
          onClick={onSos}
          className={`relative mx-auto grid h-40 w-40 place-items-center rounded-full bg-gradient-emergency text-white shadow-xl transition-transform active:scale-95 ${sos ? "pulse-emergency" : ""} ${isSubmitting ? "opacity-70" : ""}`}
        >
          <div>
            <Siren className="mx-auto h-10 w-10" />
            <div className="mt-1 text-xl font-black tracking-widest">{isSubmitting ? "..." : "SOS"}</div>
          </div>
        </button>
        <p className="mt-4 text-xs text-[#525866]">
          {isSubmitting
            ? "Reporting emergency to dispatch..."
            : sos
              ? "Beacon active. Ambulance dispatch in progress."
              : "Hold for 2 seconds or tap to broadcast emergency beacon."}
        </p>
        <div className="mt-4 flex justify-center gap-2">
          {(["Accident", "Medical", "Fire"] as const).map((seg) => (
            <button
              key={seg}
              type="button"
              disabled={isSubmitting}
              onClick={() => {
                setActiveSegment(seg);
                onSegmentSos(seg);
              }}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold ${
                activeSegment === seg ? "bg-[#E63946] text-white" : "bg-[#F8F9FB] text-[#525866] ring-1 ring-[#E5E7EB]"
              }`}
            >
              {seg}
            </button>
          ))}
        </div>
        {sos && (
          <button type="button" onClick={onTrack} className="mt-4 text-xs font-bold text-[#E63946] underline">
            View live tracking →
          </button>
        )}
      </div>

      <SectionCard title="Voice SOS" description="Describe the emergency naturally">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => {
              setListening(!listening);
              if (!listening) {
                setTranscript("");
                setActiveSegment(null);
              }
            }}
            className={`grid h-14 w-14 place-items-center rounded-full ${listening ? "bg-[#E63946] text-white pulse-emergency" : "bg-[#F8F9FB] text-[#525866] ring-1 ring-[#E5E7EB]"}`}
          >
            {listening ? <Mic className="h-6 w-6" /> : <MicOff className="h-6 w-6" />}
          </button>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold uppercase text-[#525866]">
              {listening ? "Listening..." : "Tap to speak"}
            </p>
            <p className="mt-1 text-xs italic text-[#111111]">{transcript || '"I need an ambulance..."'}</p>
          </div>
        </div>
        {sos && (
          <div className="mt-4 rounded-xl border border-medical/20 bg-medical/5 p-3">
            <p className="flex items-center gap-1.5 text-xs font-bold text-medical">
              <Brain className="h-4 w-4" /> AI Classification
            </p>
            <dl className="mt-2 grid grid-cols-2 gap-2 text-xs">
              <Field k="Type" v={activeSegment ?? "General"} />
              <Field k="Victims" v="1 patient" />
              <Field k="Priority" v={severity ?? "Assessing..."} />
              <Field k="Status" v={isSubmitting ? "Submitting" : "Live"} />
            </dl>
          </div>
        )}
      </SectionCard>

      <SectionCard title="Emergency Contacts" description="Auto-notified on SOS">
        {[
          { name: "Priya Sharma", relation: "Spouse", phone: "+91 98765 43210" },
          { name: "Ravi Sharma", relation: "Father", phone: "+91 98765 43211" },
        ].map((c) => (
          <div key={c.phone} className="flex items-center justify-between border-b border-[#E5E7EB] py-3 last:border-0">
            <div>
              <p className="text-sm font-semibold text-[#111111]">{c.name}</p>
              <p className="text-xs text-[#525866]">{c.relation}</p>
            </div>
            <a href={`tel:${c.phone}`} className="grid h-9 w-9 place-items-center rounded-full bg-success/10 text-success">
              <Phone className="h-4 w-4" />
            </a>
          </div>
        ))}
      </SectionCard>
    </div>
  );
}

function TrackingView({
  sos,
  emergency,
}: {
  sos: boolean;
  emergency: ReturnType<typeof useCitizenEmergency>;
}) {
  const etaLabel =
    emergency.etaMinutes != null ? `${emergency.etaMinutes}m` : sos ? "Calculating..." : "—";
  const defaultSteps = [
    { label: "SOS received", done: sos },
    { label: "Ambulance dispatched", done: false },
    { label: "Green corridor active", done: false },
    { label: "Hospital alerted", done: false },
    { label: "Patient handover", done: false },
  ];
  const timeline =
    emergency.steps.length > 0
      ? defaultSteps.map((step) => ({
          ...step,
          done: step.done || emergency.steps.some((s) => s.label === step.label && s.done),
        }))
      : defaultSteps;

  return (
    <div className="flex flex-col">
      <LiveMap
        className="min-h-[50vh] rounded-none border-0"
        showCorridor={sos}
        route={sos ? { from: [20, 75], via: [[40, 55]], to: [78, 22] } : undefined}
        markers={[
          { id: "me", type: "emergency", x: 20, y: 75, active: sos, label: "You" },
          {
            id: "amb",
            type: "ambulance",
            x: sos ? 38 : 60,
            y: sos ? 58 : 65,
            active: sos,
            label: emergency.ambulanceId?.substring(0, 8).toUpperCase() ?? "AMB",
          },
          { id: "h1", type: "hospital", x: 78, y: 22, label: emergency.hospitalName ?? "Hospital" },
        ]}
      />
      <div className="space-y-3 p-4">
        <div className="flex items-center justify-between rounded-xl bg-white p-4 ring-1 ring-[#E5E7EB]">
          <div>
            <p className="text-xs font-bold text-[#525866]">Ambulance ETA</p>
            <p className="text-2xl font-bold text-[#111111]">{etaLabel}</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold text-[#525866]">Hospital</p>
            <p className="text-sm font-semibold text-[#111111]">
              {emergency.hospitalName ?? (sos ? "Assigning..." : "—")}
            </p>
          </div>
        </div>
        {emergency.error && (
          <p className="rounded-lg bg-[#E63946]/10 px-3 py-2 text-xs font-semibold text-[#E63946]">
            {emergency.error}
          </p>
        )}
        <ol className="space-y-2">
          {timeline.map((step, i) => (
            <li key={i} className="flex items-center gap-3 text-xs">
              <span className={`h-2 w-2 rounded-full ${step.done ? "bg-success" : "bg-[#E5E7EB]"}`} />
              <span className={step.done ? "font-semibold text-[#111111]" : "text-[#525866]"}>{step.label}</span>
            </li>
          ))}
        </ol>
        <a
          href="tel:108"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#F8F9FB] py-3 text-sm font-bold text-[#111111] ring-1 ring-[#E5E7EB]"
        >
          <PhoneCall className="h-4 w-4" /> Dial 108
        </a>
      </div>
    </div>
  );
}

function HistoryView() {
  const incidents = [
    { id: "EMG-1180", type: "Medical", date: "Mar 2, 2026", status: "Resolved", hospital: "City Care" },
    { id: "EMG-1092", type: "Accident", date: "Jan 15, 2026", status: "Resolved", hospital: "Apollo" },
  ];
  return (
    <div className="space-y-3 p-4">
      <p className="text-sm font-semibold text-[#111111]">Emergency History</p>
      {incidents.map((inc) => (
        <div key={inc.id} className="rounded-xl bg-white p-4 ring-1 ring-[#E5E7EB]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#111111]">{inc.id}</span>
            <span className="rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-bold text-success">{inc.status}</span>
          </div>
          <p className="mt-1 text-sm text-[#525866]">{inc.type} · {inc.date}</p>
          <p className="mt-1 text-xs text-[#525866]">Admitted to {inc.hospital}</p>
        </div>
      ))}
    </div>
  );
}

function ProfileView() {
  return (
    <div className="space-y-4 p-4">
      <ProfileHeader name="Aarav Sharma" subtitle="Citizen ID · LL-2024-88421" role="citizen" />
      {[
        { icon: Droplets, label: "Blood Group", value: "O Positive" },
        { icon: Pill, label: "Allergies", value: "Penicillin, Sulfa drugs" },
        { icon: Heart, label: "Conditions", value: "Hypertension (controlled)" },
        { icon: Users, label: "Emergency Contacts", value: "2 configured" },
        { icon: Shield, label: "Insurance", value: "Star Health · Active" },
      ].map((row) => (
        <div key={row.label} className="flex items-center gap-4 rounded-xl bg-white p-4 ring-1 ring-[#E5E7EB]">
          <row.icon className="h-5 w-5 text-[#525866]" />
          <div>
            <p className="text-[10px] font-bold uppercase text-[#525866]">{row.label}</p>
            <p className="text-sm font-semibold text-[#111111]">{row.value}</p>
          </div>
        </div>
      ))}
    </div>
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
