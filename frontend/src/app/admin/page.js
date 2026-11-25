"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { courseAPI, staffAPI, studentAPI, teacherAPI } from "@/services/api";

const stats = [
  { label: "Total Students", value: "1,284", change: "+12% this month", up: true, color: "bg-blue-500", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
  { label: "Active Courses", value: "9", change: "+2 this month", up: true, color: "bg-[#C8102E]", icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" },
  { label: "Faculty Members", value: "18", change: "No change", up: null, color: "bg-green-500", icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" },
  { label: "Staff Members", value: "8", change: "No change", up: null, color: "bg-[#1a1a2e]", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
];

const quickLinks = [
  { label: "Add Course", href: "/admin/courses", icon: "M12 4v16m8-8H4", color: "bg-[#C8102E]" },
  { label: "Add Faculty", href: "/admin/faculty", icon: "M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z", color: "bg-green-500" },
  { label: "Add Staff", href: "/admin/staff", icon: "M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z", color: "bg-[#1a1a2e]" },
  { label: "Assign Duties", href: "/admin/duty-schedule", icon: "M8 2v4m8-4v4M3 10h18M5 4h14a2 2 0 012 2v14H3V6a2 2 0 012-2z", color: "bg-indigo-500" },
  { label: "Upload Gallery", href: "/admin/gallery", icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z", color: "bg-indigo-500" },
];

const statLinks = {
  "Total Students": "/admin/students",
  "Active Courses": "/admin/courses",
  "Faculty Members": "/admin/faculty",
  "Staff Members": "/admin/staff",
};

const statusColor = {
  Active: "bg-green-100 text-green-700",
  Inactive: "bg-gray-100 text-gray-500",
};

export default function AdminDashboard() {
  const [students, setStudents] = useState([]);
  const [studentsLoading, setStudentsLoading] = useState(true);
  const [studentsError, setStudentsError] = useState(false);
  const [courses, setCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [coursesError, setCoursesError] = useState(false);
  const [teachers, setTeachers] = useState([]);
  const [teachersLoading, setTeachersLoading] = useState(true);
  const [teachersError, setTeachersError] = useState(false);
  const [staff, setStaff] = useState([]);
  const [staffLoading, setStaffLoading] = useState(true);
  const [staffError, setStaffError] = useState(false);

  useEffect(() => {
    let active = true;

    studentAPI.getAll()
      .then((response) => {
        if (!response.success || !Array.isArray(response.data)) {
          throw new Error(response.message || "Could not load students");
        }
        if (active) setStudents(response.data);
      })
      .catch((error) => {
        console.error("Failed to load recent students:", error);
        if (active) setStudentsError(true);
      })
      .finally(() => {
        if (active) setStudentsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const recentStudents = students.slice(0, 4);
  const recentCourses = [...courses]
    .sort((a, b) => Number(b.id) - Number(a.id))
    .slice(0, 5);

  useEffect(() => {
    let active = true;

    courseAPI.getAll()
      .then((response) => {
        if (!response.success || !Array.isArray(response.data)) {
          throw new Error(response.message || "Could not load courses");
        }
        if (active) setCourses(response.data);
      })
      .catch((error) => {
        console.error("Failed to load dashboard courses:", error);
        if (active) setCoursesError(true);
      })
      .finally(() => {
        if (active) setCoursesLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    Promise.allSettled([teacherAPI.getAll(), staffAPI.getAll()])
      .then(([teacherResult, staffResult]) => {
        if (teacherResult.status === "fulfilled" && teacherResult.value.success && Array.isArray(teacherResult.value.data)) {
          if (active) setTeachers(teacherResult.value.data);
        } else {
          console.error("Failed to load dashboard faculty count:", teacherResult.status === "rejected" ? teacherResult.reason : teacherResult.value.message);
          if (active) setTeachersError(true);
        }

        if (staffResult.status === "fulfilled" && staffResult.value.success && Array.isArray(staffResult.value.data)) {
          if (active) setStaff(staffResult.value.data);
        } else {
          console.error("Failed to load dashboard staff count:", staffResult.status === "rejected" ? staffResult.reason : staffResult.value.message);
          if (active) setStaffError(true);
        }
      })
      .finally(() => {
        if (active) {
          setTeachersLoading(false);
          setStaffLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const statValues = {
    "Total Students": studentsError ? "—" : studentsLoading ? "…" : students.length,
    "Active Courses": coursesError ? "—" : coursesLoading ? "…" : courses.filter((course) => course.status === "active").length,
    "Faculty Members": teachersError ? "—" : teachersLoading ? "…" : teachers.length,
    "Staff Members": staffError ? "—" : staffLoading ? "…" : staff.length,
  };

  const statDetails = {
    "Total Students": "Registered students",
    "Active Courses": "Available courses",
    "Faculty Members": "Teacher accounts",
    "Staff Members": "Staff accounts",
  };

  return (
    <div className="space-y-6">

      {/* Welcome bar */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-[#1a1a2e]">Welcome back, Admin</h1>
          <p className="text-sm text-gray-500 mt-0.5">Here's what's happening at Lakshya today.</p>
        </div>
        <span className="text-xs text-gray-400 bg-white border border-gray-200 px-3 py-1.5 rounded-full">
          Wed, Nov 11, 2026
        </span>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, color, icon }) => (
          <Link key={label} href={statLinks[label]} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col gap-3 transition-all hover:-translate-y-1 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8102E] focus-visible:ring-offset-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</p>
              <div className={`w-9 h-9 rounded-xl ${color} flex items-center justify-center`}>
                <svg className="w-4.5 h-4.5 w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-extrabold text-[#1a1a2e]">{statValues[label]}</p>
            <p className="text-xs font-medium text-gray-400">{statDetails[label]}</p>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {quickLinks.map(({ label, href, icon, color }) => (
            <Link
              key={label}
              href={href}
              className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col items-center gap-2 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-200 group"
            >
              <div className={`w-11 h-11 rounded-xl ${color} flex items-center justify-center`}>
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
                </svg>
              </div>
              <span className="text-xs font-semibold text-gray-600 group-hover:text-[#C8102E] transition-colors">{label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Tables row */}
      <div className="grid lg:grid-cols-2 gap-6">

        {/* Recent Students */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="font-bold text-[#1a1a2e] text-sm">Recent Students</h2>
            <Link href="/admin/students" className="text-xs text-[#C8102E] font-semibold hover:underline">View all</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {studentsLoading ? (
              <p className="px-5 py-8 text-center text-sm text-gray-400">Loading students...</p>
            ) : studentsError ? (
              <p role="alert" className="px-5 py-8 text-center text-sm text-gray-500">Could not load recent students.</p>
            ) : recentStudents.length ? recentStudents.map((student) => {
              const name = [student.first_name, student.last_name].filter(Boolean).join(" ");
              const status = (student.status || "inactive").toLowerCase();
              const joined = student.admission_date
                ? new Date(student.admission_date).toLocaleDateString()
                : "Admission date unavailable";

              return (
              <div key={student.id} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors">
                <div className="w-8 h-8 rounded-full bg-[#1a1a2e]/10 flex items-center justify-center text-xs font-bold text-[#1a1a2e] flex-shrink-0">
                  {name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#1a1a2e] truncate">{name}</p>
                  <p className="text-xs text-gray-400 truncate">{student.admission_number} · {joined}</p>
                </div>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${statusColor[status === "active" ? "Active" : "Inactive"]}`}>
                  {status === "active" ? "Active" : "Inactive"}
                </span>
              </div>
              );
            }) : (
              <p className="px-5 py-8 text-center text-sm text-gray-400">No students have been added yet.</p>
            )}
          </div>
        </div>

        {/* Recent Courses */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="font-bold text-[#1a1a2e] text-sm">Recent Courses</h2>
            <Link href="/admin/courses" className="text-xs text-[#C8102E] font-semibold hover:underline">View all</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {coursesLoading ? (
              <p className="px-5 py-8 text-center text-sm text-gray-400">Loading courses...</p>
            ) : coursesError ? (
              <p role="alert" className="px-5 py-8 text-center text-sm text-gray-500">Could not load recent courses.</p>
            ) : recentCourses.length ? recentCourses.map((course) => {
              const status = (course.status || "inactive").toLowerCase();
              const details = [course.duration, course.description].filter(Boolean).join(" · ");

              return (
                <div key={course.id} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors">
                  <div className="w-8 h-8 rounded-xl bg-[#C8102E]/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-[#C8102E]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#1a1a2e] truncate">{course.course_name}</p>
                    <p className="text-xs text-gray-400 truncate">{details || "Course details not provided"}</p>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${statusColor[status === "active" ? "Active" : "Inactive"]}`}>
                    {status === "active" ? "Active" : "Inactive"}
                  </span>
                </div>
              );
            }) : (
              <p className="px-5 py-8 text-center text-sm text-gray-400">No courses have been added yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
