import { useRouter } from 'next/router'
import { useAuth } from '../context/AuthContext'
import { useEffect } from 'react'

export function ProtectedRoute({ children }) {
  const router = useRouter()
  const { isAuthenticated, loading } = useAuth()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth/login')
    }
  }, [loading, isAuthenticated, router])

  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>
  }

  if (!isAuthenticated) {
    return null
  }

  return children
}
