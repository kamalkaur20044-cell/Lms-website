"use client";

import { useState } from "react";
import AttendanceCalendar from "@/components/AttendanceCalendar";
import EmptyState from "@/components/EmptyState";
import { icons } from "../icons";
import { Card, PageTitle, StatCard, inputClass } from "../ui";

const stats = [
  { label: "Attendance %", color: "bg-green-500", icon: icons.clipboardCheck },
  { label: "Present Days", color: "bg-[#1a1a2e]", icon: icons.calendar },
  { label: "Absent Days", color: "bg-[#C8102E]", icon: icons.calendar },
  { label: "Leave Days", color: "bg-blue-500", icon: icons.calendar },
];

export default function Attendance() {
  const [form, setForm] = useState({ date: "", reason: "" });

  const update = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  return (
    <div className="space-y-6">
      <PageTitle title="Attendance" subtitle="Your daily and monthly attendance record." />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">
        <div className="space-y-4 min-w-0">
          <EmptyState title="Attendance Alerts" message="You have no attendance shortage alerts." />
          <EmptyState title="Monthly Attendance" message="Month-wise attendance will appear here once it is recorded." />
          <EmptyState title="Absence History" message="No absences recorded." />
        </div>

        <div className="space-y-6">
          <AttendanceCalendar title="Daily Attendance" />

          <Card title="Correction Request">
            <form onSubmit={(e) => e.preventDefault()} className="space-y-3">
              <div>
                <label htmlFor="date" className="text-xs font-semibold text-gray-500">Date</label>
                <input id="date" name="date" type="date" value={form.date} onChange={update} className={`${inputClass} mt-1`} />
              </div>
              <div>
                <label htmlFor="reason" className="text-xs font-semibold text-gray-500">Reason</label>
                <textarea
                  id="reason"
                  name="reason"
                  rows={3}
                  value={form.reason}
                  onChange={update}
                  placeholder="Explain why your attendance should be corrected"
                  className={`${inputClass} mt-1 resize-none`}
                />
              </div>
              <button
                type="submit"
                disabled
                className="w-full rounded-xl bg-[#C8102E] text-white text-sm font-semibold py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Request
              </button>
              <p className="text-xs text-gray-400 text-center">Coming soon</p>
            </form>
          </Card>

          <EmptyState title="My Requests" message="Your correction requests will appear here." />
        </div>
      </div>
    </div>
  );
}
