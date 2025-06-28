import React, { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Lock, User, Eye, EyeOff, Shield, Crown } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const { state, login } = useAuth()

  // Always redirect if already authenticated
  useEffect(() => {
    if (state.isAuthenticated && state.isAdmin) {
      // Force redirect
      window.location.href = '/admin'
    }
  }, [state.isAuthenticated, state.isAdmin])

  // Redirect if already authenticated
  if (state.isAuthenticated && state.isAdmin) {
    return <Navigate to="/admin" replace />
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    const result = await login(email, password)
    
    if (!result.success) {
      setError(result.error || 'Login failed')
    }
    
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gold-50 via-white to-gold-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-gold-200 to-gold-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-gold-300 to-gold-400 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative max-w-md w-full space-y-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-r from-gold-500 to-gold-600 rounded-full flex items-center justify-center shadow-2xl">
                <Crown className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gold-400 rounded-full animate-pulse"></div>
            </div>
          </div>
          
          <h2 className="text-4xl font-bold text-gray-900 mb-2">
            Admin Access
          </h2>
          <p className="text-gray-600 text-lg">
            Restricted access for authorized personnel only
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="p-8">
            {/* Security Notice */}
            <div className="mb-8 p-4 bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-xl">
              <div className="flex items-center mb-2">
                <Shield className="w-5 h-5 text-red-600 mr-2" />
                <p className="text-sm font-medium text-red-700">
                  Security Notice
                </p>
              </div>
              <p className="text-sm text-red-600">
                Only the authorized admin (instylebd86@gmail.com) can access this system. 
                Unauthorized access attempts are logged and monitored.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm"
                >
                  {error}
                </motion.div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Admin Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-colors duration-300 bg-white"
                    placeholder="instylebd86@gmail.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Admin Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-colors duration-300 bg-white"
                    placeholder="Enter admin password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full"
                size="lg"
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : (
                  'Access Admin Panel'
                )}
              </Button>
            </form>
          </Card>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <p className="text-sm text-gray-600">
            This system is protected by advanced security measures.
          </p>
          <p className="text-xs text-gray-500 mt-1">
            All access attempts are logged for security purposes.
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default AdminLogin