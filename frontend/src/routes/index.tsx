import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { 
  Activity, Ambulance, ArrowRight, Brain, Building2, CheckCircle2, 
  HeartPulse, MapPin, Radio, Shield, Siren, Sparkles, Timer, Users, 
  Zap, AlertTriangle, ChevronRight, Play, Eye
} from "lucide-react";
import { platformStats } from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AEGIS — AEGIS Emergency Response System" },
      { name: "description", content: "AEGIS Emergency Response System connects citizens, ambulances, hospitals, and volunteers in one intelligent emergency response network to reduce response times and save lives." },
      { property: "og:title", content: "AEGIS — AEGIS Emergency Response System" },
      { property: "og:description", content: "AEGIS Emergency Response System connects citizens, ambulances, hospitals, and volunteers in one intelligent emergency response network to reduce response times and save lives." },
    ],
  }),
  component: Landing,
});

function Landing() {
  const [activeStep, setActiveStep] = useState(0);

  // Auto-advance hero visualization steps
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 4);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen text-[#111111] bg-white font-sans selection:bg-[#E63946]/10 selection:text-[#E63946]">
      {/* STICKY NAVBAR */}
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-emergency shadow-md">
              <HeartPulse className="h-5 w-5 text-white" />
            </div>
            <div className="leading-tight">
              <div className="font-bold text-lg tracking-tight text-[#111111]">AEGIS</div>
              <div className="text-[9px] uppercase tracking-wider text-[#E63946] font-extrabold">Protect. Respond. Save Lives.</div>
            </div>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            <a href="#solutions" className="text-sm font-medium text-gray-600 hover:text-[#111111] transition-colors">Solutions</a>
            <a href="#how-it-works" className="text-sm font-medium text-gray-600 hover:text-[#111111] transition-colors">How It Works</a>
            <a href="#for-hospitals" className="text-sm font-medium text-gray-600 hover:text-[#111111] transition-colors">For Hospitals</a>
            <a href="#for-ambulances" className="text-sm font-medium text-gray-600 hover:text-[#111111] transition-colors">For Ambulance Services</a>
            <a href="#resources" className="text-sm font-medium text-gray-600 hover:text-[#111111] transition-colors">Resources</a>
            <a href="#contact" className="text-sm font-medium text-gray-600 hover:text-[#111111] transition-colors">Contact</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm font-semibold text-gray-700 hover:text-[#111111] px-3 py-2 transition-colors">
              Login
            </Link>
            <Link to="/login" className="inline-flex items-center justify-center rounded-lg bg-[#E63946] px-4 py-2 text-sm font-semibold text-white hover:bg-[#C32F3A] transition-all shadow-sm hover:shadow active:scale-95">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-hero py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 grid gap-12 lg:grid-cols-2 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#E63946]/20 bg-[#E63946]/5 px-3 py-1 text-xs font-semibold text-[#E63946]">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Next-Gen emergency management platform</span>
            </div>
            <h1 className="text-5xl font-extrabold leading-[1.15] tracking-tight sm:text-6xl text-[#111111]">
              Emergency Response, <br />
              <span className="text-[#E63946]">Reimagined With AI.</span>
            </h1>
            <p className="max-w-xl text-lg text-gray-600 leading-relaxed">
              AEGIS connects ambulances, hospitals, emergency responders and citizens in one intelligent network. Reduce response times. Improve coordination. Save lives.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link to="/login" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#E63946] px-6 py-3.5 font-bold text-white hover:bg-[#C32F3A] transition-all shadow-lg shadow-[#E63946]/10 hover:shadow-xl hover:translate-y-[-1px] active:scale-95">
                Launch Platform <ChevronRight className="h-4 w-4" />
              </Link>
              <a href="#contact" className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3.5 font-bold text-gray-800 hover:bg-gray-50 transition-all shadow-sm active:scale-95">
                Request Demo <Play className="h-3.5 w-3.5 fill-current text-gray-500" />
              </a>
            </div>
            
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-4 border-t border-gray-100 pt-8 mt-4">
              <div>
                <p className="text-2xl font-extrabold text-[#E63946]">4.5L+</p>
                <p className="text-xs text-gray-500 font-semibold mt-1">Road deaths yearly</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-[#111111]">40%</p>
                <p className="text-xs text-gray-500 font-semibold mt-1">Deaths preventable</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-blue-600">8-12m</p>
                <p className="text-xs text-gray-500 font-semibold mt-1">Average delay time</p>
              </div>
            </div>
          </div>

          {/* INTERACTIVE HERO RIGHT-SIDE VISUALIZATION */}
          <div className="relative">
            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-xl shadow-gray-100">
              <div className="flex items-center justify-between border-b border-gray-50 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <span className="flex h-2 w-2 rounded-full bg-[#E63946] animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Live Simulation Grid</span>
                </div>
                <div className="flex gap-1.5">
                  {[0, 1, 2, 3].map((step) => (
                    <button
                      key={step}
                      onClick={() => setActiveStep(step)}
                      className={`h-2.5 w-2.5 rounded-full transition-colors ${activeStep === step ? "bg-[#E63946]" : "bg-gray-200"}`}
                      title={`Go to step ${step + 1}`}
                    />
                  ))}
                </div>
              </div>

              {/* Realistic Map Canvas Container */}
              <div className="relative h-[320px] rounded-2xl bg-gray-50 border border-gray-100 overflow-hidden">
                {/* SVG Route Paths & Nodes */}
                <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
                  {/* Grid Lines */}
                  <defs>
                    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#E5E7EB" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />

                  {/* Route Paths */}
                  <path 
                    d="M 50 160 Q 150 70 200 180 T 360 120" 
                    fill="none" 
                    stroke="#E5E7EB" 
                    strokeWidth="4" 
                    strokeLinecap="round" 
                  />
                  {activeStep >= 1 && (
                    <path 
                      d="M 50 160 Q 150 70 200 180 T 360 120" 
                      fill="none" 
                      stroke="#E63946" 
                      strokeWidth="4" 
                      strokeDasharray="8 4" 
                      className="animate-dash" 
                      strokeLinecap="round"
                    />
                  )}

                  {/* Node 1: Accident */}
                  <circle cx="50" cy="160" r="10" fill={activeStep >= 0 ? "#E63946" : "#D1D5DB"} className={activeStep === 0 ? "animate-pulse" : ""} />
                  {activeStep >= 0 && <circle cx="50" cy="160" r="18" fill="none" stroke="#E63946" strokeWidth="2" className="animate-ping" opacity="0.3" />}

                  {/* Node 2: Ambulance */}
                  <circle cx="200" cy="180" r="10" fill={activeStep >= 1 ? "#3B82F6" : "#D1D5DB"} />
                  {activeStep === 1 && <circle cx="200" cy="180" r="18" fill="none" stroke="#3B82F6" strokeWidth="2" className="animate-ping" opacity="0.3" />}

                  {/* Node 3: Hospital */}
                  <circle cx="360" cy="120" r="10" fill={activeStep >= 2 ? "#22C55E" : "#D1D5DB"} />
                  {activeStep >= 2 && <circle cx="360" cy="120" r="18" fill="none" stroke="#22C55E" strokeWidth="2" className="animate-ping" opacity="0.3" />}
                </svg>

                {/* Animated Overlays */}
                {activeStep === 0 && (
                  <div className="absolute top-4 left-4 bg-white border border-[#E63946]/30 rounded-xl p-3 shadow-lg max-w-[220px] transition-all">
                    <div className="flex items-center gap-1.5 text-xs text-[#E63946] font-bold">
                      <AlertTriangle className="h-3.5 w-3.5" /> ACCIDENT DETECTED
                    </div>
                    <p className="text-xs font-bold text-gray-800 mt-1">Sector 62, Noida</p>
                    <p className="text-[10px] text-gray-500">SOS Triggered via Smart App</p>
                  </div>
                )}

                {activeStep === 1 && (
                  <div className="absolute top-4 right-4 bg-white border border-blue-200 rounded-xl p-3 shadow-lg max-w-[220px] transition-all">
                    <div className="flex items-center gap-1.5 text-xs text-blue-600 font-bold">
                      <Ambulance className="h-3.5 w-3.5" /> AMBULANCE DISPATCHED
                    </div>
                    <p className="text-xs font-bold text-gray-800 mt-1">Unit A-1083 (ALS)</p>
                    <p className="text-[10px] text-gray-500">ETA: 4 min · Route Synced</p>
                  </div>
                )}

                {activeStep === 2 && (
                  <div className="absolute bottom-4 left-4 bg-white border border-green-200 rounded-xl p-3 shadow-lg max-w-[220px] transition-all">
                    <div className="flex items-center gap-1.5 text-xs text-green-600 font-bold">
                      <Building2 className="h-3.5 w-3.5" /> HOSPITAL PREPARED
                    </div>
                    <p className="text-xs font-bold text-gray-800 mt-1">City Care Hospital</p>
                    <p className="text-[10px] text-gray-500">ER Bed 3 reserved · ICU Alerted</p>
                  </div>
                )}

                {activeStep === 3 && (
                  <div className="absolute inset-0 bg-[#F8F9FB]/90 flex flex-col items-center justify-center p-6 text-center transition-all animate-fade-in">
                    <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 mb-2">
                      <CheckCircle2 className="h-7 w-7" />
                    </div>
                    <h3 className="text-sm font-bold text-gray-800">Patient Admitted Successfully</h3>
                    <p className="text-xs text-gray-500 max-w-xs mt-1">Handover finished in 8.2 min. Vitals streamed live to trauma crew throughout transport.</p>
                    <button 
                      onClick={() => setActiveStep(0)} 
                      className="mt-3 text-xs text-[#E63946] font-bold hover:underline"
                    >
                      Replay sequence
                    </button>
                  </div>
                )}

                {/* Legend Labels on map */}
                <div className="absolute bottom-2 right-2 flex flex-col gap-1 bg-white/95 backdrop-blur-sm border border-gray-100 p-2 rounded-lg text-[10px] text-gray-500 shadow-sm font-medium">
                  <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#E63946]" /> Accident Scene</div>
                  <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-blue-500" /> Responding Unit</div>
                  <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-green-500" /> Destination Hospital</div>
                </div>
              </div>

              {/* Progress Stepper UI */}
              <div className="grid grid-cols-4 gap-2 mt-4 text-center">
                {[
                  { label: "Accident", desc: "Reported via App/Car" },
                  { label: "Ambulance", desc: "Assigned & Routed" },
                  { label: "Hospital", desc: "Prepared In Advance" },
                  { label: "Delivered", desc: "ER Handover Completed" }
                ].map((s, idx) => (
                  <div 
                    key={s.label}
                    onClick={() => setActiveStep(idx)}
                    className={`p-2 rounded-lg border cursor-pointer transition-all ${activeStep === idx ? "border-[#E63946]/30 bg-[#E63946]/2" : "border-gray-100 bg-gray-50 hover:bg-gray-100/55"}`}
                  >
                    <div className={`text-xs font-bold ${activeStep === idx ? "text-[#E63946]" : "text-gray-700"}`}>{s.label}</div>
                    <div className="text-[9px] text-gray-400 mt-0.5 line-clamp-1">{s.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST SECTION */}
      <section className="border-y border-gray-100 bg-[#F8F9FB] py-12">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Trusted by hospitals, municipalities & emergency responders</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-75">
            {/* Elegant text placeholders representing medical/government networks */}
            <div className="text-gray-700 font-extrabold text-sm tracking-tight flex items-center gap-1.5">
              <Building2 className="h-4 w-4 text-gray-500" /> Max Healthcare
            </div>
            <div className="text-gray-700 font-extrabold text-sm tracking-tight flex items-center gap-1.5">
              <Building2 className="h-4 w-4 text-gray-500" /> Fortis Hospitals
            </div>
            <div className="text-gray-700 font-extrabold text-sm tracking-tight flex items-center gap-1.5">
              <Shield className="h-4 w-4 text-gray-500" /> NASSCOM Grid
            </div>
            <div className="text-gray-700 font-extrabold text-sm tracking-tight flex items-center gap-1.5">
              <Building2 className="h-4 w-4 text-gray-500" /> Apollo Trauma
            </div>
            <div className="text-gray-700 font-extrabold text-sm tracking-tight flex items-center gap-1.5">
              <Users className="h-4 w-4 text-gray-500" /> Delhi EMS Network
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEM SECTION */}
      <section className="py-20 lg:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-[#111111] sm:text-4xl">
              Emergency Systems Were Never Built To Work Together.
            </h2>
            <p className="mt-4 text-gray-600">
              Traditional emergency dispatch is siloed. When time stands between life and death, delays accumulate across communication gaps.
            </p>
          </div>

          <div className="mt-16 max-w-4xl mx-auto">
            <div className="relative grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
              {[
                { title: "Citizen Calls", desc: "Panicked reporting with vague location details." },
                { title: "Dispatch Delay", desc: "Manual routing and phone coordination delays." },
                { title: "Traffic Delay", desc: "No priority coordination on congested signals." },
                { title: "Hospital Unaware", desc: "ER learns of patient only when ambulance pulls up." },
                { title: "Critical Time Lost", desc: "Wasted window causing preventable fatalities." }
              ].map((step, idx) => (
                <div key={step.title} className="relative flex flex-col items-center text-center p-4 bg-[#F8F9FB] rounded-2xl border border-gray-100">
                  <div className="h-8 w-8 rounded-full bg-red-100 text-[#E63946] flex items-center justify-center font-bold text-xs mb-3">
                    {idx + 1}
                  </div>
                  <h3 className="text-sm font-bold text-[#111111]">{step.title}</h3>
                  <p className="text-xs text-gray-500 mt-1">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SOLUTION SECTION */}
      <section id="solutions" className="py-20 lg:py-28 bg-[#F8F9FB] border-y border-gray-100">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[#E63946]/5 px-3 py-1 text-xs font-semibold text-[#E63946] mb-3">
              <span>INTEGRATED SYSTEM</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-[#111111] sm:text-4xl">
              One Network. Every Emergency.
            </h2>
            <p className="mt-3 text-gray-600">
              AEGIS bridges critical steps into a single intelligent platform, removing manual bottlenecks.
            </p>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "AI Dispatch",
                icon: Brain,
                desc: "Analyzes incoming emergency calls using real-time NLP, extracting location coordinates and medical severity to dispatch the optimal ambulance fleet within seconds.",
                useCase: "A citizen reports a vehicle collision on NH-24. AI instantly parses coordinates, flags trauma severity, and alerts the closest unit.",
                benefits: "Cuts manual dispatch time from 3 minutes to under 8 seconds."
              },
              {
                title: "Green Corridor",
                icon: Zap,
                desc: "Interfaces directly with city traffic management systems, automatically turning traffic signals green along the ambulance's live GPS navigation path.",
                useCase: "ALS unit AMB-108 travels through three major city junctions; traffic lights turn green 200m before arrival.",
                benefits: "Reduces transit delay by 30-40% in congested urban zones."
              },
              {
                title: "Hospital Sync",
                icon: Building2,
                desc: "Streams patient vitals from the ambulance directly to the destination hospital's ER dashboard, ensuring trauma teams prepare appropriate beds and equipment.",
                useCase: "Hospital crew views live ECG telemetry and SpO2 levels, preparing ER Bay 3 before the ambulance pulls up.",
                benefits: "Zero transition time. Resuscitation begins immediately upon delivery."
              },
              {
                title: "Volunteer Network",
                icon: Users,
                desc: "Mobilizes nearby certified citizen volunteers (CPR/First-aid trained) to administer initial assistance in the minutes before paramedics arrive.",
                useCase: "A cardiac arrest is reported at a shopping plaza. A registered nurse shopping nearby is paged and applies CPR.",
                benefits: "Provides critical life support during the vital first 3-5 minutes."
              },
              {
                title: "AI First Aid Assistant",
                icon: Siren,
                desc: "Provides step-by-step, personalized rescue instructions directly to the citizen caller while the ambulance is en-route.",
                useCase: "Caller receives interactive vocal prompts and visuals on applying direct pressure to stop severe bleeding.",
                benefits: "Stabilizes patients early and reduces panic during crisis."
              },
              {
                title: "Predictive Analytics",
                icon: Activity,
                desc: "Uses history and spatial data to forecast accident heatmaps, allowing municipalities to pre-position ambulance units at high-risk hotspots.",
                useCase: "During monsoon showers, AI positions three rescue units near Hindon Bridge flyover based on accident risk predictions.",
                benefits: "Improves incident-readiness times by up to 25%."
              }
            ].map((sol) => (
              <div key={sol.title} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                <div className="h-10 w-10 rounded-lg bg-[#E63946]/5 text-[#E63946] flex items-center justify-center mb-4">
                  <sol.icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">{sol.title}</h3>
                <p className="text-sm text-gray-600 mt-2 leading-relaxed">{sol.desc}</p>
                
                <div className="mt-4 pt-4 border-t border-gray-50 space-y-2">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-400">Real Use Case</span>
                    <p className="text-xs text-gray-700 mt-0.5">{sol.useCase}</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-green-500">Key Benefit</span>
                    <p className="text-xs font-semibold text-gray-900 mt-0.5">{sol.benefits}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS (TIMELINE) */}
      <section id="how-it-works" className="py-20 lg:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-[#111111] sm:text-4xl">
              Chronology of a Rescued Life
            </h2>
            <p className="mt-3 text-gray-600">
              From incident detection to hospital handover, see how AEGIS acts in real time.
            </p>
          </div>

          <div className="mt-16 max-w-3xl mx-auto relative pl-8 border-l border-gray-100">
            {[
              { step: "01", title: "Emergency Reported", desc: "Citizen activates the SOS trigger on their mobile app, or a connected vehicle registers a crash event. Live GPS details stream to the grid." },
              { step: "02", title: "AI Evaluates Situation", desc: "AEGIS's dispatch core instantly classifies severity, victim count, and clinical needs using NLP on text, audio or car sensor outputs." },
              { step: "03", title: "Best Ambulance Selected", desc: "Algorithms select the optimal ambulance based on traffic, distance, and clinical specialties, pushing turn-by-turn routing with Green Corridor clearance." },
              { step: "04", title: "Hospital Prepared", desc: "Hospital systems sync dynamically. An emergency trauma room and surgical teams are assigned, viewing real-time patient status." },
              { step: "05", title: "Volunteer Network Activated", desc: "Registered CPR-certified volunteers within a 500m radius are paged, providing immediate rescue support until the unit arrives." },
              { step: "06", title: "Patient Receives Care", desc: "Ambulance crew executes a seamless handover to the waiting trauma team with full history pre-loaded in the hospital system." }
            ].map((s) => (
              <div key={s.step} className="relative mb-12 last:mb-0">
                <div className="absolute -left-12 top-0.5 h-8 w-8 rounded-full bg-white border border-[#E63946] flex items-center justify-center text-xs font-bold text-[#E63946]">
                  {s.step}
                </div>
                <h3 className="text-lg font-bold text-gray-900">{s.title}</h3>
                <p className="text-sm text-gray-600 mt-1 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* IMPACT SECTION */}
      <section className="py-20 lg:py-24 bg-[#F8F9FB] border-t border-gray-100">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-extrabold tracking-tight text-[#111111]">
              Creating Real Impact Across India
            </h2>
            <p className="mt-4 text-gray-600">
              Empowering cities to combat emergency delay crises. Smart grids save lives by saving seconds.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto">
            {[
              { val: "4.5 Lakh+", label: "Road deaths yearly", desc: "Average fatalities recorded across Indian highways and cities." },
              { val: "40%", label: "Potentially preventable", desc: "Injuries that could have been survived with timely trauma response." },
              { val: "8-12 min", label: "Average delay reduced", desc: "Typical travel time saved under intelligent green corridor corridors." },
              { val: "100+", label: "Smart cities target", desc: "Municipal integrations in pipeline to modernize city grids." }
            ].map((stat) => (
              <div key={stat.label} className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm text-left">
                <div className="text-3xl font-black text-[#E63946]">{stat.val}</div>
                <div className="text-sm font-bold text-gray-900 mt-2">{stat.label}</div>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">{stat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-gray-100 bg-white py-12">
        <div className="mx-auto max-w-7xl px-6 grid gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-emergency shadow-sm">
                <HeartPulse className="h-4.5 w-4.5 text-white" />
              </div>
              <span className="font-bold text-[#111111]">AEGIS</span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              AI-powered emergency response network connecting citizens, ambulances, and hospitals to save lives when seconds count.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#111111] uppercase tracking-wider">Solutions</h4>
            <ul className="mt-3 space-y-2 text-xs text-gray-500">
              <li><Link to="/login" className="hover:text-[#E63946]">AI Dispatch Core</Link></li>
              <li><Link to="/login" className="hover:text-[#E63946]">Green Corridor Control</Link></li>
              <li><Link to="/login" className="hover:text-[#E63946]">Hospital Bed Sync</Link></li>
              <li><Link to="/login" className="hover:text-[#E63946]">Volunteer Coordination</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#111111] uppercase tracking-wider">Portals</h4>
            <ul className="mt-3 space-y-2 text-xs text-gray-500">
              <li><Link to="/login" className="hover:text-[#E63946]">Citizen SOS Portal</Link></li>
              <li><Link to="/login" className="hover:text-[#E63946]">Hospital ER console</Link></li>
              <li><Link to="/login" className="hover:text-[#E63946]">Ambulance Cockpit</Link></li>
              <li><Link to="/login" className="hover:text-[#E63946]">Responder Network</Link></li>
              <li><Link to="/login" className="hover:text-[#E63946]">Admin Command Center</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#111111] uppercase tracking-wider">Contact & Support</h4>
            <ul className="mt-3 space-y-2 text-xs text-gray-500">
              <li>HQ: New Delhi, India</li>
              <li>Email: contact@aegis.org</li>
              <li>Ph: +91 800 911 0000</li>
            </ul>
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-6 border-t border-gray-50 mt-8 pt-6 flex flex-wrap justify-between items-center text-[11px] text-gray-400">
          <p>© 2026 AEGIS. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:underline">Privacy Policy</a>
            <a href="#" className="hover:underline">Terms of Service</a>
            <a href="#" className="hover:underline">ISO 27001 Certified</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
