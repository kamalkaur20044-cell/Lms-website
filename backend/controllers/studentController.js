import bcrypt from 'bcrypt';
import db from '../config/db.js';

// Get all students (Admin only)
export const getStudents = async (req, res) => {
  try {
    const [students] = await db.query(`
      SELECT 
        s.id,
        s.user_id,
        s.admission_number,
        s.first_name,
        s.last_name,
        s.date_of_birth,
        s.gender,
        s.phone,
        s.address,
        s.admission_date,
        s.status,
        u.username
      FROM students s
      INNER JOIN users u ON s.user_id = u.id
      ORDER BY s.created_at DESC
    `);
    
    res.status(200).json({
      success: true,
      data: students
    });
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching students',
      error: error.message
    });
  }
};

// Create student (Admin only)
export const createStudent = async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();
    
    const {
      username,
      password,
      admission_number,
      first_name,
      last_name,
      date_of_birth,
      gender,
      phone,
      address,
      admission_date,
      status
    } = req.body;
    
    // Validate required fields
    if (!username || !password || !admission_number || !first_name || !phone) {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }
    
    // Validate phone (10 digits)
    if (!/^\d{10}$/.test(phone)) {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: 'Phone number must be exactly 10 digits'
      });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Insert into users table
    const [userResult] = await connection.query(
      `INSERT INTO users (username, password, role, status) 
       VALUES (?, ?, 'student', 'active')`,
      [username, hashedPassword]
    );
    
    const user_id = userResult.insertId;
    
    // Insert into students table
    await connection.query(
      `INSERT INTO students (
        user_id, admission_number, first_name, last_name,
        date_of_birth, gender, phone, address, admission_date, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user_id,
        admission_number,
        first_name,
        last_name || null,
        date_of_birth || null,
        gender || 'male',
        phone,
        address || null,
        admission_date || null,
        status || 'active'
      ]
    );
    
    await connection.commit();
    
    res.status(201).json({
      success: true,
      message: 'Student created successfully',
      data: {
        user_id,
        username,
        admission_number
      }
    });
    
  } catch (error) {
    await connection.rollback();
    
    console.error('Error creating student:', error);
    
    // Handle duplicate username
    if (error.code === 'ER_DUP_ENTRY') {
      if (error.message.includes('username')) {
        return res.status(400).json({
          success: false,
          message: 'Username already exists'
        });
      }
      if (error.message.includes('admission_number')) {
        return res.status(400).json({
          success: false,
          message: 'Admission number already exists'
        });
      }
    }
    
    res.status(500).json({
      success: false,
      message: 'Error creating student',
      error: error.message
    });
  } finally {
    connection.release();
  }
};

// Get single student
export const getStudent = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [students] = await db.query(`
      SELECT 
        s.*,
        u.username
      FROM students s
      INNER JOIN users u ON s.user_id = u.id
      WHERE s.id = ?
    `, [id]);
    
    if (students.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: students[0]
    });
  } catch (error) {
    console.error('Error fetching student:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching student',
      error: error.message
    });
  }
};

// Update student
export const updateStudent = async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();
    
    const { id } = req.params;
    const {
      first_name,
      last_name,
      date_of_birth,
      gender,
      phone,
      address,
      admission_date,
      status
    } = req.body;
    
    // Validate phone if provided
    if (phone && !/^\d{10}$/.test(phone)) {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: 'Phone number must be exactly 10 digits'
      });
    }
    
    // Update students table
    await connection.query(
      `UPDATE students SET
        first_name = ?,
        last_name = ?,
        date_of_birth = ?,
        gender = ?,
        phone = ?,
        address = ?,
        admission_date = ?,
        status = ?
      WHERE id = ?`,
      [first_name, last_name, date_of_birth, gender, phone, address, admission_date, status, id]
    );
    
    await connection.commit();
    
    res.status(200).json({
      success: true,
      message: 'Student updated successfully'
    });
    
  } catch (error) {
    await connection.rollback();
    
    console.error('Error updating student:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating student',
      error: error.message
    });
  } finally {
    connection.release();
  }
};

// Delete student
export const deleteStudent = async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();
    
    const { id } = req.params;
    
    // Get user_id first
    const [students] = await connection.query(
      'SELECT user_id FROM students WHERE id = ?',
      [id]
    );
    
    if (students.length === 0) {
      await connection.rollback();
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }
    
    const user_id = students[0].user_id;
    
    // Delete from students table 
    await connection.query('DELETE FROM students WHERE id = ?', [id]);
    
    // Delete from users table
    await connection.query('DELETE FROM users WHERE id = ?', [user_id]);
    
    await connection.commit();
    
    res.status(200).json({
      success: true,
      message: 'Student deleted successfully'
    });
    
  } catch (error) {
    await connection.rollback();
    
    console.error('Error deleting student:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting student',
      error: error.message
    });
  } finally {
    connection.release();
  }
};
