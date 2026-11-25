"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PageTitle } from "../ui";

const supportOptions = [
  {
    title: "Call student support",
    description: "Speak with the institute team for help with classes, courses, or your portal.",
    value: "+91 98233-00034",
    href: "tel:+919823300034",
    action: "Call now",
    icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z",
  },
  {
    title: "Email student support",
    description: "Send your question and include your admission number for faster assistance.",
    value: "support@lakshya.ac.in",
    href: "mailto:support@lakshya.ac.in",
    action: "Send an email",
    icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
  },
];

const statusStyles = {
  open: "bg-amber-50 text-amber-700",
  answered: "bg-blue-50 text-blue-700",
  resolved: "bg-emerald-50 text-emerald-700",
};

const statusLabels = {
  open: "Awaiting response",
  answered: "Response received",
  resolved: "Resolved",
};

function formatDateTime(value) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? ""
    : date.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
}

export default function StudentSupport() {
  const [queries, setQueries] = useState([]);
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [adminPreview, setAdminPreview] = useState(false);

  useEffect(() => {
    let user = {};
    try {
      user = JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      user = {};
    }

    const isAdminPreview = user.role === "admin";
    setAdminPreview(isAdminPreview);
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    setSuccessMessage("");
    const now = new Date().toISOString();
    setQueries((current) => [{
      id: now,
      category,
      title: title.trim(),
      message: message.trim(),
      status: "open",
      created_at: now,
      teacher_reply: "",
    }, ...current]);
    setTitle("");
    setMessage("");
    setCategory("");
    setSuccessMessage("Your question has been added.");
  };

  return (
    <div className="space-y-6">
      <PageTitle
        title="Student Support"
        subtitle="Get help with your learning or contact the institute support team."
      />

      <section className="rounded-2xl bg-gradient-to-br from-[#1a1a2e] to-[#0f3460] p-6 text-white sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#F5C518]">Here to help</p>
        <h2 className="mt-2 text-xl font-extrabold sm:text-2xl">Get support with your learning</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/70">
          Share a question about your classes, exams, or study resources.
        </p>
      </section>

      <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        {!adminPreview && (
          <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5">
              <p className="text-xs font-bold uppercase tracking-wide text-[#C8102E]">Ask your teacher</p>
              <h2 className="mt-1 text-lg font-extrabold text-[#1a1a2e]">Send a subject question</h2>
              <p className="mt-1 text-sm text-gray-500">Choose a topic and share the details of your question.</p>
            </div>

            {successMessage && <p role="status" className="mb-4 rounded-xl bg-emerald-50 px-3 py-2.5 text-sm font-medium text-emerald-700">{successMessage}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="query-category" className="mb-1.5 block text-xs font-semibold text-gray-600">Question topic</label>
                  <select
                    id="query-category"
                    required
                    value={category}
                    onChange={(event) => setCategory(event.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 focus:border-[#C8102E] focus:outline-none focus:ring-2 focus:ring-[#C8102E]/20 disabled:bg-gray-50"
                  >
                    <option value="">Choose a topic</option>
                    <option value="Course content">Course content</option>
                    <option value="Exam preparation">Exam preparation</option>
                    <option value="Study resources">Study resources</option>
                    <option value="Class schedule">Class schedule</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="query-title" className="mb-1.5 block text-xs font-semibold text-gray-600">Question title</label>
                  <input
                    id="query-title"
                    required
                    minLength={4}
                    maxLength={160}
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="What would you like help with?"
                    className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:border-[#C8102E] focus:outline-none focus:ring-2 focus:ring-[#C8102E]/20"
                  />
                </div>
                <div>
                  <label htmlFor="query-message" className="mb-1.5 block text-xs font-semibold text-gray-600">Details</label>
                  <textarea
                    id="query-message"
                    required
                    minLength={10}
                    maxLength={5000}
                    rows={5}
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    placeholder="Include the topic or step where you need clarification."
                    className="w-full resize-y rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:border-[#C8102E] focus:outline-none focus:ring-2 focus:ring-[#C8102E]/20"
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#C8102E] px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-[#a50d25] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Send question
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-7-7l7 7-7 7" />
                  </svg>
                </button>
              </form>
          </section>
        )}

        <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-[#C8102E]">Your conversations</p>
              <h2 className="mt-1 text-lg font-extrabold text-[#1a1a2e]">My questions</h2>
            </div>
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-600">{queries.length} total</span>
          </div>

          {queries.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-8 text-center">
              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-white text-gray-400 shadow-sm">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-4 4v-4z" />
                </svg>
              </div>
              <p className="mt-3 text-sm font-bold text-gray-800">Start a conversation with your teacher</p>
              <p className="mt-1 text-xs text-gray-500">Your sent questions and replies will appear here.</p>
            </div>
          ) : (
            <div className="max-h-[720px] space-y-3 overflow-y-auto pr-1">
              {queries.map((query) => (
                <article key={query.id} className="rounded-xl border border-gray-100 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-gray-500">{query.category}</p>
                      <h3 className="mt-1 text-sm font-extrabold text-gray-800">{query.title}</h3>
                    </div>
                    <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold ${statusStyles[query.status] || statusStyles.open}`}>
                      {statusLabels[query.status] || "Awaiting response"}
                    </span>
                  </div>
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-gray-600">{query.message}</p>
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[11px] text-gray-400">
                    <span>Academic support</span>
                    <time dateTime={query.created_at}>{formatDateTime(query.created_at)}</time>
                  </div>
                  {query.teacher_reply && (
                    <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50/70 p-3">
                      <p className="text-[10px] font-extrabold uppercase tracking-wide text-blue-700">Teacher response</p>
                      <p className="mt-1.5 whitespace-pre-wrap text-sm leading-relaxed text-gray-700">{query.teacher_reply}</p>
                      {query.replied_at && <time className="mt-2 block text-[10px] text-gray-400" dateTime={query.replied_at}>{formatDateTime(query.replied_at)}</time>}
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {supportOptions.map((option) => (
          <article key={option.title} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#C8102E]/10 text-[#C8102E]">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d={option.icon} />
              </svg>
            </div>
            <h2 className="mt-4 text-base font-extrabold text-[#1a1a2e]">{option.title}</h2>
            <p className="mt-1 min-h-10 text-sm leading-relaxed text-gray-500">{option.description}</p>
            <p className="mt-4 text-sm font-bold text-gray-800">{option.value}</p>
            <a href={option.href} className="mt-4 inline-flex rounded-xl bg-[#C8102E] px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#a50d25]">
              {option.action}
            </a>
          </article>
        ))}
      </div>

      <section className="grid grid-cols-1 gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:grid-cols-2 sm:p-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-gray-400">Office hours</p>
          <p className="mt-2 text-sm font-semibold text-gray-800">Mon – Sat: 9:00 AM – 6:00 PM</p>
          <p className="mt-1 text-sm font-semibold text-gray-800">Sunday: 10:00 AM – 2:00 PM</p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-gray-400">Visit the institute</p>
          <p className="mt-2 text-sm leading-relaxed text-gray-700">
            Jindal Complex, Near Blackstone, Bus Stand Road / Dr. Ashok Hospital Road, Mubarik Mehal Colony, Sangrur, Punjab — 148001
          </p>
          <Link href="/contact" className="mt-3 inline-flex text-sm font-bold text-[#C8102E] hover:underline">
            View contact page
          </Link>
        </div>
      </section>
    </div>
  );
}
