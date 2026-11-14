"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import styles from "./HeroBanner.module.css";

const slides = [
  { src: "/images/banner1.png", alt: "Lakshya IIT-JEE Coaching Banner" },
  { src: "/images/banner2.png", alt: "Lakshya NEET Coaching Banner" },
  { src: "/images/banner3.png", alt: "Lakshya Foundation Program Banner" },
];

// Clone first slide at the end → enables seamless infinite loop
const track = [...slides, slides[0]];

const INTERVAL = 3500; // ms between auto-slides

const courses = [
  { label: "IIT-JEE Mains",   desc: "Class XI & XII",    href: "/courses", icon: "M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 19h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z" },
  { label: "IIT-JEE Advanced", desc: "Top Engineering",   href: "/courses", icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" },
  { label: "NEET (UG)",        desc: "Medical Entrance",  href: "/courses", icon: "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" },
  { label: "Foundation",       desc: "Class VIII – X",    href: "/courses", icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" },
];

export default function HeroBanner() {
  // `index` tracks position in the extended track (0 … slides.length)
  const [index, setIndex]       = useState(0);
  const [animated, setAnimated] = useState(true);
  const timerRef                = useRef(null);

  // The "real" dot/counter index (clamp clone back to 0)
  const current = index >= slides.length ? 0 : index;

  // ── Auto-play — defined FIRST so everything below can reference it
  const startTimer = useCallback(() => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      // Cap at slides.length (the clone) — never go beyond
      setIndex((i) => (i >= slides.length ? slides.length : i + 1));
    }, INTERVAL);
  }, []);

  // Start timer on mount
  useEffect(() => {
    startTimer();
    return () => clearInterval(timerRef.current);
  }, [startTimer]);

  // ── After sliding to the clone (index === slides.length),
  //    stop the timer, then instantly snap back to real slide 0
  const handleTransitionEnd = useCallback(() => {
    if (index === slides.length) {
      clearInterval(timerRef.current); // pause timer during snap
      setAnimated(false);              // disable CSS transition
      setIndex(0);                     // snap to real slide 0
    }
  }, [index]);

  // Re-enable transition + restart timer after the silent snap
  useEffect(() => {
    if (!animated) {
      const id = requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          setAnimated(true);
          startTimer(); // restart only after snap completes
        })
      );
      return () => cancelAnimationFrame(id);
    }
  }, [animated, startTimer]);

  // ── Manual navigation
  const goTo = useCallback((realIdx) => {
    setAnimated(true);
    setIndex(realIdx);
    startTimer();
  }, [startTimer]);

  const next = useCallback(() => {
    setAnimated(true);
    setIndex((i) => i + 1);
    startTimer();
  }, [startTimer]);

  const prev = useCallback(() => {
    setAnimated(true);
    setIndex((i) => (i <= 0 ? slides.length - 1 : i - 1));
    startTimer();
  }, [startTimer]);

  return (
    <section className="relative w-full bg-[#1a1a2e]" aria-label="Hero banner">

      <div className="relative w-full" style={{ aspectRatio: "16/5", minHeight: "200px" }}>

        {/* ── Sliding image track (overflow-hidden scoped here only) ── */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent z-[1]" />

          {/* Flex track */}
          <div
            className="flex h-full"
            style={{
              transform: `translateX(-${index * 100}%)`,
              transition: animated ? "transform 700ms cubic-bezier(0.25, 0.46, 0.45, 0.94)" : "none",
            }}
            onTransitionEnd={handleTransitionEnd}
          >
            {track.map((slide, i) => (
              <div key={i} className="flex-shrink-0 w-full h-full">
                <img
                  src={slide.src}
                  alt={slide.alt}
                  className="w-full h-full object-cover object-center"
                />
              </div>
            ))}
          </div>
        </div>

        {/* ── UI overlays — outside the sliding track, design unchanged ── */}

        {/* Prev button */}
        <button onClick={prev} aria-label="Previous slide"
          className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-10 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/80 hover:bg-white shadow-lg flex items-center justify-center transition-all hover:scale-105">
          <svg className="w-5 h-5 text-[#C8102E]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Next button */}
        <button onClick={next} aria-label="Next slide"
          className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-10 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/80 hover:bg-white shadow-lg flex items-center justify-center transition-all hover:scale-105">
          <svg className="w-5 h-5 text-[#C8102E]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Dot indicators */}
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
          {slides.map((_, i) => (
            <button key={i} onClick={() => goTo(i)} aria-label={`Go to slide ${i + 1}`}
              className={`rounded-full transition-all duration-300 ${i === current ? "w-6 h-2.5 bg-[#C8102E]" : "w-2.5 h-2.5 bg-white/60 hover:bg-white"}`} />
          ))}
        </div>

        {/* Slide counter */}
        <div className="absolute top-4 right-4 z-10 bg-black/40 text-white text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm">
          {current + 1} / {slides.length}
        </div>

        {/* Cards overlapping bottom of banner — desktop only (lg+) */}
        <div className="hidden lg:block absolute bottom-0 left-0 right-0 z-10 translate-y-1/2 px-8">
          <div className="max-w-5xl mx-auto grid grid-cols-4 gap-3">
            {courses.map(({ label, desc, href, icon }) => (
              <Link key={label} href={href}
                className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-3 shadow-lg hover:shadow-xl hover:-translate-y-1 hover:border-[#C8102E]/30 transition-all duration-200 group">
                <span className="w-10 h-10 rounded-xl bg-[#C8102E]/10 group-hover:bg-[#C8102E] flex items-center justify-center flex-shrink-0 transition-colors duration-200">
                  <svg className="w-5 h-5 text-[#C8102E] group-hover:text-white transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
                  </svg>
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-[#1a1a2e] group-hover:text-[#C8102E] transition-colors leading-tight">{label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>

      {/* Spacer for overlapping cards — desktop only */}
      <div className="hidden lg:block pt-16" />

      {/* Cards below banner — mobile only (< lg), horizontal scroll strip */}
      <div className="lg:hidden bg-white px-3 py-3 shadow-md">
        <div className="flex gap-3 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          {courses.map(({ label, desc, href, icon }) => (
            <Link key={label} href={href}
              className="flex-shrink-0 bg-white border border-gray-100 rounded-2xl px-3 py-2.5 flex items-center gap-2.5 shadow-sm hover:border-[#C8102E]/30 transition-all duration-200 group"
              style={{ minWidth: "140px" }}>
              <span className="w-9 h-9 rounded-xl bg-[#C8102E]/10 group-hover:bg-[#C8102E] flex items-center justify-center flex-shrink-0 transition-colors duration-200">
                <svg className="w-4 h-4 text-[#C8102E] group-hover:text-white transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
                </svg>
              </span>
              <div>
                <p className="text-xs font-bold text-[#1a1a2e] group-hover:text-[#C8102E] transition-colors leading-tight">{label}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

    </section>
  );
}
