"use client";

import { useState } from "react";

const allFaculty = [
  { id: 1, name: "Dr. Rajesh Sharma", subject: "Physics", stream: "IIT-JEE & NEET", qual: "Ph.D. — IIT Delhi", exp: "18 years", courses: 2, status: "Active" },
  { id: 2, name: "Prof. Anil Kumar", subject: "Mathematics", stream: "IIT-JEE", qual: "M.Tech — IIT Bombay", exp: "15 years", courses: 2, status: "Active" },
  { id: 3, name: "Dr. Priya Verma", subject: "Biology", stream: "NEET (UG)", qual: "MBBS — AIIMS Delhi", exp: "12 years", courses: 2, status: "Active" },
  { id: 4, name: "Mr. Suresh Gupta", subject: "Chemistry", stream: "IIT-JEE & NEET", qual: "M.Sc. — IIT Kanpur", exp: "14 years", courses: 3, status: "Active" },
  { id: 5, name: "Ms. Ritu Saxena", subject: "Chemistry", stream: "NEET (UG)", qual: "M.Sc. — BHU", exp: "9 years", courses: 1, status: "Inactive" },
];

const subjectColors = {
  Physics: "bg-red-100 text-[#C8102E]",
  Mathematics: "bg-blue-100 text-blue-700",
  Biology: "bg-green-100 text-green-700",
  Chemistry: "bg-yellow-100 text-yellow-700",
};

const statusColor = {
  Active: "bg-green-100 text-green-700",
  Inactive: "bg-gray-100 text-gray-500",
};

export default function FacultyPage() {
  const [search, setSearch] = useState("");

  const filtered = allFaculty.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    f.subject.toLowerCase().includes(search.toLowerCase()) ||
    f.stream.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-[#1a1a2e]">Faculty</h1>
          <p className="text-sm text-gray-500">{filtered.length} faculty members</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#C8102E] text-white text-sm font-bold rounded-xl hover:bg-[#a50d25] transition-colors self-start sm:self-auto">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
          Add Faculty
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input
            type="text"
            placeholder="Search faculty..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#C8102E] focus:ring-2 focus:ring-[#C8102E]/10"
          />
        </div>
      </div>

      {/* Grid cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((f) => (
          <div key={f.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3 hover:-translate-y-1 hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between">
              <div className="w-11 h-11 rounded-2xl bg-[#C8102E]/10 flex items-center justify-center text-base font-extrabold text-[#C8102E]">
                {f.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
              </div>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusColor[f.status]}`}>{f.status}</span>
            </div>
            <div>
              <p className="font-bold text-[#1a1a2e] text-sm">{f.name}</p>
              <p className="text-xs text-gray-400 mt-0.5">{f.qual}</p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${subjectColors[f.subject] || "bg-gray-100 text-gray-600"}`}>{f.subject}</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{f.stream}</span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <div className="text-xs text-gray-500">
                <span className="font-semibold text-[#1a1a2e]">{f.exp}</span> exp
              </div>
              <div className="text-xs text-gray-500">
                <span className="font-semibold text-[#1a1a2e]">{f.courses}</span> courses
              </div>
              <div className="flex gap-1.5">
                <button className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500 transition-colors" title="Edit">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                </button>
                <button className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors" title="Delete">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-gray-400 text-sm bg-white rounded-2xl border border-gray-100">No faculty found.</div>
      )}
    </div>
  );
}
