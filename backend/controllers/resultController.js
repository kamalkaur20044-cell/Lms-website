import xlsx from "xlsx";
import fs from "fs";
import { createHash } from "crypto";
import db from "../config/db.js";

const normalizeHeader = (header) => String(header).trim().toLowerCase().replace(/[\s_-]+/g, "");

const getColumn = (row, aliases) => {
    const key = Object.keys(row).find((header) => aliases.includes(normalizeHeader(header)));
    return key ? row[key] : undefined;
};

const parseOptionalCount = (value, label, invalidFields) => {
    if (value === null || value === undefined || value === "") return null;
    const count = Number(value);
    if (!Number.isSafeInteger(count) || count < 0) {
        invalidFields.push(`${label} (must be a non-negative whole number)`);
        return null;
    }
    return count;
};

const toDate = (value) => {
    if (value === null || value === undefined || value === "") return null;
    if (value instanceof Date && !Number.isNaN(value.getTime())) {
        return value.toISOString().slice(0, 10);
    }
    const parsedDate = new Date(value);
    return Number.isNaN(parsedDate.getTime()) ? null : parsedDate.toISOString().slice(0, 10);
};

const validationError = (message) => Object.assign(new Error(message), { status: 400 });

const getResultRows = async (whereClause, values) => {
    const [rows] = await db.query(
        `SELECT e.exam_id, e.exam_name, e.exam_date,
                s.id AS student_id, s.admission_number,
                CONCAT_WS(' ', s.first_name, s.last_name) AS student_name,
                sub.subject_name AS subject,
               r.obtained_marks AS marks, r.max_marks,
               r.correct_answers, r.wrong_answers, r.unanswered
         FROM results r
         INNER JOIN exams e ON e.exam_id = r.exam_id
         INNER JOIN subjects sub ON sub.id = r.subject_id
         INNER JOIN students s ON s.id = r.student_id
         ${whereClause}
         ORDER BY e.exam_date DESC, e.exam_name, student_name, sub.subject_name`,
        values
    );

    const resultsByStudentAndExam = new Map();
    for (const row of rows) {
        const key = `${row.exam_id}:${row.student_id}`;
        let result = resultsByStudentAndExam.get(key);
        if (!result) {
            result = {
                exam_id: row.exam_id,
                exam_name: row.exam_name,
                exam_date: row.exam_date,
                student_id: row.student_id,
                admission_number: row.admission_number,
                student_name: row.student_name,
                subjects: [],
                total: 0,
                max_total: 0,
            };
            resultsByStudentAndExam.set(key, result);
        }
        const marks = Number(row.marks);
        const maxMarks = Number(row.max_marks);
        result.subjects.push({
            name: row.subject,
            marks,
            max_marks: maxMarks,
            correct_answers: row.correct_answers,
            wrong_answers: row.wrong_answers,
            unanswered: row.unanswered,
        });
        result.total += marks;
        result.max_total += maxMarks;
    }

    return [...resultsByStudentAndExam.values()].map((result) => ({
        ...result,
        percentage: result.max_total ? (result.total / result.max_total) * 100 : 0,
        passed: result.subjects.every((subject) => subject.marks / subject.max_marks >= 0.35),
    }));
};

export const getResults = async (_req, res) => {
    try {
        const results = await getResultRows("", []);
        res.status(200).json({ success: true, data: results });
    } catch (error) {
        console.error("Error fetching results:", error);
        res.status(500).json({ success: false, message: "Error fetching results" });
    }
};

export const getMyResults = async (req, res) => {
    try {
        let students;
        if (req.user.role === "admin") {
            const studentId = Number(req.query.studentId);
            if (!Number.isSafeInteger(studentId) || studentId < 1) {
                return res.status(400).json({ success: false, message: "A valid studentId is required for admin access" });
            }
            [students] = await db.query("SELECT id FROM students WHERE id = ?", [studentId]);
        } else {
            [students] = await db.query(
                "SELECT id FROM students WHERE user_id = ?",
                [req.user.user_id]
            );
        }
        if (students.length === 0) {
            return res.status(404).json({ success: false, message: "Student record not found" });
        }

        const results = await getResultRows("WHERE s.id = ? AND r.is_published = 1", [students[0].id]);
        res.status(200).json({ success: true, data: results });
    } catch (error) {
        console.error("Error fetching student results:", error);
        res.status(500).json({ success: false, message: "Error fetching results" });
    }
};

export const uploadResults = async (req, res) => {
    let connection;
    let transactionStarted = false;
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "Please upload an Excel file" });
        }

        const workbook = xlsx.readFile(req.file.path, { cellDates: true });
        const sheetName = workbook.SheetNames[0];
        if (!sheetName) {
            throw validationError("The Excel file has no worksheets");
        }

        const rows = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], { defval: null });
        if (rows.length === 0) {
            throw validationError("Excel file is empty");
        }

        const parsedRows = rows.map((row, index) => {
            const examName = getColumn(row, ["examname", "exam"]);
            const rawExamDate = getColumn(row, ["examdate", "date"]);
            const examDate = toDate(rawExamDate);
            const admissionNumber = getColumn(row, ["admissionnumber", "admissionno", "admission"]);
            const subject = getColumn(row, ["subject", "subjectname"]);
            const rawMarks = getColumn(row, ["marks", "marksobtained"]);
            const rawMaxMarks = getColumn(row, ["maximummarks", "maxmarks", "totalmarks"]);
            const rawCorrectAnswers = getColumn(row, ["correctanswers", "correct", "rightanswers"]);
            const rawWrongAnswers = getColumn(row, ["wronganswers", "incorrectanswers", "wrong"]);
            const rawUnanswered = getColumn(row, ["unanswered", "unansweredquestions", "blankanswers"]);
            const marks = Number(rawMarks);
            const maxMarks = Number(rawMaxMarks);
            const invalidFields = [];
            const correctAnswers = parseOptionalCount(rawCorrectAnswers, "Correct Answers", invalidFields);
            const wrongAnswers = parseOptionalCount(rawWrongAnswers, "Wrong Answers", invalidFields);
            const unanswered = parseOptionalCount(rawUnanswered, "Unanswered", invalidFields);

            if (typeof examName !== "string" || !examName.trim()) invalidFields.push("Exam Name");
            if (!examDate) invalidFields.push("Exam Date (use YYYY-MM-DD)");
            if (
                typeof admissionNumber !== "string" && typeof admissionNumber !== "number" ||
                !String(admissionNumber ?? "").trim()
            ) invalidFields.push("Admission Number");
            if (typeof subject !== "string" || !subject.trim()) invalidFields.push("Subject");
            if (rawMarks === null || rawMarks === "" || !Number.isFinite(marks) || marks < 0) {
                invalidFields.push("Marks (must be a non-negative number)");
            }
            if (rawMaxMarks === null || rawMaxMarks === "" || !Number.isFinite(maxMarks) || maxMarks <= 0) {
                invalidFields.push("Maximum Marks (must be greater than zero)");
            }
            if (Number.isFinite(marks) && Number.isFinite(maxMarks) && marks > maxMarks) {
                invalidFields.push("Marks cannot exceed Maximum Marks");
            }
            if (invalidFields.length) {
                throw validationError(`Spreadsheet row ${index + 2}: ${invalidFields.join(", ")}`);
            }

            return {
                examName: examName.trim(),
                examDate,
                admissionNumber: String(admissionNumber).trim(),
                subject: subject.trim(),
                marks,
                maxMarks,
                correctAnswers,
                wrongAnswers,
                unanswered,
                rowNumber: index + 2,
            };
        });

        const admissions = [...new Set(parsedRows.map((row) => row.admissionNumber))];
        const [students] = await db.query(
            "SELECT id, admission_number FROM students WHERE admission_number IN (?)",
            [admissions]
        );
        const studentIds = new Map(students.map((student) => [String(student.admission_number).toLowerCase(), student.id]));
        const unknownAdmissions = [...new Set(
            parsedRows.filter((row) => !studentIds.has(row.admissionNumber.toLowerCase())).map((row) => row.admissionNumber)
        )];
        if (unknownAdmissions.length) {
            throw validationError(`Unknown admission number(s): ${unknownAdmissions.join(", ")}`);
        }

        const examNames = [...new Set(parsedRows.map((row) => row.examName))];
        const [exams] = await db.query(
            "SELECT exam_id, exam_name, exam_date FROM exams WHERE exam_name IN (?)",
            [examNames]
        );
        const examIds = new Map(
            exams.map((exam) => [
                `${String(exam.exam_name).trim().toLowerCase()}:${toDate(exam.exam_date)}`,
                exam.exam_id,
            ])
        );

        const subjectNames = [...new Set(parsedRows.map((row) => row.subject))];
        const [subjects] = await db.query(
            "SELECT id, subject_name FROM subjects WHERE subject_name IN (?)",
            [subjectNames]
        );
        const subjectIds = new Map(
            subjects.map((subject) => [String(subject.subject_name).trim().toLowerCase(), subject.id])
        );
        const unknownSubjects = [...new Set(
            parsedRows
                .filter((row) => !subjectIds.has(row.subject.toLowerCase()))
                .map((row) => row.subject)
        )];
        if (unknownSubjects.length) {
            throw validationError(`Subject(s) not found in subjects table: ${unknownSubjects.join(", ")}`);
        }

        const uniqueRows = new Set();
        for (const row of parsedRows) {
            const key = `${row.examName.toLowerCase()}:${row.examDate}:${row.admissionNumber.toLowerCase()}:${row.subject.toLowerCase()}`;
            if (uniqueRows.has(key)) {
                throw validationError(`Duplicate subject for admission number ${row.admissionNumber} in row ${row.rowNumber}`);
            }
            uniqueRows.add(key);
            row.studentId = studentIds.get(row.admissionNumber.toLowerCase());
            row.subjectId = subjectIds.get(row.subject.toLowerCase());
        }

        connection = await db.getConnection();
        await connection.beginTransaction();
        transactionStarted = true;

        for (const row of parsedRows) {
            const examKey = `${row.examName.toLowerCase()}:${row.examDate}`;
            let examId = examIds.get(examKey);
            if (!examId) {
                examId = `IMP-${createHash("sha256").update(examKey).digest("hex").slice(0, 40)}`;
                await connection.query(
                    `INSERT INTO exams (exam_id, exam_name, exam_date)
                     VALUES (?, ?, ?)
                     ON DUPLICATE KEY UPDATE exam_id = VALUES(exam_id)`,
                    [examId, row.examName, row.examDate]
                );
                examIds.set(examKey, examId);
            }

            const [existingResults] = await connection.query(
                `SELECT id FROM results
                 WHERE exam_id = ? AND student_id = ? AND subject_id = ?
                 ORDER BY id DESC
                 LIMIT 1
                 FOR UPDATE`,
                [examId, row.studentId, row.subjectId]
            );
            if (existingResults.length) {
                await connection.query(
                    `UPDATE results
                     SET max_marks = ?, obtained_marks = ?, is_published = 1,
                         correct_answers = COALESCE(?, correct_answers),
                         wrong_answers = COALESCE(?, wrong_answers),
                         unanswered = COALESCE(?, unanswered),
                         updated_at = CURRENT_TIMESTAMP
                     WHERE id = ?`,
                    [row.maxMarks, row.marks, row.correctAnswers, row.wrongAnswers, row.unanswered, existingResults[0].id]
                );
            } else {
                await connection.query(
                    `INSERT INTO results
                     (student_id, exam_id, subject_id, max_marks, obtained_marks,
                      correct_answers, wrong_answers, unanswered, is_published)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)`,
                    [
                        row.studentId,
                        examId,
                        row.subjectId,
                        row.maxMarks,
                        row.marks,
                        row.correctAnswers,
                        row.wrongAnswers,
                        row.unanswered,
                    ]
                );
            }
        }

        await connection.commit();
        transactionStarted = false;
        res.status(200).json({
            success: true,
            message: "Results imported successfully",
            importedRecords: parsedRows.length,
        });
    } catch (error) {
        if (connection && transactionStarted) await connection.rollback();
        console.error("Excel results import error:", error);
        res.status(error.status || 500).json({
            success: false,
            message: error.status ? error.message : "Error importing results",
        });
    } finally {
        if (connection) connection.release();
        if (req.file) {
            try {
                await fs.promises.unlink(req.file.path);
            } catch (error) {
                if (error.code !== "ENOENT") console.error("Uploaded results cleanup error:", error);
            }
        }
    }
};
