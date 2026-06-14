import type { LucideIcon } from "lucide-react";
import { Ambulance, ClipboardList, Fuel, History, Map, User, Users } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { Avatar } from "@/components/ui/avatar";

export type AmbulanceTab = "mission" | "navigation" | "patient" | "vehicle" | "history" | "profile";

const TABS: { id: AmbulanceTab; label: string; icon: LucideIcon }[] = [
  { id: "mission", label: "Current Mission", icon: ClipboardList },
  { id: "navigation", label: "Navigation", icon: Map },
  { id: "patient", label: "Patient", icon: Users },
  { id: "vehicle", label: "Vehicle", icon: Fuel },
  { id: "history", label: "History", icon: History },
  { id: "profile", label: "Profile", icon: User },
];

export function AmbulanceShell({
  activeTab,
  onTabChange,
  children,
  missionStatus,
}: {
  activeTab: AmbulanceTab;
  onTabChange: (tab: AmbulanceTab) => void;
  children: ReactNode;
  missionStatus?: ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-[#111111]/5">
      <div className="border-b border-[#E5E7EB] bg-[#111111] text-white">
        <div className="flex items-center justify-between px-4 py-3">
          <Link to="/ambulance" className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-[#E63946]">
              <Ambulance className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-bold">Unit A-1083 · ALS</div>
              <div className="text-[10px] text-white/60">EMT Vivaan Sharma</div>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            {missionStatus}
            <button type="button" onClick={() => onTabChange("profile")} aria-label="Open profile">
              <Avatar className="h-8 w-8" />
            </button>
          </div>
        </div>
        <div className="flex overflow-x-auto border-t border-white/10 px-2">
          {TABS.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  "flex shrink-0 items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-semibold transition-colors",
                  active ? "border-[#E63946] text-white" : "border-transparent text-white/50 hover:text-white/80",
                )}
              >
                <tab.icon className="h-3.5 w-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
      <main className="flex-1">{children}</main>
    </div>
  );
}
