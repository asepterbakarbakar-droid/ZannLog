import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false
  }
})

// Create tables if not exists
export async function initDatabase() {
  try {
    const client = await pool.connect()
    
    // Create users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) DEFAULT 'user',
        avatar_url VARCHAR(255),
        is_verified BOOLEAN DEFAULT false,
        last_login TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Create indexes
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);
    `)

    // Insert demo user if not exists
    const demoUserExists = await client.query(
      'SELECT id FROM users WHERE username = $1',
      ['demo']
    )

    if (demoUserExists.rows.length === 0) {
      const bcrypt = require('bcryptjs')
      const hashedPassword = await bcrypt.hash('demopass123', 12)
      
      await client.query(
        `INSERT INTO users (username, email, password, role, is_verified) 
         VALUES ($1, $2, $3, $4, $5)`,
        ['demo', 'demo@example.com', hashedPassword, 'user', true]
      )
      console.log('✅ Demo user created')
    }

    client.release()
    console.log('✅ Database initialized successfully')
  } catch (error) {
    console.error('❌ Database initialization error:', error)
    throw error
  }
}

export default pool