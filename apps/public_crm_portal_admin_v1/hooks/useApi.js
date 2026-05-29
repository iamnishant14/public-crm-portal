import { useAuth } from '../context/AuthContext'

export function useApi(endpoint) {
  const { user } = useAuth()

  const request = async (method = 'GET', body = null) => {
    try {
      const options = {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      }

      if (body) {
        options.body = JSON.stringify(body)
      }

      const response = await fetch(`/api${endpoint}`, options)

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'API request failed')
      }

      return await response.json()
    } catch (error) {
      console.error(`API error [${method} ${endpoint}]:`, error)
      throw error
    }
  }

  return {
    get: () => request('GET'),
    post: (body) => request('POST', body),
    put: (body) => request('PUT', body),
    delete: () => request('DELETE')
  }
}
