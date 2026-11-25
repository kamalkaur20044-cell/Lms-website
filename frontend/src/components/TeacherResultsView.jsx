"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Icon from "@/components/Icon";
import { resultAPI } from "@/services/api";
import StudentResultAnalysis from "@/components/StudentResultAnalysis";

function getGrade(percentage) {
  if (percentage >= 90) return "A+";
  if (percentage >= 80) return "A";
  if (percentage >= 70) return "B+";
  if (percentage >= 60) return "B";
  if (percentage >= 50) return "C";
  return "D";
}

export default function TeacherResultsView() {
  const [results, setResults] = useState([]);
  const [examId, setExamId] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [loadError, setLoadError] = useState("");
  const [selectedResult, setSelectedResult] = useState(null);

  const loadResults = useCallback(async () => {
    const response = await resultAPI.getAll();
    if (!response.success) throw new Error(response.message || "Could not load results");
    setResults(response.data);
  }, []);

  useEffect(() => {
    loadResults()
      .catch((requestError) => setLoadError(requestError.message))
      .finally(() => setLoading(false));
  }, [loadResults]);

  useEffect(() => {
    if (!message && !error) return undefined;
    const timer = setTimeout(() => {
      setMessage("");
      setError("");
    }, 5000);
    return () => clearTimeout(timer);
  }, [message, error]);

  const handleUpload = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!file) {
      setError("Choose an Excel workbook first.");
      return;
    }

    setUploading(true);
    setError("");
    setMessage("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await resultAPI.upload(formData);
      if (!response.success) throw new Error(response.message || "Could not upload results");
      await loadResults();
      setFile(null);
      form.reset();
      setMessage(`${response.importedRecords} result rows imported successfully.`);
    } catch (uploadError) {
      setError(uploadError.message);
    } finally {
      setUploading(false);
    }
  };

  const exams = useMemo(() => {
    const uniqueExams = new Map();
    for (const result of results) {
      if (!uniqueExams.has(result.exam_id)) {
        uniqueExams.set(result.exam_id, { id: String(result.exam_id), name: result.exam_name, date: result.exam_date });
      }
    }
    return [...uniqueExams.values()];
  }, [results]);
  const activeExamId = exams.some((exam) => exam.id === examId) ? examId : exams[0]?.id || "";
  const examResults = results.filter((result) => String(result.exam_id) === activeExamId);
  const query = search.trim().toLowerCase();
  const filteredResults = examResults.filter((result) =>
    !query ||
    result.student_name.toLowerCase().includes(query) ||
    result.admission_number.toLowerCase().includes(query)
  );
  const subjects = [...new Set(examResults.flatMap((result) => result.subjects.map((subject) => subject.name)))];
  const average = filteredResults.length
    ? filteredResults.reduce((sum, result) => sum + result.percentage, 0) / filteredResults.length
    : 0;
  const passRate = filteredResults.length
    ? (filteredResults.filter((result) => result.passed).length / filteredResults.length) * 100
    : 0;

  if (selectedResult) {
    return <StudentResultAnalysis result={selectedResult} onBack={() => setSelectedResult(null)} />;
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#C8102E]">Academic performance</p>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-[#1a1a2e]">Student results</h1>
          <p className="mt-1 text-sm text-gray-500">Review examination marks for students.</p>
        </div>
        <label className="w-full sm:w-auto">
          <span className="mb-1.5 block text-xs font-semibold text-gray-500">Examination</span>
          <select
            value={activeExamId}
            onChange={(event) => setExamId(event.target.value)}
            disabled={!exams.length}
            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 focus:border-[#C8102E] focus:outline-none sm:min-w-64"
          >
            {exams.map((exam) => (
              <option key={exam.id} value={exam.id}>{exam.name} · {new Date(exam.date).toLocaleDateString()}</option>
            ))}
          </select>
        </label>
      </div>

      <form onSubmit={handleUpload} className="space-y-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <div>
          <h2 className="text-sm font-bold text-[#1a1a2e]">Upload student results</h2>
          <p className="mt-1 text-xs text-gray-500">
            Excel columns: Exam Name, Exam Date, Admission Number, Subject, Marks, Maximum Marks.
            Use one row per student and subject. Optional columns: Correct Answers, Wrong Answers, Unanswered.
            Exam name and date are saved to exams; subjects must already exist.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={(event) => setFile(event.target.files?.[0] || null)}
            aria-label="Choose results Excel file"
            className="block w-full text-sm text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-gray-100 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-gray-700"
          />
          <button
            type="submit"
            disabled={uploading}
            className="whitespace-nowrap rounded-xl bg-[#C8102E] px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {uploading ? "Uploading..." : "Upload results"}
          </button>
        </div>
        {message && <p role="status" className="text-sm text-green-700">{message}</p>}
        {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
      </form>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Students" value={filteredResults.length} icon="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" color="bg-[#1a1a2e]" />
        <StatCard label="Class average" value={`${average.toFixed(1)}%`} icon="M3 3v18h18M18 17V9m-5 8V5m-5 12v-3" color="bg-blue-500" />
        <StatCard label="Pass rate" value={`${passRate.toFixed(0)}%`} icon="M9 12l2 2 4-4m6-2a9 9 0 11-18 0 9 9 0 0118 0z" color="bg-green-500" />
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by student name or admission number..."
          aria-label="Search students"
          className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-[#C8102E] focus:outline-none sm:max-w-lg"
        />
        <p className="mt-2 text-xs text-gray-500">{filteredResults.length} students</p>
      </div>

      <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-5 py-4">
          <h2 className="text-sm font-bold text-[#1a1a2e]">{exams.find((exam) => exam.id === activeExamId)?.name || "Exam results"}</h2>
          <p className="mt-1 text-xs text-gray-400">Marks and performance by student</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-[#f7f8fc]">
                {["Student", ...subjects, "Total", "Percentage", "Grade", "Result"].map((heading) => (
                  <th key={heading} scope="col" className="whitespace-nowrap px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-gray-500">{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredResults.map((result) => (
                <tr
                  key={`${result.exam_id}-${result.student_id}`}
                  onClick={() => setSelectedResult(result)}
                  className="cursor-pointer transition-colors hover:bg-blue-50/60 focus-visible:bg-blue-50/60 focus-visible:outline-none"
                >
                  <th scope="row" className="px-4 py-3.5 text-left">
                    <button type="button" onClick={(event) => { event.stopPropagation(); setSelectedResult(result); }} className="text-left focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8102E]">
                      <span className="block whitespace-nowrap font-semibold text-[#1a1a2e]">{result.student_name}</span>
                      <span className="mt-0.5 block font-mono text-xs font-normal text-gray-400">{result.admission_number}</span>
                      <span className="sr-only">Open performance analysis</span>
                    </button>
                  </th>
                  {subjects.map((subjectName) => {
                    const subject = result.subjects.find((item) => item.name === subjectName);
                    return <td key={subjectName} className="whitespace-nowrap px-4 py-3.5 font-medium text-gray-700">{subject ? `${subject.marks} / ${subject.max_marks}` : "—"}</td>;
                  })}
                  <td className="whitespace-nowrap px-4 py-3.5 font-bold text-[#1a1a2e]">{result.total} / {result.max_total}</td>
                  <td className="px-4 py-3.5 font-semibold text-gray-700">{result.percentage.toFixed(1)}%</td>
                  <td className="px-4 py-3.5"><span className="rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-bold text-gray-700">{getGrade(result.percentage)}</span></td>
                  <td className="px-4 py-3.5">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${result.passed ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                      {result.passed ? "Passed" : "Not passed"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && (
            <div className="py-12 text-center">
              <p className="text-sm font-medium text-gray-500">{loadError || "No results found for this examination."}</p>
            </div>
          )}
          {loading && <p className="py-10 text-center text-sm text-gray-500">Loading results...</p>}
        </div>
      </section>
    </div>
  );
}

function StatCard({ label, value, icon, color }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${color}`}>
        <Icon d={icon} className="h-5 w-5 text-white" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold text-gray-500">{label}</p>
        <p className="mt-0.5 text-xl font-extrabold text-[#1a1a2e]">{value}</p>
      </div>
    </div>
  );
}
