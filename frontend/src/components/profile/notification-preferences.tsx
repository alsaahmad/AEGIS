"use client";

import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";

export default function NotificationPreferences({ role }: { role?: string }) {
  const [open, setOpen] = useState(false);
  const [sms, setSms] = useState(true);
  const [push, setPush] = useState(true);

  const save = () => {
    toast.success("Notification preferences saved");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="rounded-lg px-3 py-2 text-sm font-semibold text-[#525866] ring-1 ring-[#E5E7EB]">Notifications</button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Notification Preferences</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={sms} onChange={(e) => setSms(e.target.checked)} />
            <span className="text-sm">SMS Alerts</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={push} onChange={(e) => setPush(e.target.checked)} />
            <span className="text-sm">Push Notifications</span>
          </label>
        </div>
        <DialogFooter>
          <div className="flex w-full justify-end">
            <button onClick={() => setOpen(false)} className="rounded-lg px-4 py-2 text-sm font-semibold text-[#525866] ring-1 ring-[#E5E7EB]">Cancel</button>
            <button onClick={save} className="ml-2 rounded-lg bg-[#E63946] px-4 py-2 text-sm font-bold text-white">Save Changes</button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
