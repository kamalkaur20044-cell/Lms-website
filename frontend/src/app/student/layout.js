"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import Icon from "@/components/Icon";
import { icons } from "./icons";

const ALLOWED_ROLES = ["student"];

const navItems = [
  { label: "Dashboard", href: "/student/dashboard", icon: icons.home },
  { label: "My Courses", href: "/student/courses", icon: icons.book },
  { label: "Study Material", href: "/student/study-material", icon: icons.document },
  { label: "Class Schedule", href: "/student/schedule", icon: icons.calendar },
  { label: "Recorded Lectures", href: "/student/lectures", icon: icons.video },
  { label: "Attendance", href: "/student/attendance", icon: icons.clipboardCheck },
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

export default function StudentLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [username] = useState(readUsername);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  const current = navItems.find((item) => pathname.startsWith(item.href));
  const initial = (username || "S").charAt(0).toUpperCase();

  return (
    <ProtectedRoute allowedRoles={ALLOWED_ROLES}>
      <div className="min-h-screen bg-[#f7f8fc] flex">
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        <aside
          className={`fixed top-0 left-0 h-screen w-64 bg-[#1a1a2e] z-30 flex flex-col transition-transform duration-300
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen`}
        >
          <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
            <div className="w-9 h-9 rounded-xl bg-[#C8102E] flex items-center justify-center flex-shrink-0 text-white">
              <Icon d={icons.cap} strokeWidth={2} />
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-tight">Lakshya Student</p>
              <p className="text-gray-400 text-xs">Student Portal</p>
            </div>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            <p className="text-gray-500 text-xs font-semibold uppercase tracking-widest px-3 mb-3">Main Menu</p>
            {navItems.map(({ label, href, icon }) => {
              const active = pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
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
            <Link
              href="/"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:bg-white/5 hover:text-white transition-all"
            >
              <Icon d={icons.back} />
              Back to Website
            </Link>
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-all"
            >
              <Icon d={icons.logout} />
              Logout
            </button>
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/5">
              <div className="w-8 h-8 rounded-full bg-[#C8102E] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {initial}
              </div>
              <div className="min-w-0">
                <p className="text-white text-xs font-semibold truncate">{username || "Student"}</p>
                <p className="text-gray-500 text-xs truncate">Student</p>
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
                  onClick={logout}
                  className="p-2 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                  aria-label="Logout"
                  title="Logout"
                >
                  <Icon d={icons.logout} />
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
    </ProtectedRoute>
  );
}
