"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

const slides = [
  { src: "/images/banner1.png", alt: "Lakshya IIT-JEE Coaching Banner" },
  { src: "/images/banner2.png", alt: "Lakshya NEET Coaching Banner" },
  { src: "/images/banner3.png", alt: "Lakshya Foundation Program Banner" },
];

export default function HeroBanner() {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goTo = useCallback(
    (index) => {
      if (isTransitioning || index === current) return;
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrent(index);
        setIsTransitioning(false);
      }, 300);
    },
    [current, isTransitioning]
  );

  const next = useCallback(() => {
    goTo((current + 1) % slides.length);
  }, [current, goTo]);

  const prev = useCallback(() => {
    goTo((current - 1 + slides.length) % slides.length);
  }, [current, goTo]);

  // Auto-advance every 4 seconds
  useEffect(() => {
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section className="relative w-full overflow-hidden bg-[#1a1a2e]" aria-label="Hero banner">
      {/* Slides */}
      <div
        className="relative w-full"
        style={{ aspectRatio: "16/5", minHeight: "280px" }}
      >
        {slides.map((slide, i) => (
          <div
            key={slide.src}
            className="absolute inset-0 transition-opacity duration-500"
            style={{ opacity: i === current ? 1 : 0, zIndex: i === current ? 1 : 0 }}
            aria-hidden={i !== current}
          >
            <img
              src={slide.src}
              alt={slide.alt}
              className="w-full h-full object-cover object-center"
            />
            {/* Subtle dark overlay at bottom for readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
          </div>
        ))}

        {/* Prev button */}
        <button
          onClick={prev}
          aria-label="Previous slide"
          className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-10 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/80 hover:bg-white shadow-lg flex items-center justify-center transition-all hover:scale-105"
        >
          <svg className="w-5 h-5 text-[#C8102E]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Next button */}
        <button
          onClick={next}
          aria-label="Next slide"
          className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-10 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/80 hover:bg-white shadow-lg flex items-center justify-center transition-all hover:scale-105"
        >
          <svg className="w-5 h-5 text-[#C8102E]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Dot indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`rounded-full transition-all duration-300 ${
                i === current
                  ? "w-6 h-2.5 bg-[#C8102E]"
                  : "w-2.5 h-2.5 bg-white/60 hover:bg-white"
              }`}
            />
          ))}
        </div>

        {/* Slide counter */}
        <div className="absolute top-4 right-4 z-10 bg-black/40 text-white text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm">
          {current + 1} / {slides.length}
        </div>
      </div>

      {/* Quick-action bar below banner */}
      <div className="bg-[#1a1a2e] border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-0 flex flex-wrap items-stretch justify-center gap-0">
          {[
            { label: "IIT-JEE Mains", href: "/courses", icon: "M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 19h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z" },
            { label: "IIT-JEE Advanced", href: "/courses", icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" },
            { label: "NEET (UG)", href: "/courses", icon: "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" },
            { label: "Foundation", href: "/courses", icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" },
          ].map(({ label, href, icon }) => (
            <Link
              key={label}
              href={href}
              className="flex items-center gap-3 px-8 py-5 text-sm font-semibold text-gray-300 hover:text-white hover:bg-white/5 transition-all border-r border-white/10 last:border-r-0 group"
            >
              <span className="w-8 h-8 rounded-lg bg-[#C8102E]/20 group-hover:bg-[#C8102E] flex items-center justify-center transition-colors flex-shrink-0">
                <svg className="w-4 h-4 text-[#C8102E] group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
                </svg>
              </span>
              {label}
            </Link>
          ))}
          <Link
            href="/login"
            className="flex items-center gap-2 px-8 py-5 bg-[#C8102E] text-white text-sm font-bold hover:bg-[#a50d25] transition-colors whitespace-nowrap"
          >
            Enroll Now
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
