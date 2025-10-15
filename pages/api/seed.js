import pool from '../../lib/database'
import bcrypt from 'bcryptjs'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const client = await pool.connect()

    try {
      // Create demo user if not exists
      const demoUserExists = await client.query(
        'SELECT id FROM users WHERE username = $1',
        ['demo']
      )

      if (demoUserExists.rows.length === 0) {
        const hashedPassword = await bcrypt.hash('demopass123', 12)
        
        await client.query(
          `INSERT INTO users (username, email, password, role, is_verified) 
           VALUES ($1, $2, $3, $4, $5)`,
          ['demo', 'demo@example.com', hashedPassword, 'user', true]
        )
      }

      res.json({ 
        success: true, 
        message: 'Database seeded successfully!',
        demoCredentials: {
          username: 'demo',
          password: 'demopass123'
        }
      })
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Seed error:', error)
    res.status(500).json({ success: false, message: error.message })
  }
}