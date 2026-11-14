"use client";

import { useEffect, useState } from "react";
import { studentPortalAPI } from "@/services/api";
import EmptyState from "@/components/EmptyState";
import Icon from "@/components/Icon";
import { icons } from "../icons";
import { Card, Field, PageTitle, inputClass } from "../ui";
import { formatDate, formatTime, fullName } from "../utils";

const PASSWORD_FIELDS = [
  ["currentPassword", "Current password"],
  ["newPassword", "New password"],
  ["confirmPassword", "Confirm new password"],
];

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    studentPortalAPI
      .getProfile()
      .then((res) => (res.success ? setProfile(res.data) : setError(res.message || "Could not load profile")))
      .catch(() => setError("Network error. Please try again."))
      .finally(() => setLoading(false));
  }, []);

  const student = profile?.student;
  const parents = profile?.parents ?? [];
  const batch = profile?.batches?.[0];
  const name = student ? fullName(student.first_name, student.last_name) : "";

  return (
    <div className="space-y-6">
      <PageTitle title="My Profile" subtitle="Your personal details, course and account settings." />

      {error && <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">{error}</div>}

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-6">
        <div className="space-y-6 min-w-0">
          <Card title="Personal Information">
            {loading ? (
              <p className="text-sm text-gray-400">Loading...</p>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                <Field label="Full name" value={name} />
                <Field label="Student ID" value={student?.admission_number} />
                <Field label="Username" value={student?.username} />
                <Field label="Date of birth" value={student?.date_of_birth && formatDate(student.date_of_birth)} />
                <Field label="Gender" value={student?.gender} />
                <Field label="Phone" value={student?.phone} />
                <Field label="Admission date" value={student?.admission_date && formatDate(student.admission_date)} />
                <div className="col-span-2">
                  <Field label="Address" value={student?.address} />
                </div>
              </div>
            )}
          </Card>

          <Card title="Parent / Guardian Details">
            {parents.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-4">No parent details added yet.</p>
            ) : (
              <div className="space-y-4">
                {parents.map((p, i) => (
                  <div key={i} className="grid grid-cols-2 lg:grid-cols-4 gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                    <Field label="Name" value={fullName(p.first_name, p.last_name)} />
                    <Field label="Relationship" value={p.relationship} />
                    <Field label="Phone" value={p.phone} />
                    <Field label="Email" value={p.email} />
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card title="Course & Batch">
            {batch ? (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Field label="Course" value={batch.course_name} />
                <Field label="Batch" value={batch.batch_name} />
                <Field label="Class timing" value={`${formatTime(batch.start_time)} - ${formatTime(batch.end_time)}`} />
                <Field label="Batch duration" value={`${formatDate(batch.start_date)} to ${formatDate(batch.end_date)}`} />
              </div>
            ) : (
              <p className="text-xs text-gray-400 text-center py-4">Not enrolled in any batch yet.</p>
            )}
          </Card>

          <Card title="Change Password">
            <form onSubmit={(e) => e.preventDefault()} className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {PASSWORD_FIELDS.map(([id, label]) => (
                <div key={id}>
                  <label htmlFor={id} className="text-xs font-semibold text-gray-500">{label}</label>
                  <input id={id} type="password" autoComplete="off" className={`${inputClass} mt-1`} />
                </div>
              ))}
              <div className="md:col-span-3 flex items-center gap-3">
                <button
                  type="submit"
                  disabled
                  className="rounded-xl bg-[#C8102E] text-white text-sm font-semibold px-5 py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Update Password
                </button>
                <span className="text-xs text-gray-400">Coming soon</span>
              </div>
            </form>
          </Card>

          <EmptyState title="Devices & Sessions" message="Devices where you are logged in will appear here." />
        </div>

        <div className="space-y-6">
          <IdCard student={student} name={name} batch={batch} />
        </div>
      </div>
    </div>
  );
}

function IdCard({ student, name, batch }) {
  return (
    <Card title="Digital ID Card">
      <div className="rounded-2xl overflow-hidden border border-gray-100">
        <div className="bg-gradient-to-br from-[#1a1a2e] to-[#0f3460] px-4 py-3 flex items-center gap-2 text-white">
          <Icon d={icons.cap} className="w-5 h-5" />
          <p className="text-sm font-bold">Lakshya</p>
          <span className="ml-auto text-[11px] text-gray-300">Student ID Card</span>
        </div>

        <div className="p-4 flex flex-col items-center text-center gap-3">
          <div className="w-20 h-20 rounded-2xl bg-[#C8102E] flex items-center justify-center text-white text-3xl font-extrabold overflow-hidden">
            {student?.photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={student.photo} alt={name} className="w-full h-full object-cover" />
            ) : (
              (name || "S").charAt(0).toUpperCase()
            )}
          </div>
          <div>
            <p className="font-extrabold text-[#1a1a2e]">{name || "-"}</p>
            <p className="text-xs text-gray-500">{student?.admission_number || "-"}</p>
          </div>
          <div className="w-full grid grid-cols-2 gap-3 text-left bg-gray-50 rounded-xl p-3">
            <Field label="Course" value={batch?.course_name} />
            <Field label="Batch" value={batch?.batch_name} />
            <Field label="Phone" value={student?.phone} />
            <Field label="Valid till" value={batch?.end_date && formatDate(batch.end_date)} />
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <button
          type="button"
          disabled
          className="flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Icon d={icons.user} className="w-4 h-4" />
          Change Photo
        </button>
        <span className="text-xs text-gray-400">Coming soon</span>
      </div>
    </Card>
  );
}
