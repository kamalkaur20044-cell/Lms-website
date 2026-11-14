import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../config/db.js';

// Login
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Validate input
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide username and password'
      });
    }
    
    // Find user
    const [users] = await db.query(
      'SELECT * FROM users WHERE username = ? AND status = "active"',
      [username]
    );
    
    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    const user = users[0];
    
    // Check password
    // PHP's password_hash() creates "$2y$" hashes; node bcrypt only accepts "$2a$"/"$2b$"
    const storedHash = String(user.password).replace(/^\$2y\$/, '$2b$');
    const isPasswordValid = await bcrypt.compare(password, storedHash);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        user_id: user.id, 
        username: user.username, 
        role: user.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    // Return success
    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error during login',
      error: error.message
    });
  }
};

// Get current user info (from token)
export const getMe = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const role = req.user.role;
    
    // Get user from users table
    const [users] = await db.query(
      'SELECT id, username, role, status, created_at FROM users WHERE id = ?',
      [user_id]
    );
    
    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    const user = users[0];
    
    // Get role-specific data
    let roleData = null;
    
    if (role === 'student') {
      const [students] = await db.query(
        'SELECT * FROM students WHERE user_id = ?',
        [user_id]
      );
      roleData = students[0] || null;
    } else if (role === 'teacher') {
      const [teachers] = await db.query(
        'SELECT * FROM teachers WHERE user_id = ?',
        [user_id]
      );
      roleData = teachers[0] || null;
    } else if (role === 'staff') {
      const [staff] = await db.query(
        'SELECT * FROM staff WHERE user_id = ?',
        [user_id]
      );
      roleData = staff[0] || null;
    } else if (role === 'parent') {
      const [parents] = await db.query(
        'SELECT * FROM parents WHERE user_id = ?',
        [user_id]
      );
      roleData = parents[0] || null;
    }
    
    res.status(200).json({
      success: true,
      user,
      profile: roleData
    });
    
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user data',
      error: error.message
    });
  }
};

// Change password
export const changePassword = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const { currentPassword, newPassword } = req.body;
    
    // Validate input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide current and new password'
      });
    }
    
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters'
      });
    }
    
    // Get current user
    const [users] = await db.query(
      'SELECT password FROM users WHERE id = ?',
      [user_id]
    );
    
    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Verify current password
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      String(users[0].password).replace(/^\$2y\$/, '$2b$')
    );
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }
    
    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update password
    await db.query(
      'UPDATE users SET password = ? WHERE id = ?',
      [hashedPassword, user_id]
    );
    
    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });
    
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Error changing password',
      error: error.message
    });
  }
};

// Logout (client-side token removal, but endpoint for consistency)
export const logout = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logout successful'
  });
};
