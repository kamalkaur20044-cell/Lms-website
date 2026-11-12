"use client";

import { useState, useEffect } from "react";
import { courseAPI } from "@/services/api";

const statusColor = {
  active: "bg-green-100 text-green-700",
  inactive: "bg-gray-100 text-gray-500",
};

const emptyForm = {
  course_name: "", description: "", duration: "", status: "active",
};

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const data = await courseAPI.getAll();
      if (data.success) {
        setCourses(data.data);
      } else {
        setApiError(data.message || "Failed to load courses");
      }
    } catch {
      setApiError("Network error. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    const e = {};
    if (!form.course_name.trim()) e.course_name = "Required";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSubmitting(true);
    setApiError("");
    try {
      const data = await courseAPI.create(form);
      if (data.success) {
        setForm(emptyForm);
        setErrors({});
        setShowModal(false);
        fetchCourses();
      } else {
        setApiError(data.message || "Failed to create course");
      }
    } catch {
      setApiError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this course?")) return;
    try {
      const data = await courseAPI.delete(id);
      if (data.success) {
        setCourses((prev) => prev.filter((c) => c.id !== id));
      } else {
        alert(data.message || "Failed to delete course");
      }
    } catch {
      alert("Network error. Please try again.");
    }
  };

  const filtered = courses.filter((c) => {
    const matchSearch = c.course_name?.toLowerCase().includes(search.toLowerCase()) ||
      c.description?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-[#1a1a2e]">Courses</h1>
          <p className="text-sm text-gray-500">{filtered.length} of {courses.length} courses</p>
        </div>
        <button onClick={() => { setShowModal(true); setApiError(""); }} className="flex items-center gap-2 px-4 py-2 bg-[#C8102E] text-white text-sm font-bold rounded-xl hover:bg-[#a50d25] transition-colors self-start sm:self-auto">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
          Add Course
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input type="text" placeholder="Search by course name or description..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#C8102E] focus:ring-2 focus:ring-[#C8102E]/10" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#C8102E] bg-white text-gray-700">
          <option>All</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="text-center py-16">
            <div className="w-8 h-8 border-4 border-[#C8102E] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-gray-400 text-sm">Loading courses...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#f7f8fc] border-b border-gray-100">
                  {["#", "Course Name", "Description", "Duration", "Status", "Created At", "Actions"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3.5 text-gray-400 text-xs">{c.id}</td>
                    <td className="px-4 py-3.5 font-semibold text-[#1a1a2e] max-w-[200px]">{c.course_name}</td>
                    <td className="px-4 py-3.5 text-gray-500 text-xs max-w-[220px] truncate">{c.description}</td>
                    <td className="px-4 py-3.5 text-gray-600 text-xs whitespace-nowrap">{c.duration}</td>
                    <td className="px-4 py-3.5">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${statusColor[c.status]}`}>{c.status}</span>
                    </td>
                    <td className="px-4 py-3.5 text-gray-400 text-xs whitespace-nowrap">{c.created_at?.split("T")[0]}</td>
                    <td className="px-4 py-3.5">
                      <button onClick={() => handleDelete(c.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors" title="Delete">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-16">
                <svg className="w-12 h-12 text-gray-200 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                <p className="text-gray-400 text-sm font-medium">No courses yet</p>
                <p className="text-gray-300 text-xs mt-1">Click "Add Course" to get started</p>
              </div>
            )}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-extrabold text-[#1a1a2e]">Add Course</h2>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {apiError && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">{apiError}</div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Course Name <span className="text-[#C8102E]">*</span></label>
                <input type="text" placeholder="IIT-JEE Mains Complete Course" value={form.course_name}
                  onChange={(e) => { setForm((p) => ({ ...p, course_name: e.target.value })); setErrors((p) => ({ ...p, course_name: "" })); }}
                  className={`w-full px-3 py-2 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C8102E]/10 ${errors.course_name ? "border-red-400" : "border-gray-200 focus:border-[#C8102E]"}`} />
                {errors.course_name && <p className="text-xs text-red-500 mt-0.5">{errors.course_name}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Description</label>
                <textarea rows={3} placeholder="Course description..." value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#C8102E] resize-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Duration</label>
                <input type="text" placeholder="12 Months" value={form.duration}
                  onChange={(e) => setForm((p) => ({ ...p, duration: e.target.value }))}
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
                <button type="submit" disabled={submitting}
                  className="flex-1 py-2.5 bg-[#C8102E] text-white text-sm font-bold rounded-xl hover:bg-[#a50d25] transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
                  {submitting ? "Saving..." : "Add Course"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
