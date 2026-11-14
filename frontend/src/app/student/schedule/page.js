"use client";

import { useState } from "react";
import EmptyState from "@/components/EmptyState";
import { Card, PageTitle, Tabs } from "../ui";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const VIEWS = ["Daily", "Weekly"];

const todayLabel = () => DAYS[(new Date().getDay() + 6) % 7];

export default function ClassSchedule() {
  const [view, setView] = useState("Daily");
  const [day, setDay] = useState(todayLabel);

  return (
    <div className="space-y-6">
      <PageTitle title="Class Schedule" subtitle="Your timetable, exams, holidays and class updates.">
        <Tabs items={VIEWS} value={view} onChange={setView} />
      </PageTitle>

      {view === "Daily" ? (
        <Card title="Daily Timetable" action={<Tabs items={DAYS} value={day} onChange={setDay} />}>
          <TimetableHead />
          <p className="text-xs text-gray-400 text-center py-8">No classes scheduled for {day}.</p>
        </Card>
      ) : (
        <Card title="Weekly Timetable">
          <div className="overflow-x-auto">
            <div className="grid grid-cols-7 gap-2 min-w-[640px]">
              {DAYS.map((d) => (
                <div key={d} className="rounded-xl bg-gray-50 p-3 min-h-[160px]">
                  <p className={`text-xs font-bold mb-2 ${d === todayLabel() ? "text-[#C8102E]" : "text-gray-600"}`}>{d}</p>
                  <p className="text-xs text-gray-400">No classes</p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <EmptyState title="Upcoming Examinations" message="No upcoming examinations." />
        <EmptyState title="Holiday Calendar" message="Holidays will appear here once they are announced." />
        <EmptyState title="Rescheduled Classes" message="No rescheduled classes." />
        <EmptyState title="Cancelled Classes" message="No class cancellations." />
      </div>
    </div>
  );
}

function TimetableHead() {
  return (
    <div className="hidden sm:grid grid-cols-4 gap-3 px-3 py-2 rounded-xl bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">
      <span>Time</span>
      <span>Subject</span>
      <span>Faculty</span>
      <span>Classroom</span>
    </div>
  );
}
