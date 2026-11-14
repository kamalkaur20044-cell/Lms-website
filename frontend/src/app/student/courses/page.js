"use client";

import { useEffect, useState } from "react";
import { studentPortalAPI } from "@/services/api";
import EmptyState from "@/components/EmptyState";
import Icon from "@/components/Icon";
import { icons } from "../icons";
import { Card, Field, PageTitle } from "../ui";
import { formatDate, formatTime, fullName } from "../utils";

export default function MyCourses() {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    studentPortalAPI
      .getCourses()
      .then((res) => (res.success ? setCourses(res.data) : setError(res.message || "Could not load courses")))
      .catch(() => setError("Network error. Please try again."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <PageTitle title="My Courses" subtitle="Your enrolled course, batch, subjects and faculty." />

      {error && <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">{error}</div>}
      {loading && <p className="text-sm text-gray-400">Loading...</p>}
      {!loading && !error && courses.length === 0 && (
        <EmptyState message="You are not enrolled in any course yet." />
      )}

      {courses.map((course) => (
        <CourseBlock key={course.batch_id} course={course} />
      ))}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <EmptyState title="Academic Calendar" message="Important academic dates will appear here." />
        <EmptyState title="Course Resources" message="Course resources will appear here once they are added." />
      </div>
    </div>
  );
}

function CourseBlock({ course }) {
  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-br from-[#1a1a2e] to-[#0f3460] rounded-2xl p-5 sm:p-6 text-white">
        <div className="flex flex-col lg:flex-row lg:items-center gap-5">
          <div className="flex items-start gap-4 flex-1 min-w-0">
            <div className="w-12 h-12 rounded-xl bg-[#C8102E] flex items-center justify-center flex-shrink-0">
              <Icon d={icons.book} className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg font-extrabold">{course.course_name}</h2>
              {course.course_description && <p className="text-sm text-gray-300 mt-1">{course.course_description}</p>}
              <div className="flex flex-wrap gap-2 mt-3 text-xs">
                <span className="bg-white/10 px-2.5 py-1 rounded-full">Batch: {course.batch_name}</span>
                {course.duration && <span className="bg-white/10 px-2.5 py-1 rounded-full">Duration: {course.duration}</span>}
                <span className="bg-white/10 px-2.5 py-1 rounded-full capitalize">{course.enrollment_status}</span>
                <span className="bg-[#F5C518] text-[#1a1a2e] font-semibold px-2.5 py-1 rounded-full">
                  {formatTime(course.start_time)} - {formatTime(course.end_time)}
                </span>
              </div>
            </div>
          </div>

          <div className="lg:w-64">
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-gray-300">Course completion</span>
              <span className="font-semibold">-</span>
            </div>
            <div className="h-2 rounded-full bg-white/10" />
            <p className="text-xs text-gray-400 mt-1.5">Coming soon</p>
          </div>
        </div>
      </div>

      <Card title="Programme & Batch Details">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Field label="Programme" value={course.course_name} />
          <Field label="Batch" value={course.batch_name} />
          <Field label="Batch starts" value={formatDate(course.start_date)} />
          <Field label="Batch ends" value={formatDate(course.end_date)} />
          <Field label="Class timing" value={`${formatTime(course.start_time)} - ${formatTime(course.end_time)}`} />
          <Field label="Enrolled on" value={formatDate(course.enrollment_date)} />
        </div>
      </Card>

      <Card title="Subjects & Faculty">
        {course.subjects.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-6">Subjects will appear here once they are assigned.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {course.subjects.map((subject) => (
              <SubjectCard key={subject.subject_id} subject={subject} />
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

function SubjectCard({ subject }) {
  const teacher = fullName(subject.teacher_first_name, subject.teacher_last_name);

  return (
    <div className="rounded-xl border border-gray-100 p-4 space-y-3">
      <div>
        <p className="font-bold text-[#1a1a2e]">{subject.subject_name}</p>
        {subject.description && <p className="text-xs text-gray-500 mt-0.5">{subject.description}</p>}
      </div>

      <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
        <div className="w-9 h-9 rounded-full bg-[#1a1a2e] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
          {(teacher || "?").charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-800 truncate">{teacher || "Faculty not assigned"}</p>
          <p className="text-xs text-gray-500 truncate">
            {[subject.qualification, subject.specialization].filter(Boolean).join(", ") || "-"}
          </p>
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Chapter-wise syllabus</p>
        <p className="text-xs text-gray-400">Chapters will appear here once they are added.</p>
      </div>
    </div>
  );
}
