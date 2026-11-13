"use client";

import { useMemo, useState } from "react";
import Icon from "./Icon";

const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const STATUS = {
  present: { cell: "bg-green-100 text-green-700", dot: "bg-green-500", label: "Present" },
  absent: { cell: "bg-red-100 text-red-700", dot: "bg-red-500", label: "Absent" },
  late: { cell: "bg-amber-100 text-amber-700", dot: "bg-amber-500", label: "Late" },
  leave: { cell: "bg-blue-100 text-blue-700", dot: "bg-blue-500", label: "Leave" },
  holiday: { cell: "bg-purple-100 text-purple-700", dot: "bg-purple-500", label: "Holiday" },
};

const COUNTED = ["present", "absent", "late", "leave"];
const NO_ITEMS = [];
const NO_NOTES = {};

const dateKey = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

const toMap = (list, key, value) => Object.fromEntries(list.map((item) => [item[key], item[value]]));

// records: [{ date: "YYYY-MM-DD", status }], holidays: [{ date, title }],
// notes: { "YYYY-MM-DD": "tooltip text" } for summary views such as admin.
export default function AttendanceCalendar({
  title = "Attendance Calendar",
  records = NO_ITEMS,
  holidays = NO_ITEMS,
  notes = NO_NOTES,
  emptyMessage = "Attendance will show here once it is recorded.",
}) {
  const today = new Date();
  const todayKey = dateKey(today);
  const [month, setMonth] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));

  const statusByDate = useMemo(() => toMap(records, "date", "status"), [records]);
  const holidayByDate = useMemo(() => toMap(holidays, "date", "title"), [holidays]);

  const days = useMemo(() => {
    const year = month.getFullYear();
    const m = month.getMonth();
    const leadingBlanks = (new Date(year, m, 1).getDay() + 6) % 7; // week starts on Monday
    const total = new Date(year, m + 1, 0).getDate();
    return [
      ...Array(leadingBlanks).fill(null),
      ...Array.from({ length: total }, (_, i) => new Date(year, m, i + 1)),
    ];
  }, [month]);

  const counts = useMemo(() => {
    const result = Object.fromEntries(COUNTED.map((s) => [s, 0]));
    days.forEach((d) => {
      const status = d && statusByDate[dateKey(d)];
      if (status in result) result[status] += 1;
    });
    return result;
  }, [days, statusByDate]);

  const shiftMonth = (step) => setMonth((m) => new Date(m.getFullYear(), m.getMonth() + step, 1));
  const isEmpty = !records.length && !holidays.length && !Object.keys(notes).length;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-4">{title}</h2>

      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => shiftMonth(-1)}
          className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
          aria-label="Previous month"
        >
          <Icon d="M15 19l-7-7 7-7" className="w-4 h-4" strokeWidth={2} />
        </button>
        <p className="text-sm font-semibold text-[#1a1a2e]">
          {month.toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
        </p>
        <button
          onClick={() => shiftMonth(1)}
          className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
          aria-label="Next month"
        >
          <Icon d="M9 5l7 7-7 7" className="w-4 h-4" strokeWidth={2} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {WEEK_DAYS.map((d) => (
          <div key={d} className="text-[11px] font-semibold text-gray-400 py-1">{d}</div>
        ))}
        {days.map((d, i) => {
          if (!d) return <div key={`blank-${i}`} />;
          const key = dateKey(d);
          const status = holidayByDate[key] ? "holiday" : statusByDate[key];
          const tooltip = holidayByDate[key] || notes[key] || STATUS[status]?.label || "";
          return (
            <div
              key={key}
              title={tooltip}
              className={`aspect-square flex items-center justify-center rounded-lg text-xs font-medium
                ${status ? STATUS[status].cell : "text-gray-600 hover:bg-gray-50"}
                ${key === todayKey ? "ring-2 ring-[#C8102E]" : ""}`}
            >
              {d.getDate()}
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-x-3 gap-y-1.5 mt-4">
        {Object.entries(STATUS).map(([key, { dot, label }]) => (
          <span key={key} className="flex items-center gap-1.5 text-[11px] text-gray-500">
            <span className={`w-2 h-2 rounded-full ${dot}`} />
            {label}
          </span>
        ))}
      </div>

      {records.length > 0 && (
        <div className="grid grid-cols-4 gap-2 mt-4 pt-4 border-t border-gray-100 text-center">
          {COUNTED.map((key) => (
            <div key={key}>
              <p className="text-lg font-extrabold text-[#1a1a2e]">{counts[key]}</p>
              <p className="text-[11px] text-gray-500">{STATUS[key].label}</p>
            </div>
          ))}
        </div>
      )}

      {isEmpty && (
        <p className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-400 text-center">{emptyMessage}</p>
      )}
    </div>
  );
}
