"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/* ─── Data ─────────────────────────────────────────────────── */

const filters = ["All", "IIT-JEE", "NEET", "Foundation", "Crash Course", "Online"];

const courses = [
  {
    id: 1,
    category: "IIT-JEE",
    badge: "Most Popular",
    badgeColor: "bg-[#C8102E] text-white",
    title: "IIT-JEE Mains Complete Course",
    desc: "Comprehensive Physics, Chemistry & Maths coverage with 500+ hours of live classes, DPPs, and a full test series.",
    duration: "12 Months",
    students: "2,840",
    classes: "500+ Hours",
    tests: "40 Mock Tests",
    rating: 4.9,
    mode: "Offline + Online",
    gradient: "from-[#C8102E] to-red-700",
    tag: "bg-red-100 text-[#C8102E]",
    icon: "M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 19h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z",
  },
  {
    id: 2,
    category: "IIT-JEE",
    badge: "Top Rated",
    badgeColor: "bg-[#F5C518] text-[#1a1a2e]",
    title: "IIT-JEE Advanced Intensive",
    desc: "Advanced problem-solving, 20-year paper analysis, and mentoring from IITians targeting Rank under 500.",
    duration: "8 Months",
    students: "1,520",
    classes: "350+ Hours",
    tests: "30 Mock Tests",
    rating: 4.8,
    mode: "Offline",
    gradient: "from-[#1a1a2e] to-blue-800",
    tag: "bg-blue-100 text-blue-700",
    icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
  },
  {
    id: 3,
    category: "NEET",
    badge: "High Demand",
    badgeColor: "bg-green-500 text-white",
    title: "NEET (UG) Target Batch",
    desc: "Biology, Physics & Chemistry for NEET with NCERT-focused strategy, MCQ banks & weekly mock exams.",
    duration: "12 Months",
    students: "3,210",
    classes: "480+ Hours",
    tests: "45 Mock Tests",
    rating: 4.9,
    mode: "Offline + Online",
    gradient: "from-green-600 to-green-800",
    tag: "bg-green-100 text-green-700",
    icon: "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z",
  },
  {
    id: 4,
    category: "Foundation",
    badge: "New Batch",
    badgeColor: "bg-indigo-500 text-white",
    title: "Foundation Program (Class VIII–X)",
    desc: "Build strong Maths & Science fundamentals for competitive exams. Includes Olympiad & NTSE preparation.",
    duration: "10 Months",
    students: "4,120",
    classes: "400+ Hours",
    tests: "25 Mock Tests",
    rating: 4.7,
    mode: "Offline",
    gradient: "from-indigo-500 to-indigo-700",
    tag: "bg-indigo-100 text-indigo-700",
    icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
  },
  {
    id: 5,
    category: "Crash Course",
    badge: "Fast Track",
    badgeColor: "bg-purple-500 text-white",
    title: "JEE Crash Course (60 Days)",
    desc: "Rapid revision of high-weightage topics, 30 full-length mocks, and daily doubt-clearing sessions.",
    duration: "2 Months",
    students: "980",
    classes: "120+ Hours",
    tests: "30 Mock Tests",
    rating: 4.6,
    mode: "Offline + Online",
    gradient: "from-purple-500 to-purple-700",
    tag: "bg-purple-100 text-purple-700",
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
  },
  {
    id: 6,
    category: "Crash Course",
    badge: "Fast Track",
    badgeColor: "bg-purple-500 text-white",
    title: "NEET Crash Course (45 Days)",
    desc: "Last-mile NEET preparation covering all high-yield NCERT topics, MCQ practice, and revision strategies.",
    duration: "45 Days",
    students: "860",
    classes: "90+ Hours",
    tests: "20 Mock Tests",
    rating: 4.6,
    mode: "Offline + Online",
    gradient: "from-pink-500 to-pink-700",
    tag: "bg-pink-100 text-pink-700",
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
  },
  {
    id: 7,
    category: "Online",
    badge: "Flexible",
    badgeColor: "bg-teal-500 text-white",
    title: "JEE Online Self-Paced Batch",
    desc: "Study at your own pace with 600+ recorded lectures, unlimited test attempts, and live weekly doubt sessions.",
    duration: "Lifetime Access",
    students: "1,250",
    classes: "600+ Videos",
    tests: "Unlimited Tests",
    rating: 4.7,
    mode: "Online",
    gradient: "from-teal-500 to-teal-700",
    tag: "bg-teal-100 text-teal-700",
    icon: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2h-2",
  },
  {
    id: 8,
    category: "Online",
    badge: "Flexible",
    badgeColor: "bg-teal-500 text-white",
    title: "NEET Online Self-Paced Batch",
    desc: "800+ recorded lectures, chapter-wise MCQ banks, and full-length mock tests with detailed performance analytics.",
    duration: "Lifetime Access",
    students: "1,100",
    classes: "800+ Videos",
    tests: "Unlimited Tests",
    rating: 4.7,
    mode: "Online",
    gradient: "from-orange-500 to-orange-700",
    tag: "bg-orange-100 text-orange-700",
    icon: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2h-2",
  },
  {
    id: 9,
    category: "NEET",
    badge: "Repeater Batch",
    badgeColor: "bg-rose-500 text-white",
    title: "NEET Repeater Batch",
    desc: "Specially designed for NEET repeaters — focused revision, weakpoint analysis, and intensive mock drill.",
    duration: "8 Months",
    students: "720",
    classes: "300+ Hours",
    tests: "35 Mock Tests",
    rating: 4.8,
    mode: "Offline",
    gradient: "from-rose-500 to-rose-700",
    tag: "bg-rose-100 text-rose-700",
    icon: "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z",
  },
];

/* ─── Star Rating ───────────────────────────────────────────── */
function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} className={`w-3.5 h-3.5 ${s <= Math.floor(rating) ? "text-[#F5C518]" : "text-gray-200"}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="ml-1 text-xs font-semibold text-gray-500">{rating}</span>
    </div>
  );
}

/* ─── Page ─────────────────────────────────────────────────── */
export default function CoursesPage() {
  const [active, setActive] = useState("All");

  const filtered = active === "All" ? courses : courses.filter((c) => c.category === active);

  return (
    <>
      <Navbar />

      <main>

        {/* ── BREADCRUMB ───────────────────────────────── */}
        <section className="bg-[#f7f8fc]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
            <nav className="flex items-center gap-2 text-sm" aria-label="Breadcrumb">
              <Link href="/" className="text-gray-500 hover:text-[#C8102E] transition-colors font-medium">
                Home
              </Link>
              <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-[#C8102E] font-semibold">Courses</span>
            </nav>
            <p className="hidden sm:block text-xs text-gray-400 font-medium tracking-wide uppercase">
              IIT-JEE · NEET · Foundation
            </p>
          </div>
        </section>

        {/* ── HEADING + FILTERS ────────────────────────── */}
        <section className="bg-[#f7f8fc] pt-10 pb-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            <div className="text-center mb-8">
              <p className="text-[#C8102E] font-semibold text-sm uppercase tracking-widest mb-2">
                All Programs
              </p>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1a1a2e] section-title-underline">
                Our Courses
              </h1>
              <p className="text-gray-500 mt-4 max-w-xl mx-auto">
                From school foundation to India's toughest competitive exams — find the right program for your goal.
              </p>
            </div>

            {/* Filter tabs */}
            <div className="flex flex-wrap justify-center gap-2">
              {filters.map((f) => (
                <button
                  key={f}
                  onClick={() => setActive(f)}
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                    active === f
                      ? "bg-[#C8102E] text-white shadow-md shadow-red-200"
                      : "bg-white text-gray-600 border border-gray-200 hover:border-[#C8102E] hover:text-[#C8102E]"
                  }`}
                >
                  {f}
                  {f !== "All" && (
                    <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${active === f ? "bg-white/20" : "bg-gray-100"}`}>
                      {courses.filter((c) => c.category === f).length}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Result count */}
            <p className="text-center text-xs text-gray-400 mt-4">
              Showing {filtered.length} {filtered.length === 1 ? "course" : "courses"}
              {active !== "All" ? ` in ${active}` : ""}
            </p>
          </div>
        </section>

        {/* ── COURSE CARDS ─────────────────────────────── */}
        <section className="py-10 bg-[#f7f8fc]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((c) => (
                <article
                  key={c.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm card-hover border border-gray-100 group flex flex-col"
                >
                  {/* Card header */}
                  <div className={`h-36 bg-gradient-to-br ${c.gradient} flex items-center justify-center relative overflow-hidden`}>
                    <div className="absolute top-0 right-0 w-28 h-28 rounded-full bg-white/10 translate-x-8 -translate-y-8" />
                    <div className="absolute bottom-0 left-0 w-20 h-20 rounded-full bg-white/5 -translate-x-6 translate-y-6" />
                    <svg className="w-14 h-14 text-white opacity-90 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={c.icon} />
                    </svg>
                    {/* Badge */}
                    <span className={`absolute top-3 left-3 px-2.5 py-1 text-xs font-bold rounded-full ${c.badgeColor}`}>
                      {c.badge}
                    </span>
                    {/* Mode tag */}
                    <span className="absolute bottom-3 right-3 px-2.5 py-1 text-xs font-semibold bg-black/30 text-white rounded-full backdrop-blur-sm">
                      {c.mode}
                    </span>
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    {/* Category pill */}
                    <span className={`inline-block self-start px-2.5 py-0.5 text-xs font-semibold rounded-full mb-2 ${c.tag}`}>
                      {c.category}
                    </span>

                    <h2 className="font-bold text-[#1a1a2e] text-base leading-snug mb-1 group-hover:text-[#C8102E] transition-colors">
                      {c.title}
                    </h2>
                    <p className="text-xs text-gray-500 leading-relaxed mb-4 flex-1">{c.desc}</p>

                    {/* Stats row */}
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      {[
                        { icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", val: c.duration },
                        { icon: "M15 10l4.553-2.069A1 1 0 0121 8.82V15.18a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z", val: c.classes },
                        { icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2", val: c.tests },
                      ].map(({ icon, val }) => (
                        <div key={val} className="bg-gray-50 rounded-xl p-2 text-center">
                          <svg className="w-3.5 h-3.5 text-[#C8102E] mx-auto mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
                          </svg>
                          <p className="text-xs text-gray-600 font-medium leading-tight">{val}</p>
                        </div>
                      ))}
                    </div>

                    {/* Rating + Students */}
                    <div className="flex items-center justify-between mb-4">
                      <StarRating rating={c.rating} />
                      <span className="text-xs text-gray-400">{c.students} students</span>
                    </div>

                    {/* CTA */}
                    <Link
                      href="/contact"
                      className="block text-center py-2.5 bg-[#C8102E] text-white text-sm font-bold rounded-xl hover:bg-[#a50d25] transition-colors"
                    >
                      Enroll Now
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            {/* Empty state */}
            {filtered.length === 0 && (
              <div className="text-center py-20">
                <p className="text-gray-400 text-sm">No courses found for this filter.</p>
              </div>
            )}
          </div>
        </section>

        {/* ── BOTTOM STRIP ─────────────────────────────── */}
        <section className="py-12 bg-[#1a1a2e]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-5">
            <div>
              <h2 className="text-xl font-extrabold text-white">
                Not sure which course is right for you?
              </h2>
              <p className="text-gray-400 text-sm mt-1">
                Our counsellors will help you pick the perfect program — free of charge.
              </p>
            </div>
            <Link
              href="/contact"
              className="flex-shrink-0 px-7 py-3 bg-[#F5C518] text-[#1a1a2e] font-bold rounded-full hover:bg-yellow-400 transition-colors shadow-lg whitespace-nowrap"
            >
              Free Counselling
            </Link>
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}
