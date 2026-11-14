"use client";

import { useState } from "react";
import EmptyState from "@/components/EmptyState";
import Icon from "@/components/Icon";
import { icons } from "../icons";
import { PageTitle, Tabs, inputClass } from "../ui";

const CATEGORIES = [
  "All",
  "Class Notes",
  "PDF Material",
  "DPP",
  "Worksheets",
  "NCERT Solutions",
  "Important Questions",
  "Formula Sheets",
  "Previous Year Questions",
  "Revision Modules",
  "Practice Sets",
];

export default function StudyMaterial() {
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");

  return (
    <div className="space-y-6">
      <PageTitle title="Study Material" subtitle="Notes, DPPs, worksheets and more, organised subject and chapter wise." />

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative sm:col-span-2 lg:col-span-1">
            <Icon d={icons.search} className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search material"
              className={`${inputClass} pl-9`}
            />
          </div>
          <select className={inputClass} defaultValue="">
            <option value="">All subjects</option>
          </select>
          <select className={inputClass} defaultValue="">
            <option value="">All chapters</option>
          </select>
          <select className={inputClass} defaultValue="">
            <option value="">All topics</option>
          </select>
        </div>

        <Tabs items={CATEGORIES} value={category} onChange={setCategory} />
      </div>

      <EmptyState
        title={category === "All" ? "All Material" : category}
        message="Study material will appear here once your faculty uploads it."
      />
    </div>
  );
}
