import { sql } from '../../../lib/database';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required'
      });
    }

    // Find user
    const users = await sql`
      SELECT id, username, email, password, role, created_at 
      FROM users 
      WHERE username = ${username} OR email = ${username}
    `;

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const user = users[0];

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Update last login
    await sql`UPDATE users SET last_login = NOW() WHERE id = ${user.id}`;

    // Generate token
    const token = jwt.sign(
      {
        userId: user.id,
        username: user.username,
        email: user.email
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // User data without password
    const userData = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      createdAt: user.created_at
    };

    res.status(200).json({
      success: true,
      message: 'Login successful!',
      token,
      user: userData
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
}
