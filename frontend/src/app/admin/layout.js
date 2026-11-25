"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useLogout } from "@/hooks/useLogout";
import { employeeDutyScheduleAPI, studentAPI } from "@/services/api";
import { FaArrowLeft } from "react-icons/fa6";
import EmployeeDashboard from "@/components/EmployeeDashboard";
import StudentDashboard   from "@/app/student/dashboard/page";
import StudentCourses     from "@/app/student/courses/page";
import StudentMaterial    from "@/app/student/study-material/page";
import StudentSchedule    from "@/app/student/schedule/page";
import StudentLectures    from "@/app/student/lectures/page";
import StudentAttendance  from "@/app/student/attendance/page";
import StudentResults     from "@/app/student/results/page";
import StudentProfile     from "@/app/student/profile/page";

const navItems = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
  },
  {
    label: "Students",
    href: "/admin/students",
    icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
  },
  {
    label: "Results",
    href: "/admin/results",
    icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 14l2 2 4-4",
  },
  {
    label: "Courses",
    href: "/admin/courses",
    icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
  },
  {
    label: "Staff",
    href: "/admin/staff",
    icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zM5 3a2 2 0 00-2 2v1",
  },
  {
    label: "Faculty",
    href: "/admin/faculty",
    icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10",
  },
  {
    label: "Gallery",
    href: "/admin/gallery",
    icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z",
  },
  {
    label: "Hero Banners",
    href: "/admin/hero-banners",
    icon: "M4 6h16M4 12h16M4 18h16M7 3v18m10-18v18",
  },
  {
    label: "Duty Schedules",
    href: "/admin/duty-schedule",
    icon: "M8 2v4m8-4v4M3 10h18M5 4h14a2 2 0 012 2v14H3V6a2 2 0 012-2zm3 10h3m-3 4h5",
  },
];

const previewIcons = {
  home: navItems[0].icon,
  students: navItems[1].icon,
  results: navItems[2].icon,
  courses: navItems[3].icon,
  staff: navItems[4].icon,
  faculty: navItems[5].icon,
  gallery: navItems[6].icon,
  banners: navItems[7].icon,
  dutySchedules: navItems[8].icon,
  profile: "M20 21a8 8 0 00-16 0m8-10a4 4 0 100-8 4 4 0 000 8z",
  attendance: "M8 2v4m8-4v4M3 10h18M5 4h14a2 2 0 012 2v14H3V6a2 2 0 012-2zm3 10h3m-3 4h8",
  schedule: "M12 6v6l4 2m5-2a9 9 0 11-18 0 9 9 0 0118 0z",
  documents: "M7 3h7l5 5v13H7a2 2 0 01-2-2V5a2 2 0 012-2zm7 0v5h5m-9 5h5m-5 4h5",
  announcements: "M11 5l6-3v20l-6-3H5a2 2 0 01-2-2v-8a2 2 0 012-2h6zm0 0v14m-5 0l2 5h4l-2-5",
  help: "M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-4 4v-4z",
  upload: "M12 16V4m0 0L7 9m5-5l5 5M4 16v4h16v-4",
  settings: "M12 8a4 4 0 100 8 4 4 0 000-8zm8 4a8 8 0 00-.1-1.2l2-1.5-2-3.5-2.4 1a8 8 0 00-2.1-1.2L15 3h-4l-.4 2.6a8 8 0 00-2.1 1.2l-2.4-1-2 3.5 2 1.5a8 8 0 000 2.4l-2 1.5 2 3.5 2.4-1a8 8 0 002.1 1.2L11 21h4l.4-2.6a8 8 0 002.1-1.2l2.4 1 2-3.5-2-1.5A8 8 0 0020 12z",
};

const teacherPreviewSections = [
  { title: "Overview", items: [{ id: "dashboard",     label: "Dashboard",        icon: previewIcons.home }] },
  {
    title: "My Work",
    items: [
      { id: "profile",       label: "My Profile",       icon: previewIcons.profile },
      { id: "attendance",    label: "Attendance",        icon: previewIcons.attendance },
      { id: "results",       label: "Results",           icon: previewIcons.results },
      { id: "leave",         label: "Leave Management",  icon: previewIcons.schedule },
      { id: "schedule",      label: "Duty Schedule",     icon: previewIcons.schedule },
      { id: "documents",     label: "My Documents",      icon: previewIcons.documents },
    ],
  },
  {
    title: "Communication",
    items: [
      { id: "announcements", label: "Announcements",  icon: previewIcons.announcements },
      { id: "help",          label: "HR Help Desk",   icon: previewIcons.help },
      { id: "content",       label: "Content Upload", icon: previewIcons.upload },
    ],
  },
  { title: "Preferences", items: [{ id: "settings", label: "Settings", icon: previewIcons.settings }] },
];

// staff has same sections as teacher (no "results" tab, filtered inside EmployeeDashboard)
const staffPreviewSections = teacherPreviewSections;

const roleMenuSections = {
  admin: [{ title: "", items: navItems }],
  student: [{
    title: "",
    items: [
      { id: "dashboard", label: "Dashboard",         icon: previewIcons.home },
      { id: "courses",   label: "My Courses",        icon: previewIcons.courses },
      { id: "material",  label: "Study Material",    icon: previewIcons.documents },
      { id: "schedule",  label: "Class Schedule",    icon: previewIcons.schedule },
      { id: "lectures",  label: "Recorded Lectures", icon: previewIcons.documents },
      { id: "attendance",label: "Attendance",        icon: previewIcons.attendance },
      { id: "results",   label: "Results",           icon: previewIcons.results },
      { id: "profile",   label: "My Profile",        icon: previewIcons.profile },
    ],
  }],
  teacher: teacherPreviewSections,
  staff:   staffPreviewSections,
};

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [previewRole, setPreviewRole] = useState("admin");
  const [previewSection, setPreviewSection] = useState("dashboard");
  const [students, setStudents] = useState([]);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [studentsError, setStudentsError] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [previewEmployees, setPreviewEmployees] = useState([]);
  const [previewEmployeeId, setPreviewEmployeeId] = useState("");
  const [previewEmployeesLoading, setPreviewEmployeesLoading] = useState(false);
  const [previewEmployeesError, setPreviewEmployeesError] = useState("");
  const { loggingOut, handleLogout } = useLogout();
  const isPreviewingRole = previewRole !== "admin";

  useEffect(() => {
    if (previewRole !== "student") return undefined;
    let active = true;
    setStudentsLoading(true);
    setStudentsError("");

    studentAPI.getAll()
      .then((response) => {
        if (!response.success || !Array.isArray(response.data)) {
          throw new Error(response.message || "Could not load students");
        }
        if (active) setStudents(response.data);
      })
      .catch((error) => {
        console.error("Failed to load students for portal access:", error);
        if (active) setStudentsError("Could not load students. Please try again.");
      })
      .finally(() => {
        if (active) setStudentsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [previewRole]);

  useEffect(() => {
    if (previewRole !== "teacher" && previewRole !== "staff") return undefined;
    let active = true;
    setPreviewEmployeesLoading(true);
    setPreviewEmployeesError("");

    employeeDutyScheduleAPI.getAll()
      .then((response) => {
        if (!response.success || !Array.isArray(response.data)) {
          throw new Error(response.message || "Could not load employees");
        }
        if (!active) return;
        const roleEmployees = response.data.filter((employee) =>
          employee.employee_type === previewRole && employee.status === "active"
        );
        setPreviewEmployees(roleEmployees);
        setPreviewEmployeeId((current) =>
          roleEmployees.some((employee) => String(employee.id) === current)
            ? current
            : String(roleEmployees[0]?.id || "")
        );
      })
      .catch((error) => {
        if (active) setPreviewEmployeesError(error.message || "Could not load employees");
      })
      .finally(() => {
        if (active) setPreviewEmployeesLoading(false);
      });

    return () => {
      active = false;
    };
  }, [previewRole]);

  const handleRoleChange = (role) => {
    setPreviewRole(role);
    setPreviewSection("dashboard");
    setSelectedStudentId("");
  };

  const rolePills = [
    { value: "admin",   label: "Admin"   },
    { value: "student", label: "Student" },
    { value: "teacher", label: "Teacher" },
    { value: "staff",   label: "Staff"   },
  ];

  const previewRoleLabel = rolePills.find((r) => r.value === previewRole)?.label ?? previewRole;

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="min-h-screen bg-[#f7f8fc] flex">

      {/* ── Sidebar ──────────────────────────────────── */}
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-[#1a1a2e] z-30 flex flex-col transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen`}
      >
        {/* Logo area */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
          <div className="w-9 h-9 rounded-xl bg-[#C8102E] flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-tight">Lakshya Admin</p>
            <p className="text-gray-400 text-xs">Control Panel</p>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">

          {/* ── Role Switcher ── */}
          <p className="px-1 pb-2 text-[10px] font-semibold uppercase tracking-widest text-gray-500">
            View As
          </p>
          <div className="mb-4 grid grid-cols-2 gap-1.5">
            {rolePills.map(({ value, label }) => {
              const isActive = previewRole === value;
              return (
                <button
                  key={value}
                  onClick={() => handleRoleChange(value)}
                  title={`Preview ${label} dashboard`}
                  className={`flex items-center gap-1.5 px-2 py-2 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer
                    ${isActive
                      ? "bg-[#C8102E] text-white shadow-md shadow-red-900/40 ring-1 ring-[#C8102E]"
                      : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10"
                    }`}
                >
                  <span className="truncate">{label}</span>
                  {isActive && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#F5C518] flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
          {previewRole === "student" && (
            <div className="mb-3">
              <label htmlFor="portal-student" className="sr-only">Choose student</label>
              <select
                id="portal-student"
                value={selectedStudentId}
                onChange={(event) => setSelectedStudentId(event.target.value)}
                disabled={studentsLoading || Boolean(studentsError)}
                className="w-full rounded-lg border border-white/10 bg-[#25253a] px-3 py-2 text-sm text-white focus:border-[#F5C518] focus:outline-none focus:ring-2 focus:ring-[#F5C518]/30 disabled:opacity-60"
              >
                <option value="">
                  {studentsLoading
                    ? "Loading students..."
                    : studentsError
                      ? "Students unavailable"
                      : students.length
                        ? "Choose a student"
                        : "No students found"}
                </option>
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.first_name} {student.last_name} · {student.admission_number}
                  </option>
                ))}
              </select>
              {studentsError && <p role="alert" className="mt-2 px-1 text-xs text-red-300">{studentsError}</p>}
            </div>
          )}
          {(previewRole === "teacher" || previewRole === "staff") && (
            <div className="mb-3">
              <label htmlFor="portal-employee" className="sr-only">Choose employee</label>
              <select
                id="portal-employee"
                value={previewEmployeeId}
                onChange={(event) => setPreviewEmployeeId(event.target.value)}
                disabled={previewEmployeesLoading || Boolean(previewEmployeesError) || !previewEmployees.length}
                className="w-full rounded-lg border border-white/10 bg-[#25253a] px-3 py-2 text-sm text-white focus:border-[#F5C518] focus:outline-none focus:ring-2 focus:ring-[#F5C518]/30 disabled:opacity-60"
              >
                <option value="">
                  {previewEmployeesLoading
                    ? "Loading employees..."
                    : previewEmployeesError
                      ? "Employees unavailable"
                      : previewEmployees.length
                        ? "Choose an employee"
                        : "No active employees"}
                </option>
                {previewEmployees.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.first_name} {employee.last_name || ""} · {employee.employee_id}
                  </option>
                ))}
              </select>
              {previewEmployeesError && <p role="alert" className="mt-2 px-1 text-xs text-red-300">{previewEmployeesError}</p>}
            </div>
          )}
          {roleMenuSections[previewRole].map(({ title, items }, sectionIndex) => (
            <div key={title || sectionIndex} className={sectionIndex ? "mt-4" : ""}>
              {title && (
                <p className="px-3 pb-2 pt-1 text-[10px] font-semibold uppercase tracking-widest text-gray-500">
                  {title}
                </p>
              )}
              <div className="space-y-1">
                {items.map(({ id, label, href, icon, badge }) => {
                  const isActive = !isPreviewingRole && pathname === href;
                  const isPreviewActive = isPreviewingRole && previewSection === id;
                  const className = `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative w-full text-left
                    ${isActive || isPreviewActive
                      ? "bg-[#C8102E] text-white shadow-md shadow-red-900/30"
                      : "text-gray-400 hover:bg-white/5 hover:text-white"
                    }`;
                  const content = (
                    <>
                      <svg className="w-4.5 h-4.5 w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
                      </svg>
                      <span>{label}</span>
                      {badge && (
                        <span className="ml-auto rounded-full bg-[#F5C518] px-1.5 py-0.5 text-xs font-bold text-[#1a1a2e]">
                          {badge}
                        </span>
                      )}
                      {(isActive || isPreviewActive) && (
                        <span className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#F5C518] rounded-l-full" />
                      )}
                    </>
                  );

                  // Preview roles — clickable buttons that switch content section
                  if (isPreviewingRole) {
                    return (
                      <button
                        key={label}
                        onClick={() => { setPreviewSection(id); setSidebarOpen(false); }}
                        className={className}
                      >
                        {content}
                      </button>
                    );
                  }

                  // Admin — normal links
                  return (
                    <Link
                      key={label}
                      href={href}
                      onClick={() => setSidebarOpen(false)}
                      className={className}
                    >
                      {content}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom — back to site */}
        <div className="px-3 py-4 border-t border-white/10 space-y-2">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:bg-white/5 hover:text-white transition-all"
          >
            <FaArrowLeft/>
            Back to Website
          </Link>
          <button
            onClick={handleLogout}
            className=" w-full p-2 rounded-xl text-sm font-semibold text-red-300 bg-transparent hover:bg-[#C8102E] hover:text-white border border-red-500/20 hover:border-[#C8102E] transition-all duration-200 shadow-xs group cursor-pointer">
            Logout Account
          </button>
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/5">
            <div className="w-8 h-8 rounded-full bg-[#C8102E] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              A
            </div>
            <div className="min-w-0">
              <p className="text-white text-xs font-semibold truncate">Admin</p>
              <p className="text-gray-500 text-xs truncate">admin@lakshya.ac.in</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main area ────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top bar */}
        <header className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between px-4 sm:px-6 h-14">
            {/* Mobile hamburger */}
            <button
              className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Page title from pathname */}
            <p className="text-sm font-semibold text-gray-700 capitalize lg:ml-0 ml-2">
              {pathname === "/admin"
                ? "Dashboard"
                : pathname.split("/").pop().replace(/-/g, " ")}
            </p>

            <div className="flex items-center gap-3">
              {/* Notification bell */}
              <button className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors" aria-label="Notifications">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#C8102E] rounded-full" />
              </button>

              {/* Logout button */}
              <button 
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-red-600 bg-red-50 hover:bg-[#C8102E] hover:text-white border border-red-200/80 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer" 
                aria-label="Logout"
                title="Logout of session"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Logout</span>
              </button>

              {/* Avatar */}
              <div className="w-8 h-8 rounded-full bg-[#C8102E] flex items-center justify-center text-white text-xs font-bold">
                A
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          {!isPreviewingRole ? (
            /* Normal admin content */
            <div className="p-4 sm:p-6">{children}</div>

          ) : previewRole === "student" && !selectedStudentId ? (
            /* Student pill but no student chosen yet */
            <div className="flex flex-col items-center justify-center h-full min-h-[60vh] gap-4 text-center px-6">
              <div className="w-16 h-16 rounded-2xl bg-[#1a1a2e] flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p className="text-gray-800 font-semibold text-base">Select a student to preview</p>
                <p className="text-gray-400 text-sm mt-1">Choose a student from the sidebar to view their portal.</p>
              </div>
            </div>

          ) : previewRole === "student" ? (
            /* Student — render the right page component based on previewSection */
            <div className="p-4 sm:p-6">
              {previewSection === "dashboard"  && <StudentDashboard  studentId={selectedStudentId} />}
              {previewSection === "courses"    && <StudentCourses    studentId={selectedStudentId} />}
              {previewSection === "material"   && <StudentMaterial />}
              {previewSection === "schedule"   && <StudentSchedule />}
              {previewSection === "lectures"   && <StudentLectures />}
              {previewSection === "attendance" && <StudentAttendance />}
              {previewSection === "results"    && <StudentResults    studentId={selectedStudentId} />}
              {previewSection === "profile"    && <StudentProfile    studentId={selectedStudentId} />}
            </div>

          ) : previewRole === "teacher" ? (
            /* Teacher — EmployeeDashboard content only, section controlled by sidebar */
            <div className="p-4 sm:p-6">
              <EmployeeDashboard
                key={`teacher-${previewSection}`}
                allowedRoles={["teacher", "admin"]}
                noLayout
                defaultSection={previewSection}
                scheduleEmployeeType="teacher"
                scheduleEmployeeId={previewEmployeeId}
              />
            </div>

          ) : previewRole === "staff" ? (
            /* Staff — same as teacher without results tab */
            <div className="p-4 sm:p-6">
              <EmployeeDashboard
                key={`staff-${previewSection}`}
                allowedRoles={["staff", "admin"]}
                noLayout
                defaultSection={previewSection}
                scheduleEmployeeType="staff"
                scheduleEmployeeId={previewEmployeeId}
              />
            </div>

          ) : null}
        </main>
      </div>
      </div>
    </ProtectedRoute>
  );
}
