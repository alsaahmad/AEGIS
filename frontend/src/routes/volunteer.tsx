import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Award,
  BookOpen,
  CheckCircle2,
  HeartPulse,
  Play,
  Sparkles,
  Star,
  Trophy,
} from "lucide-react";
import { SectionCard, SeverityBadge } from "@/components/design-system";
import { VolunteerShell, type VolunteerTab } from "@/components/roles/volunteer-shell";
import { LiveMap } from "@/components/live-map";
import ProfileHeader from "@/components/profile/profile-header";

export const Route = createFileRoute("/volunteer")({
  head: () => ({ meta: [{ title: "Volunteer Response · AEGIS" }] }),
  component: VolunteerPortal,
});

function VolunteerPortal() {
  const [tab, setTab] = useState<VolunteerTab>("incidents");
  const [accepted, setAccepted] = useState(false);
  const [arrived, setArrived] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [volStats, setVolStats] = useState({
    rating: 4.9,
    incidentsResponded: 14,
    communityScore: 880,
    skillRank: "Gold Responder",
    rewardPoints: 2450,
  });

  const handleComplete = () => {
    setCompleted(true);
    setVolStats((s) => ({
      ...s,
      incidentsResponded: s.incidentsResponded + 1,
      communityScore: s.communityScore + 50,
      rewardPoints: s.rewardPoints + 50,
    }));
  };

  return (
    <VolunteerShell activeTab={tab} onTabChange={setTab} onDuty>
      {tab === "incidents" && (
        <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          <div className="space-y-4">
            <div className="rounded-2xl border-2 border-[#E63946]/30 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-xs font-bold text-[#E63946]">
                  <HeartPulse className="h-4 w-4 pulse-emergency" /> 800m away
                </span>
                <SeverityBadge severity="critical" />
              </div>
              <h2 className="mt-3 text-lg font-bold text-[#111111]">Cardiac Arrest · Sector 62</h2>
              <p className="mt-1 text-sm text-[#525866]">
                Male, ~56 years. Ambulance ETA 4m. CPR assistance needed immediately.
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                <span className="rounded-full bg-[#F8F9FB] px-2.5 py-0.5 text-[10px] font-semibold text-[#525866]">CPR Certified</span>
                <span className="rounded-full bg-[#F8F9FB] px-2.5 py-0.5 text-[10px] font-semibold text-[#525866]">AED @ Metro Gate 2</span>
              </div>
              <div className="mt-4 flex gap-2">
                {!accepted ? (
                  <>
                    <button type="button" onClick={() => setAccepted(true)} className="flex-1 rounded-xl bg-[#E63946] py-2.5 text-sm font-bold text-white">
                      Accept Response
                    </button>
                    <button type="button" className="rounded-xl px-4 py-2.5 text-sm font-bold text-[#525866] ring-1 ring-[#E5E7EB]">
                      Decline
                    </button>
                  </>
                ) : !arrived ? (
                  <button type="button" onClick={() => setArrived(true)} className="flex-1 rounded-xl bg-medical py-2.5 text-sm font-bold text-white">
                    I've Arrived on Scene
                  </button>
                ) : !completed ? (
                  <button type="button" onClick={handleComplete} className="flex-1 rounded-xl bg-success py-2.5 text-sm font-bold text-white">
                    Mark Assistance Complete
                  </button>
                ) : (
                  <div className="flex-1 rounded-xl bg-success/10 py-2.5 text-center text-sm font-bold text-success">
                    +50 points · Thank you for saving a life
                  </div>
                )}
              </div>
            </div>

            <SectionCard title="Navigation Assistance" description="Fastest route to incident">
              <LiveMap
                className="h-[200px]"
                markers={[
                  { id: "inc", type: "emergency", x: 50, y: 50, label: "Incident", active: true },
                  { id: "me", type: "volunteer", x: 38, y: 58, label: "You", active: true },
                  { id: "amb", type: "ambulance", x: 70, y: 30, label: "AMB-1083", active: true },
                ]}
              />
            </SectionCard>
          </div>

          <SectionCard title="Nearby Emergency Alerts" description="Within 2 km radius">
            {[
              { id: "EMG-1258", type: "Cardiac Arrest", dist: "0.8 km", match: "CPR", active: true },
              { id: "EMG-1264", type: "Arterial Bleeding", dist: "1.4 km", match: "First Aid", active: false },
            ].map((inc) => (
              <div key={inc.id} className="mb-3 flex items-center justify-between rounded-xl bg-[#F8F9FB] p-4 last:mb-0">
                <div>
                  <p className="text-sm font-bold text-[#111111]">{inc.id} · {inc.type}</p>
                  <p className="text-xs text-[#525866]">{inc.dist} · Skill: {inc.match}</p>
                </div>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${inc.active ? "bg-[#E63946]/10 text-[#E63946]" : "bg-[#E5E7EB] text-[#525866]"}`}>
                  {inc.active ? "Active" : "Assigned"}
                </span>
              </div>
            ))}
          </SectionCard>
        </div>
      )}

      {tab === "requests" && (
        <div className="space-y-4">
          <p className="text-sm text-[#525866]">Skill-matched requests awaiting your response</p>
          {[
            { type: "CPR Request", location: "Sector 62 Market", skill: "CPR Certified", urgent: true },
            { type: "First Aid Request", location: "GT Road Crossing", skill: "First Aid Specialist", urgent: false },
            { type: "AED Deployment", location: "Indirapuram Plaza", skill: "AED Trained", urgent: false },
          ].map((req) => (
            <div key={req.location} className="flex items-center justify-between rounded-2xl bg-white p-5 ring-1 ring-[#E5E7EB]">
              <div>
                <p className="font-bold text-[#111111]">{req.type}</p>
                <p className="text-sm text-[#525866]">{req.location}</p>
                <p className="mt-1 text-xs text-medical">{req.skill}</p>
              </div>
              <div className="flex gap-2">
                <button type="button" className="rounded-lg bg-[#E63946] px-4 py-2 text-xs font-bold text-white">Accept</button>
                <button type="button" className="rounded-lg px-4 py-2 text-xs font-bold text-[#525866] ring-1 ring-[#E5E7EB]">Decline</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "training" && (
        <div className="grid gap-4 md:grid-cols-2">
          {[
            { title: "Bystander CPR Refresher", progress: 100, duration: "45 min" },
            { title: "AED Deployment Guide", progress: 75, duration: "30 min" },
            { title: "Hemorrhage Control", progress: 20, duration: "60 min" },
            { title: "Pediatric First Aid", progress: 0, duration: "90 min" },
          ].map((course) => (
            <div key={course.title} className="rounded-2xl bg-white p-5 ring-1 ring-[#E5E7EB]">
              <div className="flex items-start justify-between">
                <BookOpen className="h-5 w-5 text-medical" />
                <span className="text-[10px] font-bold text-[#525866]">{course.duration}</span>
              </div>
              <p className="mt-3 font-bold text-[#111111]">{course.title}</p>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#F8F9FB]">
                <div className="h-full bg-medical" style={{ width: `${course.progress}%` }} />
              </div>
              <p className="mt-1 text-xs text-[#525866]">{course.progress}% complete</p>
              <button type="button" className="mt-3 flex items-center gap-1.5 text-xs font-bold text-medical">
                <Play className="h-3.5 w-3.5" /> {course.progress === 100 ? "Review" : "Continue"}
              </button>
            </div>
          ))}
        </div>
      )}

      {tab === "achievements" && (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-gradient-to-br from-[#E63946]/10 to-transparent p-5 ring-1 ring-[#E63946]/20">
              <Trophy className="h-6 w-6 text-[#E63946]" />
              <p className="mt-2 text-2xl font-bold text-[#111111]">{volStats.skillRank}</p>
              <p className="text-xs text-[#525866]">Current rank</p>
            </div>
            <div className="rounded-2xl bg-white p-5 ring-1 ring-[#E5E7EB]">
              <Star className="h-6 w-6 text-warning" />
              <p className="mt-2 text-2xl font-bold text-[#111111]">{volStats.rating} ★</p>
              <p className="text-xs text-[#525866]">Community rating</p>
            </div>
            <div className="rounded-2xl bg-white p-5 ring-1 ring-[#E5E7EB]">
              <Award className="h-6 w-6 text-success" />
              <p className="mt-2 text-2xl font-bold text-[#111111]">{volStats.rewardPoints}</p>
              <p className="text-xs text-[#525866]">Reward points</p>
            </div>
          </div>
          <SectionCard title="Achievement Badges">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {["First Response", "CPR Hero", "10 Lives", "Night Owl", "Speed Responder", "Community Leader"].map((badge, earned) => (
                <div key={badge} className="rounded-xl bg-[#F8F9FB] p-4 text-center">
                  <div className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-success/10">
                    <CheckCircle2 className="h-5 w-5 text-success" />
                  </div>
                  <p className="mt-2 text-[10px] font-bold text-[#111111]">{badge}</p>
                </div>
              ))}
            </div>
          </SectionCard>
          <SectionCard title="Impact Analytics">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-3xl font-bold text-[#111111]">{volStats.incidentsResponded}</p>
                <p className="text-xs text-[#525866]">Incidents responded</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-[#111111]">#18</p>
                <p className="text-xs text-[#525866]">Noida grid rank</p>
              </div>
            </div>
          </SectionCard>
        </div>
      )}

      {tab === "history" && (
        <div className="space-y-3">
          {[
            { id: "EMG-1180", type: "CPR Assistance", date: "Mar 2", outcome: "Patient stabilized" },
            { id: "EMG-1092", type: "First Aid", date: "Feb 18", outcome: "Ambulance handover" },
            { id: "EMG-1055", type: "AED Deployment", date: "Feb 5", outcome: "Rhythm restored" },
          ].map((h) => (
            <div key={h.id} className="flex items-center justify-between rounded-xl bg-white p-4 ring-1 ring-[#E5E7EB]">
              <div>
                <p className="font-bold text-[#111111]">{h.id} · {h.type}</p>
                <p className="text-xs text-[#525866]">{h.date} · {h.outcome}</p>
              </div>
              <span className="text-[10px] font-bold text-success">+50 pts</span>
            </div>
          ))}
        </div>
      )}

      {tab === "profile" && (
        <div className="mx-auto max-w-lg space-y-4">
          <ProfileHeader name="Aarav Sharma" subtitle="VOL-202 · Gold Responder" role="volunteer" />
          {[
            { label: "Certifications", value: "CPR, First Aid, AED" },
            { label: "Community Score", value: `${volStats.communityScore} XP` },
            { label: "Availability", value: "Weekends & Evenings" },
            { label: "Response Radius", value: "2 km" },
          ].map((row) => (
            <div key={row.label} className="rounded-xl bg-white p-4 ring-1 ring-[#E5E7EB]">
              <p className="text-[10px] font-bold uppercase text-[#525866]">{row.label}</p>
              <p className="text-sm font-semibold text-[#111111]">{row.value}</p>
            </div>
          ))}
          <SectionCard title="Emergency Learning Center">
            <p className="flex items-start gap-2 text-xs text-[#525866]">
              <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-medical" />
              Complete 2 more courses to unlock Platinum Responder status and priority dispatch notifications.
            </p>
          </SectionCard>
        </div>
      )}
    </VolunteerShell>
  );
}
