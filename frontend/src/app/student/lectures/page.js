"use client";

import { useState } from "react";
import EmptyState from "@/components/EmptyState";
import Icon from "@/components/Icon";
import { icons } from "../icons";
import { PageTitle, StatCard, Tabs, inputClass } from "../ui";

const VIEWS = ["Subject-wise", "Chapter-wise", "Bookmarked"];

export default function RecordedLectures() {
  const [view, setView] = useState("Subject-wise");
  const [search, setSearch] = useState("");

  return (
    <div className="space-y-6">
      <PageTitle title="Recorded Lectures" subtitle="Watch recorded classes and continue where you left off." />

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard label="Lectures Watched" color="bg-[#C8102E]" icon={icons.play} />
        <StatCard label="In Progress" color="bg-amber-500" icon={icons.clock} />
        <StatCard label="Access Valid Till" color="bg-[#1a1a2e]" icon={icons.calendar} />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Icon d={icons.search} className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by topic"
              className={`${inputClass} pl-9`}
            />
          </div>
          <select className={inputClass} defaultValue="">
            <option value="">All subjects</option>
          </select>
          <select className={inputClass} defaultValue="">
            <option value="">All faculty</option>
          </select>
        </div>

        <Tabs items={VIEWS} value={view} onChange={setView} />
      </div>

      <EmptyState title="Continue Watching" message="Lectures you start watching will appear here." />
      <EmptyState title="Video Library" message="Recorded lectures will appear here once they are uploaded." />
    </div>
  );
}
