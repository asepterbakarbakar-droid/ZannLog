import { neon } from '@neondatabase/serverless';

// Create SQL helper
const sql = neon(process.env.POSTGRES_URL);

// Test database connection
export async function testConnection() {
  try {
    const result = await sql`SELECT NOW() as current_time`;
    console.log('✅ Connected to Neon PostgreSQL at:', result[0].current_time);
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
}

// Initialize database (create tables if not exist)
export async function initDatabase() {
  try {
    // Create users table if not exists
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) DEFAULT 'user',
        is_verified BOOLEAN DEFAULT true,
        last_login TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Check if demo user exists, if not create it
    const demoUser = await sql`SELECT id FROM users WHERE username = 'demo'`;
    
    if (demoUser.length === 0) {
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('demopass123', 12);
      
      await sql`
        INSERT INTO users (username, email, password, role) 
        VALUES ('demo', 'demo@example.com', ${hashedPassword}, 'user')
      `;
      console.log('✅ Demo user created: demo / demopass123');
    }

    console.log('✅ Database initialized successfully');
    return true;
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    return false;
  }
}

export { sql };
