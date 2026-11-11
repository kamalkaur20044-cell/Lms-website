"use client";

import { useState } from "react";

const allEnquiries = [
  { id: 1, name: "Rohit Sharma", email: "rohit@email.com", phone: "+91 98765 43210", program: "IIT-JEE Mains", message: "I want to know about the batch timings and fee structure.", date: "Nov 11, 2026", status: "New" },
  { id: 2, name: "Priya Singh", email: "priya@email.com", phone: "+91 87654 32109", program: "NEET (UG)", message: "Please share details about the online batch for NEET.", date: "Nov 11, 2026", status: "Contacted" },
  { id: 3, name: "Amit Verma", email: "amit@email.com", phone: "+91 76543 21098", program: "Foundation", message: "My son is in class 9. Is there a suitable batch?", date: "Nov 10, 2026", status: "New" },
  { id: 4, name: "Sneha Patel", email: "sneha@email.com", phone: "+91 65432 10987", program: "IIT-JEE Advanced", message: "I scored 95% in boards. Can I get a scholarship?", date: "Nov 10, 2026", status: "Resolved" },
  { id: 5, name: "Rahul Gupta", email: "rahul@email.com", phone: "+91 54321 09876", program: "Crash Course", message: "JEE Mains is next month. Do you have crash batches?", date: "Nov 09, 2026", status: "Contacted" },
  { id: 6, name: "Anita Mehra", email: "anita@email.com", phone: "+91 43210 98765", program: "NEET (UG)", message: "I am a dropper. What is the fee for the repeater batch?", date: "Nov 09, 2026", status: "New" },
];

const statusColor = {
  New: "bg-blue-100 text-blue-700",
  Contacted: "bg-yellow-100 text-yellow-700",
  Resolved: "bg-green-100 text-green-700",
};

const statuses = ["All", "New", "Contacted", "Resolved"];

export default function EnquiriesPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [expanded, setExpanded] = useState(null);

  const filtered = allEnquiries.filter((e) => {
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase()) || e.program.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || e.status === filter;
    return matchSearch && matchFilter;
  });

  const counts = {
    New: allEnquiries.filter((e) => e.status === "New").length,
    Contacted: allEnquiries.filter((e) => e.status === "Contacted").length,
    Resolved: allEnquiries.filter((e) => e.status === "Resolved").length,
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-[#1a1a2e]">Enquiries</h1>
          <p className="text-sm text-gray-500">{filtered.length} enquiries found</p>
        </div>
      </div>

      {/* Count cards */}
      <div className="grid grid-cols-3 gap-3">
        {Object.entries(counts).map(([label, count]) => (
          <button
            key={label}
            onClick={() => setFilter(filter === label ? "All" : label)}
            className={`rounded-2xl p-4 text-center border transition-all ${
              filter === label
                ? "bg-[#C8102E] border-[#C8102E] text-white"
                : "bg-white border-gray-100 hover:border-[#C8102E]/30"
            }`}
          >
            <p className={`text-2xl font-extrabold ${filter === label ? "text-white" : "text-[#1a1a2e]"}`}>{count}</p>
            <p className={`text-xs font-semibold mt-0.5 ${filter === label ? "text-red-100" : "text-gray-500"}`}>{label}</p>
          </button>
        ))}
      </div>

      {/* Search + filter */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input
            type="text"
            placeholder="Search by name or program..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#C8102E] focus:ring-2 focus:ring-[#C8102E]/10"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#C8102E] bg-white text-gray-700"
        >
          {statuses.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>

      {/* Enquiry cards */}
      <div className="space-y-3">
        {filtered.map((e) => (
          <div key={e.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div
              className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => setExpanded(expanded === e.id ? null : e.id)}
            >
              <div className="w-9 h-9 rounded-full bg-[#C8102E]/10 flex items-center justify-center text-sm font-bold text-[#C8102E] flex-shrink-0">
                {e.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold text-[#1a1a2e] text-sm">{e.name}</p>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusColor[e.status]}`}>{e.status}</span>
                </div>
                <p className="text-xs text-gray-400 truncate">{e.program} · {e.phone} · {e.date}</p>
              </div>
              <svg
                className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${expanded === e.id ? "rotate-180" : ""}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {expanded === e.id && (
              <div className="px-5 pb-4 border-t border-gray-100 pt-3 space-y-3">
                <p className="text-sm text-gray-600 bg-gray-50 rounded-xl p-3 leading-relaxed">
                  <span className="text-xs font-bold text-gray-400 block mb-1">Message</span>
                  {e.message}
                </p>
                <div className="flex flex-wrap gap-2">
                  <a href={`tel:${e.phone}`} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1a1a2e] text-white text-xs font-semibold rounded-lg hover:bg-[#16213e] transition-colors">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                    Call
                  </a>
                  <a href={`mailto:${e.email}`} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500 text-white text-xs font-semibold rounded-lg hover:bg-blue-600 transition-colors">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    Email
                  </a>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500 text-white text-xs font-semibold rounded-lg hover:bg-green-600 transition-colors">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    Mark Resolved
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-500 text-xs font-semibold rounded-lg hover:bg-red-100 transition-colors">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400 text-sm bg-white rounded-2xl border border-gray-100">No enquiries found.</div>
        )}
      </div>
    </div>
  );
}
