"use client";

import { useState } from "react";
import Image from "next/image";

const allImages = [
  { id: 1, src: "/images/banner1.png", alt: "Campus overview", category: "Campus", date: "Nov 01, 2026" },
  { id: 2, src: "/images/banner2.png", alt: "Annual results ceremony", category: "Events", date: "Nov 02, 2026" },
  { id: 3, src: "/images/banner3.png", alt: "Orientation day", category: "Events", date: "Nov 03, 2026" },
  { id: 4, src: "/images/t1.png", alt: "Faculty in classroom", category: "Classroom", date: "Nov 04, 2026" },
  { id: 5, src: "/images/t2.png", alt: "Mentor session", category: "Classroom", date: "Nov 05, 2026" },
  { id: 6, src: "/images/t3.png", alt: "Student interaction", category: "Classroom", date: "Nov 06, 2026" },
];

const categories = ["All", "Campus", "Classroom", "Events"];

const catColor = {
  Campus: "bg-blue-100 text-blue-700",
  Classroom: "bg-green-100 text-green-700",
  Events: "bg-purple-100 text-purple-700",
};

export default function GalleryAdminPage() {
  const [filter, setFilter] = useState("All");
  const [preview, setPreview] = useState(null);

  const filtered = filter === "All" ? allImages : allImages.filter((i) => i.category === filter);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-[#1a1a2e]">Gallery</h1>
          <p className="text-sm text-gray-500">{filtered.length} images</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#C8102E] text-white text-sm font-bold rounded-xl hover:bg-[#a50d25] transition-colors self-start sm:self-auto">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
          Upload Image
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
              filter === cat
                ? "bg-[#C8102E] text-white shadow-sm"
                : "bg-white border border-gray-200 text-gray-600 hover:border-[#C8102E] hover:text-[#C8102E]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* Upload placeholder */}
        <button className="border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-2 p-6 hover:border-[#C8102E] hover:bg-red-50 transition-all min-h-[180px] group">
          <svg className="w-8 h-8 text-gray-300 group-hover:text-[#C8102E] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
          <span className="text-xs text-gray-400 group-hover:text-[#C8102E] font-medium transition-colors">Upload New</span>
        </button>

        {filtered.map((img) => (
          <div key={img.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group hover:-translate-y-1 hover:shadow-md transition-all duration-200">
            <div className="relative h-32 bg-gray-50 cursor-pointer" onClick={() => setPreview(img)}>
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="25vw"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              </div>
            </div>
            <div className="p-3">
              <p className="text-xs font-semibold text-[#1a1a2e] truncate">{img.alt}</p>
              <div className="flex items-center justify-between mt-1.5">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${catColor[img.category]}`}>{img.category}</span>
                <button className="p-1 rounded-lg hover:bg-red-50 text-red-400 transition-colors" title="Delete">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox preview */}
      {preview && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={() => setPreview(null)}>
          <div className="relative max-w-2xl w-full rounded-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <Image src={preview.src} alt={preview.alt} width={800} height={500} className="w-full h-auto object-contain bg-black" />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-5 py-4 flex items-center justify-between">
              <div>
                <p className="text-white text-sm font-semibold">{preview.alt}</p>
                <p className="text-gray-300 text-xs">{preview.category} · {preview.date}</p>
              </div>
              <button onClick={() => setPreview(null)} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
