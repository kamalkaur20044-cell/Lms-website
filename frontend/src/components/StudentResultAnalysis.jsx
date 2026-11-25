"use client";

import Icon from "@/components/Icon";

const formatDate = (value) => value ? new Date(value).toLocaleDateString() : "Date not provided";

function getGrade(percentage) {
  if (percentage >= 90) return "A+";
  if (percentage >= 80) return "A";
  if (percentage >= 70) return "B+";
  if (percentage >= 60) return "B";
  if (percentage >= 50) return "C";
  return "D";
}

function getQuestionTotal(subjects, field) {
  if (!subjects.length || subjects.some((subject) => subject[field] === null || subject[field] === undefined)) {
    return null;
  }
  return subjects.reduce((total, subject) => total + Number(subject[field]), 0);
}

function MetricCard({ label, value, note, tone }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
      <p className="text-xs font-semibold text-gray-500">{label}</p>
      <p className={`mt-2 text-2xl font-extrabold tracking-tight ${tone}`}>{value}</p>
      <p className="mt-1 text-[11px] text-gray-400">{note}</p>
    </div>
  );
}

export default function StudentResultAnalysis({ result, onBack }) {
  const percentage = Number(result.percentage) || 0;
  const subjects = result.subjects || [];
  const questionMetrics = [
    { key: "correct_answers", label: "Correct answers", tone: "text-emerald-700", note: "Questions answered correctly" },
    { key: "wrong_answers", label: "Wrong answers", tone: "text-rose-700", note: "Questions answered incorrectly" },
    { key: "unanswered", label: "Unanswered", tone: "text-amber-700", note: "Questions left blank" },
  ].map((metric) => ({ ...metric, total: getQuestionTotal(subjects, metric.key) }));

  return (
    <div className="space-y-5">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-gray-300 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8102E]"
      >
        <Icon d="M19 12H5m7 7l-7-7 7-7" className="h-4 w-4" />
        Back to results
      </button>

      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1a1a2e] via-[#222844] to-[#38213a] p-6 text-white shadow-lg sm:p-8">
        <div className="absolute -right-10 -top-20 h-64 w-64 rounded-full bg-[#C8102E]/20 blur-3xl" />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-lg font-extrabold text-[#F5C518]">
              {result.student_name.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase()}
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/60">Student performance analysis</p>
              <h1 className="mt-1 text-2xl font-extrabold sm:text-3xl">{result.student_name}</h1>
              <p className="mt-1 text-sm text-white/65">
                Admission no. {result.admission_number} · {result.exam_name} · {formatDate(result.exam_date)}
              </p>
            </div>
          </div>
          <div className={`rounded-2xl border border-white/10 px-5 py-3 ${result.passed ? "bg-emerald-400/15" : "bg-rose-400/15"}`}>
            <p className="text-xs font-medium text-white/65">Overall result</p>
            <p className="mt-1 text-lg font-extrabold">{result.passed ? "Passed" : "Needs improvement"}</p>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
        <MetricCard label="Overall score" value={`${percentage.toFixed(1)}%`} note={`${result.total} of ${result.max_total} marks`} tone="text-[#1a1a2e]" />
        <MetricCard label="Grade" value={getGrade(percentage)} note={`${subjects.length} subjects assessed`} tone="text-blue-700" />
        {questionMetrics.map((metric) => (
          <MetricCard
            key={metric.key}
            label={metric.label}
            value={metric.total === null ? "—" : metric.total}
            note={metric.total === null ? "Question data unavailable" : metric.note}
            tone={metric.tone}
          />
        ))}
      </div>

      <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-5 py-4">
          <h2 className="text-sm font-bold text-[#1a1a2e]">Subject performance</h2>
          <p className="mt-1 text-xs text-gray-500">Marks, question outcomes, and progress by subject.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-[#f7f8fc] text-xs font-bold uppercase tracking-wide text-gray-500">
                <th scope="col" className="px-5 py-3">Subject</th>
                <th scope="col" className="px-4 py-3">Marks</th>
                <th scope="col" className="px-4 py-3">Score</th>
                <th scope="col" className="px-4 py-3">Correct</th>
                <th scope="col" className="px-4 py-3">Wrong</th>
                <th scope="col" className="px-4 py-3">Unanswered</th>
                <th scope="col" className="px-5 py-3">Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {subjects.map((subject) => {
                const subjectPercentage = subject.max_marks ? (subject.marks / subject.max_marks) * 100 : 0;
                return (
                  <tr key={subject.name}>
                    <th scope="row" className="px-5 py-4 text-left font-semibold text-gray-800">{subject.name}</th>
                    <td className="whitespace-nowrap px-4 py-4 font-medium text-gray-700">{subject.marks} / {subject.max_marks}</td>
                    <td className="min-w-36 px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-20 overflow-hidden rounded-full bg-gray-100">
                          <div className="h-full rounded-full bg-gradient-to-r from-[#C8102E] to-[#F5C518]" style={{ width: `${Math.min(subjectPercentage, 100)}%` }} />
                        </div>
                        <span className="text-xs font-semibold text-gray-600">{subjectPercentage.toFixed(1)}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 font-semibold text-emerald-700">{subject.correct_answers ?? "—"}</td>
                    <td className="px-4 py-4 font-semibold text-rose-700">{subject.wrong_answers ?? "—"}</td>
                    <td className="px-4 py-4 font-semibold text-amber-700">{subject.unanswered ?? "—"}</td>
                    <td className="px-5 py-4">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${subjectPercentage >= 35 ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                        {subjectPercentage >= 35 ? "Passed" : "Needs work"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
