import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    const userData = localStorage.getItem('user_data')
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData))
      } catch (e) {
        setError('Failed to parse user data')
      }
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    setLoading(true)
    setError(null)
    try {
      // TODO: Replace with actual API call to /api/auth/login
      const mockUser = {
        id: '1',
        email,
        name: email.split('@')[0],
        role: 'OrgAdmin',
        permissions: ['read', 'write', 'approve']
      }
      localStorage.setItem('auth_token', 'mock_token_' + Date.now())
      localStorage.setItem('user_data', JSON.stringify(mockUser))
      setUser(mockUser)
      return mockUser
    } catch (e) {
      setError(e.message)
      throw e
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_data')
    setUser(null)
  }

  const isAuthenticated = !!user
  const hasPermission = (permission) => user?.permissions?.includes(permission)

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout, isAuthenticated, hasPermission }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
