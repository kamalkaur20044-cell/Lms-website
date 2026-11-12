import bcrypt from 'bcrypt';
import db from '../config/db.js';

export const getTeachers = async (req, res) => {
  try {
    const [teachers] = await db.query(`
      SELECT t.*, u.username
      FROM teachers t
      INNER JOIN users u ON t.user_id = u.id
      ORDER BY t.created_at DESC
    `);
    res.status(200).json({ success: true, data: teachers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createTeacher = async (req, res) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const { username, password, employee_id, first_name, last_name, phone, email, qualification, specialization, joining_date, status } = req.body;

    if (!username || !password || !employee_id || !first_name || !phone) {
      await connection.rollback();
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    if (!/^\d{10}$/.test(phone)) {
      await connection.rollback();
      return res.status(400).json({ success: false, message: 'Phone must be exactly 10 digits' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [userResult] = await connection.query(
      `INSERT INTO users (username, password, role, status) VALUES (?, ?, 'teacher', 'active')`,
      [username, hashedPassword]
    );

    const user_id = userResult.insertId;

    const [teacherResult] = await connection.query(
      `INSERT INTO teachers (user_id, employee_id, first_name, last_name, phone, email, qualification, specialization, joining_date, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [user_id, employee_id, first_name, last_name || null, phone, email || null, qualification || null, specialization || null, joining_date || null, status || 'active']
    );

    await connection.commit();
    res.status(201).json({ success: true, message: 'Teacher created successfully', data: { id: teacherResult.insertId, user_id, username, employee_id } });
  } catch (error) {
    await connection.rollback();
    if (error.code === 'ER_DUP_ENTRY') {
      if (error.message.includes('username')) return res.status(400).json({ success: false, message: 'Username already exists' });
      if (error.message.includes('employee_id')) return res.status(400).json({ success: false, message: 'Employee ID already exists' });
    }
    res.status(500).json({ success: false, message: error.message });
  } finally {
    connection.release();
  }
};

export const updateTeacher = async (req, res) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const { id } = req.params;
    const { first_name, last_name, phone, email, qualification, specialization, joining_date, status } = req.body;

    if (phone && !/^\d{10}$/.test(phone)) {
      await connection.rollback();
      return res.status(400).json({ success: false, message: 'Phone must be exactly 10 digits' });
    }

    await connection.query(
      `UPDATE teachers SET first_name=?, last_name=?, phone=?, email=?, qualification=?, specialization=?, joining_date=?, status=? WHERE id=?`,
      [first_name, last_name, phone, email, qualification, specialization, joining_date, status, id]
    );

    await connection.commit();
    res.status(200).json({ success: true, message: 'Teacher updated successfully' });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ success: false, message: error.message });
  } finally {
    connection.release();
  }
};

export const deleteTeacher = async (req, res) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const { id } = req.params;

    const [rows] = await connection.query('SELECT user_id FROM teachers WHERE id = ?', [id]);
    if (rows.length === 0) {
      await connection.rollback();
      return res.status(404).json({ success: false, message: 'Teacher not found' });
    }

    await connection.query('DELETE FROM teachers WHERE id = ?', [id]);
    await connection.query('DELETE FROM users WHERE id = ?', [rows[0].user_id]);

    await connection.commit();
    res.status(200).json({ success: true, message: 'Teacher deleted successfully' });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ success: false, message: error.message });
  } finally {
    connection.release();
  }
};
