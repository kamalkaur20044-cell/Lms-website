"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CourseCard from "@/components/CourseCard";
import { courseAPI } from "@/services/api";

const bookIcon = "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253";

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await courseAPI.getPublic();
        if (data.success) {
          const activeCourses = Array.isArray(data.data)
            ? data.data.filter((course) => course.status === "active")
            : [];
          setCourses(activeCourses);
        } else {
          setCourses([]);
        }
      } catch {
        setCourses([]);
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
                {filtered.map((course) => (
                  <CourseCard key={course.id} course={course} />
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
