import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import { LogOut, User, Mail, Calendar, Shield, Sparkles } from 'lucide-react'
import Head from 'next/head'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')

    if (!token || !userData) {
      router.push('/')
      return
    }

    setUser(JSON.parse(userData))
    setLoading(false)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 dark:from-gray-900 dark:to-purple-900 flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-gray-600 dark:text-gray-300">Loading dashboard...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>Dashboard - ZannLog Premium</title>
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-pink-900">
        {/* Header */}
        <motion.header
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <motion.div
                className="flex items-center space-x-3"
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Dashboard
                </h1>
              </motion.div>
              
              <motion.button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </motion.button>
            </div>
          </div>
        </motion.header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {/* Welcome Card */}
            <motion.div
              className="lg:col-span-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 dark:border-gray-700/20"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-center space-x-4 mb-6">
                <motion.div
                  className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg"
                  whileHover={{ rotate: 5, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {user?.username?.charAt(0).toUpperCase()}
                </motion.div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                    Welcome back, {user?.username}! 👋
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    Great to see you again. Here's your account overview.
                  </p>
                </div>
              </div>
              
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center space-x-3 mb-2">
                    <User className="w-6 h-6 text-blue-500" />
                    <h3 className="font-semibold text-gray-800 dark:text-white">Username</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 font-mono">{user?.username}</p>
                </div>
                
                <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-6 border border-green-200 dark:border-green-800">
                  <div className="flex items-center space-x-3 mb-2">
                    <Mail className="w-6 h-6 text-green-500" />
                    <h3 className="font-semibold text-gray-800 dark:text-white">Email</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">{user?.email}</p>
                </div>
                
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-2xl p-6 border border-purple-200 dark:border-purple-800">
                  <div className="flex items-center space-x-3 mb-2">
                    <Shield className="w-6 h-6 text-purple-500" />
                    <h3 className="font-semibold text-gray-800 dark:text-white">Role</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 capitalize">{user?.role}</p>
                </div>
                
                <div className="bg-orange-50 dark:bg-orange-900/20 rounded-2xl p-6 border border-orange-200 dark:border-orange-800">
                  <div className="flex items-center space-x-3 mb-2">
                    <Calendar className="w-6 h-6 text-orange-500" />
                    <h3 className="font-semibold text-gray-800 dark:text-white">Member Since</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recently'}
                  </p>
                </div>
              </motion.div>
            </motion.div>

            {/* Stats Card */}
            <motion.div
              className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl p-8 text-white shadow-2xl"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <h3 className="text-2xl font-bold mb-6">Your Stats</h3>
              
              <div className="space-y-6">
                <motion.div
                  className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="flex justify-between items-center">
                    <span>Account Status</span>
                    <motion.span
                      className="px-3 py-1 bg-green-500 rounded-full text-sm font-semibold"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      Active
                    </motion.span>
                  </div>
                </motion.div>
                
                <motion.div
                  className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="flex justify-between items-center">
                    <span>Login Count</span>
                    <span className="text-xl font-bold">1</span>
                  </div>
                </motion.div>
                
                <motion.div
                  className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="flex justify-between items-center">
                    <span>Security Level</span>
                    <span className="text-xl font-bold">High</span>
                  </div>
                </motion.div>
              </div>

              <motion.div
                className="mt-8 p-4 bg-white/10 rounded-2xl backdrop-blur-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <p className="text-sm opacity-90">
                  🎉 You're all set! Your account is secure and ready to use.
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        </main>
      </div>
    </>
  )
}