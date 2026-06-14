"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { saveProfile, getProfile } from "@/lib/profile";
import { toast } from "sonner";
import { MotionButton } from "@/components/ui/motion";

export default function ProfileEdit({ role }: { role: string }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<any>({});

  useEffect(() => {
    if (!open) return;
    const p = getProfile(role);
    setForm({ name: p.name || "", phone: p.phone || "", email: p.email || "", address: p.address || "", bloodGroup: p.bloodGroup || "", conditions: p.conditions || "", allergies: p.allergies || "", emergencyContacts: p.emergencyContacts || "", insurance: p.insurance || "" });
  }, [open, role]);

  const handleSave = () => {
    if (!form.name || form.name.trim().length < 2) return toast.error("Name is required");
    if (!form.phone || form.phone.trim().length < 6) return toast.error("Valid phone required");
    const ok = saveProfile(role, form);
    if (ok) {
      toast.success("Profile updated");
      setOpen(false);
    } else {
      toast.error("Save failed");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <MotionButton className="rounded-lg px-3 py-2 text-sm font-semibold text-[#525866] ring-1 ring-[#E5E7EB]">Edit Profile</MotionButton>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <label className="text-[10px] font-bold text-[#525866]">Full name</label>
            <input value={form.name || ""} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1 w-full rounded-md border px-3 py-2" />
          </div>
          <div>
            <label className="text-[10px] font-bold text-[#525866]">Phone</label>
            <input value={form.phone || ""} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="mt-1 w-full rounded-md border px-3 py-2" />
          </div>
          <div>
            <label className="text-[10px] font-bold text-[#525866]">Email</label>
            <input value={form.email || ""} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-1 w-full rounded-md border px-3 py-2" />
          </div>
          <div>
            <label className="text-[10px] font-bold text-[#525866]">Address</label>
            <input value={form.address || ""} onChange={(e) => setForm({ ...form, address: e.target.value })} className="mt-1 w-full rounded-md border px-3 py-2" />
          </div>
          {role === "citizen" && (
            <>
              <div>
                <label className="text-[10px] font-bold text-[#525866]">Blood group</label>
                <input value={form.bloodGroup || ""} onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })} className="mt-1 w-full rounded-md border px-3 py-2" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-[#525866]">Medical conditions</label>
                <input value={form.conditions || ""} onChange={(e) => setForm({ ...form, conditions: e.target.value })} className="mt-1 w-full rounded-md border px-3 py-2" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-[#525866]">Allergies</label>
                <input value={form.allergies || ""} onChange={(e) => setForm({ ...form, allergies: e.target.value })} className="mt-1 w-full rounded-md border px-3 py-2" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-[#525866]">Emergency contacts (comma separated)</label>
                <input value={form.emergencyContacts || ""} onChange={(e) => setForm({ ...form, emergencyContacts: e.target.value })} className="mt-1 w-full rounded-md border px-3 py-2" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-[#525866]">Insurance</label>
                <input value={form.insurance || ""} onChange={(e) => setForm({ ...form, insurance: e.target.value })} className="mt-1 w-full rounded-md border px-3 py-2" />
              </div>
            </>
          )}
        </div>
        <DialogFooter>
          <div className="flex w-full justify-between">
            <MotionButton onClick={() => setOpen(false)} className="rounded-lg px-4 py-2 text-sm font-semibold text-[#525866] ring-1 ring-[#E5E7EB]">Cancel</MotionButton>
            <div className="ml-2 flex gap-2">
              <MotionButton onClick={handleSave} className="rounded-lg bg-[#E63946] px-4 py-2 text-sm font-bold text-white">Save Changes</MotionButton>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
