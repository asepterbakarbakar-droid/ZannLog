import pool from '../../../lib/database'
import bcrypt from 'bcryptjs'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' })
  }

  try {
    const { username, email, password } = req.body

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      })
    }

    if (username.length < 3) {
      return res.status(400).json({
        success: false,
        message: 'Username must be at least 3 characters long'
      })
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      })
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      })
    }

    const client = await pool.connect()

    try {
      // Check if user already exists
      const existingUser = await client.query(
        `SELECT id FROM users WHERE username = $1 OR email = $2`,
        [username.toLowerCase().trim(), email.toLowerCase().trim()]
      )

      if (existingUser.rows.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Username or email already exists'
        })
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12)

      // Insert new user
      const result = await client.query(
        `INSERT INTO users (username, email, password, role, is_verified) 
         VALUES ($1, $2, $3, $4, $5) 
         RETURNING id, username, email, role, created_at`,
        [username.toLowerCase().trim(), email.toLowerCase().trim(), hashedPassword, 'user', true]
      )

      const newUser = result.rows[0]

      res.status(201).json({
        success: true,
        message: 'Registration successful! You can now login.',
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          role: newUser.role,
          createdAt: newUser.created_at
        }
      })

    } finally {
      client.release()
    }

  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
}