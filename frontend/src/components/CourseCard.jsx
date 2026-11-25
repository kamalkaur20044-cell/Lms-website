import Link from "next/link";

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
});
const percentFormatter = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 });

function getCourseDetails(course) {
  const name = course.course_name?.toLowerCase() || "";

  if (name.includes("foundation")) {
    return {
      subtitle: "School prep along with an early JEE-NEET headstart",
      highlights: [
        "100% NCERT coverage with advanced Foundation topics",
        "Weekly practice classes to develop problem-solving skills",
        "Subjective and Objective tests every 21 days",
      ],
    };
  }

  if (name.includes("ncert")) {
    return {
      subtitle: "Best-in-class school preparation",
      highlights: [
        "100% NCERT coverage to ace school exams",
        "Weekly practice classes for school-style questions",
        "Subjective and Objective tests every 21 days",
      ],
    };
  }

  const highlights = [];
  if (name.includes("jee") && name.includes("neet")) {
    highlights.push("Focused preparation for IIT-JEE and NEET");
  } else if (name.includes("jee")) {
    highlights.push("Focused preparation for IIT-JEE");
  } else if (name.includes("neet")) {
    highlights.push("Focused preparation for NEET");
  }
  if (name.includes("crash")) highlights.push("Focused revision and exam practice");
  if (course.duration) highlights.push(`Course duration: ${course.duration}`);
  if (highlights.length === 0) highlights.push("Program details available from our counsellors");

  return {
    subtitle: course.description || "A structured program built around your academic goals.",
    highlights,
  };
}

export default function CourseCard({ course }) {
  const details = getCourseDetails(course);
  const fee = course.fee === null || course.fee === undefined || course.fee === "" ? null : Number(course.fee);
  const discountPercent = course.discount_percent === null || course.discount_percent === undefined
    ? 0
    : Number(course.discount_percent);
  const hasFee = fee !== null && Number.isFinite(fee) && fee >= 0;
  const hasDiscount = hasFee && Number.isFinite(discountPercent) && discountPercent > 0 && discountPercent <= 100;
  const discountedFee = hasFee ? fee * (1 - (hasDiscount ? discountPercent : 0) / 100) : null;
  const savings = hasDiscount ? fee - discountedFee : 0;

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-[#C8102E]/25 hover:shadow-xl">
      <div className="h-1.5 bg-gradient-to-r from-[#C8102E] via-[#F5C518] to-[#1a1a2e]" />
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-5 flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#1a1a2e] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Active course
          </span>
          {hasDiscount && (
            <span className="rounded-full bg-[#C8102E] px-3 py-1.5 text-xs font-extrabold tracking-wide text-white shadow-sm shadow-red-900/20">
              {percentFormatter.format(discountPercent)}% OFF
            </span>
          )}
        </div>

        <h2 className="text-lg font-extrabold leading-snug text-[#1a1a2e]">
          {course.course_name}
        </h2>
        <p className="mt-1 text-sm leading-relaxed text-gray-500">{details.subtitle}</p>

        <ul className="mt-5 space-y-3">
          {details.highlights.map((highlight) => (
            <li key={highlight} className="flex items-start gap-2.5 text-sm leading-relaxed text-gray-700">
              <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#C8102E]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span>{highlight}</span>
            </li>
          ))}
        </ul>

        <div className="mt-auto border-t border-gray-100 pt-5">
          {hasFee ? (
            <div className="rounded-2xl border border-[#C8102E]/10 bg-gradient-to-br from-gray-50 to-rose-50/70 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  {hasDiscount && <p className="text-xs text-gray-400 line-through">{currencyFormatter.format(fee)}</p>}
                  <p className="mt-1 text-2xl font-black tracking-tight text-[#1a1a2e]">{currencyFormatter.format(discountedFee)}</p>
                  <p className="mt-0.5 text-[11px] font-medium text-gray-500">{hasDiscount ? "Discounted course fee" : "Course fee"}</p>
                </div>
                {hasDiscount && (
                  <span className="shrink-0 rounded-xl bg-white px-3 py-2 text-right shadow-sm">
                    <span className="block text-[10px] font-semibold uppercase tracking-wide text-gray-400">You save</span>
                    <span className="mt-0.5 block text-xs font-extrabold text-[#C8102E]">{currencyFormatter.format(savings)}</span>
                  </span>
                )}
              </div>
            </div>
          ) : (
            <p className="rounded-xl bg-gray-50 px-4 py-3 text-sm font-bold text-gray-600">Contact for fees</p>
          )}
          <Link
            href={`/courses/${encodeURIComponent(course.id)}`}
            className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#C8102E] px-4 py-3 text-sm font-bold text-white shadow-sm shadow-red-900/10 transition-all hover:bg-[#a50d25] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8102E] focus-visible:ring-offset-2"
          >
            Know more
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
}
