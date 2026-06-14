"use client";

import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";

export default function SecuritySettings({ role }: { role?: string }) {
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");

  const save = () => {
    if (password.length > 0 && password.length < 6) return toast.error("Password too short");
    toast.success("Security settings updated");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="rounded-lg px-3 py-2 text-sm font-semibold text-[#525866] ring-1 ring-[#E5E7EB]">Security</button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Security Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <label className="text-[10px] font-bold text-[#525866]">Change Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 w-full rounded-md border px-3 py-2" />
          </div>
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
