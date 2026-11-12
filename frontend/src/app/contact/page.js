"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const contactInfo = [
  {
    icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z",
    title: "Visit Us",
    lines: ["Jindal Complex, Near Blackstone", "Bus Stand Road / Dr. Ashok Hospital Road", "Mubarik Mehal Colony, Sangrur", "Punjab — 148001"],
  },
  {
    icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z",
    title: "Call Us",
    lines: ["+91 98233-00034", "+91 97679-00030"],
  },
  {
    icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
    title: "Email Us",
    lines: ["admissions@lakshya.ac.in", "support@lakshya.ac.in"],
  },
  {
    icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
    title: "Office Hours",
    lines: ["Mon – Sat: 9:00 AM – 6:00 PM", "Sunday: 10:00 AM – 2:00 PM"],
  },
];

const programs = [
  "IIT-JEE Mains",
  "IIT-JEE Advanced",
  "NEET (UG)",
  "Foundation (VIII–X)",
  "Crash Course",
  "Online Batch",
  "Other",
];

export default function ContactPage() {
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
              <span className="text-[#C8102E] font-semibold">Contact Us</span>
            </nav>
            <p className="hidden sm:block text-xs text-gray-400 font-medium tracking-wide uppercase">
              IIT-JEE · NEET · Foundation
            </p>
          </div>
        </section>

        {/* ── CONTACT SECTION ──────────────────────────── */}
        <section className="py-16 bg-[#f7f8fc]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* Heading */}
            <div className="text-center mb-12">
              <p className="text-[#C8102E] font-semibold text-sm uppercase tracking-widest mb-2">
                Get in Touch
              </p>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1a1a2e] section-title-underline">
                Contact Us
              </h1>
              <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
                Have questions about admissions, courses, or fees? We're here to help. Visit us, call us, or connect on social media. Our counselling team is ready to assist you.
              </p>
            </div>

            {/* Contact Info Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {contactInfo.map(({ icon, title, lines }) => (
                <div
                  key={title}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 card-hover text-center"
                >
                  <div className="w-14 h-14 rounded-2xl bg-[#C8102E]/10 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-7 h-7 text-[#C8102E]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
                    </svg>
                  </div>
                  <p className="font-bold text-[#1a1a2e] text-base mb-3">{title}</p>
                  {lines.map((l) => (
                    <p key={l} className="text-sm text-gray-500 leading-relaxed">{l}</p>
                  ))}
                </div>
              ))}
            </div>

            {/* Social Links Card */}
            <div className="max-w-2xl mx-auto bg-[#1a1a2e] rounded-2xl p-8 text-center">
              <p className="text-white font-bold text-lg mb-2">Connect With Us</p>
              <p className="text-gray-400 text-sm mb-6">Follow us on social media for updates, tips, and success stories</p>
              <div className="flex gap-4 justify-center flex-wrap">
                {[
                  { label: "Facebook", path: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z", color: "hover:bg-blue-600" },
                  { label: "YouTube", path: "M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z", color: "hover:bg-red-600" },
                  { label: "Instagram", path: "M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37zm1.5-4.87h.01M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2z", color: "hover:bg-pink-600" },
                  { label: "Twitter", path: "M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z", color: "hover:bg-sky-500" },
                ].map(({ label, path, color }) => (
                  <a
                    key={label}
                    href="#"
                    aria-label={label}
                    className={`w-12 h-12 rounded-xl bg-white/10 ${color} flex items-center justify-center transition-all duration-200 transform hover:scale-110`}
                  >
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={path} />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── MAP ──────────────────────────────────────── */}
        <section className="bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
            <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-100 h-72">
              <iframe
                title="Lakshya Institute Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3446.446130008823!2d75.8406445112391!3d30.2528674049675!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39105104b4833327%3A0x3ebedd6eadd0ad1!2sLakshay%20institute%20Sangrur!5e0!3m2!1sen!2sin!4v1793707641450!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}
