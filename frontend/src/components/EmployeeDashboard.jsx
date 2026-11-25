"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Icon from "@/components/Icon";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useLogout } from "@/hooks/useLogout";
import TeacherResultsView from "@/components/TeacherResultsView";
import { employeeDutyScheduleAPI } from "@/services/api";

const iconPaths = {
  dashboard: "M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z",
  profile: "M20 21a8 8 0 00-16 0m8-10a4 4 0 100-8 4 4 0 000 8z",
  attendance: "M8 2v4m8-4v4M3 10h18M5 4h14a2 2 0 012 2v14H3V6a2 2 0 012-2zm3 10h3m-3 4h8",
  leave: "M8 2v4m8-4v4M3 10h18M5 4h14a2 2 0 012 2v14H3V6a2 2 0 012-2zm4 10l2 2 4-4",
  schedule: "M12 6v6l4 2m5-2a9 9 0 11-18 0 9 9 0 0118 0z",
  documents: "M7 3h7l5 5v13H7a2 2 0 01-2-2V5a2 2 0 012-2zm7 0v5h5m-9 5h5m-5 4h5",
  announcements: "M11 5l6-3v20l-6-3H5a2 2 0 01-2-2v-8a2 2 0 012-2h6zm0 0v14m-5 0l2 5h4l-2-5",
  help: "M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-4 4v-4z",
  settings: "M12 8a4 4 0 100 8 4 4 0 000-8zm8 4a8 8 0 00-.1-1.2l2-1.5-2-3.5-2.4 1a8 8 0 00-2.1-1.2L15 3h-4l-.4 2.6a8 8 0 00-2.1 1.2l-2.4-1-2 3.5 2 1.5a8 8 0 000 2.4l-2 1.5 2 3.5 2.4-1a8 8 0 002.1 1.2L11 21h4l.4-2.6a8 8 0 002.1-1.2l2.4 1 2-3.5-2-1.5A8 8 0 0020 12z",
  upload: "M12 16V4m0 0L7 9m5-5l5 5M4 16v4h16v-4",
  results: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 14l2 2 4-4",
  bell: "M18 8a6 6 0 00-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9m-8 12a2 2 0 004 0",
  clock: "M12 6v6l4 2m5-2a9 9 0 11-18 0 9 9 0 0118 0z",
  check: "M5 12l4 4L19 6",
  calendar: "M8 2v4m8-4v4M3 10h18M5 4h14a2 2 0 012 2v14H3V6a2 2 0 012-2z",
  arrow: "M7 17L17 7M7 7h10v10",
};

const navGroups = [
  {
    title: "OVERVIEW",
    items: [{ id: "dashboard", label: "Dashboard", icon: iconPaths.dashboard }],
  },
  {
    title: "MY WORK",
    items: [
      { id: "profile", label: "My Profile", icon: iconPaths.profile },
      { id: "attendance", label: "Attendance", icon: iconPaths.attendance },
      { id: "results", label: "Results", icon: iconPaths.results },
      { id: "leave", label: "Leave Management", icon: iconPaths.leave },
      { id: "schedule", label: "Duty Schedule", icon: iconPaths.schedule },
      { id: "documents", label: "My Documents", icon: iconPaths.documents },
    ],
  },
  {
    title: "COMMUNICATION",
    items: [
      { id: "announcements", label: "Announcements", icon: iconPaths.announcements },
      { id: "student-queries", label: "Student Queries", icon: iconPaths.help },
      { id: "help", label: "HR Help Desk", icon: iconPaths.help },
      { id: "content", label: "Content Upload", icon: iconPaths.upload },
    ],
  },
  {
    title: "PREFERENCES",
    items: [{ id: "settings", label: "Settings", icon: iconPaths.settings }],
  },
];

const teacher = {
  name: "Dr. Ananya Sharma",
  initials: "AS",
  employeeId: "TCH-024",
  designation: "Senior Physics Faculty",
  department: "Physics",
  joiningDate: "12 June 2019",
  manager: "Academic Director",
  email: "ananya.sharma@lakshya.ac.in",
  phone: "+91 98765 43210",
  emergencyContact: "+91 98765 40012 · Rohan Sharma",
  status: "Active",
};

const holidays = [
  { date: "25 Nov", name: "Guru Nanak Jayanti", type: "Institute holiday" },
  { date: "25 Dec", name: "Christmas Day", type: "National holiday" },
  { date: "01 Jan", name: "New Year Holiday", type: "Institute holiday" },
];

const calendarHolidays = [
  { month: 10, day: 25 },
  { month: 11, day: 25 },
  { month: 0, day: 1 },
];

const notifications = [
  { type: "General", title: "Faculty meeting", detail: "Tomorrow at 4:00 PM in Conference Room 2.", time: "15 min ago", color: "bg-blue-100 text-blue-700" },
  { type: "General", title: "Updated examination schedule", detail: "The December mock test calendar is now available.", time: "2 hours ago", color: "bg-blue-100 text-blue-700" },
];

const scheduleDays = [
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
  { value: 7, label: "Sunday" },
];

const getScheduleDay = (date) => ((date.getDay() + 6) % 7) + 1;

const formatScheduleTime = (time) => {
  if (!time) return "";
  const [hours, minutes] = String(time).slice(0, 5).split(":").map(Number);
  if (!Number.isInteger(hours) || !Number.isInteger(minutes)) return String(time);
  const period = hours >= 12 ? "PM" : "AM";
  return `${hours % 12 || 12}:${String(minutes).padStart(2, "0")} ${period}`;
};

const getScheduleMinutes = (time) => {
  const [hours, minutes] = String(time || "").slice(0, 5).split(":").map(Number);
  return Number.isInteger(hours) && Number.isInteger(minutes) ? hours * 60 + minutes : 0;
};

const formatScheduleDate = (date) => {
  if (!date) return "";
  const parsedDate = new Date(`${date}T00:00:00`);
  return Number.isNaN(parsedDate.getTime())
    ? date
    : parsedDate.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

const getTodaySchedule = (schedule) => {
  if (!schedule) return [];
  const today = new Date();
  const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  if (schedule.effective_from > todayString || (schedule.effective_to && schedule.effective_to < todayString)) return [];
  const day = getScheduleDay(today);
  return (schedule.slots || [])
    .filter((slot) =>
      (slot.schedule_kind === "weekly" && Number(slot.day_of_week) === day) ||
      (slot.schedule_kind === "special" && slot.duty_date === todayString)
    )
    .sort((first, second) => first.start_time.localeCompare(second.start_time));
};

const attendanceRecords = [
  { date: "Wed, 25 Nov", status: "Holiday", checkIn: "—", checkOut: "—", hours: "—", late: "—", overtime: "—" },
  { date: "Wed, 18 Nov", status: "Present", checkIn: "08:47 AM", checkOut: "—", hours: "In progress", late: "—", overtime: "—" },
  { date: "Tue, 17 Nov", status: "Present", checkIn: "09:13 AM", checkOut: "07:10 PM", hours: "9h 57m", late: "13m", overtime: "10m" },
  { date: "Mon, 16 Nov", status: "Half day", checkIn: "09:02 AM", checkOut: "01:00 PM", hours: "4h 00m", late: "2m", overtime: "—" },
  { date: "Sun, 15 Nov", status: "Weekly off", checkIn: "—", checkOut: "—", hours: "—", late: "—", overtime: "—" },
  { date: "Sat, 14 Nov", status: "Weekly off", checkIn: "—", checkOut: "—", hours: "—", late: "—", overtime: "—" },
  { date: "Fri, 13 Nov", status: "Leave", checkIn: "—", checkOut: "—", hours: "—", late: "—", overtime: "—" },
  { date: "Thu, 12 Nov", status: "Absent", checkIn: "—", checkOut: "—", hours: "—", late: "—", overtime: "—" },
];

const leaveHistory = [
  { dates: "18 Nov 2026", days: "1 day", dayCount: 1, status: "Pending", calendarDates: ["2026-11-18"] },
  { dates: "07 – 08 Oct 2026", days: "2 days", dayCount: 2, status: "Approved", calendarDates: ["2026-10-07", "2026-10-08"] },
  { dates: "14 Sep 2026", days: "1 day", dayCount: 1, status: "Approved", calendarDates: ["2026-09-14"] },
];

const totalLeaveDays = leaveHistory.reduce((total, item) => total + item.dayCount, 0);

const documents = [
  { name: "Appointment Letter", category: "Employment", date: "12 Jun 2019", status: "Verified", type: "PDF" },
  { name: "Offer Letter", category: "Employment", date: "28 May 2019", status: "Verified", type: "PDF" },
  { name: "Identity Proof", category: "Personal", date: "12 Jun 2019", status: "Verified", type: "PDF" },
  { name: "Ph.D. Qualification Certificate", category: "Qualification", date: "15 Jun 2019", status: "Verified", type: "PDF" },
  { name: "Experience Letters", category: "Employment", date: "12 Jun 2019", status: "Verified", type: "PDF" },
  { name: "Curriculum Vitae", category: "Personal", date: "12 Jun 2019", status: "Verified", type: "PDF" },
  { name: "Bank Details", category: "Employment", date: "12 Jun 2019", status: "Verified", type: "PDF" },
  { name: "Policy Acknowledgement · 2026", category: "Policy", date: "01 Apr 2026", status: "Action needed", type: "PDF" },
  { name: "Code of Conduct Acknowledgement", category: "Policy", date: "01 Apr 2026", status: "Verified", type: "PDF" },
];

const announcements = [
  { category: "ACADEMIC", title: "December mock examination schedule", body: "The full mock-test schedule has been published. Please review your assigned invigilation slots by Friday.", date: "18 Nov 2026", priority: "Important" },
  { category: "HR NOTICE", title: "Update emergency contact information", body: "Please review your profile and ensure your emergency contact details are current.", date: "16 Nov 2026", priority: "Action required" },
  { category: "EVENT", title: "Annual faculty development workshop", body: "Join the teaching excellence workshop on 28 November at the auditorium.", date: "14 Nov 2026", priority: "Upcoming" },
];

const batches = [
  { name: "Class 12 · JEE Advanced", students: 32 },
  { name: "Class 11 · Mechanics", students: 28 },
  { name: "Class 12 · NEET Physics", students: 35 },
];

const PREVIEW_TODAY = new Date(2026, 10, 18);

function PageHeading({ title, description, children, portalLabel = "Teacher portal" }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#C8102E]">{portalLabel}</p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-[#1a1a2e]">{title}</h1>
        {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
      </div>
      {children}
    </div>
  );
}

function Card({ title, subtitle, action, children, className = "" }) {
  return (
    <section className={`rounded-2xl border border-gray-100 bg-white p-5 shadow-sm ${className}`}>
      {(title || subtitle || action) && (
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            {title && <h2 className="text-sm font-bold text-[#1a1a2e]">{title}</h2>}
            {subtitle && <p className="mt-1 text-xs text-gray-400">{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

function ActionButton({ children, onClick, secondary = false, type = "button", disabled = false }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-60 ${
        secondary
          ? "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
          : "bg-[#C8102E] text-white shadow-sm shadow-red-900/10 hover:bg-[#a50d25]"
      }`}
    >
      {children}
    </button>
  );
}

function formatPunchTime(timestamp) {
  return timestamp ? new Date(timestamp).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : "—";
}

function StatusBadge({ children, tone = "green" }) {
  const tones = {
    green: "bg-emerald-50 text-emerald-700 ring-emerald-600/10",
    amber: "bg-amber-50 text-amber-700 ring-amber-600/10",
    blue: "bg-blue-50 text-blue-700 ring-blue-600/10",
    gray: "bg-gray-100 text-gray-600 ring-gray-500/10",
    red: "bg-red-50 text-red-700 ring-red-600/10",
  };
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold ring-1 ring-inset ${tones[tone]}`}>{children}</span>;
}

function AttendanceCalendar({ month, onMonthChange, compact = false }) {
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const monthName = month.toLocaleDateString("en-IN", { month: "long", year: "numeric" });
  const offset = new Date(year, monthIndex, 1).getDay();
  const days = new Date(year, monthIndex + 1, 0).getDate();
  const cells = [...Array(offset).fill(null), ...Array.from({ length: days }, (_, index) => index + 1)];
  const today = PREVIEW_TODAY;

  const dayState = (day) => {
    if (!day) return "empty";
    const weekday = new Date(year, monthIndex, day).getDay();
    if (calendarHolidays.some((holiday) => holiday.month === monthIndex && holiday.day === day)) return "holiday";
    if (weekday === 0 || weekday === 6) return "weekend";
    if (day % 17 === 0) return "leave";
    if (day % 11 === 0) return "late";
    if (day % 13 === 0) return "absent";
    return "present";
  };

  const stateClasses = {
    present: "bg-emerald-50 text-emerald-800 after:bg-emerald-500",
    late: "bg-amber-50 text-amber-800 after:bg-amber-500",
    leave: "bg-blue-50 text-blue-800 after:bg-blue-500",
    absent: "bg-rose-100 text-rose-800 after:bg-rose-600",
    holiday: "bg-violet-100 text-violet-800 after:bg-violet-600",
    weekend: "text-gray-300",
    empty: "invisible",
  };

  return (
    <Card
      title="Attendance calendar"
      subtitle="Your monthly attendance overview"
      action={
        <div className="flex items-center gap-2">
          <button onClick={() => onMonthChange(new Date(year, monthIndex - 1, 1))} aria-label="Previous month" className="rounded-lg border border-gray-200 p-1.5 text-gray-500 hover:bg-gray-50">‹</button>
          <span className="min-w-[112px] text-center text-xs font-semibold text-gray-600">{monthName}</span>
          <button onClick={() => onMonthChange(new Date(year, monthIndex + 1, 1))} aria-label="Next month" className="rounded-lg border border-gray-200 p-1.5 text-gray-500 hover:bg-gray-50">›</button>
        </div>
      }
    >
      <div className="mx-auto w-full max-w-[500px]">
        <div className={`grid grid-cols-7 gap-y-1 ${compact ? "text-[11px]" : "text-xs"}`}>
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
            <div key={day} className="py-2 text-center font-semibold text-gray-400">{day}</div>
          ))}
          {cells.map((day, index) => {
            const state = dayState(day);
            const isToday = day && year === today.getFullYear() && monthIndex === today.getMonth() && day === today.getDate();
            return (
              <div key={`${day || "blank"}-${index}`} className="flex justify-center py-0.5">
                <span className={`relative flex h-8 w-8 items-center justify-center rounded-full font-medium after:absolute after:bottom-1 after:h-1 after:w-1 after:rounded-full ${stateClasses[state]} ${isToday ? "ring-2 ring-[#C8102E] ring-offset-1" : ""}`}>
                  {day || ""}
                </span>
              </div>
            );
          })}
        </div>
        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 border-t border-gray-100 pt-4 text-[11px] text-gray-500">
          <span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-emerald-500" />Present</span>
          <span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-amber-500" />Late arrival</span>
          <span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-blue-500" />Leave</span>
          <span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-rose-600" />Absent</span>
          <span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-violet-600" />Holiday</span>
        </div>
      </div>
    </Card>
  );
}

function DashboardView({ onNavigate, month, setMonth, attendance, onPunch, notificationTab, setNotificationTab, studentQueries, showStudentQueries, dutySchedule, scheduleLoading, scheduleError }) {
  const checkedIn = Boolean(attendance.checkIn && !attendance.checkOut);
  const attendanceComplete = Boolean(attendance.checkIn && attendance.checkOut);
  const todayLabel = PREVIEW_TODAY.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });
  const visibleNotifications = notifications.filter((item) => notificationTab === "All" || item.type === notificationTab);
  const openQueries = studentQueries?.filter((query) => query.status === "open").length || 0;
  const todaySchedule = getTodaySchedule(dutySchedule);
  const todayDate = new Date();
  const todayDateString = `${todayDate.getFullYear()}-${String(todayDate.getMonth() + 1).padStart(2, "0")}-${String(todayDate.getDate()).padStart(2, "0")}`;
  const scheduleIsActive = dutySchedule
    && dutySchedule.effective_from <= todayDateString
    && (!dutySchedule.effective_to || dutySchedule.effective_to >= todayDateString);
  const todayWorkingDay = scheduleIsActive
    ? (dutySchedule.working_days || []).find((day) => Number(day.day_of_week) === getScheduleDay(todayDate))
    : null;
  const currentMinutes = new Date().getHours() * 60 + new Date().getMinutes();
  const nextDuty = todaySchedule.find((slot) =>
    slot.duty_type !== "break" && getScheduleMinutes(slot.start_time) >= currentMinutes
  );

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1a1a2e] via-[#222844] to-[#38213a] p-6 text-white shadow-lg sm:p-8">
        <div className="absolute -right-10 -top-20 h-64 w-64 rounded-full bg-[#C8102E]/20 blur-3xl" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-lg font-extrabold text-[#F5C518]">{teacher.initials}</div>
            <div>
              <p className="text-sm text-white/65">{todayLabel}</p>
              <h2 className="mt-1 text-2xl font-extrabold sm:text-3xl">Good morning, Ananya</h2>
              <p className="mt-1 text-sm text-white/70">Here&apos;s your teaching day at a glance.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            {(attendance.checkIn || attendance.checkOut) && (
              <div className="rounded-xl border border-white/10 bg-white/10 px-4 py-3">
                <p className="text-[11px] uppercase tracking-wide text-white/60">{attendance.checkOut ? "Punch Out" : "Punch In"}</p>
                <p className="mt-1 text-sm font-bold">{formatPunchTime(attendance.checkOut || attendance.checkIn)}</p>
              </div>
            )}
            <div className="rounded-xl border border-white/10 bg-white/10 px-4 py-3">
              <p className="text-[11px] uppercase tracking-wide text-white/60">Today&apos;s duties</p>
              <p className="mt-1 text-lg font-bold">{scheduleLoading ? "…" : todaySchedule.filter((slot) => slot.duty_type !== "break").length} <span className="text-xs font-medium text-white/60">scheduled</span></p>
            </div>
            <button onClick={onPunch} disabled={attendanceComplete} className={`rounded-xl px-4 py-3 text-left transition disabled:cursor-not-allowed disabled:opacity-70 ${checkedIn ? "bg-emerald-500 text-white" : "bg-[#F5C518] text-[#1a1a2e] hover:bg-[#ffda44]"}`}>
              <p className="text-[11px] font-semibold uppercase tracking-wide opacity-75">{attendanceComplete ? "Attendance complete" : "Attendance"}</p>
              <p className="mt-1 text-sm font-extrabold">{attendanceComplete ? "Check out recorded" : checkedIn ? "Check out" : "Check in now →"}</p>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {[
          { label: "Monthly attendance", value: "96%", note: "↑ 2.4% from last month", icon: iconPaths.attendance, tone: "text-emerald-600 bg-emerald-50", section: "attendance" },
          { label: "Leave balance", value: "12 days", note: "Across 3 leave types", icon: iconPaths.calendar, tone: "text-blue-600 bg-blue-50", section: "leave" },
          ...(showStudentQueries ? [{
            label: "Student queries",
            value: String(studentQueries.length).padStart(2, "0"),
            note: `${openQueries} awaiting your reply`,
            icon: iconPaths.help,
            tone: "text-amber-600 bg-amber-50",
            section: "student-queries",
          }] : []),
          { label: "Next duty", value: scheduleLoading ? "…" : scheduleError ? "—" : nextDuty ? formatScheduleTime(nextDuty.start_time) : "—", note: scheduleLoading ? "Loading assigned schedule" : scheduleError ? "Schedule unavailable" : nextDuty?.title || (todaySchedule.length ? "No more duties today" : "No duty assigned today"), icon: iconPaths.clock, tone: "text-violet-600 bg-violet-50", section: "schedule" },
        ].map((stat) => (
          <button key={stat.label} type="button" onClick={() => onNavigate(stat.section)} className="w-full rounded-2xl border border-gray-100 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8102E] focus-visible:ring-offset-2 sm:p-5">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-semibold text-gray-500">{stat.label}</p>
              <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${stat.tone}`}><Icon d={stat.icon} className="h-4 w-4" /></span>
            </div>
            <p className="mt-3 text-2xl font-extrabold tracking-tight text-[#1a1a2e]">{stat.value}</p>
            <p className="mt-1 text-[11px] text-gray-400">{stat.note}</p>
          </button>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <AttendanceCalendar month={month} onMonthChange={setMonth} compact />
        <Card title="Today&apos;s duty schedule" subtitle={`${todayDate.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}${todayWorkingDay ? ` · Working hours ${formatScheduleTime(todayWorkingDay.start_time)} – ${formatScheduleTime(todayWorkingDay.end_time)}` : ""}`} action={<button onClick={() => onNavigate("schedule")} className="text-xs font-bold text-[#C8102E] hover:underline">Full schedule</button>}>
          {scheduleError ? (
            <p role="alert" className="rounded-xl bg-red-50 px-3 py-2.5 text-xs text-red-700">{scheduleError}</p>
          ) : scheduleLoading ? (
            <div className="space-y-3">{[0, 1, 2].map((item) => <div key={item} className="h-14 animate-pulse rounded-lg bg-gray-100" />)}</div>
          ) : todaySchedule.length === 0 ? (
            <p className="py-6 text-center text-sm text-gray-500">{todayWorkingDay ? "Working day · no classes or duties assigned." : "No duties are assigned for today."}</p>
          ) : (
          <div className="space-y-4">
            {todaySchedule.map((item) => (
              <div key={item.id || `${item.start_time}-${item.title}`} className="flex gap-3">
                <span className="w-1 shrink-0 rounded-full bg-[#C8102E]" />
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-semibold text-gray-400">{formatScheduleTime(item.start_time)} – {formatScheduleTime(item.end_time)}</p>
                  <p className="mt-0.5 truncate text-sm font-bold text-gray-800">{item.title}</p>
                  <p className="mt-0.5 text-xs text-gray-500">{[item.description, item.location].filter(Boolean).join(" · ") || (item.duty_type === "break" ? "Break" : item.duty_type === "class" ? "Class" : "Duty")}</p>
                </div>
                <span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${item.duty_type === "class" ? "bg-blue-500" : item.duty_type === "break" ? "bg-gray-300" : "bg-violet-500"}`} />
              </div>
            ))}
          </div>
          )}
        </Card>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <Card
          title="Notifications"
          subtitle="Recent institute updates"
          action={<button onClick={() => onNavigate("announcements")} className="text-xs font-bold text-[#C8102E] hover:underline">View all</button>}
        >
          <div className="mb-4 flex gap-2 border-b border-gray-100 pb-3">
            {["All", "General"].map((tab) => (
              <button key={tab} onClick={() => setNotificationTab(tab)} className={`rounded-full px-3 py-1.5 text-[11px] font-bold transition ${notificationTab === tab ? "bg-[#1a1a2e] text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>{tab}</button>
            ))}
          </div>
          <div className="space-y-3">
            {visibleNotifications.slice(0, 3).map((item) => (
              <div key={item.title} className="flex gap-3 rounded-xl p-2 transition hover:bg-gray-50">
                <span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${item.color}`}><Icon d={iconPaths.bell} className="h-4 w-4" /></span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2"><p className="text-xs font-bold text-gray-800">{item.title}</p><StatusBadge tone="blue">{item.type}</StatusBadge></div>
                  <p className="mt-1 text-xs text-gray-500">{item.detail}</p>
                </div>
                <span className="shrink-0 text-[10px] text-gray-400">{item.time}</span>
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-5">
          <Card title="Quick actions" subtitle="Common tasks, one click away">
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Upload content", icon: iconPaths.upload, id: "content", color: "bg-red-50 text-[#C8102E]" },
                { label: "Apply for leave", icon: iconPaths.leave, id: "leave", color: "bg-blue-50 text-blue-700" },
                { label: "Attendance correction", icon: iconPaths.attendance, id: "attendance", color: "bg-amber-50 text-amber-700" },
                ...(showStudentQueries ? [{ label: "Student queries", icon: iconPaths.help, id: "student-queries", color: "bg-emerald-50 text-emerald-700" }] : []),
                { label: "Raise HR query", icon: iconPaths.help, id: "help", color: "bg-violet-50 text-violet-700" },
              ].map((action) => (
                <button key={action.id} onClick={() => onNavigate(action.id)} className="flex items-center gap-2 rounded-xl border border-gray-100 p-3 text-left transition hover:border-gray-200 hover:bg-gray-50">
                  <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${action.color}`}><Icon d={action.icon} className="h-4 w-4" /></span>
                  <span className="text-[11px] font-bold leading-tight text-gray-700">{action.label}</span>
                </button>
              ))}
            </div>
          </Card>
          <Card title="Leave approval status" subtitle="Your latest leave request">
            <div className="flex items-center justify-between gap-3 rounded-xl bg-amber-50 p-3">
              <div><p className="text-xs font-bold text-gray-800">Leave request · 18 Nov</p><p className="mt-1 text-[10px] text-gray-500">Waiting for Academic Director</p></div>
              <StatusBadge tone="amber">Pending</StatusBadge>
            </div>
            <button onClick={() => onNavigate("leave")} className="mt-3 text-xs font-bold text-[#C8102E] hover:underline">View leave history →</button>
          </Card>
          <Card title="Upcoming holidays" action={<span className="rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold text-amber-700">Next · 25 Nov</span>}>
            <div className="space-y-3">
              {holidays.slice(0, 2).map((holiday) => (
                <div key={holiday.name} className="flex items-center gap-3">
                  <div className="w-12 shrink-0 rounded-lg bg-gray-50 py-1.5 text-center"><p className="text-[10px] font-bold uppercase text-gray-400">{holiday.date.split(" ")[1]}</p><p className="text-sm font-extrabold text-[#1a1a2e]">{holiday.date.split(" ")[0]}</p></div>
                  <div><p className="text-xs font-bold text-gray-800">{holiday.name}</p><p className="mt-0.5 text-[10px] text-gray-400">{holiday.type}</p></div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function ProfileView() {
  const groups = [
    { title: "Personal information", fields: [["Full name", teacher.name], ["Email address", teacher.email], ["Phone number", teacher.phone], ["Emergency contact", teacher.emergencyContact]] },
    { title: "Employment information", fields: [["Employee ID", teacher.employeeId], ["Designation", teacher.designation], ["Department", teacher.department], ["Joining date", teacher.joiningDate], ["Reporting manager", teacher.manager], ["Employment status", teacher.status]] },
  ];
  return (
    <div className="space-y-5">
      <PageHeading title="My Profile" description="Your personal and employment details." />
      <div className="rounded-2xl bg-gradient-to-r from-[#1a1a2e] to-[#34304f] p-6 text-white">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#C8102E] text-xl font-extrabold">{teacher.initials}</div>
          <div className="flex-1"><h2 className="text-xl font-extrabold">{teacher.name}</h2><p className="mt-1 text-sm text-white/65">{teacher.designation} · {teacher.department}</p></div>
          <StatusBadge>{teacher.status}</StatusBadge>
        </div>
      </div>
      {groups.map((group) => (
        <Card key={group.title} title={group.title}>
          <div className="grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
            {group.fields.map(([label, value]) => <div key={label}><p className="text-xs text-gray-400">{label}</p><p className="mt-1 text-sm font-semibold text-gray-800">{value}</p></div>)}
          </div>
        </Card>
      ))}
    </div>
  );
}

function AttendanceView({ month, setMonth, attendance, onPunch, onSubmitted }) {
  const checkedIn = Boolean(attendance.checkIn && !attendance.checkOut);
  const attendanceComplete = Boolean(attendance.checkIn && attendance.checkOut);
  const [showCorrectionForm, setShowCorrectionForm] = useState(false);
  return (
    <div className="space-y-5">
      <PageHeading title="Attendance management" description="Review your attendance, hours, and correction requests.">
        <ActionButton secondary onClick={() => setShowCorrectionForm((visible) => !visible)}><Icon d={iconPaths.attendance} className="h-4 w-4" />Request correction</ActionButton>
      </PageHeading>
      {showCorrectionForm && <Card title="Attendance correction request" subtitle="Correction requests should be submitted within 3 working days">
        <form onSubmit={(event) => { event.preventDefault(); onSubmitted("Attendance correction saved in this UI preview only; it has not been submitted."); setShowCorrectionForm(false); }} className="grid gap-3 sm:grid-cols-[1fr_2fr_auto]">
          <input required type="date" aria-label="Attendance date" className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:border-[#C8102E] focus:outline-none" />
          <input required placeholder="Reason for correction" aria-label="Reason for correction" className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:border-[#C8102E] focus:outline-none" />
          <ActionButton type="submit">Submit request</ActionButton>
        </form>
      </Card>}
      <div className="grid items-stretch gap-5 xl:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)]">
        <div className="flex min-h-[420px] flex-col gap-3">
          <Card className="flex flex-1 flex-col justify-between" title="Today&apos;s attendance" subtitle="Today" action={<StatusBadge tone={checkedIn || attendanceComplete ? "green" : "amber"}>{attendanceComplete ? "Checked out" : checkedIn ? "Checked in" : "Not checked in"}</StatusBadge>}>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-gray-50 px-3 py-2.5"><p className="text-[10px] font-semibold text-gray-400">Check in</p><p className="mt-1 text-sm font-bold text-gray-800">{formatPunchTime(attendance.checkIn)}</p></div>
              <div className="rounded-xl bg-gray-50 px-3 py-2.5"><p className="text-[10px] font-semibold text-gray-400">Check out</p><p className="mt-1 text-sm font-bold text-gray-800">{formatPunchTime(attendance.checkOut)}</p></div>
            </div>
            <div className="mt-3 flex items-center justify-between rounded-lg border border-dashed border-gray-200 px-3 py-2 text-xs">
              <span className="text-gray-500">Scheduled timing</span>
              <span className="font-bold text-gray-700">9:00 AM – 7:00 PM</span>
            </div>
            <div className="mt-3"><ActionButton onClick={onPunch} disabled={attendanceComplete}><Icon d={checkedIn ? iconPaths.check : iconPaths.clock} className="h-4 w-4" />{attendanceComplete ? "Attendance complete" : checkedIn ? "Check out" : "Check in"}</ActionButton></div>
          </Card>
          <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Present", value: "17", note: "of 20 workdays", color: "border-emerald-500" },
            { label: "Leave", value: "01", note: "day this month", color: "border-blue-500" },
            { label: "Absent", value: "02", note: "days this month", color: "border-rose-500" },
          ].map((stat) => (
            <div key={stat.label} className={`flex min-h-[132px] min-w-0 flex-col items-center justify-center rounded-xl border border-gray-100 border-t-2 ${stat.color} bg-white px-2 py-4 text-center shadow-sm`}>
              <p className="truncate text-[10px] font-semibold text-gray-500 sm:text-xs">{stat.label}</p>
              <p className="mt-2 text-2xl font-extrabold text-[#1a1a2e]">{stat.value}</p>
              <p className="mt-1 text-[9px] text-gray-400 sm:text-[10px]">{stat.note}</p>
            </div>
          ))}
          </div>
        </div>
        <AttendanceCalendar month={month} onMonthChange={setMonth} />
      </div>
      <Card title="Attendance records" subtitle="Daily status, check-in/out, and work-hour details · November 2026">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-xs">
            <thead>
              <tr className="border-b border-gray-100 text-[10px] uppercase tracking-wider text-gray-400">
                <th scope="col" className="pb-3 pr-4 font-semibold">Date</th>
                <th scope="col" className="pb-3 pr-4 font-semibold">Status</th>
                <th scope="col" className="pb-3 pr-4 font-semibold">In</th>
                <th scope="col" className="pb-3 pr-4 font-semibold">Out</th>
                <th scope="col" className="pb-3 pr-4 font-semibold">Worked</th>
                <th scope="col" className="pb-3 pr-4 font-semibold">Late</th>
                <th scope="col" className="pb-3 text-right font-semibold">Overtime</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {attendanceRecords.map((record) => (
                <tr key={record.date} className="transition hover:bg-gray-50/70">
                  <td className="whitespace-nowrap py-3.5 pr-4 font-semibold text-gray-700">{record.date}</td>
                  <td className="py-3.5 pr-4">
                    <StatusBadge tone={{ Present: "green", "Half day": "amber", Absent: "red", Leave: "blue", Holiday: "blue", "Weekly off": "gray" }[record.status]}>
                      {record.status}
                    </StatusBadge>
                  </td>
                  <td className="whitespace-nowrap py-3.5 pr-4 tabular-nums text-gray-600">{record.checkIn}</td>
                  <td className="whitespace-nowrap py-3.5 pr-4 tabular-nums text-gray-600">{record.checkOut}</td>
                  <td className="whitespace-nowrap py-3.5 pr-4 font-medium tabular-nums text-gray-700">{record.hours}</td>
                  <td className="whitespace-nowrap py-3.5 pr-4 tabular-nums text-gray-600">{record.late}</td>
                  <td className="whitespace-nowrap py-3.5 text-right tabular-nums text-gray-600">{record.overtime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function LeaveCalendar({ month, onMonthChange }) {
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const monthName = month.toLocaleDateString("en-IN", { month: "long", year: "numeric" });
  const offset = new Date(year, monthIndex, 1).getDay();
  const days = new Date(year, monthIndex + 1, 0).getDate();
  const cells = [...Array(offset).fill(null), ...Array.from({ length: days }, (_, index) => index + 1)];

  return (
    <Card
      className="h-full"
      title="Leave calendar"
      subtitle="Plan your upcoming time off"
      action={
        <div className="flex items-center gap-2">
          <button onClick={() => onMonthChange(new Date(year, monthIndex - 1, 1))} aria-label="Previous month" className="rounded-lg border border-gray-200 p-1.5 text-gray-500 hover:bg-gray-50">‹</button>
          <span className="min-w-[112px] text-center text-xs font-semibold text-gray-600">{monthName}</span>
          <button onClick={() => onMonthChange(new Date(year, monthIndex + 1, 1))} aria-label="Next month" className="rounded-lg border border-gray-200 p-1.5 text-gray-500 hover:bg-gray-50">›</button>
        </div>
      }
    >
      <div className="mx-auto w-full max-w-[500px]">
        <div className="grid grid-cols-7 gap-y-1 text-xs">
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
            <div key={day} className="py-2 text-center font-semibold text-gray-400">{day}</div>
          ))}
          {cells.map((day, index) => {
            const isToday = day && year === PREVIEW_TODAY.getFullYear() && monthIndex === PREVIEW_TODAY.getMonth() && day === PREVIEW_TODAY.getDate();
            const dateKey = day && `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const isLeave = day && leaveHistory.some((leave) => leave.calendarDates.includes(dateKey));
            const isHoliday = day && calendarHolidays.some((holiday) => holiday.month === monthIndex && holiday.day === day);
            return (
              <div key={`${day || "blank"}-${index}`} className="flex justify-center py-0.5">
                <span className={`flex h-8 w-8 items-center justify-center rounded-full font-medium ${!day ? "invisible" : isLeave ? "bg-blue-100 text-blue-800" : isHoliday ? "bg-violet-100 text-violet-800" : "text-gray-700"} ${isToday ? "ring-2 ring-[#C8102E] ring-offset-1" : ""}`}>
                  {day || ""}
                </span>
              </div>
            );
          })}
        </div>
        <div className="mt-4 flex gap-4 border-t border-gray-100 pt-4 text-[11px] text-gray-500">
          <span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-[#C8102E]" />Today</span>
          <span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-blue-500" />Leave</span>
          <span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-violet-500" />Institute holiday</span>
        </div>
      </div>
    </Card>
  );
}

function LeaveView({ onSubmitted }) {
  const [submitted, setSubmitted] = useState(false);
  const [month, setMonth] = useState(new Date(PREVIEW_TODAY.getFullYear(), PREVIEW_TODAY.getMonth(), 1));
  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
    };
  return (
    <div className="space-y-5">
      <PageHeading title="Leave management" description="Apply for time off and track your leave balance and approvals." />
      <div className="grid items-stretch gap-5 xl:grid-cols-2">
        <Card title="Leave history" subtitle="Recent requests and approval status">
          <div className="mb-3 flex items-center justify-between gap-3 rounded-xl bg-gray-50 px-4 py-3">
            <div>
              <p className="text-xs font-semibold text-gray-500">Total leaves</p>
              <p className="mt-1 text-xl font-extrabold text-[#1a1a2e]">{totalLeaveDays} <span className="text-xs font-semibold text-gray-500">days</span></p>
            </div>
          </div>
          <div className="space-y-1">
            {leaveHistory.map((item) => (
              <div key={item.dates} className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 py-4 last:border-0">
                <div><p className="text-sm font-bold text-gray-800">{item.dates}</p><p className="mt-1 text-xs text-gray-500">{item.days}</p></div>
                <StatusBadge tone={item.status === "Pending" ? "amber" : "green"}>{item.status === "Pending" ? "Awaiting approval" : item.status}</StatusBadge>
              </div>
            ))}
          </div>
        </Card>
        <LeaveCalendar month={month} onMonthChange={setMonth} />
      </div>
      <div className="mx-auto w-full max-w-3xl">
        <Card title="Apply for leave" subtitle="Complete the form to preview a leave request">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><label className="mb-1.5 block text-xs font-semibold text-gray-600">Leave type</label><select required className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 focus:border-[#C8102E] focus:outline-none"><option value="">Select leave type</option><option>Casual Leave</option><option>Sick Leave</option><option>Earned Leave</option><option>Unpaid Leave</option></select></div>
            <div className="grid grid-cols-2 gap-3"><div><label className="mb-1.5 block text-xs font-semibold text-gray-600">From date</label><input required type="date" className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-700 focus:border-[#C8102E] focus:outline-none" /></div><div><label className="mb-1.5 block text-xs font-semibold text-gray-600">To date</label><input required type="date" className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-700 focus:border-[#C8102E] focus:outline-none" /></div></div>
            <div><label className="mb-1.5 block text-xs font-semibold text-gray-600">Reason</label><textarea required rows={3} placeholder="Share a brief reason for your leave..." className="w-full resize-none rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-700 focus:border-[#C8102E] focus:outline-none" /></div>
            <div><label className="mb-1.5 block text-xs font-semibold text-gray-600">Supporting document <span className="font-normal text-gray-400">(optional)</span></label><input type="file" className="w-full text-xs text-gray-500 file:mr-3 file:rounded-lg file:border-0 file:bg-gray-100 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-gray-700" /></div>
            <ActionButton type="submit">Submit application</ActionButton>
          </form>
        </Card>
      </div>
    </div>
  );
}

function ScheduleView({ portalLabel, dutySchedule, scheduleLoading, scheduleError }) {
  const [expandedDay, setExpandedDay] = useState(() => getScheduleDay(new Date()));
  const slots = dutySchedule?.slots || [];
  const weeklySlots = slots.filter((slot) => slot.schedule_kind === "weekly");
  const activeWeeklySlots = weeklySlots.filter((slot) => slot.duty_type !== "break");
  const scheduledWorkDays = dutySchedule?.working_days || [];
  const today = new Date();
  const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const specialDuties = slots
    .filter((slot) => slot.schedule_kind === "special" && slot.duty_date >= todayString)
    .sort((first, second) => first.duty_date.localeCompare(second.duty_date) || first.start_time.localeCompare(second.start_time));
  const scheduledMinutes = scheduledWorkDays.reduce(
    (total, day) => total + Math.max(0, getScheduleMinutes(day.end_time) - getScheduleMinutes(day.start_time)),
    0
  );
  const workingDays = scheduledWorkDays.length;
  const metrics = [
    { label: "Weekly duties", value: scheduleLoading ? "…" : activeWeeklySlots.length, icon: iconPaths.schedule, tone: "bg-red-50 text-[#C8102E]" },
    { label: "Scheduled hours", value: scheduleLoading ? "…" : `${(scheduledMinutes / 60).toFixed(scheduledMinutes % 60 ? 1 : 0)}h`, icon: iconPaths.clock, tone: "bg-blue-50 text-blue-600" },
    { label: "Working days", value: scheduleLoading ? "…" : workingDays, icon: iconPaths.calendar, tone: "bg-emerald-50 text-emerald-600" },
    { label: "Days off", value: scheduleLoading ? "…" : `${7 - workingDays} days`, icon: iconPaths.check, tone: "bg-violet-50 text-violet-600" },
  ];

  return (
    <div className="space-y-5">
      <PageHeading portalLabel={portalLabel} title="Duty schedule" description="Your assigned weekly schedule and date-specific duties." />
      {scheduleError && <p role="alert" className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">{scheduleError}</p>}
      {dutySchedule && (
        <p className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-xs font-medium text-blue-800">
          Schedule effective {formatScheduleDate(dutySchedule.effective_from)}
          {dutySchedule.effective_to ? ` through ${formatScheduleDate(dutySchedule.effective_to)}` : " until changed"}
        </p>
      )}
      {!scheduleLoading && !scheduleError && !dutySchedule && (
        <p className="rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-800">No duty schedule is currently assigned to your account.</p>
      )}
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {metrics.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-semibold text-gray-500">{stat.label}</p>
              <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${stat.tone}`}><Icon d={stat.icon} className="h-4 w-4" /></span>
            </div>
            <p className="mt-3 text-2xl font-extrabold tracking-tight text-[#1a1a2e]">{stat.value}</p>
          </div>
        ))}
      </div>

      <Card title="Weekly schedule" subtitle="Recurring classes, shifts, breaks, and locations assigned by administration">
        {scheduleLoading ? (
          <div className="space-y-2">{[0, 1, 2, 3].map((item) => <div key={item} className="h-14 animate-pulse rounded-xl bg-gray-100" />)}</div>
        ) : (
          <div className="space-y-2">
            {scheduleDays.map(({ value, label }) => {
              const dayPlan = scheduledWorkDays.find((day) => Number(day.day_of_week) === value);
              const daySlots = weeklySlots
                .filter((slot) => Number(slot.day_of_week) === value)
                .sort((first, second) => first.start_time.localeCompare(second.start_time));
              const dutyCount = daySlots.filter((slot) => slot.duty_type !== "break").length;
              const isExpanded = expandedDay === value;
              return (
                <div key={value} className={`overflow-hidden rounded-xl border transition-colors ${isExpanded ? "border-blue-200 bg-blue-50/30" : "border-gray-100 bg-white hover:border-gray-200"}`}>
                  <button
                    type="button"
                    aria-expanded={isExpanded}
                    aria-controls={`schedule-day-${value}`}
                    onClick={() => setExpandedDay(isExpanded ? 0 : value)}
                    className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-gray-800">{label}</p>
                      <p className={`mt-1 text-xs ${dutyCount ? "text-gray-500" : "font-medium text-gray-400"}`}>
                        {dayPlan ? `${formatScheduleTime(dayPlan.start_time)} – ${formatScheduleTime(dayPlan.end_time)}` : "No assigned hours"}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <StatusBadge tone={dayPlan ? "blue" : "gray"}>{dutyCount ? `${dutyCount} ${dutyCount === 1 ? "duty" : "duties"}` : dayPlan ? "Working day" : "Day off"}</StatusBadge>
                      <span aria-hidden="true" className={`text-sm text-gray-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}>⌄</span>
                    </div>
                  </button>
                  {isExpanded && (
                    <div id={`schedule-day-${value}`} className="border-t border-gray-100 bg-white px-4 sm:px-5">
                      {daySlots.length === 0 ? (
                        <p className="py-4 text-sm font-medium text-gray-500">{dayPlan ? `Working hours ${formatScheduleTime(dayPlan.start_time)} – ${formatScheduleTime(dayPlan.end_time)} · No classes or duties assigned.` : "No duties assigned for this day."}</p>
                      ) : (
                        <div className="divide-y divide-gray-100">
                          {daySlots.map((slot, index) => (
                            <div key={slot.id || `${value}-${index}`} className="flex flex-col gap-1 py-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                              <div>
                                <p className="text-[11px] font-medium text-gray-400">{formatScheduleTime(slot.start_time)} – {formatScheduleTime(slot.end_time)}</p>
                                {(slot.description || slot.location) && <p className="mt-1 text-xs text-gray-500">{[slot.description, slot.location].filter(Boolean).join(" · ")}</p>}
                              </div>
                              <div className="flex items-center gap-2 sm:justify-end">
                                <span className={`rounded-full px-2 py-1 text-[9px] font-bold uppercase ${slot.duty_type === "class" ? "bg-blue-50 text-blue-700" : slot.duty_type === "break" ? "bg-gray-100 text-gray-600" : "bg-violet-50 text-violet-700"}`}>{slot.duty_type}</span>
                                <p className={`text-sm font-bold ${slot.duty_type === "break" ? "text-gray-500" : "text-[#1a1a2e]"}`}>{slot.title}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </Card>

      <Card title="Special duties" subtitle="Date-specific assignments from administration">
        {scheduleLoading ? (
          <div className="h-16 animate-pulse rounded-xl bg-gray-100" />
        ) : specialDuties.length === 0 ? (
          <p className="py-5 text-center text-sm text-gray-500">No special duties assigned.</p>
        ) : (
          <div className="space-y-3">
            {specialDuties.map((slot, index) => (
              <div key={slot.id || `${slot.duty_date}-${index}`} className="flex flex-col gap-3 rounded-xl bg-gray-50 p-4 sm:flex-row sm:items-center">
                <span className="rounded-lg bg-white px-3 py-2 text-center text-xs font-bold text-[#C8102E] shadow-sm">{formatScheduleDate(slot.duty_date)}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-gray-800">{slot.title}</p>
                  <p className="mt-1 text-xs text-gray-500">{formatScheduleTime(slot.start_time)} – {formatScheduleTime(slot.end_time)}{slot.location ? ` · ${slot.location}` : ""}</p>
                  {slot.description && <p className="mt-1 text-xs text-gray-500">{slot.description}</p>}
                </div>
                <span className={`self-start rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${slot.duty_type === "class" ? "bg-blue-50 text-blue-700" : slot.duty_type === "break" ? "bg-gray-100 text-gray-600" : "bg-violet-50 text-violet-700"}`}>{slot.duty_type}</span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

function DocumentsView() {
  return (
    <div className="space-y-5">
      <PageHeading title="My documents" description="Employment, identity, qualification, and policy records." />
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">{[["Total documents", "08"], ["Verified", "07"], ["Action needed", "01"], ["Recently added", "01"]].map(([label, value]) => <div key={label} className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"><p className="text-xs text-gray-500">{label}</p><p className="mt-2 text-2xl font-extrabold text-[#1a1a2e]">{value}</p></div>)}</div>
      <Card title="Employment documents" subtitle="Documents available in your personnel file">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[620px] text-left text-xs">
            <thead><tr className="border-b border-gray-100 text-[10px] uppercase tracking-wider text-gray-400"><th className="pb-3 font-semibold">Document</th><th className="pb-3 font-semibold">Category</th><th className="pb-3 font-semibold">Added</th><th className="pb-3 font-semibold">Status</th><th className="pb-3 text-right font-semibold">Type</th></tr></thead>
            <tbody className="divide-y divide-gray-50">{documents.map((doc) => <tr key={doc.name}><td className="py-4 font-bold text-gray-800">{doc.name}</td><td className="py-4 text-gray-500">{doc.category}</td><td className="py-4 text-gray-500">{doc.date}</td><td className="py-4"><StatusBadge tone={doc.status === "Verified" ? "green" : "amber"}>{doc.status}</StatusBadge></td><td className="py-4 text-right font-semibold text-gray-400">{doc.type}</td></tr>)}</tbody>
          </table>
        </div>
      </Card>
      <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 text-xs leading-relaxed text-blue-800">For changes to your personnel documents, contact the HR Help Desk. Documents and downloads shown here are sample UI data.</div>
    </div>
  );
}

function AnnouncementsView() {
  return (
    <div className="space-y-5">
      <PageHeading title="Announcements & notices" description="Institute circulars, HR updates, holidays, events, and meetings." />
      <div className="flex flex-wrap gap-2">{["All notices", "Institute circulars", "HR notices", "Events", "Holidays"].map((filter, index) => <button key={filter} className={`rounded-full px-4 py-2 text-xs font-bold ${index === 0 ? "bg-[#1a1a2e] text-white" : "border border-gray-200 bg-white text-gray-500 hover:bg-gray-50"}`}>{filter}</button>)}</div>
      <div className="space-y-4">{announcements.map((item) => <Card key={item.title} className="transition hover:shadow-md">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
          <div className="flex-1"><div className="flex flex-wrap items-center gap-2"><StatusBadge tone="blue">{item.category}</StatusBadge><StatusBadge tone={item.priority === "Action required" ? "amber" : item.priority === "Important" ? "red" : "green"}>{item.priority}</StatusBadge></div><h2 className="mt-3 text-base font-extrabold text-[#1a1a2e]">{item.title}</h2><p className="mt-2 max-w-3xl text-sm leading-relaxed text-gray-500">{item.body}</p><p className="mt-3 text-[11px] font-medium text-gray-400">Posted {item.date} · Lakshya Institute</p></div>
          <button className="shrink-0 rounded-xl border border-gray-200 px-3 py-2 text-xs font-bold text-gray-600 hover:bg-gray-50">Read notice</button>
        </div>
      </Card>)}</div>
    </div>
  );
}

function formatQueryDate(value) {
  if (!value) return "Date not provided";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Date not provided"
    : date.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
}

function StudentQueriesView({ queries, onReply, onResolve }) {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [drafts, setDrafts] = useState({});
  const [actionError, setActionError] = useState("");
  const [savingId, setSavingId] = useState(null);
  const openCount = queries.filter((query) => query.status === "open").length;
  const answeredCount = queries.filter((query) => query.status === "answered").length;
  const resolvedCount = queries.filter((query) => query.status === "resolved").length;
  const normalizedSearch = search.trim().toLowerCase();
  const filteredQueries = queries.filter((query) => {
    const matchesStatus =
      filter === "All" ||
      (filter === "Needs reply" && query.status === "open") ||
      (filter === "Answered" && query.status === "answered") ||
      (filter === "Resolved" && query.status === "resolved");
    const studentName = `${query.student_first_name || ""} ${query.student_last_name || ""}`.toLowerCase();
    const matchesSearch =
      !normalizedSearch ||
      studentName.includes(normalizedSearch) ||
      String(query.admission_number || "").toLowerCase().includes(normalizedSearch) ||
      String(query.subject_name || "").toLowerCase().includes(normalizedSearch) ||
      String(query.title || "").toLowerCase().includes(normalizedSearch) ||
      String(query.batch_name || "").toLowerCase().includes(normalizedSearch);
    return matchesStatus && matchesSearch;
  });

  const sendReply = async (query) => {
    const reply = (drafts[query.id] || "").trim();
    if (reply.length < 2) {
      setActionError("Write a reply before sending.");
      return;
    }
    setSavingId(query.id);
    setActionError("");
    try {
      await onReply(query.id, reply);
      setReplyingTo(null);
      setDrafts((current) => ({ ...current, [query.id]: "" }));
    } catch (requestError) {
      setActionError(requestError.message);
    } finally {
      setSavingId(null);
    }
  };

  const resolveQuery = async (query) => {
    setSavingId(query.id);
    setActionError("");
    try {
      await onResolve(query.id);
    } catch (requestError) {
      setActionError(requestError.message);
    } finally {
      setSavingId(null);
    }
  };

  const filters = [
    { label: "All", count: queries.length },
    { label: "Needs reply", count: openCount },
    { label: "Answered", count: answeredCount },
    { label: "Resolved", count: resolvedCount },
  ];

  return (
    <div className="space-y-5">
      <PageHeading title="Student queries" description="Questions from students enrolled in your assigned subjects." />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {[
          { label: "Needs your reply", value: openCount, tone: "border-amber-400 text-amber-700", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
          { label: "Answered", value: answeredCount, tone: "border-blue-500 text-blue-700", icon: "M5 12l4 4L19 6" },
          { label: "Resolved", value: resolvedCount, tone: "border-emerald-500 text-emerald-700", icon: "M5 12l4 4L19 6" },
        ].map((stat) => (
          <div key={stat.label} className={`rounded-2xl border border-gray-100 border-l-4 bg-white p-4 shadow-sm ${stat.tone.split(" ")[0]}`}>
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-semibold text-gray-500">{stat.label}</p>
              <Icon d={stat.icon} className={`h-4 w-4 ${stat.tone.split(" ")[1]}`} />
            </div>
            <p className={`mt-3 text-2xl font-extrabold ${stat.tone.split(" ")[1]}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <Card
        title="Assigned student questions"
        subtitle="Review the topic, respond, and resolve conversations."
        action={
          <div className="relative w-full sm:w-64">
              <Icon d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search student or subject"
                aria-label="Search student queries"
                className="w-full rounded-xl border border-gray-200 py-2 pl-9 pr-3 text-xs focus:border-[#C8102E] focus:outline-none focus:ring-2 focus:ring-[#C8102E]/15"
              />
          </div>
        }
      >
        <div className="mb-4 flex flex-wrap gap-2 border-b border-gray-100 pb-4">
          {filters.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => setFilter(item.label)}
              className={`rounded-full px-3 py-1.5 text-[11px] font-bold transition ${filter === item.label ? "bg-[#1a1a2e] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
            >
              {item.label}<span className="ml-1.5 opacity-70">{item.count}</span>
            </button>
          ))}
        </div>

        {actionError && <p role="alert" className="mb-4 rounded-xl border border-red-100 bg-red-50 px-3 py-2.5 text-xs font-medium text-red-700">{actionError}</p>}
        {filteredQueries.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-10 text-center">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-white text-gray-400 shadow-sm">
              <Icon d={iconPaths.help} className="h-5 w-5" />
            </div>
            <p className="mt-3 text-sm font-bold text-gray-800">
              {queries.length ? "No questions match these filters" : "No student queries to display"}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              {queries.length ? "Try another status or search term." : "Student questions will appear here."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredQueries.map((query) => {
              const statusTone = query.status === "resolved" ? "green" : query.status === "answered" ? "blue" : "amber";
              const statusLabel = query.status === "resolved" ? "Resolved" : query.status === "answered" ? "Answered" : "Needs reply";
              const studentName = [query.student_first_name, query.student_last_name].filter(Boolean).join(" ") || "Student";
              return (
                <article key={query.id} className="rounded-2xl border border-gray-100 bg-white p-4 transition hover:border-gray-200 sm:p-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#1a1a2e] text-xs font-extrabold text-white">
                      {studentName.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-extrabold text-gray-800">{query.title}</h3>
                        <StatusBadge tone={statusTone}>{statusLabel}</StatusBadge>
                      </div>
                      <p className="mt-1 text-xs font-semibold text-[#C8102E]">
                        {query.subject_name} <span className="mx-1 text-gray-300">·</span> {query.batch_name}
                      </p>
                      <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-gray-600">{query.message}</p>
                      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-gray-400">
                        <span className="font-semibold text-gray-600">{studentName}</span>
                        {query.admission_number && <span>ID {query.admission_number}</span>}
                        <time dateTime={query.created_at}>{formatQueryDate(query.created_at)}</time>
                      </div>

                      {query.teacher_reply && (
                        <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50/70 p-3">
                          <p className="text-[10px] font-extrabold uppercase tracking-wide text-blue-700">Your response</p>
                          <p className="mt-1.5 whitespace-pre-wrap text-sm leading-relaxed text-gray-700">{query.teacher_reply}</p>
                          {query.replied_at && <time className="mt-2 block text-[10px] text-gray-400" dateTime={query.replied_at}>{formatQueryDate(query.replied_at)}</time>}
                        </div>
                      )}

                      {replyingTo === query.id && (
                        <div className="mt-4 space-y-3">
                          <label htmlFor={`reply-${query.id}`} className="block text-xs font-bold text-gray-600">Your reply</label>
                          <textarea
                            id={`reply-${query.id}`}
                            rows={3}
                            maxLength={5000}
                            value={drafts[query.id] || ""}
                            onChange={(event) => setDrafts((current) => ({ ...current, [query.id]: event.target.value }))}
                            placeholder="Write a clear explanation for the student..."
                            className="w-full resize-y rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:border-[#C8102E] focus:outline-none focus:ring-2 focus:ring-[#C8102E]/15"
                          />
                          <div className="flex flex-wrap gap-2">
                            <button type="button" onClick={() => sendReply(query)} disabled={savingId === query.id} className="rounded-xl bg-[#C8102E] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#a50d25] disabled:opacity-60">
                              {savingId === query.id ? "Sending..." : "Send reply"}
                            </button>
                            <button type="button" onClick={() => setReplyingTo(null)} className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-50">
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                    {query.status !== "resolved" && replyingTo !== query.id && (
                      <div className="flex shrink-0 gap-2 sm:flex-col">
                        <button type="button" onClick={() => { setReplyingTo(query.id); setActionError(""); }} className="rounded-xl bg-[#1a1a2e] px-3 py-2 text-xs font-bold text-white transition hover:bg-[#2b3050]">
                          {query.teacher_reply ? "Update reply" : "Reply"}
                        </button>
                        {query.status === "answered" && (
                          <button type="button" onClick={() => resolveQuery(query)} disabled={savingId === query.id} className="rounded-xl border border-emerald-200 px-3 py-2 text-xs font-bold text-emerald-700 transition hover:bg-emerald-50 disabled:opacity-60">
                            {savingId === query.id ? "Saving..." : "Resolve"}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}

function HelpDeskView({ onSubmitted }) {
  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmitted("Your help desk message is shown in preview only and has not been sent.");
  };
  return (
    <div className="space-y-5">
      <PageHeading title="HR help desk" description="Get help with attendance, leave, documents, and workplace matters." />
      <div className="grid gap-5 xl:grid-cols-[0.85fr_1.15fr]">
        <Card title="Your open requests" subtitle="Track recent HR support queries">
          <div className="space-y-3">{[["#HR-2084", "Attendance correction · 12 Nov", "In review", "amber"], ["#HR-1962", "Update emergency contact", "Resolved", "green"]].map(([id, title, status, tone]) => <div key={id} className="rounded-xl border border-gray-100 p-4"><div className="flex items-center justify-between gap-3"><span className="text-[10px] font-bold text-gray-400">{id}</span><StatusBadge tone={tone}>{status}</StatusBadge></div><p className="mt-2 text-xs font-bold text-gray-800">{title}</p><p className="mt-1 text-[10px] text-gray-400">Last updated {status === "Resolved" ? "14 Nov" : "Today"}</p></div>)}</div>
        </Card>
        <Card title="Raise a new query" subtitle="The HR team usually responds within one working day">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><label className="mb-1.5 block text-xs font-semibold text-gray-600">Query category</label><select className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700"><option>Attendance</option><option>Leave</option><option>Documents</option><option>Workplace issue</option><option>Other</option></select></div>
            <div><label className="mb-1.5 block text-xs font-semibold text-gray-600">Subject</label><input required placeholder="Briefly describe your query" className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:border-[#C8102E] focus:outline-none" /></div>
            <div><label className="mb-1.5 block text-xs font-semibold text-gray-600">Details</label><textarea required rows={4} placeholder="Provide details to help us resolve your query..." className="w-full resize-none rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:border-[#C8102E] focus:outline-none" /></div>
            <ActionButton type="submit">Create support request</ActionButton>
          </form>
        </Card>
      </div>
    </div>
  );
}

function ContentUploadView({ onSubmitted }) {
  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmitted("Upload details saved in this UI preview only; no content was uploaded.");
  };
  return (
    <div className="space-y-5">
      <PageHeading title="Content upload" description="Share learning materials with students in your assigned batches." />
      <div className="rounded-2xl border border-red-100 bg-gradient-to-r from-red-50 to-white p-5"><div className="flex gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#C8102E] text-white"><Icon d={iconPaths.upload} /></span><div><p className="text-sm font-extrabold text-[#1a1a2e]">Upload by batch</p><p className="mt-1 text-xs leading-relaxed text-gray-500">Choose one or more batches so students only see resources meant for their class.</p></div></div></div>
      <div className="grid gap-5 xl:grid-cols-[1fr_0.8fr]">
        <Card title="New learning resource" subtitle="Supported formats: PDF, PPT, DOC, MP4 · Up to 500 MB">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><label className="mb-1.5 block text-xs font-semibold text-gray-600">Resource title</label><input required placeholder="e.g. Laws of Motion · Revision Notes" className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:border-[#C8102E] focus:outline-none" /></div>
            <div className="grid gap-3 sm:grid-cols-2"><div><label className="mb-1.5 block text-xs font-semibold text-gray-600">Resource type</label><select className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm"><option>Study material</option><option>Recorded video</option><option>Assignment</option><option>Practice test</option></select></div><div><label className="mb-1.5 block text-xs font-semibold text-gray-600">Subject</label><select className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm"><option>Physics</option><option>Mathematics</option><option>Chemistry</option><option>Biology</option></select></div></div>
            <div><label className="mb-1.5 block text-xs font-semibold text-gray-600">Assign to batches</label><div className="space-y-2">{batches.map((batch) => <label key={batch.name} className="flex cursor-pointer items-center justify-between rounded-xl border border-gray-200 px-3 py-2.5 text-xs hover:bg-gray-50"><span className="flex items-center gap-2"><input type="checkbox" className="accent-[#C8102E]" />{batch.name}</span><span className="text-gray-400">{batch.students} students</span></label>)}</div></div>
            <div><label className="mb-1.5 block text-xs font-semibold text-gray-600">Choose file</label><input required type="file" className="w-full rounded-xl border border-dashed border-gray-300 bg-gray-50 p-3 text-xs text-gray-500 file:mr-3 file:rounded-lg file:border-0 file:bg-white file:px-3 file:py-2 file:text-xs file:font-bold file:text-gray-700" /></div>
            <div><label className="mb-1.5 block text-xs font-semibold text-gray-600">Description <span className="font-normal text-gray-400">(optional)</span></label><textarea rows={2} placeholder="Tell students what they will learn..." className="w-full resize-none rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:border-[#C8102E] focus:outline-none" /></div>
            <ActionButton type="submit"><Icon d={iconPaths.upload} className="h-4 w-4" />Preview upload</ActionButton>
          </form>
        </Card>
        <Card title="Recently shared" subtitle="Latest content by your batches">
          <div className="space-y-3">{[["Rotational Motion · DPP 04", "Class 12 · JEE Advanced", "Today · 09:12 AM", "PDF"], ["Mechanics · Lecture 12", "Class 11 · Mechanics", "Yesterday", "VIDEO"], ["Electricity · Quick Revision", "Class 12 · NEET Physics", "15 Nov 2026", "PDF"]].map(([title, batch, date, type]) => <div key={title} className="flex items-center gap-3 rounded-xl border border-gray-100 p-3"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-50 text-[9px] font-extrabold text-[#C8102E]">{type}</span><div className="min-w-0 flex-1"><p className="truncate text-xs font-bold text-gray-800">{title}</p><p className="mt-1 truncate text-[10px] text-gray-500">{batch}</p><p className="mt-1 text-[10px] text-gray-400">{date}</p></div></div>)}</div>
        </Card>
      </div>
    </div>
  );
}

function SettingsView({ notificationsEnabled, setNotificationsEnabled, onLogout, loggingOut }) {
  return (
    <div className="space-y-5">
      <PageHeading title="Settings" description="Manage your account, security, and notification preferences." />
      <Card title="Notification preferences" subtitle="Choose which updates you want to receive">
        <div className="divide-y divide-gray-100">{[["Email notifications", "Institute updates and HR notices"], ["Student query alerts", "New questions from your assigned batches"], ["Schedule reminders", "Upcoming classes and duty changes"]].map(([title, description], index) => <div key={title} className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"><div><p className="text-sm font-bold text-gray-800">{title}</p><p className="mt-1 text-xs text-gray-500">{description}</p></div><button role="switch" aria-checked={notificationsEnabled[index]} onClick={() => setNotificationsEnabled((current) => current.map((enabled, itemIndex) => itemIndex === index ? !enabled : enabled))} className={`relative h-6 w-11 rounded-full transition ${notificationsEnabled[index] ? "bg-[#C8102E]" : "bg-gray-200"}`}><span className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition ${notificationsEnabled[index] ? "left-6" : "left-1"}`} /></button></div>)}</div>
      </Card>
      <Card title="Change password" subtitle="Choose a strong password that you do not use elsewhere">
        <form className="grid gap-4 sm:grid-cols-2" onSubmit={(event) => { event.preventDefault(); }}>
          {[["Current password", "current-password"], ["New password", "new-password"], ["Confirm new password", "new-password"]].map(([label, autoComplete]) => <div key={label}><label className="mb-1.5 block text-xs font-semibold text-gray-600">{label}</label><input type="password" autoComplete={autoComplete} placeholder="••••••••" className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:border-[#C8102E] focus:outline-none" /></div>)}
          <div className="sm:col-span-2"><ActionButton type="submit">Update password</ActionButton></div>
        </form>
      </Card>
      <Card title="Account security" subtitle="Your account is protected by secure authentication">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700"><Icon d={iconPaths.check} /></span><div><p className="text-sm font-bold text-gray-800">Account active</p><p className="mt-1 text-xs text-gray-500">Last sign-in today</p></div></div><ActionButton secondary onClick={onLogout}>{loggingOut ? "Signing out…" : "Log out of account"}</ActionButton></div>
      </Card>
    </div>
  );
}

function TeacherPortal({ allowedRoles, noLayout = false, defaultSection = "dashboard", scheduleEmployeeType, scheduleEmployeeId }) {
  const [activeSection, setActiveSection] = useState(defaultSection);
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [month, setMonth] = useState(new Date(PREVIEW_TODAY.getFullYear(), PREVIEW_TODAY.getMonth(), 1));
  const [attendance, setAttendance] = useState({ checkIn: null, checkOut: null });
  const [notificationTab, setNotificationTab] = useState("All");
  const [notificationsEnabled, setNotificationsEnabled] = useState([true, true, true]);
  const [previewMessage, setPreviewMessage] = useState("");
  const [studentQueries, setStudentQueries] = useState([]);
  const [dutySchedule, setDutySchedule] = useState(null);
  const [scheduleLoading, setScheduleLoading] = useState(true);
  const [scheduleError, setScheduleError] = useState("");
  const { loggingOut, handleLogout } = useLogout();

  useEffect(() => {
    let active = true;
    let user = {};
    try {
      user = JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      user = {};
    }
    const isAdmin = user.role === "admin";
    setIsAdminUser(isAdmin);

    if (isAdmin && (!scheduleEmployeeType || !scheduleEmployeeId)) {
      setDutySchedule(null);
      setScheduleError("");
      setScheduleLoading(false);
      return () => {
        active = false;
      };
    }

    setScheduleLoading(true);
    setScheduleError("");
    const scheduleRequest = isAdmin
      ? employeeDutyScheduleAPI.getForEmployee(scheduleEmployeeType, scheduleEmployeeId)
      : employeeDutyScheduleAPI.getMine();

    scheduleRequest
      .then((response) => {
        if (!response.success) throw new Error(response.message || "Could not load duty schedule.");
        if (active) setDutySchedule(response.data.schedule || null);
      })
      .catch((error) => {
        if (active) setScheduleError(error.message || "Could not load duty schedule.");
      })
      .finally(() => {
        if (active) setScheduleLoading(false);
      });

    return () => {
      active = false;
    };
  }, [scheduleEmployeeType, scheduleEmployeeId]);

  const allItems = navGroups.flatMap((group) => group.items);
  const activeItem = allItems.find((item) => item.id === activeSection) || allItems[0];
  const portalLabel = allowedRoles.includes("staff") ? "Staff portal" : "Teacher portal";
  const navigate = (id) => {
    setActiveSection(id);
    setSidebarOpen(false);
    setPreviewMessage("");
  };
  const handlePunch = () => {
    const timestamp = new Date().toISOString();
    setAttendance((current) => {
      if (!current.checkIn) return { checkIn: timestamp, checkOut: null };
      if (!current.checkOut) return { ...current, checkOut: timestamp };
      return current;
    });
  };

  const content = {
    dashboard: <DashboardView
      onNavigate={navigate}
      month={month}
      setMonth={setMonth}
      attendance={attendance}
      onPunch={handlePunch}
      notificationTab={notificationTab}
      setNotificationTab={setNotificationTab}
      studentQueries={studentQueries}
      showStudentQueries={allowedRoles.includes("teacher")}
      dutySchedule={dutySchedule}
      scheduleLoading={scheduleLoading}
      scheduleError={scheduleError}
    />,
    profile: <ProfileView />,
    attendance: <AttendanceView month={month} setMonth={setMonth} attendance={attendance} onPunch={handlePunch} onSubmitted={setPreviewMessage} />,
    leave: <LeaveView onSubmitted={setPreviewMessage} />,
    schedule: <ScheduleView
      portalLabel={portalLabel}
      dutySchedule={dutySchedule}
      scheduleLoading={scheduleLoading}
      scheduleError={scheduleError}
    />,
    documents: <DocumentsView />,
    announcements: <AnnouncementsView />,
    "student-queries": <StudentQueriesView
      queries={studentQueries}
      onReply={async (id, reply) => {
        setStudentQueries((current) => current.map((query) =>
          query.id === id
            ? { ...query, teacher_reply: reply, status: "answered", replied_at: new Date().toISOString() }
            : query
        ));
      }}
      onResolve={async (id) => {
        setStudentQueries((current) => current.map((query) =>
          query.id === id
            ? { ...query, status: "resolved", resolved_at: new Date().toISOString() }
            : query
        ));
      }}
    />,
    help: <HelpDeskView onSubmitted={setPreviewMessage} />,
    content: <ContentUploadView onSubmitted={setPreviewMessage} />,
    settings: <SettingsView notificationsEnabled={notificationsEnabled} setNotificationsEnabled={setNotificationsEnabled} onLogout={handleLogout} loggingOut={loggingOut} />,
    ...(allowedRoles.includes("teacher") ? { results: <TeacherResultsView /> } : {}),
  }[activeSection];

  return (
    <ProtectedRoute allowedRoles={allowedRoles}>
      <div className={noLayout ? "" : "min-h-screen bg-[#f5f6fa] text-gray-800"}>
        {!noLayout && sidebarOpen && <button aria-label="Close navigation" onClick={() => setSidebarOpen(false)} className="fixed inset-0 z-30 bg-[#101324]/50 lg:hidden" />}
        {!noLayout && (
          <aside className={`fixed inset-y-0 left-0 z-40 flex w-[268px] flex-col bg-[#171a30] text-white shadow-2xl transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>
          <div className="flex items-center gap-3 border-b border-white/10 px-5 py-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C8102E] text-sm font-extrabold shadow-lg shadow-red-950/30">L</div>
            <div><p className="text-sm font-extrabold">Lakshya</p><p className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/45">{portalLabel}</p></div>
            <button onClick={() => setSidebarOpen(false)} aria-label="Close menu" className="ml-auto rounded-lg p-2 text-white/60 hover:bg-white/10 lg:hidden">×</button>
          </div>

          <div className="mx-4 my-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] p-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#C8102E] to-[#8d1027] text-xs font-extrabold">{teacher.initials}</div>
            <div className="min-w-0"><p className="truncate text-xs font-bold">{teacher.name}</p><p className="mt-1 truncate text-[10px] text-white/45">{teacher.designation}</p></div>
            <span className="ml-auto h-2 w-2 shrink-0 rounded-full bg-emerald-400" />
          </div>

          <nav className="flex-1 space-y-5 overflow-y-auto px-3 pb-4">
            {navGroups.map((group) => (
              <div key={group.title}>
                <p className="mb-2 px-3 text-[9px] font-extrabold tracking-[0.2em] text-white/35">{group.title}</p>
                <div className="space-y-1">{group.items.filter((item) =>
                  (item.id !== "results" || allowedRoles.includes("teacher")) &&
                  (item.id !== "student-queries" || allowedRoles.includes("teacher"))
                ).map((item) => (
                  <button key={item.id} onClick={() => navigate(item.id)} className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs font-semibold transition ${activeSection === item.id ? "bg-[#C8102E] text-white shadow-md shadow-red-950/20" : "text-white/60 hover:bg-white/[0.07] hover:text-white"}`}>
                    <Icon d={item.icon} className="h-[18px] w-[18px] shrink-0" />
                    <span>{item.label}</span>
                    {item.id === "help" && <span className="ml-auto rounded-full bg-[#F5C518] px-1.5 py-0.5 text-[9px] font-extrabold text-[#1a1a2e]">2</span>}
                    {item.id === "student-queries" && studentQueries?.filter((query) => query.status === "open").length > 0 && <span className="ml-auto rounded-full bg-[#F5C518] px-1.5 py-0.5 text-[9px] font-extrabold text-[#1a1a2e]">{studentQueries.filter((query) => query.status === "open").length}</span>}
                  </button>
                ))}</div>
              </div>
            ))}
          </nav>

          <div className="border-t border-white/10 p-4">
            <div className="mb-3 rounded-xl bg-white/[0.06] p-3"><div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-emerald-400" /><span className="text-[10px] font-semibold text-white/70">Academic year 2026–27</span></div><p className="mt-2 text-[10px] text-white/35">Faculty workspace</p></div>
            {isAdminUser && <Link href="/admin" className="mb-2 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs font-semibold text-white/55 transition hover:bg-white/[0.07] hover:text-white"><Icon d={iconPaths.arrow} className="h-[18px] w-[18px]" />Back to Admin</Link>}
            <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs font-semibold text-white/55 transition hover:bg-white/[0.07] hover:text-white"><Icon d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" className="h-[18px] w-[18px]" />{loggingOut ? "Signing out…" : "Log out"}</button>
          </div>
        </aside>
        )}

        <div className={noLayout ? "" : "min-h-screen lg:pl-[268px]"}>
          {!noLayout && (
            <header className="sticky top-0 z-20 border-b border-gray-200/80 bg-white/90 backdrop-blur-xl">
              <div className="flex h-[68px] items-center justify-between gap-3 px-4 sm:px-7">
                <div className="flex min-w-0 items-center gap-3">
                  <button onClick={() => setSidebarOpen(true)} aria-label="Open navigation" className="rounded-xl border border-gray-200 p-2 text-gray-600 hover:bg-gray-50 lg:hidden"><Icon d="M4 6h16M4 12h16M4 18h16" className="h-5 w-5" /></button>
                  <div className="min-w-0"><p className="truncate text-sm font-extrabold capitalize text-[#1a1a2e]">{activeItem.label}</p><p className="hidden text-[10px] text-gray-400 sm:block">Home <span className="mx-1">/</span> {portalLabel} <span className="mx-1">/</span> {activeItem.label}</p></div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="hidden text-right sm:block"><p className="text-[11px] font-bold text-gray-700">{teacher.name}</p><p className="mt-0.5 text-[10px] text-gray-400">{teacher.employeeId}</p></div>
                  <button onClick={() => navigate("announcements")} aria-label="Open notifications" className="relative rounded-xl border border-gray-200 p-2.5 text-gray-500 transition hover:bg-gray-50"><Icon d={iconPaths.bell} className="h-[18px] w-[18px]" /><span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-[#C8102E]" /></button>
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1a1a2e] text-[10px] font-extrabold text-white">{teacher.initials}</div>
                </div>
              </div>
            </header>
          )}

          <main className={noLayout ? "space-y-5" : "mx-auto max-w-[1500px] space-y-5 p-4 sm:p-6 lg:p-8"}>
            {previewMessage && <div role="status" className="flex items-start justify-between gap-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800"><span>{previewMessage}</span><button onClick={() => setPreviewMessage("")} aria-label="Dismiss message" className="font-bold">×</button></div>}
            {content}
            {!noLayout && <footer className="border-t border-gray-200 pt-4 text-[10px] text-gray-400">Lakshya Teacher Portal · {teacher.employeeId}</footer>}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}

export default function EmployeeDashboard({ allowedRoles = ["teacher"], noLayout = false, defaultSection = "dashboard", scheduleEmployeeType, scheduleEmployeeId }) {
  return (
    <TeacherPortal
      allowedRoles={allowedRoles}
      noLayout={noLayout}
      defaultSection={defaultSection}
      scheduleEmployeeType={scheduleEmployeeType}
      scheduleEmployeeId={scheduleEmployeeId}
    />
  );
}
