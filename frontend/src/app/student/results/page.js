"use client";

import { useEffect, useState } from "react";
import Icon from "@/components/Icon";
import { icons } from "../icons";
import { Card, PageTitle } from "../ui";
import { resultAPI } from "@/services/api";

function getGrade(percentage) {
  if (percentage >= 90) return "A+";
  if (percentage >= 80) return "A";
  if (percentage >= 70) return "B+";
  if (percentage >= 60) return "B";
  if (percentage >= 50) return "C";
  return "Needs improvement";
}

function formatDate(value) {
  return value ? new Date(value).toLocaleDateString() : "Date not provided";
}

export default function StudentResults({ studentId: studentIdProp } = {}) {
  const [results, setResults] = useState([]);
  const [selectedExam, setSelectedExam] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const studentId = studentIdProp || params.get("studentId");
    const examId = params.get("examId");
    resultAPI.getMine(studentId)
      .then((response) => {
        if (!response.success) throw new Error(response.message || "Could not load your results");
        setResults(response.data);
        if (examId) setSelectedExam(examId);
      })
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, [studentIdProp]);

  const result = results.find((item) => String(item.exam_id) === selectedExam) || results[0];
  const activeExamId = result ? String(result.exam_id) : "";
  const totalMarks = result?.max_total || 0;
  const marksObtained = result?.total || 0;
  const percentage = totalMarks ? (marksObtained / totalMarks) * 100 : 0;
  const appearedSubjects = result?.subjects.length || 0;

  return (
    <div className="space-y-6">
      <PageTitle title="My Results" subtitle="Review your exam performance and subject-wise marks.">
        <div className="w-full sm:w-auto">
          <label htmlFor="exam" className="mb-1.5 block text-xs font-semibold text-gray-500">Examination</label>
          <select
            id="exam"
            value={activeExamId}
            onChange={(event) => setSelectedExam(event.target.value)}
            disabled={!results.length}
            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 focus:border-[#C8102E] focus:outline-none focus:ring-2 focus:ring-[#C8102E]/30 sm:min-w-64"
          >
            {results.map((exam) => (
              <option key={exam.exam_id} value={exam.exam_id}>
                {exam.exam_name} · {formatDate(exam.exam_date)}
              </option>
            ))}
          </select>
        </div>
      </PageTitle>

      {loading ? (
        <p className="rounded-2xl bg-white p-8 text-center text-sm text-gray-500">Loading your results...</p>
      ) : error ? (
        <p role="alert" className="rounded-2xl bg-white p-8 text-center text-sm text-red-600">{error}</p>
      ) : !result ? (
        <p className="rounded-2xl bg-white p-8 text-center text-sm text-gray-500">
          No exam results have been published for your account yet.
        </p>
      ) : (
        <>
          <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1a1a2e] to-[#0f3460] p-5 text-white sm:p-7">
            <div className="absolute -right-10 -top-14 h-48 w-48 rounded-full bg-white/5" />
            <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-300">Examination result</p>
                <h2 className="mt-2 text-xl font-extrabold sm:text-2xl">{result.exam_name}</h2>
                <p className="mt-1 text-sm text-gray-300">Result declared {formatDate(result.exam_date)}</p>
              </div>
              <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/10 px-4 py-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F5C518] text-lg font-extrabold text-[#1a1a2e]">
                  {getGrade(percentage)}
                </div>
                <div>
                  <p className="text-xs text-gray-300">Overall grade</p>
                  <p className="text-sm font-bold">{result.passed ? "Passed" : "Needs improvement"}</p>
                </div>
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <SummaryCard label="Total marks" value={`${result.total} / ${result.max_total}`} note="Marks obtained" icon={icons.document} color="bg-[#C8102E]" />
            <SummaryCard label="Overall percentage" value={`${percentage.toFixed(1)}%`} note="Passing score: 35% per subject" icon={icons.clipboardCheck} color="bg-green-500" />
            <SummaryCard label="Total subjects" value={appearedSubjects} note="Subjects with published marks" icon={icons.book} color="bg-[#1a1a2e]" />
          </div>

          <Card title="Subject-wise results">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left">
                <thead>
                  <tr className="border-b border-gray-100 text-xs uppercase tracking-wide text-gray-400">
                    {["Subject", "Marks", "Percentage", "Grade", "Result"].map((heading) => (
                      <th key={heading} scope="col" className="px-4 pb-3 font-semibold first:pl-0 last:pr-0">{heading}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {result.subjects.map((subject) => {
                    const subjectPercentage = (subject.marks / subject.max_marks) * 100;
                    const passed = subjectPercentage >= 35;
                    return (
                      <tr key={subject.name}>
                        <th scope="row" className="py-4 pr-4 text-left font-semibold text-[#1a1a2e]">{subject.name}</th>
                        <td className="px-4 py-4 text-sm font-semibold text-gray-700">{subject.marks} <span className="font-normal text-gray-400">/ {subject.max_marks}</span></td>
                        <td className="px-4 py-4 text-sm text-gray-600">{subjectPercentage.toFixed(1)}%</td>
                        <td className="px-4 py-4">
                          <span className="rounded-lg bg-gray-50 px-2.5 py-1 text-xs font-bold text-gray-700">{getGrade(subjectPercentage)}</span>
                        </td>
                        <td className="py-4 pl-4">
                          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${passed ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${passed ? "bg-green-500" : "bg-red-500"}`} />
                            {passed ? "Passed" : "Not passed"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>

          <Card title="Your performance">
            <div className="space-y-4">
              {result.subjects.map((subject) => {
                const subjectPercentage = (subject.marks / subject.max_marks) * 100;
                return (
                  <div key={subject.name}>
                    <div className="mb-1.5 flex justify-between gap-3 text-sm">
                      <span className="font-medium text-gray-700">{subject.name}</span>
                      <span className="font-semibold text-[#1a1a2e]">{subjectPercentage.toFixed(1)}%</span>
                    </div>
                    <div
                      className="h-2 overflow-hidden rounded-full bg-gray-100"
                      role="progressbar"
                      aria-label={`${subject.name} score`}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={Math.round(subjectPercentage)}
                    >
                      <div className="h-full rounded-full bg-gradient-to-r from-[#C8102E] to-[#F5C518]" style={{ width: `${subjectPercentage}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </>
      )}
    </div>
  );
}

function SummaryCard({ label, value, note, icon, color }) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</p>
        <div className={`flex h-9 w-9 items-center justify-center rounded-xl text-white ${color}`}>
          <Icon d={icon} />
        </div>
      </div>
      <p className="text-2xl font-extrabold text-[#1a1a2e]">{value}</p>
      <p className="text-xs text-gray-400">{note}</p>
    </div>
  );
}
