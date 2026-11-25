"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { resultAPI } from "@/services/api";
import { Card, PageTitle } from "../ui";

const Y_TICKS = [100, 75, 50, 25, 0];

function percentageFor(result) {
  const maxMarks = Number(result.max_total) || 0;
  return maxMarks > 0
    ? Math.min(100, Math.max(0, (Number(result.total || 0) / maxMarks) * 100))
    : Math.min(100, Math.max(0, Number(result.percentage) || 0));
}

function getExamLabel(name) {
  const label = String(name || "Assessment");
  return label.length > 14 ? `${label.slice(0, 13)}…` : label;
}

function MetricCard({ label, value, detail, accent }) {
  return (
    <article className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">{label}</p>
        <span className={`mt-0.5 h-2.5 w-2.5 rounded-full ${accent}`} />
      </div>
      <p className="mt-4 truncate text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">{value}</p>
      <p className="mt-1.5 min-h-4 text-xs font-medium text-slate-500">{detail}</p>
    </article>
  );
}

function PerformanceTrendChart({ assessments }) {
  const chartWidth = Math.max(760, assessments.length * 120 + 96);
  const chartHeight = 320;
  const padding = { top: 24, right: 24, bottom: 60, left: 58 };
  const plotWidth = chartWidth - padding.left - padding.right;
  const plotHeight = chartHeight - padding.top - padding.bottom;
  const points = assessments.map((assessment, index) => {
    const x = assessments.length === 1
      ? padding.left + plotWidth / 2
      : padding.left + (index * plotWidth) / (assessments.length - 1);
    const y = padding.top + ((100 - assessment.percentage) / 100) * plotHeight;
    return { ...assessment, x, y };
  });
  const linePath = points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");
  const areaPath = points.length
    ? `${linePath} L ${points[points.length - 1].x} ${padding.top + plotHeight} L ${points[0].x} ${padding.top + plotHeight} Z`
    : "";

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-bold text-slate-800">Performance trend</p>
        <span className="inline-flex items-center gap-2 text-xs font-medium text-slate-500">
          <span className="h-2 w-2 rounded-full bg-blue-500" />
          Score percentage
        </span>
      </div>
      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          role="img"
          aria-label="Exam score trend across assessments"
          className="h-[300px] w-full"
          style={{ minWidth: `${chartWidth}px` }}
        >
          <defs>
            <linearGradient id="analysis-trend-fill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.01" />
            </linearGradient>
          </defs>

          {Y_TICKS.map((tick) => {
            const y = padding.top + ((100 - tick) / 100) * plotHeight;
            return (
              <g key={tick}>
                <line x1={padding.left} x2={chartWidth - padding.right} y1={y} y2={y} stroke="#E8EDF4" strokeDasharray={tick === 0 ? "0" : "4 6"} />
                <text x={padding.left - 12} y={y + 4} textAnchor="end" fill="#8491A5" fontSize="11">{tick}%</text>
              </g>
            );
          })}

          {areaPath && <path d={areaPath} fill="url(#analysis-trend-fill)" className="analysis-chart-area" />}
          {points.length > 1 && (
            <path
              d={linePath}
              fill="none"
              stroke="#3B82F6"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="analysis-chart-line"
            />
          )}

          {points.map((point, index) => (
            <g key={`${point.exam_id}-${index}`}>
              <circle cx={point.x} cy={point.y} r="9" fill="#3B82F6" opacity="0.12" />
              <circle
                cx={point.x}
                cy={point.y}
                r="4.5"
                fill="#fff"
                stroke="#3B82F6"
                strokeWidth="3"
                className="analysis-chart-point"
                style={{ animationDelay: `${index * 100 + 250}ms` }}
              >
                <title>{`${point.exam_name}: ${point.percentage.toFixed(1)}%`}</title>
              </circle>
              <text
                x={point.x}
                y={chartHeight - 24}
                textAnchor="middle"
                fill="#667085"
                fontSize="11"
                fontWeight="500"
              >
                {getExamLabel(point.exam_name)}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}

function SubjectPerformanceChart({ subjects }) {
  const chartWidth = Math.max(760, subjects.length * 128 + 96);
  const chartHeight = 340;
  const padding = { top: 24, right: 24, bottom: 72, left: 58 };
  const plotWidth = chartWidth - padding.left - padding.right;
  const plotHeight = chartHeight - padding.top - padding.bottom;
  const slotWidth = subjects.length ? plotWidth / subjects.length : plotWidth;
  const barWidth = Math.min(76, slotWidth * 0.62);

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-bold text-slate-800">Subject-wise performance</p>
        <span className="text-xs font-medium text-slate-500">Average score across published exams</span>
      </div>
      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          role="img"
          aria-label="Average score by subject"
          className="h-[320px] w-full"
          style={{ minWidth: `${chartWidth}px` }}
        >
          <defs>
            <linearGradient id="analysis-subject-bars" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#5598F5" />
              <stop offset="100%" stopColor="#377DE0" />
            </linearGradient>
          </defs>

          {Y_TICKS.map((tick) => {
            const y = padding.top + ((100 - tick) / 100) * plotHeight;
            return (
              <g key={tick}>
                <line x1={padding.left} x2={chartWidth - padding.right} y1={y} y2={y} stroke="#E8EDF4" strokeDasharray={tick === 0 ? "0" : "4 6"} />
                <text x={padding.left - 12} y={y + 4} textAnchor="end" fill="#8491A5" fontSize="11">{tick}</text>
              </g>
            );
          })}

          {subjects.map((subject, index) => {
            const score = Math.min(100, Math.max(0, subject.percentage));
            const barHeight = (score / 100) * plotHeight;
            const x = padding.left + slotWidth * index + (slotWidth - barWidth) / 2;
            const y = padding.top + plotHeight - barHeight;
            return (
              <g key={subject.name}>
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  rx="8"
                  fill="url(#analysis-subject-bars)"
                  className="analysis-chart-bar"
                  style={{ animationDelay: `${index * 90}ms` }}
                >
                  <title>{`${subject.name}: ${score.toFixed(1)}% (${subject.marks} of ${subject.maxMarks} marks)`}</title>
                </rect>
                <text x={x + barWidth / 2} y={Math.max(y - 10, padding.top + 12)} textAnchor="middle" fill="#344054" fontSize="12" fontWeight="700">
                  {score.toFixed(0)}%
                </text>
                <text x={x + barWidth / 2} y={chartHeight - 40} textAnchor="middle" fill="#667085" fontSize="11" fontWeight="500">
                  {subject.name.length > 13 ? `${subject.name.slice(0, 12)}…` : subject.name}
                </text>
                <text x={x + barWidth / 2} y={chartHeight - 22} textAnchor="middle" fill="#98A2B3" fontSize="10">
                  {subject.exams} {subject.exams === 1 ? "exam" : "exams"}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

function OverviewRow({ label, value, detail }) {
  return (
    <div className="flex flex-col gap-1 border-b border-slate-100 py-3 last:border-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="text-sm font-bold text-slate-800">
        {value}
        {detail && <span className="ml-2 text-xs font-medium text-slate-400">{detail}</span>}
      </span>
    </div>
  );
}

export default function StudentAnalysis() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [portalQuery, setPortalQuery] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const studentId = params.get("studentId");
    setPortalQuery(studentId ? `?adminView=1&studentId=${encodeURIComponent(studentId)}` : "");

    resultAPI.getMine(studentId)
      .then((response) => {
        if (!response.success) throw new Error(response.message || "Could not load your performance");
        setResults(response.data);
      })
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, []);

  const analysis = useMemo(() => {
    const orderedResults = results
      .map((result, index) => ({ ...result, originalIndex: index }))
      .sort((left, right) => {
        const leftTime = left.exam_date ? new Date(left.exam_date).getTime() : Number.NaN;
        const rightTime = right.exam_date ? new Date(right.exam_date).getTime() : Number.NaN;
        if (Number.isFinite(leftTime) && Number.isFinite(rightTime)) return leftTime - rightTime || left.originalIndex - right.originalIndex;
        if (Number.isFinite(leftTime)) return -1;
        if (Number.isFinite(rightTime)) return 1;
        return right.originalIndex - left.originalIndex;
      });

    const subjectTotals = new Map();
    let totalMarks = 0;
    let maxMarks = 0;

    orderedResults.forEach((result) => {
      totalMarks += Number(result.total) || 0;
      maxMarks += Number(result.max_total) || 0;
      (result.subjects || []).forEach((subject) => {
        const current = subjectTotals.get(subject.name) || {
          name: subject.name,
          marks: 0,
          maxMarks: 0,
          exams: 0,
        };
        current.marks += Number(subject.marks) || 0;
        current.maxMarks += Number(subject.max_marks) || 0;
        current.exams += 1;
        subjectTotals.set(subject.name, current);
      });
    });

    const subjects = [...subjectTotals.values()]
      .map((subject) => ({
        ...subject,
        percentage: subject.maxMarks ? (subject.marks / subject.maxMarks) * 100 : 0,
      }))
      .sort((left, right) => right.percentage - left.percentage);

    const trend = orderedResults.slice(-8).map((result) => ({
      ...result,
      percentage: percentageFor(result),
    }));
    const latest = orderedResults[orderedResults.length - 1] || null;
    const previous = orderedResults[orderedResults.length - 2] || null;
    const latestPercentage = latest ? percentageFor(latest) : null;
    const previousPercentage = previous ? percentageFor(previous) : null;

    return {
      subjects,
      trend,
      latest,
      overall: maxMarks ? (totalMarks / maxMarks) * 100 : null,
      strongestSubject: subjects[0] || null,
      subjectsBelowPassMark: subjects.filter((subject) => subject.percentage < 35).length,
      scoreChange: latestPercentage !== null && previousPercentage !== null
        ? latestPercentage - previousPercentage
        : null,
    };
  }, [results]);

  return (
    <div className="space-y-6">
      <PageTitle
        title="Academic Analysis"
        subtitle="A clear view of your scores, subject strengths, and progress across assessments."
      >
        <Link
          href={`/student/results${portalQuery}`}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition hover:border-[#C8102E]/30 hover:text-[#C8102E]"
        >
          View results
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-7-7l7 7-7 7" />
          </svg>
        </Link>
      </PageTitle>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[0, 1, 2, 3].map((item) => (
            <div key={item} className="h-32 animate-pulse rounded-2xl border border-slate-100 bg-white" />
          ))}
        </div>
      ) : error ? (
        <p role="alert" className="rounded-2xl border border-red-100 bg-white p-8 text-center text-sm text-red-600">{error}</p>
      ) : results.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
            <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v18h18M18 17V9M13 17V5M8 17v-3" />
            </svg>
          </div>
          <h2 className="mt-4 text-lg font-extrabold text-slate-900">Your academic analysis</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-500">
            Your performance dashboard will take shape as your exam results are published.
          </p>
        </div>
      ) : (
        <>
          <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#15192F] via-[#1B2B4B] to-[#12416A] p-6 text-white shadow-lg sm:p-8">
            <div className="pointer-events-none absolute -right-20 -top-28 h-72 w-72 rounded-full bg-blue-400/10 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-28 left-1/3 h-56 w-56 rounded-full bg-[#C8102E]/10 blur-2xl" />
            <div className="relative">
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-200">Student performance</p>
                  <h2 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">Academic overview</h2>
                  <p className="mt-1.5 text-sm text-blue-100/70">Your published assessment performance at a glance</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur-sm">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-blue-100/70">Assessments</p>
                  <p className="mt-0.5 text-xl font-extrabold">{results.length}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <MetricCard
                  label="Overall percentage"
                  value={analysis.overall === null ? "—" : `${analysis.overall.toFixed(1)}%`}
                  detail="Weighted across all published marks"
                  accent="bg-blue-300"
                />
                <MetricCard
                  label="Latest assessment"
                  value={analysis.latest ? `${percentageFor(analysis.latest).toFixed(1)}%` : "—"}
                  detail={analysis.latest?.exam_name || "No assessment recorded"}
                  accent="bg-emerald-400"
                />
                <MetricCard
                  label="Strongest subject"
                  value={analysis.strongestSubject?.name || "—"}
                  detail={analysis.strongestSubject ? `${analysis.strongestSubject.percentage.toFixed(1)}% average` : "No subject scores"}
                  accent="bg-amber-400"
                />
                <MetricCard
                  label="Assessments analyzed"
                  value={results.length}
                  detail="Published exam results"
                  accent="bg-rose-400"
                />
              </div>
            </div>
          </section>

          <Card className="overflow-hidden p-5 sm:p-6">
            <PerformanceTrendChart assessments={analysis.trend} />
            {analysis.scoreChange !== null && (
              <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-4 text-xs font-semibold">
                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 ${analysis.scoreChange >= 0 ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                  <span aria-hidden="true">{analysis.scoreChange >= 0 ? "↑" : "↓"}</span>
                  {Math.abs(analysis.scoreChange).toFixed(1)} pts
                </span>
                <span className="text-slate-500">change from the previous assessment</span>
              </div>
            )}
          </Card>

          <Card className="overflow-hidden p-5 sm:p-6">
            {analysis.subjects.length ? (
              <SubjectPerformanceChart subjects={analysis.subjects} />
            ) : (
              <p className="py-8 text-center text-sm text-slate-500">Subject marks will appear here with your assessment results.</p>
            )}
          </Card>

          <div className="grid grid-cols-1 gap-5 xl:grid-cols-[0.9fr_1.1fr]">
            <Card title="Academic overview">
              <div>
                <OverviewRow
                  label="Strongest subject"
                  value={analysis.strongestSubject?.name || "—"}
                  detail={analysis.strongestSubject ? `${analysis.strongestSubject.percentage.toFixed(1)}%` : ""}
                />
                <OverviewRow label="Subjects below pass mark" value={analysis.subjectsBelowPassMark} detail="35% benchmark" />
                <OverviewRow label="Subjects assessed" value={analysis.subjects.length} />
                <OverviewRow
                  label="Latest score"
                  value={analysis.latest ? `${analysis.latest.total} / ${analysis.latest.max_total}` : "—"}
                  detail={analysis.latest?.exam_name || ""}
                />
              </div>
            </Card>

            <Card
              title="Recent assessments"
              action={
                <Link href={`/student/results${portalQuery}`} className="text-xs font-bold text-[#C8102E] transition hover:underline">
                  All results
                </Link>
              }
            >
              <div className="divide-y divide-slate-100">
                {[...analysis.trend].reverse().slice(0, 5).map((result) => (
                  <div key={result.exam_id} className="flex flex-col gap-2 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-slate-800">{result.exam_name}</p>
                      <p className="mt-0.5 text-xs text-slate-500">
                        {result.exam_date ? new Date(result.exam_date).toLocaleDateString() : "Date not provided"}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-extrabold text-slate-800">{result.percentage.toFixed(1)}%</span>
                      <span className="text-xs font-medium text-slate-400">{result.total} / {result.max_total}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </>
      )}

      <style jsx global>{`
        @keyframes analysis-line-reveal {
          from { stroke-dashoffset: 2400; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes analysis-area-reveal {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes analysis-point-reveal {
          from { opacity: 0; transform: scale(0.35); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes analysis-bar-reveal {
          from { opacity: 0.35; transform: scaleY(0); }
          to { opacity: 1; transform: scaleY(1); }
        }
        .analysis-chart-line {
          stroke-dasharray: 2400;
          stroke-dashoffset: 2400;
          animation: analysis-line-reveal 1.35s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .analysis-chart-area {
          opacity: 0;
          animation: analysis-area-reveal 0.75s ease-out 0.35s forwards;
        }
        .analysis-chart-point {
          opacity: 0;
          transform-box: fill-box;
          transform-origin: center;
          animation: analysis-point-reveal 0.42s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .analysis-chart-bar {
          transform-box: fill-box;
          transform-origin: bottom;
          animation: analysis-bar-reveal 0.78s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        @media (prefers-reduced-motion: reduce) {
          .analysis-chart-line,
          .analysis-chart-area,
          .analysis-chart-point,
          .analysis-chart-bar {
            animation: none;
            stroke-dashoffset: 0;
            opacity: 1;
            transform: none;
          }
        }
      `}</style>
    </div>
  );
}
