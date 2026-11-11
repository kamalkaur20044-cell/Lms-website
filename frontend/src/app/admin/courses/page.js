"use client";

import { useState } from "react";

const allCourses = [
  { id: 1, title: "IIT-JEE Mains Complete Course", category: "IIT-JEE", duration: "12 Months", mode: "Offline + Online", students: 2840, status: "Active" },
  { id: 2, title: "IIT-JEE Advanced Intensive", category: "IIT-JEE", duration: "8 Months", mode: "Offline", students: 1520, status: "Active" },
  { id: 3, title: "NEET (UG) Target Batch", category: "NEET", duration: "12 Months", mode: "Offline + Online", students: 3210, status: "Active" },
  { id: 4, title: "Foundation Program (Class VIII–X)", category: "Foundation", duration: "10 Months", mode: "Offline", students: 4120, status: "Active" },
  { id: 5, title: "JEE Crash Course (60 Days)", category: "Crash Course", duration: "2 Months", mode: "Offline + Online", students: 980, status: "Active" },
  { id: 6, title: "NEET Crash Course (45 Days)", category: "Crash Course", duration: "45 Days", mode: "Offline + Online", students: 860, status: "Active" },
  { id: 7, title: "JEE Online Self-Paced Batch", category: "Online", duration: "Lifetime", mode: "Online", students: 1250, status: "Active" },
  { id: 8, title: "NEET Online Self-Paced Batch", category: "Online", duration: "Lifetime", mode: "Online", students: 1100, status: "Inactive" },
  { id: 9, title: "NEET Repeater Batch", category: "NEET", duration: "8 Months", mode: "Offline", students: 720, status: "Active" },
];

const categoryColors = {
  "IIT-JEE": "bg-red-100 text-[#C8102E]",
  "NEET": "bg-green-100 text-green-700",
  "Foundation": "bg-blue-100 text-blue-700",
  "Crash Course": "bg-purple-100 text-purple-700",
  "Online": "bg-teal-100 text-teal-700",
};

const statusColor = {
  Active: "bg-green-100 text-green-700",
  Inactive: "bg-gray-100 text-gray-500",
};

export default function CoursesPage() {
  const [search, setSearch] = useState("");

  const filtered = allCourses.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase()) || c.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-[#1a1a2e]">Courses</h1>
          <p className="text-sm text-gray-500">{filtered.length} courses total</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#C8102E] text-white text-sm font-bold rounded-xl hover:bg-[#a50d25] transition-colors self-start sm:self-auto">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
          Add Course
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input
            type="text"
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#C8102E] focus:ring-2 focus:ring-[#C8102E]/10"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#f7f8fc] border-b border-gray-100">
                <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">#</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Course Title</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Category</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide hidden md:table-cell">Duration</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide hidden md:table-cell">Mode</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Students</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3.5 text-gray-400 text-xs">{c.id}</td>
                  <td className="px-5 py-3.5 font-semibold text-[#1a1a2e] max-w-[200px] truncate">{c.title}</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${categoryColors[c.category]}`}>{c.category}</span>
                  </td>
                  <td className="px-5 py-3.5 text-gray-600 hidden md:table-cell">{c.duration}</td>
                  <td className="px-5 py-3.5 text-gray-600 hidden md:table-cell">{c.mode}</td>
                  <td className="px-5 py-3.5 font-semibold text-[#1a1a2e]">{c.students.toLocaleString()}</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColor[c.status]}`}>{c.status}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <button className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500 transition-colors" title="Edit">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors" title="Delete">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="text-center py-12 text-gray-400 text-sm">No courses found.</div>}
        </div>
      </div>
    </div>
  );
}
