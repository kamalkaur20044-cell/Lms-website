"use client";

import { useState } from "react";
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
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    program: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: wire to backend
    setSubmitted(true);
  };

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
              <p className="text-gray-500 mt-4 max-w-xl mx-auto">
                Have questions about admissions, courses, or fees? We're here to help. Reach out and our counselling team will get back to you within 24 hours.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 items-start">

              {/* ── Left — contact info cards ─────────── */}
              <div className="space-y-4">
                {contactInfo.map(({ icon, title, lines }) => (
                  <div
                    key={title}
                    className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-start gap-4 card-hover"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#C8102E]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-5 h-5 text-[#C8102E]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
                      </svg>
                    </div>
                    <div>
                      <p className="font-bold text-[#1a1a2e] text-sm mb-1">{title}</p>
                      {lines.map((l) => (
                        <p key={l} className="text-sm text-gray-500">{l}</p>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Social links */}
                <div className="bg-[#1a1a2e] rounded-2xl p-5">
                  <p className="text-white font-bold text-sm mb-3">Follow Us</p>
                  <div className="flex gap-3">
                    {[
                      { label: "Facebook", path: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" },
                      { label: "YouTube", path: "M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" },
                      { label: "Instagram", path: "M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37zm1.5-4.87h.01M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2z" },
                      { label: "Twitter", path: "M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" },
                    ].map(({ label, path }) => (
                      <a
                        key={label}
                        href="#"
                        aria-label={label}
                        className="w-9 h-9 rounded-xl bg-white/10 hover:bg-[#C8102E] flex items-center justify-center transition-colors"
                      >
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d={path} />
                        </svg>
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── Right — enquiry form ───────────────── */}
              <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                {submitted ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-[#1a1a2e] mb-2">Message Sent!</h3>
                    <p className="text-gray-500 text-sm max-w-sm">
                      Thank you for reaching out. Our counselling team will contact you within 24 hours.
                    </p>
                    <button
                      onClick={() => { setSubmitted(false); setForm({ name: "", email: "", phone: "", program: "", message: "" }); }}
                      className="mt-6 px-6 py-2.5 bg-[#C8102E] text-white text-sm font-bold rounded-full hover:bg-[#a50d25] transition-colors"
                    >
                      Send Another
                    </button>
                  </div>
                ) : (
                  <>
                    <h2 className="text-xl font-extrabold text-[#1a1a2e] mb-1">Send an Enquiry</h2>
                    <p className="text-sm text-gray-500 mb-6">Fill in your details and we'll get back to you shortly.</p>

                    <form onSubmit={handleSubmit} noValidate className="space-y-5">

                      {/* Name + Phone */}
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="name" className="block text-xs font-semibold text-gray-600 mb-1.5">
                            Full Name <span className="text-[#C8102E]">*</span>
                          </label>
                          <input
                            id="name"
                            name="name"
                            type="text"
                            required
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Arjun Mehta"
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#C8102E] focus:ring-2 focus:ring-[#C8102E]/10 transition"
                          />
                        </div>
                        <div>
                          <label htmlFor="phone" className="block text-xs font-semibold text-gray-600 mb-1.5">
                            Phone Number <span className="text-[#C8102E]">*</span>
                          </label>
                          <input
                            id="phone"
                            name="phone"
                            type="tel"
                            required
                            value={form.phone}
                            onChange={handleChange}
                            placeholder="+91 98765 43210"
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#C8102E] focus:ring-2 focus:ring-[#C8102E]/10 transition"
                          />
                        </div>
                      </div>

                      {/* Email */}
                      <div>
                        <label htmlFor="email" className="block text-xs font-semibold text-gray-600 mb-1.5">
                          Email Address <span className="text-[#C8102E]">*</span>
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={form.email}
                          onChange={handleChange}
                          placeholder="arjun@email.com"
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#C8102E] focus:ring-2 focus:ring-[#C8102E]/10 transition"
                        />
                      </div>

                      {/* Program interest */}
                      <div>
                        <label htmlFor="program" className="block text-xs font-semibold text-gray-600 mb-1.5">
                          Program of Interest
                        </label>
                        <select
                          id="program"
                          name="program"
                          value={form.program}
                          onChange={handleChange}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:border-[#C8102E] focus:ring-2 focus:ring-[#C8102E]/10 transition bg-white"
                        >
                          <option value="">Select a program</option>
                          {programs.map((p) => (
                            <option key={p} value={p}>{p}</option>
                          ))}
                        </select>
                      </div>

                      {/* Message */}
                      <div>
                        <label htmlFor="message" className="block text-xs font-semibold text-gray-600 mb-1.5">
                          Message
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          rows={4}
                          value={form.message}
                          onChange={handleChange}
                          placeholder="Tell us about your goals or any questions you have..."
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#C8102E] focus:ring-2 focus:ring-[#C8102E]/10 transition resize-none"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3.5 bg-[#C8102E] text-white font-bold rounded-xl hover:bg-[#a50d25] transition-all duration-200 shadow-md hover:shadow-lg text-sm tracking-wide"
                      >
                        Submit Enquiry
                      </button>

                      <p className="text-center text-xs text-gray-400">
                        We respect your privacy. Your information will never be shared.
                      </p>
                    </form>
                  </>
                )}
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
