import type { LucideIcon } from "lucide-react";
import { Award, BookOpen, Clock, HeartHandshake, Inbox, MapPin, User } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { AegisBrand } from "@/components/design-system";
import { Avatar } from "@/components/ui/avatar";

export type VolunteerTab = "incidents" | "requests" | "training" | "achievements" | "history" | "profile";

const TABS: { id: VolunteerTab; label: string; icon: LucideIcon; description: string }[] = [
  { id: "incidents", label: "Incidents", icon: MapPin, description: "Nearby emergencies" },
  { id: "requests", label: "Requests", icon: Inbox, description: "CPR & first aid calls" },
  { id: "training", label: "Training", icon: BookOpen, description: "Certification center" },
  { id: "achievements", label: "Achievements", icon: Award, description: "Impact & rewards" },
  { id: "history", label: "History", icon: Clock, description: "Past responses" },
  { id: "profile", label: "Profile", icon: User, description: "Your credentials" },
];

export function VolunteerShell({
  activeTab,
  onTabChange,
  children,
  onDuty,
}: {
  activeTab: VolunteerTab;
  onTabChange: (tab: VolunteerTab) => void;
  children: ReactNode;
  onDuty?: boolean;
}) {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-[#E5E7EB] bg-[#F8F9FB]">
        <div className="mx-auto max-w-5xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AegisBrand to="/volunteer" />
              <div className="hidden h-6 w-px bg-[#E5E7EB] sm:block" />
              <div className="hidden items-center gap-1.5 sm:flex">
                <HeartHandshake className="h-4 w-4 text-[#E63946]" />
                <span className="text-sm font-semibold text-[#111111]">Volunteer Response</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-bold",
                  onDuty ? "bg-success/10 text-success" : "bg-[#F8F9FB] text-[#525866]",
                )}
              >
                {onDuty ? "● On Duty" : "Off Duty"}
              </span>
              <button type="button" onClick={() => onTabChange("profile")} aria-label="Open profile">
                <Avatar className="h-9 w-9" />
              </button>
            </div>
          </div>
          <nav className="mt-4 flex gap-2 overflow-x-auto pb-1">
            {TABS.map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => onTabChange(tab.id)}
                  className={cn(
                    "flex shrink-0 items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all",
                    active
                      ? "bg-[#E63946] text-white shadow-sm"
                      : "bg-white text-[#525866] ring-1 ring-[#E5E7EB] hover:text-[#111111]",
                  )}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
    </div>
  );
}
