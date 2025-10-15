import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/router'
import { 
  Eye, 
  EyeOff, 
  User, 
  Mail,
  Lock,
  Sparkles,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import LoadingSpinner from './LoadingSpinner'
import FloatingParticles from './FloatingParticles'
import ThemeToggle from './ThemeToggle'
import BackgroundGrid from './BackgroundGrid'

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [passwordStrength, setPasswordStrength] = useState(0)
  const router = useRouter()

  useEffect(() => {
    // Calculate password strength
    if (formData.password) {
      let strength = 0
      if (formData.password.length >= 6) strength += 25
      if (formData.password.match(/[a-z]/) && formData.password.match(/[A-Z]/)) strength += 25
      if (formData.password.match(/\d/)) strength += 25
      if (formData.password.match(/[^a-zA-Z\d]/)) strength += 25
      setPasswordStrength(strength)
    } else {
      setPasswordStrength(0)
    }
  }, [formData.password])

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username diperlukan'
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username minimal 3 karakter'
    }
    
    if (!isLogin) {
      if (!formData.email.trim()) {
        newErrors.email = 'Email diperlukan'
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Format email tidak valid'
      }
    }
    
    if (!formData.password) {
      newErrors.password = 'Password diperlukan'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password minimal 6 karakter'
    }
    
    if (!isLogin && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Password tidak cocok'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    setSuccess('')

    if (!validateForm()) return

    setLoading(true)

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register'
      const payload = isLogin 
        ? { username: formData.username, password: formData.password }
        : { username: formData.username, email: formData.email, password: formData.password }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (data.success) {
        if (isLogin) {
          localStorage.setItem('token', data.token)
          localStorage.setItem('user', JSON.stringify(data.user))
          setSuccess('🎉 Login berhasil! Mengalihkan...')
          setTimeout(() => router.push('/dashboard'), 1500)
        } else {
          setSuccess('✨ Registrasi berhasil! Silakan login.')
          setTimeout(() => {
            setIsLogin(true)
            setFormData({ username: '', email: '', password: '', confirmPassword: '' })
          }, 2000)
        }
      } else {
        setErrors({ submit: data.message })
      }
    } catch (error) {
      setErrors({ submit: '🚫 Koneksi gagal. Silakan coba lagi.' })
    } finally {
      setLoading(false)
    }
  }

  const switchMode = () => {
    setIsLogin(!isLogin)
    setErrors({})
    setSuccess('')
    setFormData({ username: '', email: '', password: '', confirmPassword: '' })
  }

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 25) return 'bg-red-500'
    if (passwordStrength < 50) return 'bg-orange-500'
    if (passwordStrength < 75) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.15
      }
    }
  }

  const itemVariants = {
    hidden: { y: 30, opacity: 0, scale: 0.9 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }

  const formVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 relative overflow-hidden">
      <BackgroundGrid />
      <FloatingParticles />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-10 left-10 w-72 h-72 bg-purple-300 dark:bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-20 right-20 w-96 h-96 bg-blue-300 dark:bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, -40, 0],
            y: [0, 40, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Theme Toggle */}
      <motion.div
        className="absolute top-6 right-6 z-50"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <ThemeToggle />
      </motion.div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <motion.div
          className="w-full max-w-lg"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div
            className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/30 dark:border-gray-700/30 p-8 relative overflow-hidden"
            variants={itemVariants}
            whileHover={{ 
              scale: 1.01,
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-[-100%] animate-shimmer opacity-30" />
            
            {/* Header */}
            <motion.div 
              className="text-center mb-8 relative z-10"
              variants={itemVariants}
            >
              <motion.div
                className="w-20 h-20 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl"
                animate={{ 
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.05, 1],
                }}
                transition={{ 
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                whileHover={{ scale: 1.1, rotate: 10 }}
              >
                <Sparkles className="w-10 h-10 text-white" />
              </motion.div>
              <motion.h1 
                className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2"
                animate={{ backgroundPosition: ['0%', '100%', '0%'] }}
                transition={{ duration: 3, repeat: Infinity }}
                style={{ backgroundSize: '200% auto' }}
              >
                {isLogin ? 'Welcome Back' : 'Join Us Today'}
              </motion.h1>
              <motion.p 
                className="text-gray-600 dark:text-gray-300 text-lg"
                variants={itemVariants}
              >
                {isLogin ? 'Sign in to your account' : 'Create your account and get started'}
              </motion.p>
            </motion.div>

            {/* Success Message */}
            <AnimatePresence>
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.9 }}
                  className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl p-4 mb-6 text-green-600 dark:text-green-400 text-center backdrop-blur-sm flex items-center justify-center"
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  {success}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error Message */}
            <AnimatePresence>
              {errors.submit && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.9 }}
                  className="bg-gradient-to-r from-red-500/10 to-pink-500/10 border border-red-500/20 rounded-2xl p-4 mb-6 text-red-600 dark:text-red-400 text-center backdrop-blur-sm flex items-center justify-center"
                >
                  <AlertCircle className="w-5 h-5 mr-2" />
                  {errors.submit}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            <motion.form 
              onSubmit={handleSubmit}
              className="space-y-6 relative z-10"
              variants={formVariants}
            >
              {/* Username Field */}
              <motion.div variants={itemVariants}>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-300" />
                  <input
                    type="text"
                    placeholder="Enter your username"
                    className="w-full pl-12 pr-4 py-4 bg-white/50 dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 backdrop-blur-sm placeholder-gray-500 dark:placeholder-gray-400 group-hover:border-blue-300 dark:group-hover:border-blue-700"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  />
                </div>
                <AnimatePresence>
                  {errors.username && (
                    <motion.p 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-red-500 text-sm mt-2 ml-4 flex items-center"
                    >
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.username}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Email Field (Register only) */}
              <AnimatePresence>
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.4 }}
                    variants={itemVariants}
                  >
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-300" />
                      <input
                        type="email"
                        placeholder="Enter your email address"
                        className="w-full pl-12 pr-4 py-4 bg-white/50 dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 backdrop-blur-sm placeholder-gray-500 dark:placeholder-gray-400 group-hover:border-blue-300 dark:group-hover:border-blue-700"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                    <AnimatePresence>
                      {errors.email && (
                        <motion.p 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="text-red-500 text-sm mt-2 ml-4 flex items-center"
                        >
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.email}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Password Field */}
              <motion.div variants={itemVariants}>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-300" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="w-full pl-12 pr-12 py-4 bg-white/50 dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 backdrop-blur-sm placeholder-gray-500 dark:placeholder-gray-400 group-hover:border-blue-300 dark:group-hover:border-blue-700"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-300"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                
                {/* Password Strength Meter */}
                {formData.password && !isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-3"
                  >
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <motion.div
                        className={`h-2 rounded-full ${getPasswordStrengthColor()} transition-all duration-500`}
                        initial={{ width: 0 }}
                        animate={{ width: `${passwordStrength}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                      <span>Weak</span>
                      <span>Strong</span>
                    </div>
                  </motion.div>
                )}
                
                <AnimatePresence>
                  {errors.password && (
                    <motion.p 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-red-500 text-sm mt-2 ml-4 flex items-center"
                    >
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.password}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Confirm Password (Register only) */}
              <AnimatePresence>
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.4 }}
                    variants={itemVariants}
                  >
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-300" />
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        className="w-full pl-12 pr-4 py-4 bg-white/50 dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 backdrop-blur-sm placeholder-gray-500 dark:placeholder-gray-400 group-hover:border-blue-300 dark:group-hover:border-blue-700"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      />
                    </div>
                    <AnimatePresence>
                      {errors.confirmPassword && (
                        <motion.p 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="text-red-500 text-sm mt-2 ml-4 flex items-center"
                        >
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.confirmPassword}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-2xl font-semibold text-lg shadow-2xl hover:shadow-3xl transform transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-3 group relative overflow-hidden"
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                variants={itemVariants}
              >
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                
                {loading ? (
                  <LoadingSpinner size="md" />
                ) : (
                  <>
                    <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="group-hover:translate-x-1 transition-transform duration-300"
                    >
                      →
                    </motion.div>
                  </>
                )}
              </motion.button>
            </motion.form>

            {/* Switch Mode */}
            <motion.div 
              className="text-center mt-8 relative z-10"
              variants={itemVariants}
            >
              <button
                onClick={switchMode}
                className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-all duration-300 group font-medium"
              >
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <span className="font-semibold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
                  {isLogin ? 'Sign up now' : 'Sign in here'}
                </span>
                <motion.span
                  className="inline-block ml-1"
                  animate={{ x: [0, 3, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  🚀
                </motion.span>
              </button>
            </motion.div>

            {/* Demo Info */}
            <motion.div 
              className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl border border-blue-200 dark:border-blue-800 backdrop-blur-sm"
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center text-lg">
                <Sparkles className="w-5 h-5 mr-2 text-yellow-500" />
                Demo Credentials
              </h4>
              <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                <p><strong>Username:</strong> <span className="font-mono">demo</span></p>
                <p><strong>Password:</strong> <span className="font-mono">demopass123</span></p>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}