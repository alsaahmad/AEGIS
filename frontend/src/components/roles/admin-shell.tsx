import type { LucideIcon } from "lucide-react";
import {
  Activity,
  Ambulance,
  Brain,
  Building2,
  Flame,
  HeartPulse,
  LayoutGrid,
  Server,
  Shield,
  Users,
} from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { AegisBrand } from "@/components/design-system";
import { Avatar } from "@/components/ui/avatar";

export type AdminTab =
  | "operations"
  | "emergencies"
  | "hospitals"
  | "ambulances"
  | "volunteers"
  | "analytics"
  | "heatmaps"
  | "health"
  | "ai"
  | "profile";

const TABS: { id: AdminTab; label: string; icon: LucideIcon }[] = [
  { id: "operations", label: "Operations", icon: LayoutGrid },
  { id: "emergencies", label: "Emergencies", icon: HeartPulse },
  { id: "hospitals", label: "Hospitals", icon: Building2 },
  { id: "ambulances", label: "Ambulances", icon: Ambulance },
  { id: "volunteers", label: "Volunteers", icon: Users },
  { id: "analytics", label: "Analytics", icon: Activity },
  { id: "heatmaps", label: "Heatmaps", icon: Flame },
  { id: "health", label: "System Health", icon: Server },
  { id: "ai", label: "AI Insights", icon: Brain },
  { id: "profile", label: "Profile", icon: Users },
];

export function AdminShell({
  activeTab,
  onTabChange,
  children,
  alertCount,
}: {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  children: ReactNode;
  alertCount?: number;
}) {
  return (
    <div className="min-h-screen bg-[#F8F9FB]">
      <header className="border-b border-[#E5E7EB] bg-[#111111] text-white">
        <div className="flex items-center justify-between px-4 py-3 lg:px-6">
          <div className="flex items-center gap-4">
            <AegisBrand to="/command" compact />
            <div className="flex items-center gap-2">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-[#E63946]">
                <Shield className="h-4 w-4" />
              </div>
              <div>
                <div className="text-sm font-bold">Admin Command Center</div>
                <div className="text-[10px] text-white/50">Delhi NCR Emergency Network</div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {alertCount !== undefined && alertCount > 0 && (
              <span className="rounded-full bg-[#E63946] px-3 py-1 text-xs font-bold">
                {alertCount} Active
              </span>
            )}
            <span className="hidden items-center gap-1.5 text-xs text-white/60 sm:flex">
              <span className="h-2 w-2 animate-pulse rounded-full bg-success" />
              Grid Online
            </span>
            <button type="button" onClick={() => onTabChange("profile")} aria-label="Open profile">
              <Avatar className="h-8 w-8" />
            </button>
          </div>
        </div>
        <div className="flex overflow-x-auto border-t border-white/10 px-2 lg:px-4">
          {TABS.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  "flex shrink-0 items-center gap-1.5 border-b-2 px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wide transition-colors lg:px-4 lg:text-xs",
                  active ? "border-[#E63946] text-white" : "border-transparent text-white/45 hover:text-white/75",
                )}
              >
                <tab.icon className="h-3.5 w-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </header>
      <main className="p-4 lg:p-6">{children}</main>
    </div>
  );
}
