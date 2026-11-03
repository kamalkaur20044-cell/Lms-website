import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroBanner from "@/components/HeroBanner";

/* ─── Data ────────────────────────────────────────────────────── */

const categories = [
  {
    icon: "M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 19h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z",
    title: "IIT-JEE Mains",
    count: "2800+ Students",
    color: "bg-red-50",
    iconBg: "bg-[#C8102E]",
  },
  {
    icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
    title: "IIT-JEE Advanced",
    count: "1500+ Students",
    color: "bg-yellow-50",
    iconBg: "bg-[#F5C518]",
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
    title: "Crash Courses",
    count: "900+ Students",
    color: "bg-purple-50",
    iconBg: "bg-purple-500",
  },
  {
    icon: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2h-2",
    title: "Online Batches",
    count: "1200+ Students",
    color: "bg-orange-50",
    iconBg: "bg-orange-500",
  },
];

const courses = [
  {
    badge: "Most Popular",
    badgeColor: "bg-[#C8102E]",
    title: "IIT-JEE Mains Complete Course",
    desc: "Comprehensive Physics, Chemistry & Maths coverage with 500+ hours of live classes, DPPs, and full test series.",
    duration: "12 Months",
    students: "2,840",
    rating: 4.9,
    category: "IIT-JEE",
    tagColor: "bg-red-100 text-[#C8102E]",
    icon: "M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 19h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z",
    iconBg: "from-red-400 to-[#C8102E]",
  },
  {
    badge: "Top Rated",
    badgeColor: "bg-[#F5C518] text-[#1a1a2e]",
    title: "IIT-JEE Advanced Intensive",
    desc: "Advanced problem-solving, past 20-year paper analysis, and mentoring from IITians for Rank < 500.",
    duration: "8 Months",
    students: "1,520",
    rating: 4.8,
    category: "IIT-JEE Advanced",
    tagColor: "bg-yellow-100 text-yellow-700",
    icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
    iconBg: "from-yellow-400 to-yellow-600",
  },
  {
    badge: "High Demand",
    badgeColor: "bg-green-500",
    title: "NEET (UG) Target Batch",
    desc: "Biology, Physics & Chemistry for NEET with NCERT-focused strategy, MCQ banks & weekly mock exams.",
    duration: "12 Months",
    students: "3,210",
    rating: 4.9,
    category: "NEET",
    tagColor: "bg-green-100 text-green-700",
    icon: "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z",
    iconBg: "from-green-400 to-green-600",
  },
  {
    badge: "New Batch",
    badgeColor: "bg-blue-500",
    title: "Foundation Program (Class VIII–X)",
    desc: "Build strong Maths & Science fundamentals for competitive exams. Includes Olympiad & NTSE prep.",
    duration: "10 Months",
    students: "4,120",
    rating: 4.7,
    category: "Foundation",
    tagColor: "bg-blue-100 text-blue-700",
    icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
    iconBg: "from-blue-400 to-blue-600",
  },
  {
    badge: "Fast Track",
    badgeColor: "bg-purple-500",
    title: "JEE Crash Course (60 Days)",
    desc: "Rapid revision of high-weightage topics, 30 full-length mocks, and daily doubt clearing sessions.",
    duration: "2 Months",
    students: "980",
    rating: 4.6,
    category: "Crash Course",
    tagColor: "bg-purple-100 text-purple-700",
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
    iconBg: "from-purple-400 to-purple-600",
  },
  {
    badge: "Flexible",
    badgeColor: "bg-orange-500",
    title: "NEET Online Self-Paced Batch",
    desc: "Study at your own pace with 800+ recorded lectures, unlimited test attempts, and live doubt sessions.",
    duration: "Lifetime Access",
    students: "1,250",
    rating: 4.7,
    category: "Online",
    tagColor: "bg-orange-100 text-orange-700",
    icon: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2h-2",
    iconBg: "from-orange-400 to-orange-600",
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

const faculty = [
  {
    name: "Dr. Rajesh Sharma",
    subject: "Physics — IIT-JEE & NEET",
    exp: "18 years",
    qual: "IIT Delhi, Ph.D.",
    initials: "RS",
    color: "from-[#C8102E] to-red-700",
  },
  {
    name: "Prof. Anil Kumar",
    subject: "Mathematics — IIT-JEE",
    exp: "15 years",
    qual: "IIT Bombay, M.Tech",
    initials: "AK",
    color: "from-[#1a1a2e] to-blue-800",
  },
  {
    name: "Dr. Priya Verma",
    subject: "Biology — NEET",
    exp: "12 years",
    qual: "AIIMS Delhi, MBBS",
    initials: "PV",
    color: "from-green-600 to-green-800",
  },
  {
    name: "Mr. Suresh Gupta",
    subject: "Chemistry — IIT-JEE & NEET",
    exp: "14 years",
    qual: "IIT Kanpur, M.Sc.",
    initials: "SG",
    color: "from-[#F5C518] to-yellow-600",
  },
];

const stats = [
  { value: "19+", label: "Years of Excellence" },
  { value: "50,000+", label: "Students Enrolled" },
  { value: "1,000+", label: "IIT Selections" },
  { value: "2,500+", label: "NEET Qualifiers" },
];

/* ─── Star Rating ────────────────────────────────────────────── */
function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`Rating: ${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((s) => (
        <svg
          key={s}
          className={`w-3.5 h-3.5 ${s <= Math.floor(rating) ? "text-[#F5C518]" : "text-gray-300"}`}
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

/* ─── Page ───────────────────────────────────────────────────── */
export default function Home() {
  return (
    <>
      <Navbar />

      <main>
        {/* ── 1. HERO BANNER CAROUSEL ─────────────────────── */}
        <HeroBanner />

        {/* ── 2. STATS STRIP ──────────────────────────────────── */}
        <section className="bg-gradient-to-r from-[#C8102E] to-red-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-0">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/20">
              {stats.map(({ value, label }, i) => (
                <div key={label} className="flex flex-col items-center justify-center py-6 px-4 gap-1 relative group hover:bg-white/10 transition-colors">
                  <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">{value}</p>
                  <p className="text-xs sm:text-sm text-red-100 font-medium text-center">{label}</p>
                  {/* bottom accent line on hover */}
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-[#F5C518] group-hover:w-2/3 transition-all duration-300 rounded-full" />
                </div>
              ))}
            </div>
          </div>
        </section>

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

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
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

        {/* ── 4. FEATURE BANNERS ──────────────────────────────── */}
        <section className="py-10 bg-[#f7f8fc]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-6">
            {/* Banner 1 — red */}
            <div className="bg-gradient-to-r from-[#C8102E] to-red-700 rounded-3xl p-8 flex items-center gap-6 overflow-hidden relative">
              <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white/10" />
              <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full bg-white/5" />
              <div className="flex-shrink-0 w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                </svg>
              </div>
              <div className="relative z-10">
                <h3 className="text-xl font-extrabold text-white leading-snug">
                  Transform Your<br />Path to IIT &amp; NEET
                </h3>
                <p className="text-red-100 text-sm mt-1 mb-3">
                  Structured learning that gets results.
                </p>
                <Link href="#courses" className="inline-block bg-white text-[#C8102E] text-xs font-bold px-4 py-2 rounded-full hover:bg-red-50 transition-colors">
                  View Programs →
                </Link>
              </div>
            </div>

            {/* Banner 2 — yellow/navy */}
            <div className="bg-gradient-to-r from-[#1a1a2e] to-[#16213e] rounded-3xl p-8 flex items-center gap-6 overflow-hidden relative">
              <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-[#F5C518]/10" />
              <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full bg-[#F5C518]/5" />
              <div className="flex-shrink-0 w-16 h-16 bg-[#F5C518]/20 rounded-2xl flex items-center justify-center">
                <svg className="w-9 h-9 text-[#F5C518]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                </svg>
              </div>
              <div className="relative z-10">
                <h3 className="text-xl font-extrabold text-white leading-snug">
                  Redefine the Way<br />You Learn &amp; Excel
                </h3>
                <p className="text-gray-400 text-sm mt-1 mb-3">
                  AI-powered analytics. Expert mentoring.
                </p>
                <Link href="#courses" className="inline-block bg-[#F5C518] text-[#1a1a2e] text-xs font-bold px-4 py-2 rounded-full hover:bg-yellow-400 transition-colors">
                  Start Learning →
                </Link>
              </div>
            </div>
          </div>
        </section>

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

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((c) => (
                <article
                  key={c.title}
                  className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm card-hover group"
                >
                  {/* Card header */}
                  <div className={`h-40 bg-gradient-to-br ${c.iconBg} flex items-center justify-center relative overflow-hidden`}>
                    <div className="absolute top-0 right-0 w-28 h-28 rounded-full bg-white/10 translate-x-8 -translate-y-8" />
                    <svg className="w-16 h-16 text-white opacity-90" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={c.icon} />
                    </svg>
                    <span className={`absolute top-3 left-3 px-2.5 py-1 text-xs font-bold rounded-full text-white ${c.badgeColor}`}>
                      {c.badge}
                    </span>
                  </div>

                  <div className="p-5">
                    <span className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full ${c.tagColor} mb-2`}>
                      {c.category}
                    </span>
                    <h3 className="font-bold text-[#1a1a2e] text-base leading-snug mb-1 group-hover:text-[#C8102E] transition-colors">
                      {c.title}
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed mb-3">{c.desc}</p>

                    <div className="flex items-center justify-between mb-4">
                      <StarRating rating={c.rating} />
                      <span className="text-xs text-gray-500">{c.students} students</span>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {c.duration}
                      </div>
                      <Link
                        href="/login"
                        className="px-4 py-1.5 bg-[#C8102E] text-white text-xs font-bold rounded-full hover:bg-[#a50d25] transition-colors"
                      >
                        Enroll Now
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link
                href="#"
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
                Learn from IITians, NITians, and medical professionals who have dedicated their careers to shaping India's top rankers.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {faculty.map(({ name, subject, exp, qual, initials, color }) => (
                <div
                  key={name}
                  className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm card-hover text-center group"
                >
                  {/* Avatar */}
                  <div className={`h-36 bg-gradient-to-br ${color} flex items-center justify-center relative`}>
                    <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-3xl font-extrabold text-white shadow-inner">
                      {initials}
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-8 bg-white rounded-t-3xl" />
                  </div>
                  <div className="px-5 pb-6 pt-0">
                    <h3 className="font-bold text-[#1a1a2e] text-base mt-1">{name}</h3>
                    <p className="text-xs text-[#C8102E] font-semibold mt-0.5">{subject}</p>
                    <p className="text-xs text-gray-500 mt-1">{qual}</p>
                    <div className="mt-3 inline-flex items-center gap-1.5 bg-gray-50 px-3 py-1 rounded-full text-xs text-gray-600 font-medium">
                      <svg className="w-3 h-3 text-[#C8102E]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      {exp} Experience
                    </div>
                  </div>
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
                  {/* Quote icon */}
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
                  <p className="text-sm text-gray-600 leading-relaxed italic">"{quote}"</p>
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
                "🎓 1000+ IIT Selections",
                "🏥 2500+ NEET Qualifiers",
                "⭐ 4.9/5 Student Rating",
                "📚 19 Years of Excellence",
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
