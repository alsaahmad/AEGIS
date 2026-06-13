"use client";

import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  Building2,
  Cpu,
  HeartPulse,
  MapPin,
  ShieldCheck,
  ShieldAlert,
  Sparkles,
  Truck,
  Users,
  Zap,
} from "lucide-react";

const navLinks = [
  { href: "#solutions", label: "Solutions" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#hospitals", label: "For Hospitals" },
  { href: "#ambulances", label: "For Ambulance Services" },
  { href: "#volunteers", label: "For Volunteers" },
  { href: "#resources", label: "Resources" },
  { href: "#contact", label: "Contact" },
];

const trustPartners = [
  "St. Gabriel Health",
  "Seaside Municipal EMS",
  "North City Trauma",
  "Riverbend Hospital",
  "Metro Response Network",
];

const problemSteps = [
  "Citizen Calls",
  "Dispatch Delay",
  "Traffic Delay",
  "Hospital Unaware",
  "Critical Time Lost",
];

const solutionCards = [
  {
    title: "AI Dispatch",
    description:
      "Route the nearest ambulance with the best arrival time, factoring in severity, traffic, and hospital readiness.",
    benefit: "Reduce first-response delays by up to 30%.",
    icon: Zap,
  },
  {
    title: "Green Corridor",
    description:
      "Automatically coordinate traffic signals to clear emergency pathways and shorten travel time.",
    benefit: "Ensure uninterrupted routes for every mission.",
    icon: MapPin,
  },
  {
    title: "Hospital Sync",
    description:
      "Keep receiving hospitals updated in real time so teams are ready before the patient arrives.",
    benefit: "Eliminate last-minute bed and staff surprises.",
    icon: Building2,
  },
  {
    title: "Volunteer Network",
    description:
      "Mobilize trained community responders for faster support before the ambulance arrives.",
    benefit: "Extend emergency coverage across every neighborhood.",
    icon: Users,
  },
  {
    title: "AI First Aid Assistant",
    description:
      "Provide guided triage instructions to callers and bystanders while help is en route.",
    benefit: "Improve patient condition before arrival.",
    icon: ShieldAlert,
  },
  {
    title: "Predictive Analytics",
    description:
      "Identify rising risk zones and deploy resources proactively to stay ahead of incidents.",
    benefit: "Turn emergency response from reactive to anticipatory.",
    icon: Cpu,
  },
];

const processSteps = [
  "Emergency Reported",
  "AI Evaluates Situation",
  "Best Ambulance Selected",
  "Hospital Prepared",
  "Volunteer Network Activated",
  "Patient Receives Care",
];

const impactStats = [
  { label: "Road deaths yearly", value: "4.5 Lakh+" },
  { label: "Potentially preventable", value: "40%" },
  { label: "Average delay", value: "8-12 min" },
  { label: "Smart cities target", value: "100+" },
];

const productStories = [
  {
    title: "Hospital Operations",
    description:
      "A frontline tool for hospital coordination teams to monitor incoming patients, available beds, and critical resource readiness.",
    bullets: [
      "Incoming patient queue with severity and arrival ETA.",
      "ICU capacity snapshots and staff deployment alerts.",
      "Automated notifications for trauma and operating room teams.",
    ],
  },
  {
    title: "Ambulance Dispatch",
    description:
      "An operational interface for dispatch centers to assign missions, track live navigation, and keep drivers informed.",
    bullets: [
      "Current mission status and route guidance.",
      "Traffic-aware arrival estimates and reroute options.",
      "Incident notes, patient severity, and destination hospital details.",
    ],
  },
  {
    title: "Volunteer Coordination",
    description:
      "A mobile-ready experience for vetted volunteers to respond safely and effectively to nearby incidents.",
    bullets: [
      "Nearby incident alerts with distance and skills match.",
      "Hands-free response actions and live guidance.",
      "Community contribution metrics and training status.",
    ],
  },
  {
    title: "Command Center",
    description:
      "A single view for city operations to watch emergencies, hospitals, ambulances, volunteers and outcomes together.",
    bullets: [
      "Live emergency feed with incident timelines.",
      "System health, network status, and AI recommendations.",
      "City-wide analytics and risk zone visibility.",
    ],
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-slate-950">
      <div className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 sm:px-8">
          <Link href="/" className="flex items-center gap-3 text-lg font-semibold text-slate-950">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-red-600 text-white">L</span>
            <span>LifeLine AI</span>
          </Link>
          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="text-sm font-medium text-slate-700 transition hover:text-slate-950">
                {link.label}
              </a>
            ))}
          </nav>
          <div className="hidden items-center gap-3 md:flex">
            <Link href="#contact" className="rounded-full border border-slate-300 px-5 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
              Login
            </Link>
            <Link href="#solutions" className="rounded-full bg-red-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-red-700">
              Get Started
            </Link>
          </div>
          <button className="inline-flex items-center justify-center rounded-full border border-slate-300 p-2 text-slate-700 md:hidden">
            <span className="text-lg">☰</span>
          </button>
        </div>
      </div>

      <section className="overflow-hidden bg-slate-50">
        <div className="mx-auto grid max-w-7xl gap-16 px-6 py-16 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
          <div className="max-w-2xl space-y-8">
            <span className="inline-flex rounded-full bg-red-50 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-red-700">
              Emergency response, reimagined
            </span>
            <h1 className="text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl">
              Emergency Response,
              <br />Reimagined With AI.
            </h1>
            <p className="text-lg leading-8 text-slate-700">
              LifeLine AI connects ambulances, hospitals, emergency responders and citizens in one intelligent network. Reduce response times, improve coordination, and save lives.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link href="#contact" className="inline-flex items-center justify-center rounded-full bg-red-600 px-6 py-3 text-base font-semibold text-white transition hover:bg-red-700">
                Request Demo
              </Link>
              <Link href="#solutions" className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 text-base font-semibold text-slate-950 transition hover:bg-slate-100">
                Launch Platform
              </Link>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-soft">
            <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-red-50 to-transparent" />
            <div className="relative p-8">
              <div className="mb-8 flex items-center justify-between rounded-3xl bg-slate-100 p-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Active mission</p>
                  <p className="mt-2 text-sm font-semibold text-slate-950">City-wide emergency coordination</p>
                </div>
                <div className="rounded-full bg-red-600 px-3 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-white">
                  Live
                </div>
              </div>
              <div className="space-y-6">
                <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6 shadow-sm">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-950">Accident detected</p>
                      <p className="mt-1 text-sm text-slate-600">Sector 07, Meadow Park · 2 min ago</p>
                    </div>
                    <div className="rounded-2xl bg-red-600 px-3 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-white">
                      Priority 1
                    </div>
                  </div>
                  <div className="mt-4 h-24 rounded-3xl bg-white p-4 shadow-sm">
                    <div className="flex h-full items-end justify-between gap-4">
                      <div className="space-y-2">
                        <div className="h-3 w-16 rounded-full bg-red-200" />
                        <div className="h-3 w-24 rounded-full bg-slate-200" />
                        <div className="h-3 w-10 rounded-full bg-slate-200" />
                      </div>
                      <div className="rounded-3xl bg-red-600 px-3 py-2 text-xs font-semibold uppercase text-white">
                        Incident
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Ambulance assigned</p>
                    <p className="mt-3 text-lg font-semibold text-slate-950">A-1083</p>
                    <p className="mt-2 text-sm text-slate-600">ETA 4 min · Northside EMS</p>
                  </div>
                  <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Hospital selected</p>
                    <p className="mt-3 text-lg font-semibold text-slate-950">Riverside Trauma Center</p>
                    <p className="mt-2 text-sm text-slate-600">ICU beds available · Team alerted</p>
                  </div>
                </div>

                <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Patient delivery</p>
                      <p className="mt-2 text-lg font-semibold text-slate-950">En route to hospital</p>
                    </div>
                    <div className="rounded-2xl bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-emerald-700">
                      In progress
                    </div>
                  </div>
                  <div className="mt-5 flex items-center gap-4">
                    <div className="h-2.5 flex-1 rounded-full bg-slate-200">
                      <div className="h-2.5 w-3/4 rounded-full bg-red-600" />
                    </div>
                    <span className="text-xs uppercase tracking-[0.35em] text-slate-500">75% complete</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white py-14">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <div className="grid gap-8 text-center md:grid-cols-4 md:text-left">
            {trustPartners.map((partner) => (
              <div key={partner} className="rounded-[1.75rem] border border-slate-200 bg-slate-50 px-6 py-8">
                <p className="text-base font-semibold text-slate-950">{partner}</p>
                <p className="mt-2 text-sm text-slate-600">Hospital network partner</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="solutions" className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-red-600">Trusted response</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">Emergency systems were never built to work together.</h2>
            <p className="mt-4 text-lg leading-8 text-slate-700">
              LifeLine AI unifies the entire emergency response chain, so every ambulance, hospital and volunteer acts with the same up-to-date information.
            </p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-[0.9fr_0.6fr]">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft">
              <div className="grid gap-4">
                {problemSteps.map((step, index) => (
                  <div key={step} className="flex items-center gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-red-100 text-red-700">
                      {index + 1}
                    </div>
                    <p className="text-base font-semibold text-slate-950">{step}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft">
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-600">By the numbers</p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl bg-slate-50 p-6">
                  <p className="text-sm text-slate-500">Dispatch time saved</p>
                  <p className="mt-3 text-3xl font-semibold text-slate-950">25%</p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-6">
                  <p className="text-sm text-slate-500">Average route improvement</p>
                  <p className="mt-3 text-3xl font-semibold text-slate-950">12 min</p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-6">
                  <p className="text-sm text-slate-500">Hospital prep accuracy</p>
                  <p className="mt-3 text-3xl font-semibold text-slate-950">98%</p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-6">
                  <p className="text-sm text-slate-500">Volunteer activation rate</p>
                  <p className="mt-3 text-3xl font-semibold text-slate-950">84%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <div className="grid gap-8 lg:grid-cols-3 lg:items-center">
            <div className="max-w-xl">
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-red-600">Solutions</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">One network. Every emergency.</h2>
              <p className="mt-4 text-lg leading-8 text-slate-700">
                LifeLine AI is built around real operational workflows, not dashboards. Each capability supports a distinct mission stage and improves response outcomes.
              </p>
            </div>
            <div className="lg:col-span-2 grid gap-6 sm:grid-cols-2">
              {solutionCards.map((card) => (
                <div key={card.title} className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-soft">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                    <card.icon size={20} />
                  </div>
                  <h3 className="mt-6 text-xl font-semibold text-slate-950">{card.title}</h3>
                  <p className="mt-4 text-slate-600">{card.description}</p>
                  <p className="mt-4 text-sm font-semibold text-slate-950">{card.benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-red-600">How it works</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">From report to care in six steps.</h2>
            <p className="mt-4 text-lg leading-8 text-slate-700">
              LifeLine AI transforms emergency response into a connected sequence so every handoff happens with full context and speed.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {processSteps.map((step, index) => (
              <div key={step} className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                  {index + 1}
                </div>
                <h3 className="mt-6 text-xl font-semibold text-slate-950">{step}</h3>
                <p className="mt-3 text-slate-600">
                  {step === "Emergency Reported" && "Calls, app alerts, or smart devices create a single incident record."}
                  {step === "AI Evaluates Situation" && "Severity, location, and resources are assessed instantly."}
                  {step === "Best Ambulance Selected" && "The closest available ambulance is dispatched with the optimal route."}
                  {step === "Hospital Prepared" && "Receiving teams are notified and patient needs are shared ahead of arrival."}
                  {step === "Volunteer Network Activated" && "Nearby trained responders are invited to support until professional help arrives."}
                  {step === "Patient Receives Care" && "Arrival, handoff and resource status are captured for continuous improvement."}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div className="space-y-6">
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-red-600">Impact</p>
              <h2 className="text-4xl font-semibold tracking-tight text-slate-950">Real outcomes for the next generation of emergency care.</h2>
              <p className="text-lg leading-8 text-slate-700">
                LifeLine AI is designed to deploy across hospitals, cities and emergency networks that need an intelligent system built for speed, coordination, and reliability.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              {impactStats.map((stat) => (
                <div key={stat.label} className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft">
                  <p className="text-sm uppercase tracking-[0.35em] text-slate-500">{stat.label}</p>
                  <p className="mt-4 text-4xl font-semibold text-slate-950">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="hospitals" className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-red-600">For Hospitals</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">A hospital product built around real emergency workflows.</h2>
              <p className="mt-4 text-lg leading-8 text-slate-700">
                Monitor incoming patients, manage bed availability, and keep clinical teams aligned with every incoming case.
              </p>
            </div>
            <div className="grid gap-4">
              {[
                "Incoming Patients",
                "Available Beds",
                "ICU Capacity",
                "Emergency Queue",
                "Response Readiness",
                "Staff Availability",
              ].map((item) => (
                <div key={item} className="rounded-3xl border border-slate-200 bg-white p-6 text-slate-700 shadow-soft">
                  <p className="font-semibold text-slate-950">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="ambulances" className="py-20">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="order-2 lg:order-1">
              <div className="grid gap-4">
                {[
                  "Current Mission",
                  "Patient Severity",
                  "Destination Hospital",
                  "Traffic Conditions",
                  "Live Navigation",
                  "ETA & Distance",
                ].map((item) => (
                  <div key={item} className="rounded-3xl border border-slate-200 bg-white p-6 text-slate-700 shadow-soft">
                    <p className="font-semibold text-slate-950">{item}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-red-600">For Ambulance Services</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">Operational clarity for every mission.</h2>
              <p className="mt-4 text-lg leading-8 text-slate-700">
                Dispatchers and crews get a single source of truth for mission status, route guidance, and incident context.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="volunteers" className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-red-600">For Volunteers</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">A trusted response network for the community.</h2>
              <p className="mt-4 text-lg leading-8 text-slate-700">
                Volunteers receive nearby incident alerts, matched by distance and skill, with clear response guidance.
              </p>
            </div>
            <div className="grid gap-4">
              {[
                "Nearby Incidents",
                "Skill Match",
                "Emergency Type",
                "Response Actions",
                "Community Score",
                "Training Progress",
              ].map((item) => (
                <div key={item} className="rounded-3xl border border-slate-200 bg-white p-6 text-slate-700 shadow-soft">
                  <p className="font-semibold text-slate-950">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="resources" className="py-20">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-10 shadow-soft">
            <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-red-600">Why LifeLine AI</p>
                <h2 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">A real product for emergency response teams and city operators.</h2>
                <p className="mt-4 text-lg leading-8 text-slate-700">
                  Built with operational clarity, not dashboards. LifeLine AI supports coordination across the entire incident lifecycle so teams can act with confidence.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {productStories.map((product) => (
                  <div key={product.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
                    <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">{product.title}</p>
                    <p className="mt-4 text-base font-semibold text-slate-950">{product.description}</p>
                    <ul className="mt-4 space-y-2 text-slate-600">
                      {product.bullets.map((bullet) => (
                        <li key={bullet} className="flex items-start gap-3">
                          <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-red-600" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="bg-slate-950 py-20 text-white">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-red-400">Launch readiness</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-tight">Ready to connect your emergency response network.</h2>
              <p className="mt-4 max-w-xl text-lg leading-8 text-slate-300">
                Schedule a demo or talk to our operations team to see how LifeLine AI can modernize your ambulance, hospital, and volunteer response workflows.
              </p>
            </div>
            <div className="space-y-4 rounded-[2rem] border border-slate-800 bg-slate-900/95 p-10 shadow-2xl">
              <div className="rounded-3xl bg-white/5 p-6">
                <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Contact</p>
                <p className="mt-3 text-xl font-semibold text-white">hello@lifeline.ai</p>
                <p className="mt-1 text-sm text-slate-400">Schedule a product walkthrough for your city or hospital network.</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-slate-800 bg-slate-950 p-5">
                  <p className="text-sm text-slate-400">Headquarters</p>
                  <p className="mt-3 text-base font-semibold text-white">Bangalore, India</p>
                </div>
                <div className="rounded-3xl border border-slate-800 bg-slate-950 p-5">
                  <p className="text-sm text-slate-400">Emergency Ops</p>
                  <p className="mt-3 text-base font-semibold text-white">+91 98765 43210</p>
                </div>
              </div>
              <Link href="#" className="inline-flex items-center justify-center rounded-full bg-red-600 px-6 py-3 text-base font-semibold text-white transition hover:bg-red-700">
                Request a Demo
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
