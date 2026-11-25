"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { resultAPI } from "@/services/api";
import { Card, PageTitle } from "../ui";
import { formatDate } from "../utils";

function getPortalQuery() {
  const params = new URLSearchParams(window.location.search);
  const studentId = params.get("studentId");
  return studentId
    ? `?adminView=1&studentId=${encodeURIComponent(studentId)}`
    : "";
}

export default function StudentTests() {
  const [results, setResults] = useState([]);
  const [portalQuery, setPortalQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const query = getPortalQuery();
    setPortalQuery(query);
    const studentId = new URLSearchParams(window.location.search).get("studentId");

    resultAPI.getMine(studentId)
      .then((response) => {
        if (!response.success) throw new Error(response.message || "Could not load exam records");
        setResults(response.data);
      })
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <PageTitle
        title="Test & Exams"
        subtitle="Find exam updates and review your published test results."
      />

      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1a1a2e] to-[#0f3460] p-6 text-white">
        <div className="absolute -right-10 -top-12 h-44 w-44 rounded-full bg-white/5" />
        <div className="relative max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#F5C518]">Stay exam ready</p>
          <h2 className="mt-2 text-xl font-extrabold sm:text-2xl">Your assessments, in one place</h2>
        </div>
      </section>

      <Card title="Published exam results">
        {loading ? (
          <p className="py-8 text-center text-sm text-gray-500">Loading exam records...</p>
        ) : error ? (
          <p role="alert" className="py-8 text-center text-sm text-red-600">{error}</p>
        ) : results.length === 0 ? (
          <p className="py-8 text-center text-sm text-gray-500">
            No exam results have been published for your account yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left">
              <thead>
                <tr className="border-b border-gray-100 text-xs uppercase tracking-wide text-gray-400">
                  <th scope="col" className="px-3 pb-3 font-semibold">Examination</th>
                  <th scope="col" className="px-3 pb-3 font-semibold">Date</th>
                  <th scope="col" className="px-3 pb-3 font-semibold">Score</th>
                  <th scope="col" className="px-3 pb-3 font-semibold">Status</th>
                  <th scope="col" className="px-3 pb-3 font-semibold">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {results.map((result) => (
                  <tr key={result.exam_id}>
                    <th scope="row" className="px-3 py-4 text-sm font-bold text-[#1a1a2e]">{result.exam_name}</th>
                    <td className="px-3 py-4 text-sm text-gray-600">{formatDate(result.exam_date)}</td>
                    <td className="px-3 py-4 text-sm font-semibold text-gray-700">
                      {result.total} / {result.max_total}
                      <span className="ml-1 text-xs font-medium text-gray-400">
                        ({Number(result.percentage || 0).toFixed(1)}%)
                      </span>
                    </td>
                    <td className="px-3 py-4">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${result.passed ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"}`}>
                        {result.passed ? "Passed" : "Review needed"}
                      </span>
                    </td>
                    <td className="px-3 py-4">
                      <Link
                        href={`/student/results${portalQuery}${portalQuery ? "&" : "?"}examId=${encodeURIComponent(result.exam_id)}`}
                        className="text-sm font-bold text-[#C8102E] hover:underline"
                      >
                        View result
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
