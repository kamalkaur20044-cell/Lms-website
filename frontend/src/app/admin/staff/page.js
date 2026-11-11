"use client";

import { useState } from "react";

const allStaff = [
  { id: 1, name: "Ramesh Kumar", email: "ramesh@lakshya.ac.in", phone: "+91 98233 00034", role: "Manager", dept: "Administration", joined: "Jan 15, 2019", status: "Active" },
  { id: 2, name: "Sunita Devi", email: "sunita@lakshya.ac.in", phone: "+91 97679 00030", role: "Receptionist", dept: "Front Desk", joined: "Mar 10, 2021", status: "Active" },
  { id: 3, name: "Harpreet Singh", email: "harpreet@lakshya.ac.in", phone: "+91 95555 11111", role: "Accountant", dept: "Finance", joined: "Jun 05, 2020", status: "Active" },
  { id: 4, name: "Manpreet Kaur", email: "manpreet@lakshya.ac.in", phone: "+91 94444 22222", role: "Counsellor", dept: "Admissions", joined: "Aug 20, 2022", status: "Active" },
  { id: 6, name: "Pooja Sharma", email: "pooja@lakshya.ac.in", phone: "+91 92222 44444", role: "Counsellor", dept: "Admissions", joined: "Nov 01, 2021", status: "Inactive" },
  { id: 7, name: "Gurpreet Gill", email: "gurpreet@lakshya.ac.in", phone: "+91 91111 55555", role: "Security", dept: "Operations", joined: "Apr 18, 2020", status: "Active" },
];

const depts = ["All", "Administration", "Front Desk", "Finance", "Admissions", "Technology", "Operations", "Library"];

const deptColors = {
  Administration: "bg-red-100 text-[#C8102E]",
  "Front Desk": "bg-blue-100 text-blue-700",
  Finance: "bg-green-100 text-green-700",
  Admissions: "bg-yellow-100 text-yellow-700",
  Technology: "bg-purple-100 text-purple-700",
  Operations: "bg-orange-100 text-orange-700",
  Library: "bg-teal-100 text-teal-700",
};

const statusColor = {
  Active: "bg-green-100 text-green-700",
  Inactive: "bg-gray-100 text-gray-500",
};

const avatarColors = [
  "bg-[#C8102E]", "bg-blue-500", "bg-green-500", "bg-yellow-500",
  "bg-purple-500", "bg-teal-500", "bg-orange-500", "bg-pink-500",
];

export default function StaffPage() {
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", role: "", dept: "", status: "Active" });

  const filtered = allStaff.filter((s) => {
    const matchSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.role.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase());
    const matchDept = deptFilter === "All" || s.dept === deptFilter;
    return matchSearch && matchDept;
  });

  const activeCount = allStaff.filter((s) => s.status === "Active").length;

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-[#1a1a2e]">Staff</h1>
          <p className="text-sm text-gray-500">{activeCount} active · {allStaff.length} total</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#C8102E] text-white text-sm font-bold rounded-xl hover:bg-[#a50d25] transition-colors self-start sm:self-auto"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Staff
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Staff", value: allStaff.length, color: "bg-[#1a1a2e]" },
          { label: "Active", value: allStaff.filter((s) => s.status === "Active").length, color: "bg-green-500" },
          { label: "Departments", value: new Set(allStaff.map((s) => s.dept)).size, color: "bg-[#C8102E]" },
          { label: "Inactive", value: allStaff.filter((s) => s.status === "Inactive").length, color: "bg-gray-400" },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center flex-shrink-0`}>
              <span className="text-white font-extrabold text-sm">{value}</span>
            </div>
            <p className="text-xs font-semibold text-gray-500">{label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search by name, role or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#C8102E] focus:ring-2 focus:ring-[#C8102E]/10"
          />
        </div>
        <select
          value={deptFilter}
          onChange={(e) => setDeptFilter(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#C8102E] bg-white text-gray-700"
        >
          {depts.map((d) => <option key={d}>{d}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#f7f8fc] border-b border-gray-100">
                <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">#</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Staff Member</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Role</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide hidden md:table-cell">Department</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Phone</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Joined</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((s, i) => (
                <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3.5 text-gray-400 text-xs">{s.id}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-full ${avatarColors[i % avatarColors.length]} flex items-center justify-center text-xs font-bold text-white flex-shrink-0`}>
                        {s.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-[#1a1a2e] text-sm">{s.name}</p>
                        <p className="text-xs text-gray-400">{s.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-gray-600 font-medium text-sm">{s.role}</td>
                  <td className="px-5 py-3.5 hidden md:table-cell">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${deptColors[s.dept] || "bg-gray-100 text-gray-600"}`}>
                      {s.dept}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-gray-500 text-xs hidden lg:table-cell">{s.phone}</td>
                  <td className="px-5 py-3.5 text-gray-400 text-xs hidden lg:table-cell">{s.joined}</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColor[s.status]}`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <button className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500 transition-colors" title="Edit">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors" title="Delete">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-400 text-sm">No staff members found.</div>
          )}
        </div>
      </div>

      {/* Add Staff Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-extrabold text-[#1a1a2e]">Add Staff Member</h2>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setShowModal(false); }}>
              {[
                { label: "Full Name", name: "name", type: "text", placeholder: "Ramesh Kumar" },
                { label: "Email", name: "email", type: "email", placeholder: "ramesh@lakshya.ac.in" },
                { label: "Phone", name: "phone", type: "tel", placeholder: "+91 98765 43210" },
                { label: "Role / Designation", name: "role", type: "text", placeholder: "Centre Manager" },
              ].map(({ label, name, type, placeholder }) => (
                <div key={name}>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                    {label} <span className="text-[#C8102E]">*</span>
                  </label>
                  <input
                    type={type}
                    placeholder={placeholder}
                    value={form[name]}
                    onChange={(e) => setForm((p) => ({ ...p, [name]: e.target.value }))}
                    required
                    className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#C8102E] focus:ring-2 focus:ring-[#C8102E]/10"
                  />
                </div>
              ))}

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Department</label>
                <select
                  value={form.dept}
                  onChange={(e) => setForm((p) => ({ ...p, dept: e.target.value }))}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#C8102E] bg-white text-gray-700"
                >
                  <option value="">Select department</option>
                  {depts.filter((d) => d !== "All").map((d) => <option key={d}>{d}</option>)}
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 border border-gray-200 text-sm font-semibold text-gray-600 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#C8102E] text-white text-sm font-bold rounded-xl hover:bg-[#a50d25] transition-colors"
                >
                  Add Staff
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
