import db from '../config/db.js';

export const getCourses = async (req, res) => {
  try {
    const [courses] = await db.query('SELECT * FROM courses');
    res.status(200).json({ success: true, data: courses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createCourse = async (req, res) => {
  try {
    const { course_name, description, duration, fee, discount_percent, status } = req.body;

    if (!course_name) {
      return res.status(400).json({ success: false, message: 'Course name is required' });
    }

    const courseFee = Number(fee);
    const discountPercent = discount_percent === undefined ? 0 : Number(discount_percent);
    if (fee === undefined || fee === null || fee === '' || !Number.isFinite(courseFee) || courseFee < 0) {
      return res.status(400).json({ success: false, message: 'A valid course fee is required' });
    }
    if (!Number.isFinite(discountPercent) || discountPercent < 0 || discountPercent > 100) {
      return res.status(400).json({ success: false, message: 'Discount must be between 0 and 100 percent' });
    }

    const [result] = await db.query(
      `INSERT INTO courses (course_name, description, duration, fee, discount_percent, status) VALUES (?, ?, ?, ?, ?, ?)`,
      [course_name, description || null, duration || null, courseFee, discountPercent, status || 'active']
    );

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: { id: result.insertId, course_name, fee: courseFee, discount_percent: discountPercent },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { course_name, description, duration, fee, discount_percent, status } = req.body;

    if (!course_name) {
      return res.status(400).json({ success: false, message: 'Course name is required' });
    }

    const courseFee = fee === undefined || fee === null || fee === '' ? null : Number(fee);
    const discountPercent = discount_percent === undefined || discount_percent === null || discount_percent === ''
      ? null
      : Number(discount_percent);
    if (courseFee !== null && (!Number.isFinite(courseFee) || courseFee < 0)) {
      return res.status(400).json({ success: false, message: 'Course fee must be a non-negative number' });
    }
    if (discountPercent !== null && (!Number.isFinite(discountPercent) || discountPercent < 0 || discountPercent > 100)) {
      return res.status(400).json({ success: false, message: 'Discount must be between 0 and 100 percent' });
    }

    await db.query(
      `UPDATE courses
       SET course_name=?, description=?, duration=?, fee=COALESCE(?, fee),
           discount_percent=COALESCE(?, discount_percent), status=?
       WHERE id=?`,
      [course_name, description, duration, courseFee, discountPercent, status, id]
    );

    const [courses] = await db.query('SELECT * FROM courses WHERE id = ?', [id]);
    if (courses.length === 0) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Course updated successfully',
      data: courses[0],
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteCourse = async (req, res) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const { id } = req.params;

    const [rows] = await connection.query('SELECT id FROM courses WHERE id = ?', [id]);
    if (rows.length === 0) {
      await connection.rollback();
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Delete dependent batches first (FK constraint)
    await connection.query('DELETE FROM batches WHERE course_id = ?', [id]);

    // Now delete the course
    await connection.query('DELETE FROM courses WHERE id = ?', [id]);

    await connection.commit();
    res.status(200).json({ success: true, message: 'Course deleted successfully' });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ success: false, message: error.message });
  } finally {
    connection.release();
  }
};
