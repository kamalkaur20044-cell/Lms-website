"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { courseAPI } from "@/services/api";

const gradients = [
  "from-[#C8102E] to-red-700",
  "from-[#1a1a2e] to-blue-800",
  "from-green-600 to-green-800",
  "from-indigo-500 to-indigo-700",
  "from-purple-500 to-purple-700",
  "from-teal-500 to-teal-700",
  "from-orange-500 to-orange-700",
  "from-pink-500 to-pink-700",
  "from-rose-500 to-rose-700",
];

const bookIcon = "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253";

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

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await courseAPI.getPublic();
        if (data.success) {
          setCourses(data.data.filter((c) => c.status === "active"));
        }
      } catch {
        // Backend not reachable
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const filtered = courses.filter((c) =>
    c.course_name?.toLowerCase().includes(search.toLowerCase()) ||
    c.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Navbar />

      <main>

        {/* Breadcrumb */}
        <section className="bg-[#f7f8fc]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
            <nav className="flex items-center gap-2 text-sm" aria-label="Breadcrumb">
              <Link href="/" className="text-gray-500 hover:text-[#C8102E] transition-colors font-medium">Home</Link>
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

        {/* Heading + Search */}
        <section className="bg-[#f7f8fc] pt-10 pb-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <p className="text-[#C8102E] font-semibold text-sm uppercase tracking-widest mb-2">All Programs</p>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1a1a2e] section-title-underline">Our Courses</h1>
              <p className="text-gray-500 mt-4 max-w-xl mx-auto">
                From school foundation to India's toughest competitive exams — find the right program for your goal.
              </p>
            </div>

            {/* Search */}
            <div className="max-w-md mx-auto relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search courses..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#C8102E] focus:ring-2 focus:ring-[#C8102E]/10 bg-white"
              />
            </div>

            <p className="text-center text-xs text-gray-400 mt-4">
              Showing {filtered.length} {filtered.length === 1 ? "course" : "courses"}
            </p>
          </div>
        </section>

        {/* Course Cards */}
        <section className="py-10 bg-[#f7f8fc]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            {loading ? (
              <div className="text-center py-24">
                <div className="w-10 h-10 border-4 border-[#C8102E] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-400 text-sm">Loading courses...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-24">
                <svg className="w-14 h-14 text-gray-200 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={bookIcon} />
                </svg>
                <p className="text-gray-400 font-medium">
                  {search ? "No courses match your search." : "No courses available yet."}
                </p>
                {search && (
                  <button onClick={() => setSearch("")} className="mt-3 text-sm text-[#C8102E] font-semibold hover:underline">
                    Clear search
                  </button>
                )}
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((c, i) => (
                  <article key={c.id}
                    className="bg-white rounded-2xl overflow-hidden shadow-sm card-hover border border-gray-100 group flex flex-col">

                    {/* Card header */}
                    <div className={`h-36 bg-gradient-to-br ${gradients[i % gradients.length]} flex items-center justify-center relative overflow-hidden`}>
                      <div className="absolute top-0 right-0 w-28 h-28 rounded-full bg-white/10 translate-x-8 -translate-y-8" />
                      <div className="absolute bottom-0 left-0 w-20 h-20 rounded-full bg-white/5 -translate-x-6 translate-y-6" />
                      <svg className="w-14 h-14 text-white opacity-90 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d={bookIcon} />
                      </svg>
                      <span className="absolute top-3 left-3 px-2.5 py-1 text-xs font-bold rounded-full bg-white/20 text-white backdrop-blur-sm">
                        Active
                      </span>
                      {c.duration && (
                        <span className="absolute bottom-3 right-3 px-2.5 py-1 text-xs font-semibold bg-black/30 text-white rounded-full backdrop-blur-sm">
                          {c.duration}
                        </span>
                      )}
                    </div>

                    <div className="p-5 flex flex-col flex-1">
                      <h2 className="font-bold text-[#1a1a2e] text-base leading-snug mb-2 group-hover:text-[#C8102E] transition-colors">
                        {c.course_name}
                      </h2>

                      {c.description && (
                        <p className="text-xs text-gray-500 leading-relaxed mb-4 flex-1">{c.description}</p>
                      )}

                      {/* Duration */}
                      {c.duration && (
                        <div className="flex items-center gap-2 mb-4 text-xs text-gray-500">
                          <svg className="w-4 h-4 text-[#C8102E]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="font-medium">{c.duration}</span>
                        </div>
                      )}

                      <StarRating rating={4.8} />

                      <Link href="/contact"
                        className="mt-4 block text-center py-2.5 bg-[#C8102E] text-white text-sm font-bold rounded-xl hover:bg-[#a50d25] transition-colors">
                        Enroll Now
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Bottom strip */}
        <section className="py-12 bg-[#1a1a2e]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-5">
            <div>
              <h2 className="text-xl font-extrabold text-white">Not sure which course is right for you?</h2>
              <p className="text-gray-400 text-sm mt-1">Our counsellors will help you pick the perfect program — free of charge.</p>
            </div>
            <Link href="/contact"
              className="flex-shrink-0 px-7 py-3 bg-[#F5C518] text-[#1a1a2e] font-bold rounded-full hover:bg-yellow-400 transition-colors shadow-lg whitespace-nowrap">
              Free Counselling
            </Link>
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}
