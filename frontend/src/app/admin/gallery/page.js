"use client";

import { useState, useEffect, useRef } from "react";
import { galleryAPI } from "@/services/api";

const CATEGORIES = ["General", "Campus", "Classroom", "Events", "Results", "Sports"];

const catColor = {
  Campus:    "bg-blue-100 text-blue-700",
  Classroom: "bg-green-100 text-green-700",
  Events:    "bg-purple-100 text-purple-700",
  Results:   "bg-yellow-100 text-yellow-700",
  Sports:    "bg-orange-100 text-orange-700",
  General:   "bg-gray-100 text-gray-700",
};

const API_BASE =
  (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace("/api", "");

export default function GalleryAdminPage() {
  const [images,      setImages]      = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [filter,      setFilter]      = useState("All");
  const [preview,     setPreview]     = useState(null);
  const [uploading,   setUploading]   = useState(false);
  const [showModal,   setShowModal]   = useState(false);
  const [form,        setForm]        = useState({ title: "", category: "General" });
  const [selectedFile,setSelectedFile]= useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [error,       setError]       = useState("");
  const fileRef = useRef();

  /* ── Fetch images ── */
  const fetchImages = async () => {
    setLoading(true);
    try {
      const data = await galleryAPI.getAll();
      if (data.success) setImages(data.data);
      else setError(data.message || "Failed to load images");
    } catch { setError("Failed to load images"); }
    finally  { setLoading(false); }
  };

  useEffect(() => { fetchImages(); }, []);

  const allFilters  = ["All", ...CATEGORIES];
  const filtered    = filter === "All" ? images : images.filter(i => i.category === filter);

  /* ── File select ── */
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    setFilePreview(URL.createObjectURL(file));
    if (!form.title) setForm(f => ({ ...f, title: file.name.replace(/\.[^.]+$/, "") }));
  };

  /* ── Upload ── */
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return setError("Please select an image");
    setUploading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("image",    selectedFile);
      fd.append("title",    form.title    || selectedFile.name);
      fd.append("category", form.category || "General");
      const res = await galleryAPI.upload(fd);
      if (res.success) {
        setShowModal(false);
        setForm({ title: "", category: "General" });
        setSelectedFile(null);
        setFilePreview(null);
        fetchImages();
      } else {
        setError(res.message || "Upload failed");
      }
    } catch { setError("Upload failed"); }
    finally  { setUploading(false); }
  };

  /* ── Delete ── */
  const handleDelete = async (id) => {
    if (!confirm("Delete this image permanently?")) return;
    try {
      const res = await galleryAPI.delete(id);
      if (res.success) fetchImages();
      else setError(res.message || "Delete failed");
    } catch { setError("Delete failed"); }
  };

  /* ── Open modal ── */
  const openModal = () => { setShowModal(true); setError(""); };

  return (
    <div className="space-y-5">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-[#1a1a2e]">Gallery</h1>
          <p className="text-sm text-gray-500">{filtered.length} images</p>
        </div>
        <button
          onClick={openModal}
          className="flex items-center gap-2 px-4 py-2 bg-[#C8102E] text-white text-sm font-bold rounded-xl hover:bg-[#a50d25] transition-colors self-start sm:self-auto"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          Upload Image
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">{error}</div>
      )}

      {/* ── Category filters ── */}
      <div className="flex flex-wrap gap-2">
        {allFilters.map((cat) => (
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

      {/* ── Image Grid ── */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-[#C8102E] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">

          {/* Upload placeholder card */}
          <button
            onClick={openModal}
            className="border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-2 p-6 hover:border-[#C8102E] hover:bg-red-50 transition-all min-h-[180px] group"
          >
            <svg className="w-8 h-8 text-gray-300 group-hover:text-[#C8102E] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            <span className="text-xs text-gray-400 group-hover:text-[#C8102E] font-medium transition-colors">Upload New</span>
          </button>

          {/* Image cards */}
          {filtered.map((img) => (
            <div
              key={img.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group hover:-translate-y-1 hover:shadow-md transition-all duration-200"
            >
              {/* Thumbnail */}
              <div
                className="relative h-32 bg-gray-50 cursor-pointer"
                onClick={() => setPreview(img)}
              >
                <img
                  src={`${API_BASE}${img.image_url}`}
                  alt={img.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
              </div>

              {/* Card footer */}
              <div className="p-3">
                <p className="text-xs font-semibold text-[#1a1a2e] truncate">{img.title}</p>
                <div className="flex items-center justify-between mt-1.5">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${catColor[img.category] || catColor.General}`}>
                    {img.category}
                  </span>
                  <button
                    onClick={() => handleDelete(img.id)}
                    className="p-1 rounded-lg hover:bg-red-50 text-red-400 transition-colors"
                    title="Delete"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Upload Modal ── */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-extrabold text-[#1a1a2e]">Upload Image</h2>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center"
              >
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleUpload} className="space-y-4">

              {/* Drop zone */}
              <div
                className="border-2 border-dashed border-gray-200 rounded-xl p-5 text-center hover:border-[#C8102E] hover:bg-red-50 transition-all cursor-pointer"
                onClick={() => fileRef.current?.click()}
              >
                {filePreview ? (
                  <img src={filePreview} alt="preview" className="max-h-36 mx-auto rounded-lg object-contain" />
                ) : (
                  <>
                    <svg className="w-10 h-10 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M13.5 12h.008v.008H13.5V12z" />
                    </svg>
                    <p className="text-sm text-gray-500">Click to select image</p>
                    <p className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP — up to 10 MB</p>
                  </>
                )}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>

              {/* Title */}
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. Annual Day 2026"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C8102E]/30 focus:border-[#C8102E]"
                />
              </div>

              {/* Category */}
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">Category</label>
                <select
                  value={form.category}
                  onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C8102E]/30 focus:border-[#C8102E]"
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {error && <p className="text-red-600 text-xs">{error}</p>}

              {/* Actions */}
              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 py-2.5 bg-[#C8102E] text-white rounded-xl text-sm font-bold hover:bg-[#a50d25] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {uploading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Uploading…
                    </>
                  ) : "Upload"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Lightbox ── */}
      {preview && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setPreview(null)}
        >
          <div
            className="relative max-w-2xl w-full rounded-2xl overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <img
              src={`${API_BASE}${preview.image_url}`}
              alt={preview.title}
              className="w-full h-auto object-contain bg-black max-h-[80vh]"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-5 py-4 flex items-center justify-between">
              <div>
                <p className="text-white text-sm font-semibold">{preview.title}</p>
                <p className="text-gray-300 text-xs">{preview.category}</p>
              </div>
              <button
                onClick={() => setPreview(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"
              >
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
