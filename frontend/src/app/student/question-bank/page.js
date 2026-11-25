import Link from "next/link";
import { PageTitle } from "../ui";

const resourceTypes = [
  {
    title: "Practice sets",
    description: "Topic-based exercises to help you revise concepts and build speed.",
    icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4",
  },
  {
    title: "Previous year questions",
    description: "Past questions to understand exam patterns and practice timing.",
    icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  {
    title: "Important questions",
    description: "Faculty-curated questions for focused chapter revision.",
    icon: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.96a1 1 0 00.95.69h4.163c.969 0 1.371 1.24.588 1.81l-3.37 2.45a1 1 0 00-.364 1.118l1.287 3.96c.3.922-.755 1.688-1.539 1.118l-3.37-2.45a1 1 0 00-1.176 0l-3.37 2.45c-.784.57-1.838-.196-1.539-1.118l1.287-3.96a1 1 0 00-.364-1.118l-3.37-2.45c-.783-.57-.38-1.81.588-1.81h4.163a1 1 0 00.951-.69l1.286-3.96z",
  },
];

export default function StudentQuestionBank() {
  return (
    <div className="space-y-6">
      <PageTitle
        title="Question Bank"
        subtitle="Practice sets, previous year questions, and faculty-recommended revision."
      />

      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1a1a2e] to-[#0f3460] p-6 text-white sm:p-8">
        <div className="absolute -right-10 -top-14 h-48 w-48 rounded-full bg-[#F5C518]/10" />
        <div className="relative max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#F5C518]">Learn by practicing</p>
          <h2 className="mt-2 text-xl font-extrabold sm:text-2xl">Build confidence, one question at a time</h2>
          <p className="mt-2 text-sm leading-relaxed text-white/70">
            Choose a practice format below, then use your course notes to revise the topics you find challenging.
          </p>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {resourceTypes.map((resource) => (
          <article key={resource.title} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#C8102E]/10 text-[#C8102E]">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d={resource.icon} />
              </svg>
            </div>
            <h2 className="mt-4 font-extrabold text-[#1a1a2e]">{resource.title}</h2>
            <p className="mt-2 min-h-12 text-sm leading-relaxed text-gray-500">{resource.description}</p>
            <Link href="/student/study-material" className="mt-4 inline-flex text-sm font-bold text-[#C8102E] hover:underline">
              Browse study material
            </Link>
          </article>
        ))}
      </div>

      <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-base font-extrabold text-[#1a1a2e]">A focused practice routine</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            ["01", "Choose one topic", "Start with a chapter or concept from your current course."],
            ["02", "Attempt from memory", "Work through questions before checking your notes."],
            ["03", "Review and repeat", "Revisit difficult ideas, then try another set."],
          ].map(([number, title, description]) => (
            <div key={number} className="flex gap-3 rounded-xl bg-gray-50 p-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#C8102E] text-xs font-extrabold text-white">{number}</span>
              <div>
                <h3 className="text-sm font-bold text-gray-800">{title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-gray-500">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
