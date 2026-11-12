"use client";

import { useState } from "react";
import Link from "next/link";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Courses", href: "/courses" },
  { label: "Results", href: "/results" },
  { label: "Scholarship", href: "/scholarship" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
  { label: "About Us", href: "/about" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      {/* Top accent bar */}
      <div className="h-1 w-full yellow-bar" />

      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <img
              src="images/logo.png"
              alt="Lakshya — IIT-JEE / NEET / Foundation"
              className="h-16 w-auto object-contain"
            />
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
            <a
              href="tel:+919823300034"
              className="flex items-center gap-2 bg-[#1a1a2e] hover:bg-[#C8102E] text-white px-4 py-2.5 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span className="text-sm font-bold">Call Us</span>
            </a>
            <Link
              href="/login"
              className="px-5 py-2.5 text-sm font-bold text-white bg-[#C8102E] rounded-xl hover:bg-[#a50d25] transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Login
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
            <div className="px-4 pt-3 border-t border-gray-100 space-y-2">
              <a
                href="tel:+919823300034"
                className="flex items-center gap-3 px-4 py-2.5 bg-red-50 border border-[#C8102E]/20 rounded-xl text-[#C8102E] font-semibold text-sm"
                onClick={() => setMenuOpen(false)}
              >
                <span className="w-7 h-7 rounded-full bg-[#C8102E] flex items-center justify-center flex-shrink-0">
                  <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </span>
                +91 98233-00034
              </a>
              <Link
                href="/login"
                className="block text-center py-2.5 text-sm font-bold text-white bg-[#C8102E] rounded-full hover:bg-[#a50d25] transition-all"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
