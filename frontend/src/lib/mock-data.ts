// Mock data generators for Smart Emergency Grid demo

export type Severity = "critical" | "high" | "medium" | "low";
export type EmergencyType = "Accident" | "Cardiac" | "Trauma" | "Stroke" | "Fire" | "Maternal";

export interface Emergency {
  id: string;
  type: EmergencyType;
  severity: Severity;
  location: string;
  lat: number;
  lng: number;
  victims: number;
  reportedAt: string;
  status: "active" | "dispatched" | "en-route" | "at-hospital" | "resolved";
  ambulanceId?: string;
  hospitalId?: string;
  eta?: number; // minutes
}

export interface Ambulance {
  id: string;
  callsign: string;
  driver: string;
  lat: number;
  lng: number;
  status: "available" | "dispatched" | "on-mission" | "offline";
  speed: number;
  zone: string;
}

export interface Hospital {
  id: string;
  name: string;
  lat: number;
  lng: number;
  beds: number;
  icuFree: number;
  emergencyFree: number;
  distanceKm: number;
  rating: number;
  specialties: string[];
}

export interface Volunteer {
  id: string;
  name: string;
  skill: string;
  lat: number;
  lng: number;
  distance: number;
  status: "available" | "responding" | "off-duty";
}

const TYPES: EmergencyType[] = ["Accident", "Cardiac", "Trauma", "Stroke", "Fire", "Maternal"];
const SEVERITIES: Severity[] = ["critical", "high", "medium", "low"];
const ZONES = ["Sector 9", "Raj Nagar", "Indirapuram", "Vasundhara", "Vaishali", "Kavi Nagar", "Crossings", "Govindpuram"];
const FIRST = ["Aarav", "Vivaan", "Ananya", "Diya", "Arjun", "Ishaan", "Rohan", "Kavya", "Riya", "Aditya", "Meera", "Karan"];
const LAST = ["Sharma", "Verma", "Gupta", "Singh", "Khan", "Patel", "Nair", "Reddy", "Iyer", "Das"];

const seedRand = (seed: number) => {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
};

const pick = <T,>(arr: T[], r: () => number) => arr[Math.floor(r() * arr.length)];

// Center: Ghaziabad / NCR area
const CENTER = { lat: 28.6692, lng: 77.4538 };

export function generateEmergencies(n = 12): Emergency[] {
  const r = seedRand(42);
  return Array.from({ length: n }, (_, i) => {
    const sev = pick(SEVERITIES, r);
    const status: Emergency["status"] = i < 3 ? "active" : i < 6 ? "dispatched" : i < 9 ? "en-route" : "at-hospital";
    return {
      id: `EMG-${1000 + i}`,
      type: pick(TYPES, r),
      severity: sev,
      location: `${pick(ZONES, r)}, Ghaziabad`,
      lat: CENTER.lat + (r() - 0.5) * 0.12,
      lng: CENTER.lng + (r() - 0.5) * 0.12,
      victims: 1 + Math.floor(r() * 4),
      reportedAt: `${Math.floor(r() * 20) + 1} min ago`,
      status,
      ambulanceId: status !== "active" ? `AMB-${100 + Math.floor(r() * 100)}` : undefined,
      hospitalId: status === "at-hospital" ? `HSP-${10 + Math.floor(r() * 50)}` : undefined,
      eta: status !== "active" ? Math.floor(r() * 12) + 2 : undefined,
    };
  });
}

export function generateAmbulances(n = 16): Ambulance[] {
  const r = seedRand(7);
  return Array.from({ length: n }, (_, i) => ({
    id: `AMB-${100 + i}`,
    callsign: `Unit ${String.fromCharCode(65 + (i % 26))}${i + 1}`,
    driver: `${pick(FIRST, r)} ${pick(LAST, r)}`,
    lat: CENTER.lat + (r() - 0.5) * 0.15,
    lng: CENTER.lng + (r() - 0.5) * 0.15,
    status: i % 4 === 0 ? "on-mission" : i % 4 === 1 ? "dispatched" : "available",
    speed: Math.floor(r() * 60) + 20,
    zone: pick(ZONES, r),
  }));
}

export function generateHospitals(n = 8): Hospital[] {
  const r = seedRand(99);
  const NAMES = ["Apollo", "Fortis", "Max", "Yashoda", "Columbia Asia", "Sarvodaya", "Atlanta", "Vasundhara Medical"];
  return Array.from({ length: n }, (_, i) => ({
    id: `HSP-${10 + i}`,
    name: `${NAMES[i % NAMES.length]} Hospital`,
    lat: CENTER.lat + (r() - 0.5) * 0.1,
    lng: CENTER.lng + (r() - 0.5) * 0.1,
    beds: 80 + Math.floor(r() * 200),
    icuFree: Math.floor(r() * 12),
    emergencyFree: Math.floor(r() * 18) + 2,
    distanceKm: +(r() * 12 + 1).toFixed(1),
    rating: +(3.5 + r() * 1.5).toFixed(1),
    specialties: ["Trauma", "Cardiac", "Neuro", "Pediatric"].slice(0, 2 + Math.floor(r() * 2)),
  }));
}

export function generateVolunteers(n = 6): Volunteer[] {
  const r = seedRand(33);
  const SKILLS = ["CPR Certified", "First Aid", "EMT-Basic", "Nurse", "Paramedic"];
  return Array.from({ length: n }, (_, i) => ({
    id: `VOL-${200 + i}`,
    name: `${pick(FIRST, r)} ${pick(LAST, r)}`,
    skill: pick(SKILLS, r),
    lat: CENTER.lat + (r() - 0.5) * 0.05,
    lng: CENTER.lng + (r() - 0.5) * 0.05,
    distance: +(r() * 2 + 0.1).toFixed(2),
    status: i % 3 === 0 ? "responding" : "available",
  }));
}

export const responseTimeData = Array.from({ length: 12 }, (_, i) => ({
  month: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][i],
  before: 18 - Math.random() * 2,
  after: 7 - Math.random() * 1.5,
}));

export const emergencyTypeData = [
  { name: "Accident", value: 412, color: "oklch(0.65 0.25 25)" },
  { name: "Cardiac", value: 286, color: "oklch(0.62 0.2 245)" },
  { name: "Trauma", value: 198, color: "oklch(0.78 0.18 70)" },
  { name: "Stroke", value: 152, color: "oklch(0.65 0.22 305)" },
  { name: "Maternal", value: 121, color: "oklch(0.72 0.2 150)" },
];

export const utilizationData = Array.from({ length: 24 }, (_, h) => ({
  hour: `${String(h).padStart(2, "0")}:00`,
  ambulances: Math.round(40 + 50 * Math.abs(Math.sin((h - 6) / 4)) + Math.random() * 10),
  hospitals: Math.round(55 + 30 * Math.abs(Math.sin((h - 8) / 5)) + Math.random() * 8),
}));

export const livesSavedData = Array.from({ length: 7 }, (_, i) => ({
  day: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"][i],
  lives: Math.round(40 + Math.random() * 30),
  incidents: Math.round(80 + Math.random() * 50),
}));

export const heatmapZones = [
  { name: "Raj Nagar Flyover", risk: 92, incidents: 48 },
  { name: "GT Road Crossing", risk: 87, incidents: 41 },
  { name: "Hindon Bridge", risk: 78, incidents: 33 },
  { name: "Mohan Nagar", risk: 71, incidents: 28 },
  { name: "Vaishali Metro", risk: 64, incidents: 22 },
  { name: "Crossings Republik", risk: 58, incidents: 19 },
];

export const platformStats = {
  hospitals: 50,
  ambulances: 100,
  volunteers: 200,
  emergencyRecords: 1000,
  avgResponseSec: 412,
  livesSaved: 8742,
  citiesActive: 12,
  uptime: 99.98,
};
