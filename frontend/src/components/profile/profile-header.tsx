import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import ProfileEdit from "./profile-edit";
import ProfileSettings from "./profile-settings";
import NotificationPreferences from "./notification-preferences";
import SecuritySettings from "./security-settings";
import { clearSession } from "@/lib/profile";
import { toast } from "sonner";
import { MotionButton } from "@/components/ui/motion";

export default function ProfileHeader({
  name,
  subtitle,
  role = "citizen",
  logoutPath = "/login",
  children,
}: {
  name: string;
  subtitle?: string | ReactNode;
  role?: string;
  logoutPath?: string;
  children?: ReactNode;
}) {
  const initials = name ? name.split(" ").map((s) => s[0]).slice(0, 2).join("") : "";
  const handleLogout = () => {
    clearSession();
    toast.success("Logout successful");
    // redirect
    window.location.href = logoutPath;
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="grid h-16 w-16 place-items-center rounded-full bg-[#E63946]/10 text-2xl font-bold text-[#E63946]">{initials}</div>
          <div>
            <p className="text-lg font-bold text-[#111111]">{name}</p>
            {subtitle && <p className="text-xs text-[#525866]">{subtitle}</p>}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ProfileEdit role={role} />
          <ProfileSettings role={role} />
          <NotificationPreferences role={role} />
          <SecuritySettings role={role} />
          <MotionButton onClick={handleLogout} className="ml-2 rounded-lg bg-[#E63946] px-4 py-2 text-sm font-bold text-white">Logout</MotionButton>
        </div>
      </div>
      {children}
    </div>
  );
}
