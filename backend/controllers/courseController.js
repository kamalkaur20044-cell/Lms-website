import db from '../config/db.js';

export const getCourses = async (req, res) => {
  try {
    const [courses] = await db.query(`SELECT * FROM courses ORDER BY created_at DESC`);
    res.status(200).json({ success: true, data: courses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createCourse = async (req, res) => {
  try {
    const { course_name, description, duration, status } = req.body;

    if (!course_name) {
      return res.status(400).json({ success: false, message: 'Course name is required' });
    }

    const [result] = await db.query(
      `INSERT INTO courses (course_name, description, duration, status) VALUES (?, ?, ?, ?)`,
      [course_name, description || null, duration || null, status || 'active']
    );

    res.status(201).json({ success: true, message: 'Course created successfully', data: { id: result.insertId, course_name } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { course_name, description, duration, status } = req.body;

    if (!course_name) {
      return res.status(400).json({ success: false, message: 'Course name is required' });
    }

    await db.query(
      `UPDATE courses SET course_name=?, description=?, duration=?, status=? WHERE id=?`,
      [course_name, description, duration, status, id]
    );

    res.status(200).json({ success: true, message: 'Course updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query('SELECT id FROM courses WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    await db.query('DELETE FROM courses WHERE id = ?', [id]);
    res.status(200).json({ success: true, message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
