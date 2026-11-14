"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { studentPortalAPI } from "@/services/api";
import AttendanceCalendar from "@/components/AttendanceCalendar";
import EmptyState from "@/components/EmptyState";
import Icon from "@/components/Icon";
import { icons } from "../icons";
import { formatDate, formatTime, fullName } from "../utils";

const stats = [
  { label: "Attendance", color: "bg-green-500", icon: icons.clipboardCheck },
  { label: "Upcoming Tests", color: "bg-[#C8102E]", icon: icons.document },
  { label: "Pending Assignments", color: "bg-amber-500", icon: icons.clock },
  { label: "Lectures Watched", color: "bg-[#1a1a2e]", icon: icons.video },
];

const quickLinks = [
  { label: "Recorded Lectures", href: "/student/lectures", color: "bg-[#C8102E]", icon: icons.video },
  { label: "Study Material", href: "/student/study-material", color: "bg-green-500", icon: icons.document },
  { label: "Class Schedule", href: "/student/schedule", color: "bg-[#1a1a2e]", icon: icons.calendar },
  { label: "Attendance", href: "/student/attendance", color: "bg-indigo-500", icon: icons.clipboardCheck },
];

const pendingSections = [
  ["Today's Timetable", "Your timetable will appear here once it is added."],
  ["Upcoming Tests", "No upcoming tests yet."],
  ["Pending Assignments", "No pending assignments."],
  ["Recent Results", "Your exam results will appear here."],
  ["Latest Announcements", "No announcements yet."],
  ["Recently Watched Lectures", "Lectures you watch will appear here."],
  ["Study Targets", "Daily and weekly targets will appear here."],
  ["Academic Progress", "Your progress overview will appear here."],
];

export default function StudentDashboard() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    studentPortalAPI
      .getProfile()
      .then((res) => (res.success ? setProfile(res.data) : setError(res.message || "Could not load profile")))
      .catch(() => setError("Network error. Please try again."))
      .finally(() => setLoading(false));
  }, []);

  const student = profile?.student;
  const batch = profile?.batches?.[0];
  const name = student ? fullName(student.first_name, student.last_name) : "";
  const today = new Date().toLocaleDateString("en-IN", { weekday: "short", day: "2-digit", month: "short", year: "numeric" });

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">
      <div className="space-y-6 min-w-0">
        {error && <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">{error}</div>}

        <div className="bg-gradient-to-br from-[#1a1a2e] to-[#0f3460] rounded-2xl p-5 sm:p-6 text-white">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#C8102E] flex items-center justify-center text-2xl font-extrabold flex-shrink-0 overflow-hidden">
              {student?.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={student.photo} alt={name} className="w-full h-full object-cover" />
              ) : (
                (name || "S").charAt(0).toUpperCase()
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-gray-300 text-xs">{today}</p>
              <h1 className="text-xl font-extrabold truncate">
                {loading ? "Loading..." : `Welcome back, ${name || "Student"}`}
              </h1>
              <div className="flex flex-wrap gap-2 mt-2 text-xs">
                <span className="bg-white/10 px-2.5 py-1 rounded-full">ID: {student?.admission_number || "-"}</span>
                <span className="bg-white/10 px-2.5 py-1 rounded-full">Course: {batch?.course_name || "Not enrolled"}</span>
                <span className="bg-white/10 px-2.5 py-1 rounded-full">Batch: {batch?.batch_name || "-"}</span>
                {batch && (
                  <span className="bg-[#F5C518] text-[#1a1a2e] font-semibold px-2.5 py-1 rounded-full">
                    {formatTime(batch.start_time)} - {formatTime(batch.end_time)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(({ label, color, icon }) => (
            <div key={label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</p>
                <div className={`w-9 h-9 rounded-xl ${color} flex items-center justify-center text-white`}>
                  <Icon d={icon} />
                </div>
              </div>
              <p className="text-3xl font-extrabold text-[#1a1a2e]">-</p>
              <p className="text-xs text-gray-400">Coming soon</p>
            </div>
          ))}
        </div>

        <div>
          <h2 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">Quick Links</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {quickLinks.map(({ label, href, icon, color }) => (
              <Link
                key={href}
                href={href}
                className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-col items-center gap-2 hover:shadow-md transition-shadow"
              >
                <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center text-white`}>
                  <Icon d={icon} />
                </div>
                <span className="text-xs font-semibold text-gray-700 text-center">{label}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {pendingSections.map(([title, message]) => (
            <EmptyState key={title} title={title} message={message} />
          ))}
        </div>

        {batch && (
          <p className="text-xs text-gray-400">
            Batch duration: {formatDate(batch.start_date)} to {formatDate(batch.end_date)}
          </p>
        )}
      </div>

      <div className="space-y-6">
        <AttendanceCalendar title="My Attendance" />
      </div>
    </div>
  );
}
