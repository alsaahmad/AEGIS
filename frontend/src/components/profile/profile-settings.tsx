"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";

export default function ProfileSettings({ role }: { role?: string }) {
  const [open, setOpen] = useState(false);
  const [autoAccept, setAutoAccept] = useState(true);

  useEffect(() => {
    if (!open) return;
    // load settings if any
  }, [open]);

  const save = () => {
    toast.success("Settings saved");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="rounded-lg px-3 py-2 text-sm font-semibold text-[#525866] ring-1 ring-[#E5E7EB]">Settings</button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={autoAccept} onChange={(e) => setAutoAccept(e.target.checked)} />
            <span className="text-sm">Auto-accept critical cases</span>
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
