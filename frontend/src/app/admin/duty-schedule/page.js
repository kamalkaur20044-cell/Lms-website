"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { employeeDutyScheduleAPI } from "@/services/api";

const days = [
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
  { value: 7, label: "Sunday" },
];

const getLocalDate = () => {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
};

const newScheduleForm = () => ({
  effective_from: getLocalDate(),
  effective_to: "",
  working_days: [],
  special: [],
});

const dateValue = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value.slice(0, 10);
  const date = new Date(value);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};

const scheduleToForm = (schedule) => {
  if (!schedule) return newScheduleForm();
  const workingDays = new Map((schedule.working_days || []).map((day) => [
    Number(day.day_of_week),
    {
      day_of_week: Number(day.day_of_week),
      start_time: String(day.start_time || "").slice(0, 5),
      end_time: String(day.end_time || "").slice(0, 5),
      slots: [],
    },
  ]));
  schedule.slots
    .filter((slot) => slot.schedule_kind === "weekly")
    .forEach((slot) => {
      const dayNumber = Number(slot.day_of_week);
      const startTime = String(slot.start_time || "").slice(0, 5);
      const endTime = String(slot.end_time || "").slice(0, 5);
      let dayPlan = workingDays.get(dayNumber);
      if (!dayPlan) {
        dayPlan = { day_of_week: dayNumber, start_time: startTime, end_time: endTime, slots: [] };
        workingDays.set(dayNumber, dayPlan);
      } else if (!schedule.working_days?.length) {
        dayPlan.start_time = startTime < dayPlan.start_time ? startTime : dayPlan.start_time;
        dayPlan.end_time = endTime > dayPlan.end_time ? endTime : dayPlan.end_time;
      }
      dayPlan.slots.push({
        start_time: startTime,
        end_time: endTime,
        duty_type: slot.duty_type || "duty",
        title: slot.title || "",
        description: slot.description || "",
        location: slot.location || "",
      });
    });
  return {
    effective_from: dateValue(schedule.effective_from),
    effective_to: dateValue(schedule.effective_to),
    working_days: [...workingDays.values()].sort((first, second) => first.day_of_week - second.day_of_week),
    special: schedule.slots
      .filter((slot) => slot.schedule_kind === "special")
      .map((slot) => ({
        date: dateValue(slot.duty_date),
        start_time: String(slot.start_time || "").slice(0, 5),
        end_time: String(slot.end_time || "").slice(0, 5),
        duty_type: slot.duty_type || "duty",
        title: slot.title || "",
        description: slot.description || "",
        location: slot.location || "",
      })),
  };
};

const inputClass = "w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none transition focus:border-[#C8102E] focus:ring-2 focus:ring-[#C8102E]/10";

function ScheduleSlotFields({ slot, onChange, onRemove, special = false }) {
  const field = (name, value) => onChange(name, value);

  return (
    <div className="space-y-3 rounded-xl border border-gray-100 bg-gray-50/70 p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-bold text-gray-700">{special ? "Special duty" : "Class or duty"}</p>
        <button type="button" onClick={onRemove} className="rounded-lg px-2 py-1 text-xs font-semibold text-red-600 transition hover:bg-red-50">
          Remove
        </button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {special ? (
          <label className="text-xs font-semibold text-gray-600">
            Date
            <input required type="date" value={slot.date} onChange={(event) => field("date", event.target.value)} className={`${inputClass} mt-1.5`} />
          </label>
        ) : null}
        <label className="text-xs font-semibold text-gray-600">
          Start time
          <input required type="time" value={slot.start_time} onChange={(event) => field("start_time", event.target.value)} className={`${inputClass} mt-1.5`} />
        </label>
        <label className="text-xs font-semibold text-gray-600">
          End time
          <input required type="time" value={slot.end_time} onChange={(event) => field("end_time", event.target.value)} className={`${inputClass} mt-1.5`} />
        </label>
        <label className="text-xs font-semibold text-gray-600">
          Entry type
          <select value={slot.duty_type} onChange={(event) => field("duty_type", event.target.value)} className={`${inputClass} mt-1.5`}>
            <option value="class">Class</option>
            <option value="duty">Duty</option>
            <option value="break">Break</option>
          </select>
        </label>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-xs font-semibold text-gray-600">
          Title
          <input required maxLength={120} value={slot.title} onChange={(event) => field("title", event.target.value)} placeholder="e.g. Physics · Grade 12" className={`${inputClass} mt-1.5`} />
        </label>
        <label className="text-xs font-semibold text-gray-600">
          Room or location
          <input maxLength={120} value={slot.location} onChange={(event) => field("location", event.target.value)} placeholder="e.g. Room 204" className={`${inputClass} mt-1.5`} />
        </label>
      </div>
      <label className="block text-xs font-semibold text-gray-600">
        Details
        <input maxLength={500} value={slot.description} onChange={(event) => field("description", event.target.value)} placeholder="Batch, class, or instructions" className={`${inputClass} mt-1.5`} />
      </label>
    </div>
  );
}

export default function DutyScheduleAdminPage() {
  const [employees, setEmployees] = useState([]);
  const [selectedKey, setSelectedKey] = useState("");
  const [form, setForm] = useState(newScheduleForm);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const formSectionRef = useRef(null);

  const fetchEmployees = useCallback(async (initializeSelection = false) => {
    setLoading(true);
    setError("");
    try {
      const response = await employeeDutyScheduleAPI.getAll();
      if (!response.success || !Array.isArray(response.data)) {
        throw new Error(response.message || "Could not load employees.");
      }
      setEmployees(response.data);
      if (initializeSelection && response.data.length) {
        const firstEmployee = response.data[0];
        setSelectedKey(`${firstEmployee.employee_type}:${firstEmployee.id}`);
        setForm(scheduleToForm(firstEmployee.schedule));
      }
    } catch (requestError) {
      setError(requestError.message || "Could not load employees.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees(true);
  }, [fetchEmployees]);

  useEffect(() => {
    if (!success) return undefined;
    const timeoutId = window.setTimeout(() => setSuccess(""), 4500);
    return () => window.clearTimeout(timeoutId);
  }, [success]);

  const filteredEmployees = useMemo(() => employees.filter((employee) => {
    const employeeTypeMatch = typeFilter === "all" || employee.employee_type === typeFilter;
    const searchText = `${employee.first_name} ${employee.last_name || ""} ${employee.employee_id || ""} ${employee.position || ""}`.toLowerCase();
    return employeeTypeMatch && searchText.includes(search.trim().toLowerCase());
  }), [employees, search, typeFilter]);

  const selectedEmployee = employees.find((employee) =>
    `${employee.employee_type}:${employee.id}` === selectedKey
  ) || null;

  const selectEmployee = (employee) => {
    setSelectedKey(`${employee.employee_type}:${employee.id}`);
    setForm(scheduleToForm(employee.schedule));
    setError("");
    setSuccess("");
  };

  const updateSlot = (collection, index, field, value) => {
    setForm((current) => ({
      ...current,
      [collection]: current[collection].map((slot, slotIndex) =>
        slotIndex === index ? { ...slot, [field]: value } : slot
      ),
    }));
  };

  const addSlot = (collection) => {
    const slot = { date: "", start_time: "", end_time: "", duty_type: "duty", title: "", description: "", location: "" };
    setForm((current) => ({ ...current, [collection]: [...current[collection], slot] }));
  };

  const addWorkingDay = () => {
    setForm((current) => {
      const day = days.find((item) =>
        !current.working_days.some((workingDay) => workingDay.day_of_week === item.value)
      );
      if (!day) return current;
      return {
        ...current,
        working_days: [
          ...current.working_days,
          { day_of_week: day.value, start_time: "", end_time: "", slots: [] },
        ].sort((first, second) => first.day_of_week - second.day_of_week),
      };
    });
  };

  const updateWorkingDay = (dayIndex, field, value) => {
    setForm((current) => ({
      ...current,
      working_days: current.working_days.map((day, index) =>
        index === dayIndex ? { ...day, [field]: value } : day
      ),
    }));
  };

  const addWorkingDaySlot = (dayIndex) => {
    setForm((current) => ({
      ...current,
      working_days: current.working_days.map((day, index) =>
        index === dayIndex
          ? {
            ...day,
            slots: [...day.slots, { start_time: "", end_time: "", duty_type: "class", title: "", description: "", location: "" }],
          }
          : day
      ),
    }));
  };

  const updateWorkingDaySlot = (dayIndex, slotIndex, field, value) => {
    setForm((current) => ({
      ...current,
      working_days: current.working_days.map((day, index) => index === dayIndex
        ? {
          ...day,
          slots: day.slots.map((slot, itemIndex) =>
            itemIndex === slotIndex ? { ...slot, [field]: value } : slot
          ),
        }
        : day
      ),
    }));
  };

  const removeWorkingDaySlot = (dayIndex, slotIndex) => {
    setForm((current) => ({
      ...current,
      working_days: current.working_days.map((day, index) => index === dayIndex
        ? { ...day, slots: day.slots.filter((_, itemIndex) => itemIndex !== slotIndex) }
        : day
      ),
    }));
  };

  const removeWorkingDay = (dayIndex) => {
    setForm((current) => ({
      ...current,
      working_days: current.working_days.filter((_, index) => index !== dayIndex),
    }));
  };

  const removeSlot = (collection, index) => {
    setForm((current) => ({
      ...current,
      [collection]: current[collection].filter((_, slotIndex) => slotIndex !== index),
    }));
  };

  const handleSave = async (event) => {
    event.preventDefault();
    if (!selectedEmployee) return;
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const response = await employeeDutyScheduleAPI.save(
        selectedEmployee.employee_type,
        selectedEmployee.id,
        {
          effective_from: form.effective_from,
          effective_to: form.effective_to,
          working_days: form.working_days.map(({ day_of_week, start_time, end_time }) => ({
            day_of_week,
            start_time,
            end_time,
          })),
          weekly: form.working_days.flatMap((day) => day.slots.map((slot) => ({
            ...slot,
            day_of_week: day.day_of_week,
          }))),
          special: form.special,
        }
      );
      if (!response.success) throw new Error(response.message || "Could not save this schedule.");
      setEmployees((current) => current.map((employee) =>
        employee.employee_type === selectedEmployee.employee_type && employee.id === selectedEmployee.id
          ? { ...employee, schedule: response.data }
          : employee
      ));
      setForm(scheduleToForm(response.data));
      setSuccess("Duty schedule saved and shared with the employee.");
      formSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (requestError) {
      setError(requestError.message || "Could not save this schedule.");
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async () => {
    if (!selectedEmployee?.schedule) return;
    if (!window.confirm(`Remove the duty schedule for ${selectedEmployee.first_name} ${selectedEmployee.last_name || ""}?`)) return;
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const response = await employeeDutyScheduleAPI.delete(selectedEmployee.employee_type, selectedEmployee.id);
      if (!response.success) throw new Error(response.message || "Could not remove this schedule.");
      setEmployees((current) => current.map((employee) =>
        employee.employee_type === selectedEmployee.employee_type && employee.id === selectedEmployee.id
          ? { ...employee, schedule: null }
          : employee
      ));
      setForm(newScheduleForm());
      setSuccess("Duty schedule removed.");
    } catch (requestError) {
      setError(requestError.message || "Could not remove this schedule.");
    } finally {
      setSaving(false);
    }
  };

  const activeCount = employees.filter((employee) => employee.status === "active").length;
  const assignedCount = employees.filter((employee) => employee.schedule).length;

  return (
    <div className="space-y-6">
      {success && (
        <div role="status" aria-live="polite" className="fixed right-5 top-5 z-[100] flex max-w-sm items-start gap-3 rounded-xl border border-emerald-200 bg-white px-4 py-3 shadow-xl shadow-emerald-950/10">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12l4 4L19 6" />
            </svg>
          </span>
          <p className="flex-1 pt-1 text-sm font-semibold text-gray-800">{success}</p>
          <button type="button" onClick={() => setSuccess("")} aria-label="Dismiss notification" className="rounded-md px-1 text-lg leading-5 text-gray-400 hover:bg-gray-100 hover:text-gray-700">×</button>
        </div>
      )}
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#C8102E]">People & operations</p>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-[#1a1a2e]">Duty schedules</h1>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Build weekly schedules and date-specific duties for teachers and staff.</p>
        </div>
        <button type="button" onClick={fetchEmployees} disabled={loading} className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-bold text-gray-700 transition hover:bg-gray-50 disabled:opacity-60">
          Refresh
        </button>
      </header>

      <div className="grid grid-cols-2 gap-3 sm:max-w-xl">
        {[
          { label: "Active employees", value: activeCount, color: "text-blue-700 bg-blue-50" },
          { label: "Schedules assigned", value: assignedCount, color: "text-emerald-700 bg-emerald-50" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold text-gray-500">{stat.label}</p>
            <p className={`mt-2 inline-flex rounded-lg px-2.5 py-1 text-xl font-extrabold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {error && <p role="alert" className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      <div className="grid items-start gap-5 xl:grid-cols-[minmax(280px,0.75fr)_minmax(0,1.65fr)]">
        <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="border-b border-gray-100 p-4">
            <h2 className="text-base font-extrabold text-[#1a1a2e]">Employees</h2>
            <div className="mt-3 flex gap-2">
              {[
                { label: "All", value: "all" },
                { label: "Teachers", value: "teacher" },
                { label: "Staff", value: "staff" },
              ].map((filter) => (
                <button key={filter.value} type="button" onClick={() => setTypeFilter(filter.value)} className={`rounded-full px-3 py-1.5 text-[11px] font-bold transition ${typeFilter === filter.value ? "bg-[#1a1a2e] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                  {filter.label}
                </button>
              ))}
            </div>
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name or employee ID" className={`${inputClass} mt-3`} />
          </div>
          <div className="max-h-[720px] divide-y divide-gray-50 overflow-y-auto">
            {loading ? (
              <p className="p-6 text-center text-sm text-gray-500">Loading employees...</p>
            ) : filteredEmployees.length === 0 ? (
              <p className="p-6 text-center text-sm text-gray-500">No matching employees.</p>
            ) : filteredEmployees.map((employee) => {
              const key = `${employee.employee_type}:${employee.id}`;
              const isSelected = selectedKey === key;
              return (
                <button key={key} type="button" onClick={() => selectEmployee(employee)} className={`w-full px-4 py-3.5 text-left transition ${isSelected ? "bg-red-50/70" : "hover:bg-gray-50"}`}>
                  <div className="flex items-center gap-3">
                    <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-extrabold ${employee.employee_type === "teacher" ? "bg-blue-50 text-blue-700" : "bg-violet-50 text-violet-700"}`}>
                      {[employee.first_name, employee.last_name].filter(Boolean).map((part) => part[0]).join("").toUpperCase()}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-bold text-gray-800">{employee.first_name} {employee.last_name || ""}</span>
                      <span className="mt-0.5 block truncate text-xs text-gray-500">{employee.position || (employee.employee_type === "teacher" ? "Teacher" : "Staff")} · {employee.employee_id}</span>
                    </span>
                    <span className={`h-2 w-2 rounded-full ${employee.status === "active" ? "bg-emerald-500" : "bg-gray-300"}`} title={employee.status} />
                  </div>
                  <span className="mt-2 flex items-center justify-between pl-[52px]">
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">{employee.employee_type}</span>
                    <span className={`text-[10px] font-bold ${employee.schedule ? "text-emerald-700" : "text-amber-700"}`}>{employee.schedule ? "Schedule assigned" : "No schedule"}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section ref={formSectionRef} className="scroll-mt-6 rounded-2xl border border-gray-100 bg-white shadow-sm">
          {!selectedEmployee ? (
            <div className="p-10 text-center text-sm text-gray-500">Choose an employee to create or update their schedule.</div>
          ) : (
            <form onSubmit={handleSave} className="space-y-6 p-4 sm:p-6">
              <div className="flex flex-col justify-between gap-3 border-b border-gray-100 pb-4 sm:flex-row sm:items-center">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-[#C8102E]">{selectedEmployee.employee_type} schedule</p>
                  <h2 className="mt-1 text-lg font-extrabold text-[#1a1a2e]">{selectedEmployee.first_name} {selectedEmployee.last_name || ""}</h2>
                  <p className="mt-1 text-xs text-gray-500">{selectedEmployee.employee_id} · {selectedEmployee.position || "Employee"}</p>
                </div>
                {selectedEmployee.schedule && <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">Currently assigned</span>}
              </div>

              {selectedEmployee.status !== "active" && (
                <p className="rounded-xl bg-amber-50 px-3 py-2.5 text-xs font-medium text-amber-800">This account is inactive and cannot receive schedule changes.</p>
              )}

              <div>
                <h3 className="text-sm font-extrabold text-gray-800">Schedule period</h3>
                <p className="mt-1 text-xs text-gray-500">The weekly plan is visible to the employee only during this period.</p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <label className="text-xs font-semibold text-gray-600">
                    Effective from
                    <input required type="date" value={form.effective_from} onChange={(event) => setForm((current) => ({ ...current, effective_from: event.target.value }))} className={`${inputClass} mt-1.5`} />
                  </label>
                  <label className="text-xs font-semibold text-gray-600">
                    Effective until <span className="font-normal text-gray-400">(optional)</span>
                    <input type="date" min={form.effective_from} value={form.effective_to} onChange={(event) => setForm((current) => ({ ...current, effective_to: event.target.value }))} className={`${inputClass} mt-1.5`} />
                  </label>
                </div>
              </div>

              <div>
                <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-extrabold text-gray-800">Working days and hours</h3>
                    <p className="mt-1 text-xs text-gray-500">Set the full shift for each day, then add its classes and duties.</p>
                  </div>
                  <button type="button" onClick={addWorkingDay} disabled={form.working_days.length === 7} className="rounded-xl border border-gray-200 px-3 py-2 text-xs font-bold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50">+ Add working day</button>
                </div>
                <div className="space-y-3">
                  {form.working_days.length === 0 ? (
                    <p className="rounded-xl border border-dashed border-gray-200 px-4 py-5 text-center text-xs text-gray-500">No working days added. Add a day to set its shift hours and schedule entries.</p>
                  ) : form.working_days.map((dayPlan, dayIndex) => (
                    <section key={`working-day-${dayIndex}`} className="space-y-4 rounded-2xl border border-gray-100 bg-gray-50/40 p-4">
                      <div className="flex flex-wrap items-end justify-between gap-3">
                        <label className="text-xs font-semibold text-gray-600">
                          Working day
                          <select
                            value={dayPlan.day_of_week}
                            onChange={(event) => updateWorkingDay(dayIndex, "day_of_week", Number(event.target.value))}
                            className={`${inputClass} mt-1.5 min-w-40`}
                          >
                            {days.map((day) => (
                              <option
                                key={day.value}
                                value={day.value}
                                disabled={form.working_days.some((otherDay, otherIndex) => otherIndex !== dayIndex && otherDay.day_of_week === day.value)}
                              >
                                {day.label}
                              </option>
                            ))}
                          </select>
                        </label>
                        <button type="button" onClick={() => removeWorkingDay(dayIndex)} className="rounded-lg px-2 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50">Remove day</button>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <label className="text-xs font-semibold text-gray-600">
                          Full-day start time
                          <input required type="time" value={dayPlan.start_time} onChange={(event) => updateWorkingDay(dayIndex, "start_time", event.target.value)} className={`${inputClass} mt-1.5`} />
                        </label>
                        <label className="text-xs font-semibold text-gray-600">
                          Full-day end time
                          <input required type="time" value={dayPlan.end_time} onChange={(event) => updateWorkingDay(dayIndex, "end_time", event.target.value)} className={`${inputClass} mt-1.5`} />
                        </label>
                      </div>
                      <div className="border-t border-gray-100 pt-4">
                        <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
                          <div>
                            <h4 className="text-xs font-extrabold text-gray-700">Classes and duties</h4>
                            <p className="mt-1 text-[11px] text-gray-500">Entries must fit within this day&apos;s working hours.</p>
                          </div>
                          <button type="button" onClick={() => addWorkingDaySlot(dayIndex)} className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-bold text-gray-700 transition hover:bg-gray-50">+ Add another class</button>
                        </div>
                        <div className="space-y-3">
                          {dayPlan.slots.length === 0 ? (
                            <p className="rounded-xl border border-dashed border-gray-200 bg-white px-4 py-4 text-center text-xs text-gray-500">No classes or duties added for this day.</p>
                          ) : dayPlan.slots.map((slot, slotIndex) => (
                            <ScheduleSlotFields
                              key={`weekly-${dayIndex}-${slotIndex}`}
                              slot={slot}
                              onChange={(field, value) => updateWorkingDaySlot(dayIndex, slotIndex, field, value)}
                              onRemove={() => removeWorkingDaySlot(dayIndex, slotIndex)}
                            />
                          ))}
                        </div>
                      </div>
                    </section>
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-extrabold text-gray-800">Special duties</h3>
                    <p className="mt-1 text-xs text-gray-500">Add one-time events or duties for a specific date.</p>
                  </div>
                  <button type="button" onClick={() => addSlot("special")} className="rounded-xl border border-gray-200 px-3 py-2 text-xs font-bold text-gray-700 transition hover:bg-gray-50">+ Add special duty</button>
                </div>
                <div className="space-y-3">
                  {form.special.length === 0 ? (
                    <p className="rounded-xl border border-dashed border-gray-200 px-4 py-5 text-center text-xs text-gray-500">No date-specific duties assigned.</p>
                  ) : form.special.map((slot, index) => (
                    <ScheduleSlotFields key={`special-${index}`} special slot={slot} onChange={(field, value) => updateSlot("special", index, field, value)} onRemove={() => removeSlot("special", index)} />
                  ))}
                </div>
              </div>

              <div className="flex flex-col-reverse justify-between gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:items-center">
                {selectedEmployee.schedule ? (
                  <button type="button" onClick={handleRemove} disabled={saving} className="rounded-xl px-3 py-2 text-xs font-bold text-red-600 transition hover:bg-red-50 disabled:opacity-50">Remove schedule</button>
                ) : <span />}
                <button type="submit" disabled={saving || selectedEmployee.status !== "active"} className="rounded-xl bg-[#C8102E] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#a50d25] disabled:cursor-not-allowed disabled:opacity-60">
                  {saving ? "Saving..." : "Save schedule"}
                </button>
              </div>
            </form>
          )}
        </section>
      </div>
    </div>
  );
}
