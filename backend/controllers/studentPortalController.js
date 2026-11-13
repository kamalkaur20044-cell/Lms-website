import db from '../config/db.js';

const getStudentByUser = async (userId) => {
  const [rows] = await db.query(
    `SELECT s.id, s.admission_number, s.first_name, s.last_name, s.date_of_birth, s.gender,
            s.phone, s.address, s.photo, s.admission_date, s.status, u.username
     FROM students s INNER JOIN users u ON s.user_id = u.id
     WHERE s.user_id = ?`,
    [userId]
  );
  return rows[0] || null;
};

const getBatches = async (studentId) => {
  const [rows] = await db.query(
    `SELECT b.id AS batch_id, b.batch_name, b.start_date, b.end_date, b.start_time, b.end_time,
            c.id AS course_id, c.course_name, c.description AS course_description, c.duration,
            sb.enrollment_date, sb.status AS enrollment_status
     FROM student_batches sb
     INNER JOIN batches b ON sb.batch_id = b.id
     INNER JOIN courses c ON b.course_id = c.id
     WHERE sb.student_id = ?
     ORDER BY sb.status = 'active' DESC, sb.enrollment_date DESC`,
    [studentId]
  );
  return rows;
};

// GET /api/student-portal/profile
export const getProfile = async (req, res) => {
  try {
    const student = await getStudentByUser(req.user.user_id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student record not found' });
    }
    const [parents] = await db.query(
      `SELECT sp.relationship, p.first_name, p.last_name, p.phone, p.email
       FROM student_parents sp INNER JOIN parents p ON sp.parent_id = p.id
       WHERE sp.student_id = ?`,
      [student.id]
    );
    const batches = await getBatches(student.id);
    res.status(200).json({ success: true, data: { student, parents, batches } });
  } catch (error) {
    console.error('Error fetching student profile:', error);
    res.status(500).json({ success: false, message: 'Error fetching profile' });
  }
};

// GET /api/student-portal/courses
export const getCourses = async (req, res) => {
  try {
    const student = await getStudentByUser(req.user.user_id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student record not found' });
    }
    const batches = await getBatches(student.id);
    let subjects = [];
    if (batches.length > 0) {
      const [rows] = await db.query(
        `SELECT bs.batch_id, sub.id AS subject_id, sub.subject_name, sub.description,
                t.first_name AS teacher_first_name, t.last_name AS teacher_last_name,
                t.email AS teacher_email, t.qualification, t.specialization
         FROM batch_subjects bs
         INNER JOIN subjects sub ON bs.subject_id = sub.id
         LEFT JOIN teachers t ON bs.teacher_id = t.id
         WHERE bs.batch_id IN (?)
         ORDER BY sub.subject_name`,
        [batches.map((b) => b.batch_id)]
      );
      subjects = rows;
    }
    const data = batches.map((b) => ({
      ...b,
      subjects: subjects.filter((s) => s.batch_id === b.batch_id),
    }));
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error fetching student courses:', error);
    res.status(500).json({ success: false, message: 'Error fetching courses' });
  }
};
