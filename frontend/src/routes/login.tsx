import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { 
  HeartPulse, Shield, Ambulance, Building2, Users, Radio, 
  ChevronRight, Lock, MapPin, ArrowRight, Activity, Zap, CheckCircle2
} from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Portal Access · AEGIS" },
      { name: "description", content: "Access the AEGIS Emergency Response System. Onboard as a citizen, hospital coordinator, ambulance operator, volunteer responder, or grid admin." }
    ]
  }),
  component: LoginAndOnboarding,
});

type Role = "citizen" | "hospital" | "ambulance" | "volunteer" | "admin";

const ROLES: { key: Role; title: string; tagline: string; icon: React.ElementType; color: string; bg: string; border: string; accentBg: string; accentText: string }[] = [
  {
    key: "citizen",
    title: "Citizen SOS",
    tagline: "Instant dispatch, emergency alerts, and voice SOS.",
    icon: HeartPulse,
    color: "text-[#E63946]",
    bg: "bg-[#E63946]/8",
    border: "border-[#E63946]/25",
    accentBg: "bg-[#E63946]",
    accentText: "#E63946",
  },
  {
    key: "hospital",
    title: "Hospital Trauma Hub",
    tagline: "Sync bed capacities, ICU slots, and prepare ER teams.",
    icon: Building2,
    color: "text-[#0284C7]",
    bg: "bg-[#0284C7]/8",
    border: "border-[#0284C7]/25",
    accentBg: "bg-[#0284C7]",
    accentText: "#0284C7",
  },
  {
    key: "ambulance",
    title: "Ambulance Cockpit",
    tagline: "Live navigation, traffic override, and patient vitals.",
    icon: Ambulance,
    color: "text-amber-600",
    bg: "bg-amber-600/8",
    border: "border-amber-600/25",
    accentBg: "bg-amber-600",
    accentText: "#D97706",
  },
  {
    key: "volunteer",
    title: "First Responder Hub",
    tagline: "Nearby alerts, first-aid instructions, and skill maps.",
    icon: Users,
    color: "text-purple-600",
    bg: "bg-purple-600/8",
    border: "border-purple-600/25",
    accentBg: "bg-purple-600",
    accentText: "#7C3AED",
  },
  {
    key: "admin",
    title: "Grid Operations",
    tagline: "Citywide command overlays, fleet allocation, and analytics.",
    icon: Shield,
    color: "text-slate-700",
    bg: "bg-slate-700/8",
    border: "border-slate-700/25",
    accentBg: "bg-slate-800",
    accentText: "#334155",
  },
];

const ONBOARDING: Record<Role, { title: string; fields: React.ReactNode }[]> = {
  citizen: [
    {
      title: "Phone Verification",
      fields: (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Emergency Contact Number</label>
            <div className="flex gap-2">
              <span className="inline-flex items-center px-3 rounded-xl border border-gray-200 bg-gray-50 text-sm font-bold text-gray-500">+91</span>
              <input type="tel" maxLength={10} required className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-[#E63946] focus:ring-2 focus:ring-[#E63946]/10 focus:outline-none transition-all" placeholder="98765 43210" />
            </div>
            <p className="text-[10px] text-gray-400 mt-1.5">Used for verification and dispatcher callback during SOS.</p>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Full Name</label>
            <input type="text" className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-[#E63946] focus:ring-2 focus:ring-[#E63946]/10 focus:outline-none transition-all" placeholder="Aarav Sharma" />
          </div>
        </div>
      )
    },
    {
      title: "Location Permissions",
      fields: (
        <div className="space-y-4 text-center py-2">
          <div className="mx-auto h-16 w-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <MapPin className="h-8 w-8" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-gray-800">Enable High-Precision GPS</h4>
            <p className="text-xs text-gray-500 max-w-xs mx-auto">AEGIS requires precise GPS to coordinate response vectors and dispatch the nearest ambulance unit to your exact location.</p>
          </div>
          <button type="button" className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 px-5 py-2.5 text-xs font-bold text-blue-700 transition-all">
            <MapPin className="h-3.5 w-3.5" />
            Grant GPS Permission
          </button>
        </div>
      )
    },
    {
      title: "SOS Configuration",
      fields: (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Primary Emergency Contact</label>
            <div className="grid grid-cols-2 gap-2">
              <input type="text" className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-[#E63946] focus:ring-2 focus:ring-[#E63946]/10 focus:outline-none" placeholder="Contact Name" />
              <input type="tel" className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-[#E63946] focus:ring-2 focus:ring-[#E63946]/10 focus:outline-none" placeholder="Phone Number" />
            </div>
          </div>
          <label className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100 cursor-pointer hover:bg-gray-100 transition-all">
            <input type="checkbox" defaultChecked className="rounded text-[#E63946] focus:ring-[#E63946]" />
            <span className="text-xs text-gray-700 font-medium">Auto-send SMS with live tracking link when SOS is triggered</span>
          </label>
        </div>
      )
    }
  ],
  hospital: [
    {
      title: "Facility Credentials",
      fields: (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Clinical License Number</label>
            <input type="text" required className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-[#0284C7] focus:ring-2 focus:ring-[#0284C7]/10 focus:outline-none transition-all" placeholder="MOH-GZB-10293" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Hospital Name</label>
            <select className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-[#0284C7] focus:ring-2 focus:ring-[#0284C7]/10 focus:outline-none transition-all bg-white">
              <option>City Care Hospital</option>
              <option>Yashoda Super Specialty Hospital</option>
              <option>Apollo Trauma Center</option>
              <option>Max Multi-Specialty Hospital</option>
            </select>
          </div>
        </div>
      )
    },
    {
      title: "Trauma Specialties",
      fields: (
        <div className="space-y-3">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Active Departments</label>
          <div className="grid grid-cols-2 gap-2">
            {["Cardiology", "Trauma Surgery", "Neurology", "Pediatric ICU", "Burn Care Unit", "Orthopedics"].map((dept) => (
              <label key={dept} className="flex items-center gap-2.5 p-2.5 rounded-xl border border-gray-100 bg-gray-50 hover:bg-blue-50 hover:border-blue-200 cursor-pointer transition-all">
                <input type="checkbox" defaultChecked className="rounded text-[#0284C7]" />
                <span className="text-xs font-semibold text-gray-700">{dept}</span>
              </label>
            ))}
          </div>
        </div>
      )
    },
    {
      title: "Bed Capacity Declaration",
      fields: (
        <div className="space-y-4">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Available Beds Right Now</label>
          <div className="grid grid-cols-3 gap-3">
            {[{ label: "ER Bays", default: 8 }, { label: "ICU Beds", default: 3 }, { label: "Gen Ward", default: 22 }].map(({ label, default: def }) => (
              <div key={label} className="text-center">
                <span className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">{label}</span>
                <input type="number" defaultValue={def} className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-center font-bold focus:border-[#0284C7] focus:outline-none" />
              </div>
            ))}
          </div>
        </div>
      )
    }
  ],
  ambulance: [
    {
      title: "Vehicle Profile",
      fields: (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Ambulance Call Sign / ID</label>
            <input type="text" required className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-amber-600 focus:ring-2 focus:ring-amber-600/10 focus:outline-none transition-all" placeholder="Unit A-1083 (ALS)" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Emergency Support Level</label>
            <select className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-amber-600 focus:ring-2 focus:ring-amber-600/10 focus:outline-none bg-white transition-all">
              <option>Advanced Life Support (ALS)</option>
              <option>Basic Life Support (BLS)</option>
              <option>Patient Transport Vehicle (PTV)</option>
            </select>
          </div>
        </div>
      )
    },
    {
      title: "Operator Credentials",
      fields: (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Driving License Number</label>
            <input type="text" className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-amber-600 focus:ring-2 focus:ring-amber-600/10 focus:outline-none transition-all" placeholder="DL-142025008239" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Primary Driver Name</label>
            <input type="text" className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-amber-600 focus:ring-2 focus:ring-amber-600/10 focus:outline-none transition-all" placeholder="Vivaan Sharma" />
          </div>
        </div>
      )
    },
    {
      title: "Hardware Diagnostics",
      fields: (
        <div className="space-y-3 text-center py-2">
          <div className="mx-auto h-16 w-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Radio className="h-8 w-8 animate-pulse" />
          </div>
          <h4 className="text-sm font-bold text-gray-800">System Pairing Check</h4>
          <p className="text-xs text-gray-500">Connecting onboard GPS receiver and vitals telemetry transmitter...</p>
          <div className="space-y-1.5">
            {["GPS Receiver", "Vitals Telemetry", "Dispatch Radio", "City Traffic API"].map((sys, i) => (
              <div key={sys} className="flex items-center justify-between px-4 py-2 bg-green-50 border border-green-100 rounded-xl">
                <span className="text-xs font-semibold text-gray-700">{sys}</span>
                <span className="text-[10px] font-bold text-green-600 flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Online</span>
              </div>
            ))}
          </div>
        </div>
      )
    }
  ],
  volunteer: [
    {
      title: "Responder Credentials",
      fields: (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Qualification Level</label>
            <select className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-purple-600 focus:ring-2 focus:ring-purple-600/10 focus:outline-none bg-white transition-all">
              <option>CPR Certified Bystander</option>
              <option>Medical Practitioner / Doctor</option>
              <option>Registered Nurse</option>
              <option>Professional EMT / Paramedic</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Certification ID</label>
            <input type="text" className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-purple-600 focus:ring-2 focus:ring-purple-600/10 focus:outline-none transition-all" placeholder="AHA-82390 or equivalent" />
          </div>
        </div>
      )
    },
    {
      title: "Alert Radius Setup",
      fields: (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Notification Radius</label>
            <div className="grid grid-cols-3 gap-2">
              {["500m", "1 km", "2 km"].map((radius, i) => (
                <button key={radius} type="button" className={`p-3 border rounded-xl text-xs font-bold transition-all ${i === 0 ? "border-purple-600/40 bg-purple-50 text-purple-700" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
                  {radius}
                </button>
              ))}
            </div>
          </div>
          <div className="rounded-xl bg-purple-50 border border-purple-100 p-3 text-xs text-purple-700 leading-relaxed">
            <strong>Important:</strong> You will only be alerted for critical events (cardiac arrest, trauma) where immediate CPR or pressure bandaging is urgently needed.
          </div>
        </div>
      )
    },
    {
      title: "Availability Schedule",
      fields: (
        <div className="space-y-4">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Default Active Hours</label>
          <div className="grid grid-cols-2 gap-2">
            <button type="button" className="p-3 border border-purple-600/40 bg-purple-50 rounded-xl text-xs font-bold text-purple-700 hover:bg-purple-100 transition-all">
              24/7 Available
            </button>
            <button type="button" className="p-3 border border-gray-200 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-all">
              Weekends &amp; Off-hours
            </button>
          </div>
          <label className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100 cursor-pointer hover:bg-gray-100 transition-all">
            <input type="checkbox" defaultChecked className="rounded text-purple-600 focus:ring-purple-600" />
            <span className="text-xs text-gray-700 font-medium">Receive push notifications for critical incidents in my area</span>
          </label>
        </div>
      )
    }
  ],
  admin: [
    {
      title: "Admin Clearance",
      fields: (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Operator Passcode</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input type="password" required className="w-full rounded-xl border border-gray-200 pl-10 pr-4 py-2.5 text-sm focus:border-slate-700 focus:ring-2 focus:ring-slate-700/10 focus:outline-none transition-all" placeholder="••••••••" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Assigned Region</label>
            <select className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-slate-700 focus:ring-2 focus:ring-slate-700/10 focus:outline-none bg-white transition-all">
              <option>Delhi NCR Metropolitan Region</option>
              <option>Mumbai Smart Grid Area</option>
              <option>Bengaluru Operations Grid</option>
            </select>
          </div>
        </div>
      )
    },
    {
      title: "2FA Security",
      fields: (
        <div className="space-y-4 text-center">
          <div className="mx-auto h-16 w-16 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center">
            <Shield className="h-8 w-8" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Authenticator Code</label>
            <input type="text" maxLength={6} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-lg text-center tracking-widest font-mono focus:border-slate-700 focus:ring-2 focus:ring-slate-700/10 focus:outline-none transition-all" placeholder="000000" />
            <p className="text-[10px] text-gray-400 mt-1.5 text-center">Verify identity via your security authenticator app.</p>
          </div>
        </div>
      )
    },
    {
      title: "Dashboard Widgets",
      fields: (
        <div className="space-y-3">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Enable Initial Overlays</label>
          <div className="space-y-2">
            {[
              "Live Incidents & Heatmap View",
              "Green Corridor Controller Sync",
              "Fleet Utilization Analytics",
              "AI Recommendations & Audit Feed"
            ].map((widget) => (
              <label key={widget} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50 hover:bg-gray-100 cursor-pointer transition-all">
                <input type="checkbox" defaultChecked className="rounded text-slate-700" />
                <span className="text-xs font-semibold text-gray-700">{widget}</span>
              </label>
            ))}
          </div>
        </div>
      )
    }
  ]
};

function LiveNetworkDots() {
  const nodes = [
    { cx: 80, cy: 120, r: 8, color: "#E63946", label: "SOS" },
    { cx: 200, cy: 70, r: 7, color: "#3B82F6", label: "AMB" },
    { cx: 310, cy: 150, r: 9, color: "#22C55E", label: "ER" },
    { cx: 150, cy: 210, r: 6, color: "#7C3AED", label: "VOL" },
    { cx: 270, cy: 240, r: 7, color: "#F59E0B", label: "AMB" },
  ];
  const links = [[0,1],[1,2],[0,3],[3,4],[4,2]];
  return (
    <svg viewBox="0 0 380 300" className="w-full h-full opacity-80">
      {links.map(([a, b], i) => (
        <line key={i}
          x1={nodes[a].cx} y1={nodes[a].cy}
          x2={nodes[b].cx} y2={nodes[b].cy}
          stroke="#E5E7EB" strokeWidth="1.5" strokeDasharray="4 3"
        />
      ))}
      {nodes.map((n, i) => (
        <g key={i}>
          <circle cx={n.cx} cy={n.cy} r={n.r + 10} fill={n.color} opacity="0.08" className="animate-ping" style={{ animationDelay: `${i * 0.7}s`, animationDuration: "3s" }} />
          <circle cx={n.cx} cy={n.cy} r={n.r} fill={n.color} />
          <text x={n.cx} y={n.cy + n.r + 12} textAnchor="middle" fontSize="8" fill="#9CA3AF" fontWeight="bold" fontFamily="system-ui">{n.label}</text>
        </g>
      ))}
    </svg>
  );
}

function LoginAndOnboarding() {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const navigate = useNavigate();

  const currentSteps = selectedRole ? ONBOARDING[selectedRole] : [];
  const roleConf = selectedRole ? ROLES.find(r => r.key === selectedRole)! : null;

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < currentSteps.length) {
      setStep(step + 1);
    } else {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setDone(true);
        setTimeout(() => {
          if (selectedRole === "citizen") navigate({ to: "/citizen" });
          if (selectedRole === "hospital") navigate({ to: "/hospital" });
          if (selectedRole === "ambulance") navigate({ to: "/ambulance" });
          if (selectedRole === "volunteer") navigate({ to: "/volunteer" });
          if (selectedRole === "admin") navigate({ to: "/command" });
        }, 800);
      }, 1800);
    }
  };

  return (
    <div className="min-h-screen flex font-sans selection:bg-[#E63946]/10 selection:text-[#E63946]">
      
      {/* LEFT PANEL - Brand & Network Visualization */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-[42%] flex-col justify-between bg-[#0B0D11] relative overflow-hidden p-10">
        {/* Background subtle grid */}
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        
        {/* Top: Logo */}
        <Link to="/" className="relative z-10 inline-flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#E63946] to-[#C32F3A] flex items-center justify-center shadow-lg shadow-[#E63946]/30">
            <HeartPulse className="h-5.5 w-5.5 text-white" />
          </div>
          <div className="leading-tight">
            <div className="font-extrabold text-xl text-white tracking-tight">AEGIS</div>
            <div className="text-[9px] uppercase tracking-widest text-[#E63946] font-extrabold">Protect. Respond. Save Lives.</div>
          </div>
        </Link>

        {/* Center: Live Network Visualization */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center py-10">
          <div className="w-full max-w-sm">
            <div className="mb-4 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#E63946] animate-pulse" />
              <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Live Emergency Network</span>
            </div>
            <div className="relative h-[260px] rounded-2xl bg-white/[0.03] border border-white/[0.07] overflow-hidden p-4">
              <LiveNetworkDots />
              {/* Floating status chips */}
              <div className="absolute bottom-3 left-3 right-3 flex gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[#E63946]/15 border border-[#E63946]/20 text-[9px] font-bold text-[#E63946]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#E63946] animate-pulse" /> SOS ACTIVE
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-500/15 border border-blue-500/20 text-[9px] font-bold text-blue-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" /> 3 UNITS EN ROUTE
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/15 border border-green-500/20 text-[9px] font-bold text-green-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" /> 2 ERs READY
                </span>
              </div>
            </div>
          </div>
          
          {/* Tagline */}
          <div className="mt-8 space-y-3 text-center max-w-xs">
            <h2 className="text-2xl font-extrabold text-white leading-tight">One Network. Every Emergency. Zero Delays.</h2>
            <p className="text-sm text-gray-500 leading-relaxed">AEGIS coordinates the full emergency stack — from SOS trigger to hospital handover — in under 60 seconds.</p>
          </div>
        </div>

        {/* Bottom: Platform Stats */}
        <div className="relative z-10 grid grid-cols-3 gap-4 border-t border-white/[0.06] pt-6">
          {[
            { value: "4 min", label: "Avg Response" },
            { value: "12,800+", label: "Lives Impacted" },
            { value: "99.98%", label: "Network Uptime" },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="text-lg font-extrabold text-white">{value}</p>
              <p className="text-[10px] text-gray-500 font-semibold mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT PANEL - Auth / Onboarding */}
      <div className="flex-1 flex flex-col justify-center items-center py-12 px-6 sm:px-10 bg-[#F8F9FB] overflow-y-auto">
        
        {/* Mobile logo */}
        <div className="lg:hidden mb-8 text-center">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#E63946] to-[#C32F3A] flex items-center justify-center shadow-md">
              <HeartPulse className="h-5 w-5 text-white" />
            </div>
            <div className="leading-tight">
              <div className="font-extrabold text-lg text-gray-900">AEGIS</div>
              <div className="text-[9px] uppercase tracking-widest text-[#E63946] font-extrabold">Protect. Respond. Save Lives.</div>
            </div>
          </Link>
        </div>

        <div className="w-full max-w-md">

          {!selectedRole ? (
            /* ─── ROLE SELECTION ─── */
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Select Your Portal</h1>
                <p className="text-sm text-gray-500 mt-1">Each portal is role-specific with custom security and data integrations.</p>
              </div>

              <div className="space-y-2.5">
                {ROLES.map((role) => {
                  const Icon = role.icon;
                  return (
                    <button
                      key={role.key}
                      onClick={() => { setSelectedRole(role.key); setStep(1); }}
                      className="group w-full flex items-center gap-4 text-left p-4 rounded-2xl border border-gray-100 bg-white hover:border-gray-200 hover:shadow-md transition-all active:scale-[0.99] shadow-sm"
                    >
                      <div className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 ${role.bg} ${role.color} group-hover:scale-105 transition-transform`}>
                        <Icon className="h-5.5 w-5.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-gray-900">{role.title}</div>
                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{role.tagline}</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-gray-500 group-hover:translate-x-0.5 transition-all shrink-0" />
                    </button>
                  );
                })}
              </div>

              <p className="text-center text-xs text-gray-400">
                Already onboarded?{" "}
                <Link to="/" className="text-[#E63946] font-semibold hover:underline">Back to home</Link>
              </p>
            </div>

          ) : done ? (
            /* ─── SUCCESS STATE ─── */
            <div className="text-center space-y-4 py-8">
              <div className="mx-auto h-16 w-16 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-gray-900">Setup Complete</h2>
                <p className="text-sm text-gray-500 mt-1">Launching your portal dashboard...</p>
              </div>
              <div className="flex justify-center">
                <div className="h-1.5 w-24 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#E63946] animate-pulse rounded-full" style={{ width: "80%" }} />
                </div>
              </div>
            </div>

          ) : (
            /* ─── ONBOARDING FORM ─── */
            <form onSubmit={handleNext} className="space-y-6">
              
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <button
                    type="button"
                    onClick={() => setSelectedRole(null)}
                    className="text-xs text-gray-400 hover:text-gray-700 font-semibold transition-colors flex items-center gap-1"
                  >
                    ← Change Role
                  </button>
                  <h1 className="text-xl font-extrabold text-gray-900">{roleConf?.title}</h1>
                </div>
                {/* Step dots */}
                <div className="flex items-center gap-1.5">
                  {currentSteps.map((_, idx) => (
                    <div
                      key={idx}
                      className={`rounded-full transition-all ${step === idx + 1 ? "h-2 w-5" : "h-2 w-2"}`}
                      style={{ backgroundColor: step === idx + 1 ? roleConf?.accentText : "#E5E7EB" }}
                    />
                  ))}
                </div>
              </div>

              {/* Step Label */}
              <div>
                <span className="text-[10px] uppercase font-extrabold tracking-widest text-gray-400">
                  Step {step} of {currentSteps.length}
                </span>
                <h2 className="text-base font-bold text-gray-900 mt-0.5">
                  {currentSteps[step - 1].title}
                </h2>
              </div>

              {/* Form Fields */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm min-h-[200px] flex flex-col justify-center">
                {currentSteps[step - 1].fields}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full inline-flex items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-bold text-white transition-all shadow-lg active:scale-95 disabled:opacity-60 ${roleConf?.accentBg} hover:opacity-90`}
                style={{ boxShadow: `0 8px 24px ${roleConf?.accentText}22` }}
              >
                {loading ? (
                  <>
                    <Activity className="h-4 w-4 animate-pulse" />
                    <span>Synchronizing Network...</span>
                  </>
                ) : (
                  <>
                    <span>{step === currentSteps.length ? "Launch Portal" : "Continue"}</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

              {/* Trust signals */}
              <div className="flex items-center justify-center gap-4 text-[10px] text-gray-400 font-medium pt-2">
                <span className="flex items-center gap-1"><Zap className="h-3 w-3" /> AES-256 Encrypted</span>
                <span className="flex items-center gap-1"><Shield className="h-3 w-3" /> HIPAA Compliant</span>
                <span className="flex items-center gap-1"><Activity className="h-3 w-3" /> 99.98% Uptime</span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
