"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/* ─── Gallery data ─────────────────────────────────────────── */

const categories = ["All", "Campus", "Classroom", "Events"];

const images = [
  { src: "/images/g1.png", alt: "Lakshya campus overview", category: "Campus", span: "col-span-2 row-span-2" },
  { src: "/images/t3.png",      alt: "Faculty in classroom",     category: "Classroom", span: "" },
  { src: "/images/t2.png",      alt: "Mentor session",           category: "Classroom", span: "" },
  { src: "/images/g4.png", alt: "Annual results ceremony",  category: "Events",   span: "col-span-2" }
];

/* ─── Lightbox ─────────────────────────────────────────────── */
function Lightbox({ image, onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Image lightbox"
    >
      <button
        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
        onClick={onClose}
        aria-label="Close"
      >
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <div
        className="relative max-w-4xl w-full max-h-[85vh] rounded-2xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={image.src}
          alt={image.alt}
          width={1200}
          height={800}
          className="w-full h-auto object-contain"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-6 py-4">
          <p className="text-white text-sm font-medium">{image.alt}</p>
          <span className="text-xs text-gray-300">{image.category}</span>
        </div>
      </div>
    </div>
  );
}

/* ─── Page ─────────────────────────────────────────────────── */
export default function GalleryPage() {
  const [active, setActive] = useState("All");
  const [lightbox, setLightbox] = useState(null);

  const filtered = active === "All" ? images : images.filter((i) => i.category === active);

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
              <span className="text-[#C8102E] font-semibold">Gallery</span>
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
                Life at Lakshya
              </p>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1a1a2e] section-title-underline">
                Our Gallery
              </h1>
              <p className="text-gray-500 mt-4 max-w-xl mx-auto">
                A glimpse into our classrooms, campus, events, and the moments that make Lakshya special.
              </p>
            </div>

          </div>
        </section>

        {/* ── GALLERY GRID ─────────────────────────────── */}
        <section className="py-10 bg-[#f7f8fc]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* CSS column masonry — images render at natural aspect ratio, no cropping */}
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-0">
              {filtered.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setLightbox(img)}
                  className="relative w-full mb-4 break-inside-avoid rounded-2xl overflow-hidden group cursor-zoom-in focus:outline-none focus:ring-2 focus:ring-[#C8102E] block"
                  aria-label={`View: ${img.alt}`}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    width={800}
                    height={600}
                    className="w-full h-auto object-contain group-hover:scale-105 transition-transform duration-500 bg-white"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <div>
                      <p className="text-white text-xs font-semibold leading-tight">{img.alt}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 bg-[#C8102E] text-white text-xs rounded-full">
                        {img.category}
                      </span>
                    </div>
                    <div className="ml-auto w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                      </svg>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-20">
                <p className="text-gray-400 text-sm">No images in this category yet.</p>
              </div>
            )}
          </div>
        </section>

      </main>

      {/* Lightbox */}
      {lightbox && <Lightbox image={lightbox} onClose={() => setLightbox(null)} />}

      <Footer />
    </>
  );
}
