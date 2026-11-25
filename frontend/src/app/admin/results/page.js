"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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

function formatDate(value) {
  if (!value) return "";
  return new Date(value).toLocaleDateString();
}

export default function AdminResultsPage() {
  const [results, setResults] = useState([]);
  const [selectedExam, setSelectedExam] = useState("");
  const [search, setSearch] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
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

  const exams = useMemo(() => {
    const uniqueExams = new Map();
    for (const result of results) {
      if (!uniqueExams.has(result.exam_id)) {
        uniqueExams.set(result.exam_id, {
          id: String(result.exam_id),
          name: result.exam_name,
          date: result.exam_date,
        });
      }
    }
    return [...uniqueExams.values()];
  }, [results]);

  const activeExamId = exams.some((exam) => exam.id === selectedExam)
    ? selectedExam
    : exams[0]?.id || "";
  const examResults = useMemo(
    () => results.filter((result) => String(result.exam_id) === activeExamId),
    [activeExamId, results]
  );
  const query = search.trim().toLowerCase();
  const filteredResults = examResults.filter((result) =>
    !query ||
    result.student_name.toLowerCase().includes(query) ||
    result.admission_number.toLowerCase().includes(query)
  );
  const subjects = [...new Set(examResults.flatMap((result) => result.subjects.map((subject) => subject.name)))];
  const summary = useMemo(() => {
    const average = filteredResults.length
      ? filteredResults.reduce((sum, result) => sum + result.percentage, 0) / filteredResults.length
      : 0;
    const highest = filteredResults.length
      ? Math.max(...filteredResults.map((result) => result.percentage))
      : 0;
    const passRate = filteredResults.length
      ? (filteredResults.filter((result) => result.passed).length / filteredResults.length) * 100
      : 0;
    return { average, highest, passRate };
  }, [filteredResults]);

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

  if (selectedResult) {
    return <StudentResultAnalysis result={selectedResult} onBack={() => setSelectedResult(null)} />;
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-extrabold text-[#1a1a2e]">Student Results</h1>
          <p className="text-sm text-gray-500">Import and review examination marks.</p>
        </div>
        <label className="w-full sm:w-auto">
          <span className="mb-1.5 block text-xs font-semibold text-gray-500">Examination</span>
          <select
            value={activeExamId}
            onChange={(event) => setSelectedExam(event.target.value)}
            disabled={!exams.length}
            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-[#C8102E] focus:outline-none sm:min-w-64"
          >
            {exams.map((exam) => (
              <option key={exam.id} value={exam.id}>{exam.name} · {formatDate(exam.date)}</option>
            ))}
          </select>
        </label>
      </div>

      <form onSubmit={handleUpload} className="space-y-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <div>
          <h2 className="text-sm font-bold text-[#1a1a2e]">Import results from Excel</h2>
          <p className="mt-1 text-xs text-gray-500">
            Use columns: Exam Name, Exam Date, Admission Number, Subject, Marks, Maximum Marks.
            Each row represents one student and subject. Optional columns: Correct Answers, Wrong Answers, Unanswered.
            Exam name and date are saved to exams; subjects must already exist.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={(event) => setFile(event.target.files?.[0] || null)}
            className="block w-full text-sm text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-gray-100 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-gray-700"
          />
          <button
            type="submit"
            disabled={uploading}
            className="whitespace-nowrap rounded-xl bg-[#C8102E] px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {uploading ? "Importing..." : "Upload results"}
          </button>
        </div>
        {message && <p role="status" className="text-sm text-green-700">{message}</p>}
        {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
      </form>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <SummaryCard label="Students" value={filteredResults.length} color="bg-[#1a1a2e]" icon="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        <SummaryCard label="Class average" value={`${summary.average.toFixed(1)}%`} color="bg-blue-500" icon="M3 3v18h18M18 17V9m-5 8V5m-5 12v-3" />
        <SummaryCard label="Pass rate" value={`${summary.passRate.toFixed(0)}%`} color="bg-green-500" icon="M9 12l2 2 4-4m6-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        <SummaryCard label="Highest score" value={`${summary.highest.toFixed(1)}%`} color="bg-[#C8102E]" icon="M12 8l3 4h-6l3-4zm0 4v8m-7 0h14M5 4h14l-1 6H6L5 4z" />
      </div>

      <div className="relative rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by student name or admission number..."
          aria-label="Search students"
          className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm focus:border-[#C8102E] focus:outline-none sm:max-w-lg"
        />
        <p className="mt-2 text-xs text-gray-500">{filteredResults.length} students</p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-5 py-4">
          <h2 className="text-sm font-bold text-[#1a1a2e]">
            {exams.find((exam) => exam.id === activeExamId)?.name || "Exam results"}
          </h2>
          <p className="mt-0.5 text-xs text-gray-400">
            {exams.find((exam) => exam.id === activeExamId)
              ? `Results declared ${formatDate(exams.find((exam) => exam.id === activeExamId).date)}`
              : "Upload a spreadsheet to add exam results."}
          </p>
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
                    return (
                      <td key={subjectName} className="whitespace-nowrap px-4 py-3.5 font-medium text-gray-700">
                        {subject ? `${subject.marks} / ${subject.max_marks}` : "—"}
                      </td>
                    );
                  })}
                  <td className="whitespace-nowrap px-4 py-3.5 font-bold text-[#1a1a2e]">{result.total} / {result.max_total}</td>
                  <td className="px-4 py-3.5 font-semibold text-gray-700">{result.percentage.toFixed(1)}%</td>
                  <td className="px-4 py-3.5">
                    <span className="rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-bold text-gray-700">{getGrade(result.percentage)}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${result.passed ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                      {result.passed ? "Passed" : "Not passed"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && filteredResults.length === 0 && (
            <div className="py-16 text-center">
              <p className="text-sm font-medium text-gray-500">{loadError || "No results found"}</p>
              <p className="mt-1 text-xs text-gray-400">Upload results or change your search.</p>
            </div>
          )}
          {loading && <p className="py-10 text-center text-sm text-gray-500">Loading results...</p>}
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ label, value, color, icon }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${color}`}>
        <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
        </svg>
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold text-gray-500">{label}</p>
        <p className="mt-0.5 text-xl font-extrabold text-[#1a1a2e]">{value}</p>
      </div>
    </div>
  );
}
