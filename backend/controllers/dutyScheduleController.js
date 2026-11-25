import db from "../config/db.js";

const employeeTables = {
  teacher: "teachers",
  staff: "staff",
};

const dutyTypes = new Set(["class", "duty", "break"]);
const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/;
const datePattern = /^\d{4}-\d{2}-\d{2}$/;

const isValidDate = (value) => {
  if (typeof value !== "string" || !datePattern.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
};

const parseEmployeeId = (value) => {
  const id = Number(value);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
};

const getEmployee = async (employeeType, employeeId, activeOnly = false) => {
  const table = employeeTables[employeeType];
  if (!table) return null;
  const [rows] = await db.query(
    `SELECT id, employee_id, first_name, last_name, status,
            ${employeeType === "teacher" ? "specialization" : "designation"} AS position,
            email
     FROM ${table}
     WHERE id = ?${activeOnly ? " AND status = 'active'" : ""}
     LIMIT 1`,
    [employeeId]
  );
  return rows[0] || null;
};

const getSchedule = async (employeeType, employeeId, includeCurrentOrUpcoming = false) => {
  const [schedules] = await db.query(
    `SELECT id, employee_type, employee_id,
            DATE_FORMAT(effective_from, '%Y-%m-%d') AS effective_from,
            DATE_FORMAT(effective_to, '%Y-%m-%d') AS effective_to,
            updated_at
     FROM employee_duty_schedules
     WHERE employee_type = ? AND employee_id = ?
       ${includeCurrentOrUpcoming ? "AND (effective_to IS NULL OR effective_to >= CURDATE())" : ""}
     ORDER BY effective_from DESC
     LIMIT 1`,
    [employeeType, employeeId]
  );
  const schedule = schedules[0];
  if (!schedule) return null;

  const [slots] = await db.query(
    `SELECT id, schedule_kind, day_of_week,
            DATE_FORMAT(duty_date, '%Y-%m-%d') AS duty_date,
            TIME_FORMAT(start_time, '%H:%i') AS start_time,
            TIME_FORMAT(end_time, '%H:%i') AS end_time,
            duty_type, title, description, location, sort_order
     FROM employee_duty_schedule_slots
     WHERE schedule_id = ?
     ORDER BY schedule_kind, day_of_week, duty_date, start_time, sort_order, id`,
    [schedule.id]
  );
  const [workingDays] = await db.query(
    `SELECT day_of_week,
            TIME_FORMAT(start_time, '%H:%i') AS start_time,
            TIME_FORMAT(end_time, '%H:%i') AS end_time
     FROM employee_duty_schedule_days
     WHERE schedule_id = ?
     ORDER BY day_of_week`,
    [schedule.id]
  );
  return { ...schedule, working_days: workingDays, slots };
};

const validateWorkingDays = (workingDays) => {
  if (!Array.isArray(workingDays) || workingDays.length > 7) {
    return "Working days must contain between zero and seven days.";
  }

  const seenDays = new Set();
  const normalizedDays = [];
  for (const dayPlan of workingDays) {
    const day = Number(dayPlan?.day_of_week);
    const start = dayPlan?.start_time;
    const end = dayPlan?.end_time;
    if (!Number.isInteger(day) || day < 1 || day > 7 || seenDays.has(day)) {
      return "Choose each working day only once.";
    }
    if (!timePattern.test(start || "") || !timePattern.test(end || "") || end <= start) {
      return "Each working day needs a valid start and end time.";
    }
    seenDays.add(day);
    normalizedDays.push({ day_of_week: day, start_time: start, end_time: end });
  }
  return normalizedDays;
};

const validateSlots = (weekly, special) => {
  if (!Array.isArray(weekly) || !Array.isArray(special)) {
    return "Weekly and special duty schedules must be lists.";
  }
  if (weekly.length + special.length > 200) {
    return "A schedule cannot contain more than 200 entries.";
  }

  const slots = [];
  for (const [scheduleKind, entries] of [["weekly", weekly], ["special", special]]) {
    for (const entry of entries) {
      const day = Number(entry?.day_of_week);
      const date = entry?.date;
      const start = entry?.start_time;
      const end = entry?.end_time;
      const title = typeof entry?.title === "string" ? entry.title.trim() : "";
      const description = typeof entry?.description === "string" ? entry.description.trim() : "";
      const location = typeof entry?.location === "string" ? entry.location.trim() : "";
      const dutyType = entry?.duty_type;

      if (scheduleKind === "weekly" && (!Number.isInteger(day) || day < 1 || day > 7)) {
        return "Choose a valid day for each weekly duty.";
      }
      if (scheduleKind === "special" && !isValidDate(date)) {
        return "Choose a valid date for each special duty.";
      }
      if (!timePattern.test(start || "") || !timePattern.test(end || "") || end <= start) {
        return "Each duty must have a valid start and end time, with the end after the start.";
      }
      if (!title || title.length > 120 || description.length > 500 || location.length > 120) {
        return "Duty titles are required (up to 120 characters); descriptions and locations have length limits.";
      }
      if (!dutyTypes.has(dutyType)) {
        return "Choose a valid duty type.";
      }

      slots.push({
        schedule_kind: scheduleKind,
        day_of_week: scheduleKind === "weekly" ? day : null,
        duty_date: scheduleKind === "special" ? date : null,
        start_time: start,
        end_time: end,
        duty_type: dutyType,
        title,
        description: description || null,
        location: location || null,
      });
    }
  }

  const groupedSlots = new Map();
  for (const slot of slots) {
    const key = slot.schedule_kind === "weekly"
      ? `weekly-${slot.day_of_week}`
      : `special-${slot.duty_date}`;
    const group = groupedSlots.get(key) || [];
    if (group.some((existing) => slot.start_time < existing.end_time && existing.start_time < slot.end_time)) {
      return "Duties for the same day or date cannot overlap.";
    }
    group.push(slot);
    groupedSlots.set(key, group);
  }

  return slots;
};

export const getDutySchedules = async (_req, res) => {
  try {
    const [teachers] = await db.query(
      `SELECT 'teacher' AS employee_type, id, employee_id, first_name, last_name,
              specialization AS position, email, status
       FROM teachers ORDER BY first_name, last_name`
    );
    const [staff] = await db.query(
      `SELECT 'staff' AS employee_type, id, employee_id, first_name, last_name,
              designation AS position, email, status
       FROM staff ORDER BY first_name, last_name`
    );
    const [schedules] = await db.query(
      `SELECT id, employee_type, employee_id,
              DATE_FORMAT(effective_from, '%Y-%m-%d') AS effective_from,
              DATE_FORMAT(effective_to, '%Y-%m-%d') AS effective_to,
              updated_at
       FROM employee_duty_schedules`
    );
    const scheduleIds = schedules.map((schedule) => schedule.id);
    let slots = [];
    let workingDays = [];
    if (scheduleIds.length) {
      const [slotRows] = await db.query(
        `SELECT id, schedule_id, schedule_kind, day_of_week,
                DATE_FORMAT(duty_date, '%Y-%m-%d') AS duty_date,
                TIME_FORMAT(start_time, '%H:%i') AS start_time,
                TIME_FORMAT(end_time, '%H:%i') AS end_time,
                duty_type, title, description, location, sort_order
         FROM employee_duty_schedule_slots
         WHERE schedule_id IN (?)
         ORDER BY schedule_kind, day_of_week, duty_date, start_time, sort_order, id`,
        [scheduleIds]
      );
      const [workingDayRows] = await db.query(
        `SELECT schedule_id, day_of_week,
                TIME_FORMAT(start_time, '%H:%i') AS start_time,
                TIME_FORMAT(end_time, '%H:%i') AS end_time
         FROM employee_duty_schedule_days
         WHERE schedule_id IN (?)
         ORDER BY day_of_week`,
        [scheduleIds]
      );
      slots = slotRows;
      workingDays = workingDayRows;
    }

    const slotsBySchedule = new Map();
    const workingDaysBySchedule = new Map();
    for (const slot of slots) {
      const group = slotsBySchedule.get(slot.schedule_id) || [];
      group.push(slot);
      slotsBySchedule.set(slot.schedule_id, group);
    }
    for (const day of workingDays) {
      const group = workingDaysBySchedule.get(day.schedule_id) || [];
      group.push(day);
      workingDaysBySchedule.set(day.schedule_id, group);
    }
    const schedulesByEmployee = new Map(
      schedules.map((schedule) => [
        `${schedule.employee_type}:${schedule.employee_id}`,
        {
          ...schedule,
          working_days: workingDaysBySchedule.get(schedule.id) || [],
          slots: slotsBySchedule.get(schedule.id) || [],
        },
      ])
    );
    const employees = [...teachers, ...staff].map((employee) => ({
      ...employee,
      schedule: schedulesByEmployee.get(`${employee.employee_type}:${employee.id}`) || null,
    }));

    return res.status(200).json({ success: true, data: employees });
  } catch (error) {
    console.error("Failed to load duty schedules:", error);
    return res.status(500).json({ success: false, message: "Failed to load duty schedules." });
  }
};

export const getMyDutySchedule = async (req, res) => {
  try {
    const employeeType = req.user.role;
    const table = employeeTables[employeeType];
    if (!table) {
      return res.status(403).json({ success: false, message: "Duty schedules are only available to teachers and staff." });
    }

    const [employees] = await db.query(
      `SELECT id, employee_id, first_name, last_name, status,
              ${employeeType === "teacher" ? "specialization" : "designation"} AS position,
              email
       FROM ${table}
       WHERE user_id = ? AND status = 'active'
       LIMIT 1`,
      [req.user.user_id]
    );
    const currentEmployee = employees[0];
    if (!currentEmployee) {
      return res.status(404).json({ success: false, message: "Active employee record not found." });
    }
    const schedule = await getSchedule(employeeType, currentEmployee.id, true);
    return res.status(200).json({
      success: true,
      data: { employee_type: employeeType, ...currentEmployee, schedule },
    });
  } catch (error) {
    console.error("Failed to load employee duty schedule:", error);
    return res.status(500).json({ success: false, message: "Failed to load your duty schedule." });
  }
};

export const getEmployeeDutySchedule = async (req, res) => {
  const { employeeType } = req.params;
  const employeeId = parseEmployeeId(req.params.employeeId);
  if (!employeeTables[employeeType] || !employeeId) {
    return res.status(400).json({ success: false, message: "Choose a valid employee." });
  }

  try {
    const employee = await getEmployee(employeeType, employeeId);
    if (!employee) {
      return res.status(404).json({ success: false, message: "Employee not found." });
    }
    const schedule = await getSchedule(employeeType, employeeId, true);
    return res.status(200).json({
      success: true,
      data: { employee_type: employeeType, ...employee, schedule },
    });
  } catch (error) {
    console.error("Failed to load employee duty schedule:", error);
    return res.status(500).json({ success: false, message: "Failed to load employee duty schedule." });
  }
};

export const saveEmployeeDutySchedule = async (req, res) => {
  const { employeeType } = req.params;
  const employeeId = parseEmployeeId(req.params.employeeId);
  if (!employeeTables[employeeType] || !employeeId) {
    return res.status(400).json({ success: false, message: "Choose a valid employee." });
  }

  const {
    effective_from: effectiveFrom,
    effective_to: effectiveTo,
    working_days: workingDaysInput,
    weekly,
    special,
  } = req.body || {};
  if (!isValidDate(effectiveFrom) || (effectiveTo && !isValidDate(effectiveTo))) {
    return res.status(400).json({ success: false, message: "Enter a valid schedule effective date." });
  }
  if (effectiveTo && effectiveTo < effectiveFrom) {
    return res.status(400).json({ success: false, message: "The end date must be on or after the start date." });
  }

  if (Array.isArray(special) && special.some((slot) =>
    isValidDate(slot?.date) && (slot.date < effectiveFrom || (effectiveTo && slot.date > effectiveTo))
  )) {
    return res.status(400).json({ success: false, message: "Special duties must fall within the schedule period." });
  }

  const slots = validateSlots(weekly, special);
  if (typeof slots === "string") {
    return res.status(400).json({ success: false, message: slots });
  }
  const workingDays = validateWorkingDays(workingDaysInput);
  if (typeof workingDays === "string") {
    return res.status(400).json({ success: false, message: workingDays });
  }
  const workingDaysByNumber = new Map(workingDays.map((day) => [day.day_of_week, day]));
  for (const slot of slots.filter((item) => item.schedule_kind === "weekly")) {
    const dayPlan = workingDaysByNumber.get(slot.day_of_week);
    if (!dayPlan) {
      return res.status(400).json({ success: false, message: "Add working hours for every day that has a class or duty." });
    }
    if (slot.start_time < dayPlan.start_time || slot.end_time > dayPlan.end_time) {
      return res.status(400).json({ success: false, message: "Classes and duties must fit within that day's working hours." });
    }
  }

  let connection;
  let transactionStarted = false;
  try {
    connection = await db.getConnection();
    await connection.beginTransaction();
    transactionStarted = true;
    const table = employeeTables[employeeType];
    const [employees] = await connection.query(
      `SELECT id FROM ${table} WHERE id = ? AND status = 'active' LIMIT 1 FOR UPDATE`,
      [employeeId]
    );
    if (!employees.length) {
      await connection.rollback();
      return res.status(404).json({ success: false, message: "Active employee not found." });
    }

    await connection.query(
      `INSERT INTO employee_duty_schedules
         (employee_type, employee_id, effective_from, effective_to, created_by, updated_by)
       VALUES (?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         effective_from = VALUES(effective_from),
         effective_to = VALUES(effective_to),
         updated_by = VALUES(updated_by),
         updated_at = CURRENT_TIMESTAMP`,
      [employeeType, employeeId, effectiveFrom, effectiveTo || null, req.user.user_id, req.user.user_id]
    );
    const [schedules] = await connection.query(
      "SELECT id FROM employee_duty_schedules WHERE employee_type = ? AND employee_id = ? LIMIT 1",
      [employeeType, employeeId]
    );
    const scheduleId = schedules[0].id;
    await connection.query("DELETE FROM employee_duty_schedule_slots WHERE schedule_id = ?", [scheduleId]);
    await connection.query("DELETE FROM employee_duty_schedule_days WHERE schedule_id = ?", [scheduleId]);

    if (workingDays.length) {
      await connection.query(
        `INSERT INTO employee_duty_schedule_days (schedule_id, day_of_week, start_time, end_time)
         VALUES ?`,
        [workingDays.map((day) => [
          scheduleId,
          day.day_of_week,
          day.start_time,
          day.end_time,
        ])]
      );
    }

    if (slots.length) {
      await connection.query(
        `INSERT INTO employee_duty_schedule_slots
           (schedule_id, schedule_kind, day_of_week, duty_date, start_time, end_time,
            duty_type, title, description, location, sort_order)
         VALUES ?`,
        [slots.map((slot, index) => [
          scheduleId,
          slot.schedule_kind,
          slot.day_of_week,
          slot.duty_date,
          slot.start_time,
          slot.end_time,
          slot.duty_type,
          slot.title,
          slot.description,
          slot.location,
          index,
        ])]
      );
    }

    await connection.commit();
    transactionStarted = false;
    connection.release();
    connection = null;
    const schedule = await getSchedule(employeeType, employeeId);
    return res.status(200).json({ success: true, message: "Duty schedule saved.", data: schedule });
  } catch (error) {
    if (connection && transactionStarted) await connection.rollback();
    console.error("Failed to save employee duty schedule:", error);
    return res.status(500).json({ success: false, message: "Failed to save duty schedule." });
  } finally {
    if (connection) connection.release();
  }
};

export const deleteEmployeeDutySchedule = async (req, res) => {
  const { employeeType } = req.params;
  const employeeId = parseEmployeeId(req.params.employeeId);
  if (!employeeTables[employeeType] || !employeeId) {
    return res.status(400).json({ success: false, message: "Choose a valid employee." });
  }

  try {
    const [result] = await db.query(
      "DELETE FROM employee_duty_schedules WHERE employee_type = ? AND employee_id = ?",
      [employeeType, employeeId]
    );
    if (!result.affectedRows) {
      return res.status(404).json({ success: false, message: "No duty schedule is assigned to this employee." });
    }
    return res.status(200).json({ success: true, message: "Duty schedule removed." });
  } catch (error) {
    console.error("Failed to remove employee duty schedule:", error);
    return res.status(500).json({ success: false, message: "Failed to remove duty schedule." });
  }
};
