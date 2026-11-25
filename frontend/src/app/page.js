"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroBanner from "@/components/HeroBanner";
import CourseCard from "@/components/CourseCard";
import { courseAPI, teacherAPI } from "@/services/api";

/* ─── Data ────────────────────────────────────────────────────── */
const API_ORIGIN = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/api\/?$/, "");

const categories = [
  {
    icon: "M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 19h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z",
    title: "IIT-JEE ",
    count: "2000+ Students",
    color: "bg-red-50",
    iconBg: "bg-[#C8102E]",
  },
  {
    icon: "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z",
    title: "NEET (UG)",
    count: "3200+ Students",
    color: "bg-green-50",
    iconBg: "bg-green-500",
  },
  {
    icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
    title: "Foundation (VIII–X)",
    count: "4100+ Students",
    color: "bg-blue-50",
    iconBg: "bg-blue-500",
  },
  {
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
    title: "Olympiad",
    count: "900+ Students",
    color: "bg-purple-50",
    iconBg: "bg-purple-500",
  },
  {
    icon: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2h-2",
    title: "Ncert",
    count: "1200+ Students",
    color: "bg-orange-50",
    iconBg: "bg-orange-500",
  },
];

const whyUs = [
  {
    icon: "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z",
    title: "Proven Track Record",
    desc: "1000+ IIT selections and 2000+ NEET qualifiers in the last decade. Our results speak for themselves.",
  },
  {
    icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
    title: "Expert Faculty",
    desc: "Learn from IITians, NITians, and doctors with 10–20 years of teaching experience in IIT-JEE and NEET.",
  },
  {
    icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4",
    title: "Structured Study Plan",
    desc: "Topic-wise daily practice problems, weekly tests, and monthly all-India mock exams with detailed analytics.",
  },
  {
    icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",
    title: "24/7 Doubt Resolution",
    desc: "Ask doubts anytime via our app or WhatsApp group. Faculty-monitored doubt sessions every evening.",
  },
  {
    icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
    title: "Performance Analytics",
    desc: "AI-powered student dashboard tracks your progress, rank prediction, and weak areas in real time.",
  },
  {
    icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    title: "Scholarship Programs",
    desc: "Up to 100% fee waiver for meritorious students. Apply through our annual Lakshya Scholarship Test.",
  },
];

const stats = [
  { value: "19+", label: "Years of Excellence", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
  { value: "50,000+", label: "Students Enrolled", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
  { value: "1,000+", label: "IIT Selections", icon: "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" },
  { value: "2,500+", label: "NEET Qualifiers", icon: "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" },
  { value: "5+", label: "City Branches", icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" },
];

function AnimatedStatValue({ value }) {
  const [count, setCount] = useState(0);
  const elementRef = useRef(null);
  const target = Number(value.replace(/[^\d]/g, ""));
  const suffix = value.replace(/[\d,]/g, "");

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    let animationFrame;
    let observer;
    const startCounting = () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setCount(target);
        return;
      }

      const duration = 1600;
      let startTime;
      const animate = (timestamp) => {
        if (startTime === undefined) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const easedProgress = 1 - (1 - progress) ** 3;
        setCount(Math.floor(target * easedProgress));
        if (progress < 1) animationFrame = requestAnimationFrame(animate);
      };
      animationFrame = requestAnimationFrame(animate);
    };

    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          observer.disconnect();
          startCounting();
        }
      }, { threshold: 0.35 });
      observer.observe(element);
    } else {
      startCounting();
    }

    return () => {
      observer?.disconnect();
      cancelAnimationFrame(animationFrame);
    };
  }, [target]);

  return <span ref={elementRef}>{count.toLocaleString("en-US")}{suffix}</span>;
}

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`Rating: ${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-3.5 h-3.5 ${star <= Math.floor(rating) ? "text-[#F5C518]" : "text-gray-300"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="ml-1 text-xs font-semibold text-gray-600">{rating}</span>
    </div>
  );
}

const courseRoadmaps = {
  "iit-jee": {
    name: "IIT-JEE (Mains & Adv)",
    steps: [
      { step: "01", title: "Concept Mastery", desc: "Core Class 11-12 fundamentals & derivations with senior IITian faculty." },
      { step: "02", title: "Daily DPP Drills", desc: "40+ multi-concept problem sets daily with same-day 1-on-1 doubt clearing." },
      { step: "03", title: "All-India CBT Series", desc: "Proctored full-syllabus mocks on exact NTA test screen interface." },
      { step: "04", title: "Rank Booster Sprints", desc: "Last 15 years PYQ mastery & AI-driven error elimination for top AIR." },
    ]
  },
  "neet": {
    name: "NEET (UG Medical)",
    steps: [
      { step: "01", title: "NCERT Line-by-Line", desc: "Complete NCERT Biology retention with daily diagram and labeling tests." },
      { step: "02", title: "Timed MCQ Practice", desc: "60–90 daily MCQs mastering Assertion-Reason & numerical shortcuts." },
      { step: "03", title: "720-Mark OMR Mocks", desc: "Full 200-min exam rehearsals with OMR bubbling speed management." },
      { step: "04", title: "Negative Score Control", desc: "Targeted error clinics and high-frequency revisions to cross 680+." },
    ]
  },
  "foundation": {
    name: "Class 9–10 Foundation",
    steps: [
      { step: "01", title: "Mental Ability & Basics", desc: "Strengthening logical reasoning, math aptitude, and school syllabus." },
      { step: "02", title: "Olympiad Thinking", desc: "Tackling non-routine higher-order thinking (HOTS) questions for NSO/IMO." },
      { step: "03", title: "Board Writing Mastery", desc: "Step-wise descriptive answer writing to guarantee 98%+ in board exams." },
      { step: "04", title: "Pre-Boards & Class 11 Primer", desc: "Full-length mock board rehearsals and early transition to senior concepts." },
    ]
  },
  "droppers": {
    name: "Repeater / Dropper",
    steps: [
      { step: "01", title: "360° Flaw Diagnostic", desc: "Identifying past attempt weak spots and rapid foundation reset." },
      { step: "02", title: "100+ Daily Sprints", desc: "High-intensity multi-chapter problem solving and zero backlog." },
      { step: "03", title: "Weekly National CBTs", desc: "Twice-weekly full mocks tracking strike rate and percentile growth." },
      { step: "04", title: "Rank Turnaround", desc: "Final 60-day scoring chapters sprint to secure a top national rank." },
    ]
  }
};

/* ─── Page ───── */
export default function Home() {
  const [courses, setCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [selectedTrack, setSelectedTrack] = useState("iit-jee");
  const [faculty, setFaculty] = useState([]);
  const [facultyLoading, setFacultyLoading] = useState(true);

  useEffect(() => {
    courseAPI.getPublic()
      .then((data) => {
        const activeCourses = data.success && Array.isArray(data.data)
          ? data.data.filter((course) => course.status === "active")
          : [];
        setCourses(activeCourses);
      })
      .catch(() => setCourses([]))
      .finally(() => setCoursesLoading(false));
  }, []);

  useEffect(() => {
    teacherAPI.getPublic()
      .then((response) => {
        if (!response.success || !Array.isArray(response.data)) {
          throw new Error(response.message || "Could not load faculty");
        }
        setFaculty(response.data);
      })
      .catch((error) => {
        console.error("Failed to load public faculty:", error);
        setFaculty([]);
      })
      .finally(() => setFacultyLoading(false));
  }, []);

  const facultyCarouselMaxWidth = faculty.length
    ? `calc(${Array(faculty.length).fill("min(18rem, 82vw) + 1.5rem").join(" + ")})`
    : undefined;

  return (
    <>
      <Navbar />

      <main>
        {/* ── 1. HERO BANNER CAROUSEL ─────────────────────── */}
        <HeroBanner />

        {/* ── 3. BROWSE BY CATEGORY ───────────────────────────── */}
        <section id="about" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-[#C8102E] font-semibold text-sm uppercase tracking-widest mb-2">
                Explore Our Programs
              </p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1a1a2e] section-title-underline">
                Browse by Category
              </h2>
              <p className="text-gray-500 mt-4 max-w-xl mx-auto">
                From school foundation to India's toughest competitive exams — we have a program tailored for every stage of your journey.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 max-w-4xl mx-auto">
              {categories.map(({ icon, title, count, color, iconBg }) => (
                <Link
                  href="#courses"
                  key={title}
                  className={`${color} rounded-2xl p-5 text-center card-hover group cursor-pointer`}
                >
                  <div className={`w-12 h-12 ${iconBg} rounded-xl flex items-center justify-center mx-auto mb-3 shadow-md group-hover:scale-110 transition-transform`}>
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
                    </svg>
                  </div>
                  <p className="font-bold text-[#1a1a2e] text-sm leading-tight">{title}</p>
                  <p className="text-xs text-gray-500 mt-1">{count}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── 4. COMPACT COURSE ROADMAP ──────────────────────────────── */}
        {(() => {
          const currentRoadmap = courseRoadmaps[selectedTrack] || courseRoadmaps["iit-jee"];
          return (
            <section className="py-10 bg-[#f7f8fc] border-y border-gray-100">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Compact Header */}
                <div className="text-center mb-6">
                  <p className="text-[#C8102E] font-bold text-xs uppercase tracking-widest mb-1">
                    Roadmap
                  </p>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1a1a2e]">
                    4-Step Preparation Roadmap
                  </h2>
                  <p className="text-gray-500 text-xs sm:text-sm mt-1 max-w-lg mx-auto">
                    Select your target course to view the step-by-step path to success.
                  </p>
                </div>

                {/* Course Selection Pills */}
                <div className="flex flex-wrap justify-center gap-2 mb-6">
                  {Object.entries(courseRoadmaps).map(([key, val]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSelectedTrack(key)}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                        selectedTrack === key
                          ? "bg-[#C8102E] text-white shadow-sm"
                          : "bg-white text-gray-700 border border-gray-200 hover:border-[#C8102E] hover:text-[#C8102E]"
                      }`}
                    >
                      {val.name}
                    </button>
                  ))}
                </div>

                {/* 4 Minimal Step Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                  {currentRoadmap.steps.map((st) => (
                    <div
                      key={st.step}
                      className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-sm hover:shadow-md hover:border-[#C8102E]/30 transition-all flex flex-col justify-between"
                    >
                      <div>
                        <span className="text-[11px] font-black px-2 py-0.5 rounded-md bg-red-50 text-[#C8102E] inline-block mb-2.5">
                          Step {st.step}
                        </span>
                        <h3 className="font-extrabold text-[#1a1a2e] text-sm">
                          {st.title}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                          {st.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </section>
          );
        })()}

        {/* ── 5. POPULAR COURSES ──────────────────────────────── */}
        <section id="courses" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-[#C8102E] font-semibold text-sm uppercase tracking-widest mb-2">
                Our Programs
              </p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1a1a2e] section-title-underline">
                Discover Popular Courses
              </h2>
              <p className="text-gray-500 mt-4 max-w-xl mx-auto">
                Handpicked by our academic board — these courses are designed for maximum rank improvement.
              </p>
            </div>

            {coursesLoading ? (
              <div className="text-center py-16">
                <div className="w-10 h-10 border-4 border-[#C8102E] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                <p className="text-gray-400 text-sm">Loading courses...</p>
              </div>
            ) : courses.length === 0 ? (
              <div className="text-center py-16">
                <svg className="w-12 h-12 text-gray-200 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <p className="text-gray-400 text-sm font-medium">No courses available yet.</p>
                <p className="text-gray-300 text-xs mt-1">Check back soon or contact us for more info.</p>
              </div>
            ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.slice(0, 3).map((c) => {
                const bookIcon = "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253";
                return (
                  <CourseCard key={c.id} course={c} />
                );
              })}
            </div>
            )}
            <div className="text-center mt-10">
              <Link
                href="/courses"
                className="inline-flex items-center gap-2 px-7 py-3 border-2 border-[#C8102E] text-[#C8102E] font-bold rounded-full hover:bg-[#C8102E] hover:text-white transition-all duration-200"
              >
                View All Courses
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* ── 6. WHY CHOOSE US ────────────────────────────────── */}
        <section id="results" className="py-20 bg-[#f7f8fc]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-[#C8102E] font-semibold text-sm uppercase tracking-widest mb-2">
                Our Strengths
              </p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1a1a2e] section-title-underline">
                Why Choose Lakshya?
              </h2>
              <p className="text-gray-500 mt-4 max-w-xl mx-auto">
                Thousands of top rankers chose Lakshya. Here's why we consistently outperform the competition.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {whyUs.map(({ icon, title, desc }) => (
                <div
                  key={title}
                  className="bg-white rounded-2xl p-6 shadow-sm card-hover group border border-transparent hover:border-[#C8102E]/20"
                >
                  <div className="w-12 h-12 bg-[#C8102E]/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#C8102E] transition-colors">
                    <svg
                      className="w-6 h-6 text-[#C8102E] group-hover:text-white transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={1.8}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
                    </svg>
                  </div>
                  <h3 className="font-bold text-[#1a1a2e] text-base mb-2">{title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 7. MEET OUR FACULTY ─────────────────────────────── */}
        <section id="faculty" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-[#C8102E] font-semibold text-sm uppercase tracking-widest mb-2">
                Expert Educators
              </p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1a1a2e] section-title-underline">
                Meet Our Faculty
              </h2>
              <p className="text-gray-500 mt-4 max-w-xl mx-auto">
                Meet the educators who guide our students through focused preparation and academic growth.
              </p>
            </div>

            <div className="rounded-3xl border border-gray-100 bg-gradient-to-b from-[#f7f8fc] to-white p-3 shadow-inner sm:p-5">
              <div
                className="faculty-carousel relative mx-auto w-full overflow-hidden rounded-2xl px-2 py-5 sm:px-3 sm:py-6"
                style={{ maxWidth: facultyCarouselMaxWidth }}
                role="region"
                aria-roledescription="carousel"
                aria-label="Meet Our Faculty"
                tabIndex={0}
              >
              {faculty.length > 0 ? (
                <div
                  className="faculty-carousel-track"
                  style={{ animationDuration: `${faculty.length * 9}s` }}
                >
                  {[0, 1].map((copy) => (
                    <div
                      key={`faculty-set-${copy}`}
                      className="flex shrink-0 items-stretch gap-6 pr-6"
                      aria-hidden={copy === 1}
                    >
                      {faculty.map((teacher) => {
                        const name = [teacher.first_name, teacher.last_name].filter(Boolean).join(" ");
                        const image = teacher.profile_image
                          ? (/^https?:\/\//i.test(teacher.profile_image)
                            ? teacher.profile_image
                            : `${API_ORIGIN}${teacher.profile_image}`)
                          : null;

                        return (
                          <div
                            key={`${teacher.id}-${copy}`}
                            className="w-72 max-w-[82vw] shrink-0 overflow-hidden rounded-2xl border border-white bg-white text-center shadow-[0_10px_28px_rgba(26,26,46,0.10)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_38px_rgba(26,26,46,0.16)] group"
                          >
                            <div className="relative flex h-44 items-center justify-center overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                              {image ? (
                                <Image
                                  src={image}
                                  alt={name}
                                  fill
                                  sizes="(min-width: 1024px) 280px, 82vw"
                                  unoptimized
                                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                              ) : (
                                <span className="text-4xl font-extrabold text-[#C8102E]/50" aria-hidden="true">
                                  {name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2)}
                                </span>
                              )}
                              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#1a1a2e]/20 to-transparent" />
                            </div>
                            <div className="px-5 pb-6 pt-4">
                              <h3 className="font-bold text-[#1a1a2e] text-base">{name}</h3>
                              {teacher.specialization && (
                                <p className="mt-1 text-xs font-semibold text-[#C8102E]">{teacher.specialization}</p>
                              )}
                              {teacher.years_experience != null && (
                                <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1.5 text-xs font-semibold text-gray-700">
                                  <svg className="w-3 h-3 text-[#C8102E]" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                  </svg>
                                  {teacher.years_experience} {Number(teacher.years_experience) === 1 ? "year" : "years"} Experience
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="py-10 text-center text-sm text-gray-500">
                  {facultyLoading ? "Loading faculty..." : "Faculty profiles will be displayed here soon."}
                </p>
              )}
                <span className="pointer-events-none absolute inset-y-0 left-0 z-10 w-6 bg-gradient-to-r from-[#f7f8fc] to-transparent sm:w-8" />
                <span className="pointer-events-none absolute inset-y-0 right-0 z-10 w-6 bg-gradient-to-l from-[#f7f8fc] to-transparent sm:w-8" />
              </div>
            </div>
          </div>
        </section>

        {/* ── 7.5. STATS ──────────────────────────────────────── */}
        <section className="py-16 bg-[#1a1a2e] relative overflow-hidden">
          {/* Decorative blobs */}
          <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-[#C8102E]/10 -translate-x-1/2 -translate-y-1/2 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-[#F5C518]/5 translate-x-1/2 translate-y-1/2 blur-3xl" />

          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Heading */}
            <div className="text-center mb-10">
              <p className="text-[#F5C518] font-semibold text-sm uppercase tracking-widest mb-2">By the Numbers</p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Lakshya's Impact Across India
              </h2>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {stats.map(({ value, label, icon }) => (
                <div
                  key={label}
                  className="group flex flex-col items-center text-center bg-white/5 border border-white/10 rounded-2xl px-4 py-7 hover:bg-white/10 hover:border-[#C8102E]/50 transition-all duration-300"
                >
                  <div className="w-11 h-11 rounded-xl bg-[#C8102E]/20 group-hover:bg-[#C8102E] flex items-center justify-center mb-4 transition-colors">
                    <svg className="w-5 h-5 text-[#C8102E] group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
                    </svg>
                  </div>
                  <p className="text-3xl font-extrabold text-[#F5C518] leading-none"><AnimatedStatValue value={value} /></p>
                  <p className="text-xs text-gray-400 mt-2 font-medium leading-tight">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 8. TESTIMONIALS ─────────────────────────────────── */}
        <section className="py-20 bg-[#f7f8fc]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-[#C8102E] font-semibold text-sm uppercase tracking-widest mb-2">
                Success Stories
              </p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1a1a2e] section-title-underline">
                What Our Students Say
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  name: "Arjun Mehta",
                  rank: "AIR 243 — IIT-JEE Advanced",
                  quote:
                    "Lakshya's structured approach and dedicated faculty changed everything for me. The daily practice problems and mock tests were exactly what I needed to crack JEE Advanced.",
                  initials: "AM",
                  color: "bg-[#C8102E]",
                },
                {
                  name: "Sneha Patel",
                  rank: "AIR 115 — NEET UG",
                  quote:
                    "The biology faculty at Lakshya is phenomenal. NCERT-focused teaching and MCQ banks helped me score 715/720 in NEET. Forever grateful to my mentors here.",
                  initials: "SP",
                  color: "bg-green-600",
                },
                {
                  name: "Rahul Singh",
                  rank: "AIR 512 — IIT-JEE Mains",
                  quote:
                    "I joined Lakshya in Class 11 and it was the best decision of my life. The doubt resolution sessions and personal mentoring kept me on track throughout.",
                  initials: "RS",
                  color: "bg-[#1a1a2e]",
                },
              ].map(({ name, rank, quote, initials, color }) => (
                <div key={name} className="bg-white rounded-2xl p-6 shadow-sm card-hover border border-gray-100 relative">
                  <svg className="w-8 h-8 text-[#C8102E]/15 absolute top-4 right-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-11 h-11 ${color} rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                      {initials}
                    </div>
                    <div>
                      <p className="font-bold text-[#1a1a2e] text-sm">{name}</p>
                      <p className="text-xs text-[#C8102E] font-semibold">{rank}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed italic">&ldquo;{quote}&rdquo;</p>
                  <div className="mt-3">
                    <StarRating rating={5} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 9. CTA BANNER ───────────────────────────────────── */}
        <section id="contact" className="py-20 bg-gradient-to-br from-[#C8102E] via-red-700 to-[#1a1a2e] relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #F5C518 0%, transparent 50%), radial-gradient(circle at 80% 20%, #fff 0%, transparent 40%)" }} />
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 text-white text-sm font-semibold rounded-full border border-white/20 mb-6">
              <svg className="w-4 h-4 text-[#F5C518]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Trusted by 50,000+ Students
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight mb-4">
              Master the Skills to<br />
              <span className="text-[#F5C518]">Drive Your Career</span>
            </h2>
            <p className="text-red-100 text-lg max-w-2xl mx-auto mb-8">
              Your IIT or NEET dream is one decision away. Enroll today and get access to expert faculty,
              a structured study plan, and a community of achievers.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/login"
                className="px-8 py-4 bg-[#F5C518] text-[#1a1a2e] font-extrabold rounded-full text-base hover:bg-yellow-400 transition-all duration-200 shadow-xl hover:-translate-y-0.5"
              >
                Enroll Now — Free Counselling
              </Link>
              <Link
                href="#courses"
                className="px-8 py-4 bg-white/10 text-white font-bold rounded-full text-base border border-white/30 hover:bg-white/20 transition-all duration-200"
              >
                Browse Courses
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap justify-center gap-6 mt-10">
              {[
                " 1000+ IIT Selections",
                " 2500+ NEET Qualifiers",
                " 4.9/5 Student Rating",
                "19 Years of Excellence",
              ].map((badge) => (
                <span key={badge} className="text-sm text-white/80 font-medium">
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
