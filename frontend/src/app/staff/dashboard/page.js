"use client";

import EmployeeDashboard from "@/components/EmployeeDashboard";

const STAFF_ROLES = ["staff", "admin"];

export default function StaffDashboard() {
  return <EmployeeDashboard allowedRoles={STAFF_ROLES} />;
}
