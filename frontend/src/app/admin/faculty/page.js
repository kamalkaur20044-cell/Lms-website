"use client";

import { useState } from "react";

const statusColor = {
  active: "bg-green-100 text-green-700",
  inactive: "bg-gray-100 text-gray-500",
};

const emptyForm = {
  username: "", password: "", employee_id: "", first_name: "", last_name: "",
  phone: "", email: "", qualification: "", specialization: "",
  joining_date: "", status: "active",
};

export default function FacultyPage() {
  const [teachers, setTeachers] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.username.trim()) e.username = "Required";
    if (!form.password.trim()) e.password = "Required";
    else if (form.password.length < 6) e.password = "Minimum 6 characters";
    if (!form.employee_id.trim()) e.employee_id = "Required";
    if (!form.first_name.trim()) e.first_name = "Required";
    if (!form.phone.trim()) e.phone = "Required";
    else if (!/^\d{10}$/.test(form.phone)) e.phone = "Must be exactly 10 digits";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setTeachers((prev) => [...prev, { ...form, id: prev.length + 1 }]);
    setForm(emptyForm);
    setErrors({});
    setShowModal(false);
  };

  const handleDelete = (id) => setTeachers((prev) => prev.filter((t) => t.id !== id));

  const filtered = teachers.filter((t) => {
    const name = `${t.first_name} ${t.last_name}`.toLowerCase();
    return name.includes(search.toLowerCase()) ||
      t.employee_id.toLowerCase().includes(search.toLowerCase()) ||
      t.specialization.toLowerCase().includes(search.toLowerCase()) ||
      t.email.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-[#1a1a2e]">Teachers (Faculty)</h1>
          <p className="text-sm text-gray-500">{filtered.length} of {teachers.length} teachers</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 bg-[#C8102E] text-white text-sm font-bold rounded-xl hover:bg-[#a50d25] transition-colors self-start sm:self-auto">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
          Add Teacher
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input type="text" placeholder="Search by name, employee ID, specialization..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#C8102E] focus:ring-2 focus:ring-[#C8102E]/10" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#f7f8fc] border-b border-gray-100">
                {["#", "Emp. ID", "Teacher", "Username", "Phone", "Email", "Qualification", "Specialization", "Joining Date", "Status", "Actions"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3.5 text-gray-400 text-xs">{t.id}</td>
                  <td className="px-4 py-3.5 font-mono text-xs font-semibold text-[#C8102E]">{t.employee_id}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#1a1a2e]/10 flex items-center justify-center text-xs font-bold text-[#1a1a2e] flex-shrink-0">
                        {t.first_name.charAt(0)}
                      </div>
                      <p className="font-semibold text-[#1a1a2e] whitespace-nowrap">{t.first_name} {t.last_name}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-gray-500 text-xs font-mono">{t.username}</td>
                  <td className="px-4 py-3.5 text-gray-600 text-xs whitespace-nowrap">{t.phone}</td>
                  <td className="px-4 py-3.5 text-gray-600 text-xs">{t.email}</td>
                  <td className="px-4 py-3.5 text-gray-600 text-xs">{t.qualification}</td>
                  <td className="px-4 py-3.5 text-gray-600 text-xs max-w-[160px] truncate">{t.specialization}</td>
                  <td className="px-4 py-3.5 text-gray-500 text-xs whitespace-nowrap">{t.joining_date}</td>
                  <td className="px-4 py-3.5">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${statusColor[t.status]}`}>{t.status}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <button className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500 transition-colors" title="Edit">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      </button>
                      <button onClick={() => handleDelete(t.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors" title="Delete">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-16">
              <svg className="w-12 h-12 text-gray-200 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
              <p className="text-gray-400 text-sm font-medium">No teachers yet</p>
              <p className="text-gray-300 text-xs mt-1">Click "Add Teacher" to get started</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Teacher Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-extrabold text-[#1a1a2e]">Add Teacher</h2>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="bg-[#f7f8fc] rounded-xl p-3 mb-4">
                <p className="text-xs font-semibold text-gray-600 mb-2">Login Credentials</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Username", name: "username", type: "text", placeholder: "rajesh_sharma" },
                    { label: "Password", name: "password", type: "password", placeholder: "Create password" },
                  ].map(({ label, name, type, placeholder }) => (
                    <div key={name}>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">{label}<span className="text-[#C8102E] ml-0.5">*</span></label>
                      <input type={type} placeholder={placeholder} value={form[name]}
                        onChange={(e) => { 
                          setForm((p) => ({ ...p, [name]: e.target.value })); 
                          setErrors((p) => ({ ...p, [name]: "" })); 
                        }}
                        className={`w-full px-3 py-2 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C8102E]/10 ${errors[name] ? "border-red-400" : "border-gray-200 focus:border-[#C8102E]"}`} />
                      {errors[name] && <p className="text-xs text-red-500 mt-0.5">{errors[name]}</p>}
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Employee ID", name: "employee_id", type: "text", placeholder: "TCH-001" },
                  { label: "First Name", name: "first_name", type: "text", placeholder: "Rajesh" },
                  { label: "Last Name", name: "last_name", type: "text", placeholder: "Sharma" },
                  { label: "Phone", name: "phone", type: "text", placeholder: "9876543210" },
                  { label: "Email", name: "email", type: "email", placeholder: "rajesh@lakshya.ac.in" },
                  { label: "Qualification", name: "qualification", type: "text", placeholder: "Ph.D. Physics" },
                  { label: "Joining Date", name: "joining_date", type: "date", placeholder: "" },
                ].map(({ label, name, type, placeholder }) => (
                  <div key={name}>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">{label}{["employee_id","first_name","phone"].includes(name) && <span className="text-[#C8102E] ml-0.5">*</span>}</label>
                    <input type={type} placeholder={placeholder} value={form[name]}
                      onChange={(e) => { 
                        const val = name === "phone" ? e.target.value.replace(/\D/g, "").slice(0, 10) : e.target.value;
                        setForm((p) => ({ ...p, [name]: val })); 
                        setErrors((p) => ({ ...p, [name]: "" })); 
                      }}
                      className={`w-full px-3 py-2 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C8102E]/10 ${errors[name] ? "border-red-400" : "border-gray-200 focus:border-[#C8102E]"}`} />
                    {errors[name] && <p className="text-xs text-red-500 mt-0.5">{errors[name]}</p>}
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Specialization</label>
                <input type="text" placeholder="IIT-JEE & NEET Physics" value={form.specialization}
                  onChange={(e) => setForm((p) => ({ ...p, specialization: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#C8102E] focus:ring-2 focus:ring-[#C8102E]/10" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Status</label>
                <select value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#C8102E] bg-white text-gray-700">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 border border-gray-200 text-sm font-semibold text-gray-600 rounded-xl hover:bg-gray-50 transition-colors">Cancel</button>
                <button type="submit"
                  className="flex-1 py-2.5 bg-[#C8102E] text-white text-sm font-bold rounded-xl hover:bg-[#a50d25] transition-colors">Add Teacher</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
