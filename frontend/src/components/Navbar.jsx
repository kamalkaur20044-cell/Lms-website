"use client";

import { useState } from "react";
import Link from "next/link";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Courses", href: "#courses" },
  { label: "About Us", href: "#about" },
  { label: "Faculty", href: "#faculty" },
  { label: "Results", href: "#results" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      {/* Top accent bar */}
      <div className="h-1 w-full yellow-bar" />

      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 leading-none">
            <span className="text-2xl font-extrabold tracking-tight">
              <span className="text-[#000]">Lakshya</span>
            </span>
            <p className="text-[10px] font-semibold text-[#C8102E] tracking-widest uppercase leading-none mt-0.5">
              IIT-JEE / NEET / Foundation
            </p>
          </Link>

          {/* Desktop nav links */}
          <ul className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-[#C8102E] rounded-md transition-colors duration-200 relative group"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#C8102E] group-hover:w-full transition-all duration-300 rounded" />
                </Link>
              </li>
            ))}
          </ul>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-semibold text-[#C8102E] border-2 border-[#C8102E] rounded-full hover:bg-[#C8102E] hover:text-white transition-all duration-200"
            >
              Login
            </Link>
            <Link
              href="/login"
              className="px-5 py-2 text-sm font-semibold text-white bg-[#C8102E] rounded-full hover:bg-[#a50d25] transition-all duration-200 shadow-md"
            >
              Enroll Now
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="lg:hidden p-2 rounded-md text-gray-700 hover:text-[#C8102E] hover:bg-gray-100 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile dropdown menu */}
        {menuOpen && (
          <div className="lg:hidden border-t border-gray-100 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="block px-4 py-2 text-sm font-medium text-gray-700 hover:text-[#C8102E] hover:bg-red-50 rounded-md transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col gap-2 px-4 pt-3 border-t border-gray-100">
              <Link
                href="/login"
                className="text-center py-2 text-sm font-semibold text-[#C8102E] border-2 border-[#C8102E] rounded-full hover:bg-[#C8102E] hover:text-white transition-all"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                href="/login"
                className="text-center py-2 text-sm font-semibold text-white bg-[#C8102E] rounded-full hover:bg-[#a50d25] transition-all"
                onClick={() => setMenuOpen(false)}
              >
                Enroll Now
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
