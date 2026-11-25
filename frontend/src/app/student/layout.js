"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import LogoutModal from "@/components/LogoutModal";
import { useLogout } from "@/hooks/useLogout";
import Icon from "@/components/Icon";
import { icons } from "./icons";

const ALLOWED_ROLES = ["student", "admin"];

const navItems = [
  { label: "Dashboard", href: "/student/dashboard", icon: icons.home },
  { label: "My Courses", href: "/student/courses", icon: icons.book },
  { label: "Study Material", href: "/student/study-material", icon: icons.document },
  { label: "Test & Exams", href: "/student/tests", icon: icons.clipboardCheck },
  { label: "Analysis", href: "/student/analysis", icon: icons.chart },
  { label: "Student Support", href: "/student/support", icon: icons.support },
  { label: "Question Bank", href: "/student/question-bank", icon: icons.question },
  { label: "Class Schedule", href: "/student/schedule", icon: icons.calendar },
  { label: "Recorded Lectures", href: "/student/lectures", icon: icons.video },
  { label: "Attendance", href: "/student/attendance", icon: icons.clipboardCheck },
  { label: "Results", href: "/student/results", icon: icons.document },
  { label: "My Profile", href: "/student/profile", icon: icons.user },
];

function readUsername() {
  if (typeof window === "undefined") return "";
  try {
    return JSON.parse(localStorage.getItem("user") || "{}").username || "";
  } catch {
    return "";
  }
}

function readAdminPortalContext() {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  const studentId = params.get("studentId");
  if (params.get("adminView") !== "1" || !studentId) return null;

  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return user.role === "admin" ? { studentId } : null;
  } catch {
    return null;
  }
}

export default function StudentLayout({ children }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [username] = useState(readUsername);
  const [adminPortalContext, setAdminPortalContext] = useState(null);
  const { loggingOut, handleLogout } = useLogout();

  useEffect(() => {
    setAdminPortalContext(readAdminPortalContext());
  }, [pathname]);

  const current = navItems.find((item) => pathname.startsWith(item.href));
  const initial = (username || "S").charAt(0).toUpperCase();
  const portalQuery = adminPortalContext
    ? `?adminView=1&studentId=${encodeURIComponent(adminPortalContext.studentId)}`
    : "";

  return (
    <ProtectedRoute allowedRoles={ALLOWED_ROLES}>
      <div className="min-h-screen bg-[#f7f8fc] flex">
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        <aside
          className={`fixed top-0 left-0 h-screen w-64 flex-shrink-0 bg-[#1a1a2e] z-30 transition-transform duration-300
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:h-auto`}
        >
          <div className="h-full lg:h-screen lg:sticky lg:top-0 flex flex-col overflow-y-auto">
            <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
              <div className="w-9 h-9 rounded-xl bg-[#C8102E] flex items-center justify-center flex-shrink-0 text-white">
                <Icon d={icons.cap} strokeWidth={2} />
              </div>
              <div>
                <p className="text-white font-bold text-sm leading-tight">Lakshya Student</p>
                <p className="text-gray-400 text-xs">Student Portal</p>
              </div>
            </div>

            <nav className="flex-1 px-3 py-4 space-y-1">
              <p className="text-gray-500 text-xs font-semibold uppercase tracking-widest px-3 mb-3">Main Menu</p>
              {navItems.map(({ label, href, icon }) => {
                const active = pathname.startsWith(href);
                return (
                  <Link
                    key={href}
                    href={`${href}${portalQuery}`}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative
                      ${active ? "bg-[#C8102E] text-white shadow-md shadow-red-900/30" : "text-gray-400 hover:bg-white/5 hover:text-white"}`}
                  >
                    <Icon d={icon} className="w-5 h-5 flex-shrink-0" />
                    <span>{label}</span>
                    {active && <span className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#F5C518] rounded-l-full" />}
                  </Link>
                );
              })}
            </nav>

            <div className="px-3 py-4 border-t border-white/10 space-y-2">
              {adminPortalContext && (
                <Link
                  href="/admin"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-yellow-300 hover:bg-white/5 hover:text-white transition-all"
                >
                  <Icon d={icons.back} />
                  Back to Admin
                </Link>
              )}
              <Link
                href="/"
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:bg-white/5 hover:text-white transition-all"
              >
                <Icon d={icons.back} />
                Back to Website
              </Link>
              <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/5">
                <div className="w-8 h-8 rounded-full bg-[#C8102E] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {initial}
                </div>
                <div className="min-w-0">
                  <p className="text-white text-xs font-semibold truncate">{username || "Student"}</p>
                  <p className="text-gray-500 text-xs truncate">{adminPortalContext ? "Admin account" : "Student"}</p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <div className="flex-1 flex flex-col min-w-0">
          <header className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
            <div className="flex items-center justify-between px-4 sm:px-6 h-14">
              <button
                className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
                onClick={() => setSidebarOpen(true)}
                aria-label="Open sidebar"
              >
                <Icon d={icons.menu} strokeWidth={2} />
              </button>
              <p className="text-sm font-semibold text-gray-700 lg:ml-0 ml-2">{current?.label ?? "Student Portal"}</p>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-red-600 bg-red-50 hover:bg-[#C8102E] hover:text-white border border-red-200/80 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer"
                  aria-label="Logout"
                  title="Logout of session"
                >
                  <Icon d={icons.logout} />
                  <span>Logout</span>
                </button>
                <div className="w-8 h-8 rounded-full bg-[#C8102E] flex items-center justify-center text-white text-xs font-bold">
                  {initial}
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 p-4 sm:p-6 overflow-auto">{children}</main>
        </div>
      </div>
      <LogoutModal isOpen={loggingOut} />
    </ProtectedRoute>
  );
}
