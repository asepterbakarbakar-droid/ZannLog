import '../styles/globals.css'
import { useEffect } from 'react'

export default function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // Initialize database on app start
    const initDB = async () => {
      try {
        const { initDatabase } = await import('../lib/database')
        await initDatabase()
      } catch (error) {
        console.error('Failed to initialize database:', error)
      }
    }
    
    initDB()
  }, [])

  return <Component {...pageProps} />
}