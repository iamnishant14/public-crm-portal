import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token')
    const userData = localStorage.getItem('user_data')
    
    if (storedToken && userData) {
      try {
        setToken(storedToken)
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
      const resp = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      if (!resp.ok) {
        const err = await resp.json()
        throw new Error(err.message || 'Login failed')
      }
      const { token, user: respUser } = await resp.json()
      localStorage.setItem('auth_token', token)
      localStorage.setItem('user_data', JSON.stringify(respUser))
      setToken(token)
      setUser(respUser)
      return respUser
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
    setToken(null)
    setUser(null)
  }

  const isAuthenticated = !!user
  const hasPermission = (permission) => user?.permissions?.includes(permission)

  return (
    <AuthContext.Provider value={{ user, token, loading, error, login, logout, isAuthenticated, hasPermission }}>
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
