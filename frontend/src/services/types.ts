export interface GeoLocation {
  lat: number;
  lng: number;
}

export interface CreateEmergencyPayload {
  citizenId: string;
  location: GeoLocation;
  incidentDescription: string;
  victimCount: number;
  injuryType: string;
}

export interface EmergencyAck {
  emergencyId: string;
  status: string;
  message: string;
  createdAt: string;
}

export interface EmergencySnapshot {
  id: string;
  status: string;
  severity?: string;
  injuryType?: string;
  victimCount?: number;
  location?: GeoLocation;
  assignedAmbulanceId?: string;
  assignedHospitalId?: string;
  assignedHospitalName?: string;
}

export interface AmbulanceRecord {
  id: string;
  status: string;
  location?: GeoLocation;
  emergencyId?: string;
}

export interface HospitalRecord {
  id: string;
  name: string;
  availableIcuBeds?: number;
  totalIcuBeds?: number;
  availableErBeds?: number;
  totalErBeds?: number;
}

export interface DashboardWsEvent {
  type: string;
  emergencyId?: string;
  severity?: string;
  ambulanceId?: string;
  hospitalName?: string;
  hospitalId?: string;
  eta?: number;
  etaMinutes?: number;
  injuryType?: string;
  victimCount?: number;
  location?: GeoLocation;
  [key: string]: unknown;
}
