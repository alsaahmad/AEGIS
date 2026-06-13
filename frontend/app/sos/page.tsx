"use client";

import { useCallback, useEffect, useState } from "react";
import { AlertTriangle, CheckCircle, Clock, MapPin } from "lucide-react";
import dynamic from "next/dynamic";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useGeolocation } from "@/hooks/useGeolocation";
import { INJURY_TYPES, WS_TOPICS } from "@/lib/constants";
import { displaySeverity, formatTimestamp } from "@/lib/utils";
import { EMERGENCY_API } from "@/lib/config";

const Map = dynamic(() => import("@/components/Map"), { ssr: false });

interface EmergencyLocation {
  lat: number;
  lng: number;
  accuracy?: number;
}

interface TrackingUpdate {
  type: string;
  label: string;
  timestamp: string;
}

export default function SOSPage() {
  const [injuryType, setInjuryType] = useState("cardiac arrest");
  const [victimCount, setVictimCount] = useState(1);
  const [description, setDescription] = useState(
    "Person collapsed near the library entrance and may not be breathing normally."
  );
  const [location, setLocation] = useState<EmergencyLocation | null>(null);
  const [manualAddress, setManualAddress] = useState("");
  const [useManualLocation, setUseManualLocation] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [emergencyId, setEmergencyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [trackingUpdates, setTrackingUpdates] = useState<TrackingUpdate[]>([]);
  const [ambulanceLocation, setAmbulanceLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [severity, setSeverity] = useState<string | null>(null);
  const [ambulanceId, setAmbulanceId] = useState<string | null>(null);
  const [hospitalName, setHospitalName] = useState<string | null>(null);
  const [etaMinutes, setEtaMinutes] = useState<number | null>(null);

  const { location: geoLocation, error: geoError, loading: geoLoading } = useGeolocation();
  const { subscribe } = useWebSocket();

  useEffect(() => {
    if (!useManualLocation && geoLocation && !location) {
      setLocation({
        lat: geoLocation.latitude,
        lng: geoLocation.longitude,
        accuracy: geoLocation.accuracy,
      });
    }
  }, [geoLocation, useManualLocation, location]);

  const addUpdate = useCallback((type: string, label: string) => {
    setTrackingUpdates((prev) => [
      ...prev,
      { type, label, timestamp: formatTimestamp(new Date()) },
    ]);
  }, []);

  useEffect(() => {
    if (!emergencyId) return;
    return subscribe(WS_TOPICS.DASHBOARD, (data) => {
      if (String(data.emergencyId) !== emergencyId) return;
      const type = String(data.type ?? "");

      if (type === "SEVERITY_ASSESSED" && data.severity) {
        setSeverity(String(data.severity));
        addUpdate("severity", `Severity: ${displaySeverity(String(data.severity))}`);
      }
      if (type === "AMBULANCE_ASSIGNED") {
        setAmbulanceId(String(data.ambulanceId ?? ""));
        if (typeof data.eta === "number") setEtaMinutes(data.eta);
        if (data.location && typeof data.location === "object") {
          const loc = data.location as { lat: number; lng: number };
          setAmbulanceLocation(loc);
        }
        addUpdate("ambulance", `Ambulance dispatched${data.ambulanceId ? `: ${String(data.ambulanceId).substring(0, 8)}` : ""}`);
      }
      if (type === "HOSPITAL_NOTIFIED" || type === "HOSPITAL_ASSIGNED" || type === "HOSPITAL_SELECTED") {
        if (data.hospitalName) {
          setHospitalName(String(data.hospitalName));
          addUpdate("hospital", `Hospital: ${data.hospitalName}`);
        }
      }
      if (type === "EN_ROUTE") addUpdate("status", "Ambulance en route — green corridor active");
      if (type === "ARRIVED") addUpdate("status", "Ambulance arrived at hospital");
      if (type === "COMPLETED") addUpdate("status", "Patient handoff complete");
    });
  }, [emergencyId, subscribe, addUpdate]);

  const isFormValid = () => {
    if (!injuryType.trim()) { setError("Please select an injury type"); return false; }
    if (victimCount < 1) { setError("Victim count must be at least 1"); return false; }
    if (description.trim().length < 10) { setError("Please provide at least 10 characters describing the emergency"); return false; }
    if (!location && !useManualLocation) { setError("Location is required."); return false; }
    setError(null);
    return true;
  };

  const handleReportEmergency = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) return;
    setIsSubmitting(true);
    setError(null);
    try {
      const payload = {
        citizenId: `citizen-${Date.now()}`,
        location: location ?? { lat: 12.9716, lng: 77.5946 },
        incidentDescription: description,
        victimCount,
        injuryType,
      };
      const response = await fetch(`${EMERGENCY_API}/api/v1/emergencies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || `Server error: ${response.status}`);
      }
      const data = await response.json();
      setEmergencyId(data.emergencyId);
      setSubmitted(true);
      addUpdate("reported", "Emergency reported — AI assessing severity");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to report emergency.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted && emergencyId) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <div className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle size={32} />
              <h1 className="text-3xl font-bold">Emergency Reported</h1>
            </div>
            <p className="text-red-100 text-lg">Help is on the way. Stay safe and follow instructions.</p>
          </div>
        </div>
        <div className="flex-1 max-w-4xl mx-auto w-full px-6 py-8">
          <div className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-300 rounded-lg p-8 mb-8">
            <div className="grid grid-cols-3 gap-6">
              <div className="flex flex-col items-center">
                <Clock size={36} className="text-red-600 mb-2" />
                <p className="text-sm text-gray-700 font-medium">Estimated Arrival</p>
                <p className="text-4xl font-bold text-red-600 mt-2">{etaMinutes != null ? `${etaMinutes} min` : "--"}</p>
              </div>
              <div className="flex flex-col items-center">
                <AlertTriangle size={36} className="text-red-600 mb-2" />
                <p className="text-sm text-gray-700 font-medium">Severity</p>
                <p className="text-2xl font-bold text-red-600 mt-2">{severity ? displaySeverity(severity) : "ASSESSING"}</p>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-3xl mb-2">🚑</span>
                <p className="text-sm text-gray-700 font-medium">Ambulance</p>
                <p className="text-xl font-bold text-red-600 mt-2">{ambulanceId ? ambulanceId.substring(0, 8).toUpperCase() : "LOCATING"}</p>
              </div>
            </div>
          </div>
          {location && (
            <div className="mb-8 rounded-lg overflow-hidden shadow-lg border border-gray-200">
              <Map emergencyLocation={location} ambulanceLocation={ambulanceLocation} hospitalName={hospitalName} height="300px" />
            </div>
          )}
          <div className="space-y-4 mb-8">
            <h2 className="text-xl font-bold text-gray-900">Response Timeline</h2>
            {trackingUpdates.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Initializing emergency response...</p>
            ) : (
              trackingUpdates.map((u, i) => (
                <div key={i} className="flex gap-4 pb-4 border-b border-gray-200">
                  <span className="text-sm font-mono text-gray-500 min-w-20">{u.timestamp}</span>
                  <p className="font-medium text-gray-900">{u.label}</p>
                </div>
              ))
            )}
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
            <p className="text-gray-700 mb-3">If you need immediate phone support:</p>
            <p className="text-3xl font-bold text-blue-600 font-mono">102</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white py-8 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-block bg-red-600 text-white rounded-full p-3 mb-4">
            <AlertTriangle size={40} />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Emergency SOS</h1>
          <p className="text-gray-600 text-lg">Smart Emergency Grid</p>
        </div>
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-300 text-red-800 rounded-lg flex gap-3">
            <AlertTriangle size={20} className="flex-shrink-0 mt-0.5" />
            <p className="text-sm">{error}</p>
          </div>
        )}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-3">
          <MapPin size={20} className="text-blue-600" />
          <p className="font-medium text-gray-900 flex-1">
            {location ? `Location detected (${location.accuracy?.toFixed(0) ?? "?"}m accuracy)` :
              geoLoading ? "Getting location..." : geoError ? "Couldn't detect location" : "Enable location for faster response"}
          </p>
          {geoError && (
            <button type="button" onClick={() => setUseManualLocation(true)} className="text-sm font-medium text-blue-600">
              Enter Manually
            </button>
          )}
        </div>
        <form onSubmit={handleReportEmergency} className="bg-white rounded-lg shadow-lg p-8 space-y-6">
          <div>
            <label className="block text-gray-900 font-bold mb-3">Type of Emergency</label>
            <div className="grid grid-cols-2 gap-3">
              {INJURY_TYPES.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => { setInjuryType(type.value); setError(null); }}
                  className={`p-3 rounded-lg border-2 font-medium text-sm transition ${
                    injuryType === type.value ? "border-red-600 bg-red-50 text-red-700" : "border-gray-300 text-gray-700 hover:border-red-400"
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-gray-900 font-bold mb-3">Number of Victims</label>
            <div className="flex items-center gap-4">
              <button type="button" onClick={() => setVictimCount(Math.max(1, victimCount - 1))} className="px-4 py-2 bg-gray-200 rounded-lg font-bold">−</button>
              <span className="text-2xl font-bold w-12 text-center">{victimCount}</span>
              <button type="button" onClick={() => setVictimCount(victimCount + 1)} className="px-4 py-2 bg-gray-200 rounded-lg font-bold">+</button>
            </div>
          </div>
          <div>
            <label className="block text-gray-900 font-bold mb-3">Describe the Emergency</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-4 border-2 border-gray-300 rounded-lg focus:border-red-600 text-gray-900 resize-none"
              rows={5}
            />
          </div>
          {useManualLocation && (
            <div>
              <label className="block text-gray-900 font-bold mb-3">Your Location</label>
              <input
                type="text"
                value={manualAddress}
                onChange={(e) => setManualAddress(e.target.value)}
                placeholder="Street address or landmark"
                className="w-full p-4 border-2 border-gray-300 rounded-lg"
              />
            </div>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-4 font-bold text-lg rounded-lg ${isSubmitting ? "bg-gray-400" : "bg-red-600 hover:bg-red-700 text-white shadow-lg"}`}
          >
            {isSubmitting ? "Reporting..." : "🚨 REPORT EMERGENCY"}
          </button>
        </form>
      </div>
    </div>
  );
}
