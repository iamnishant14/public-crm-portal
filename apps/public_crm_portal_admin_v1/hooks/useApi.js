import { useAuth } from '../context/AuthContext'

export class ApiError extends Error {
  constructor({ message, status, code, requestId, details } = {}) {
    super(message || 'API request failed')
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.requestId = requestId
    this.details = details
  }
}

export function isResponseEnvelope(payload) {
  return Boolean(
    payload &&
    typeof payload === 'object' &&
    Object.prototype.hasOwnProperty.call(payload, 'data') &&
    Object.prototype.hasOwnProperty.call(payload, 'errors') &&
    Object.prototype.hasOwnProperty.call(payload, 'requestId')
  )
}

function attachEnvelopeMeta(data, payload) {
  if (data && typeof data === 'object') {
    Object.defineProperties(data, {
      meta: {
        configurable: true,
        enumerable: false,
        value: payload.meta
      },
      requestId: {
        configurable: true,
        enumerable: false,
        value: payload.requestId
      }
    })
  }
  return data
}

export function normalizeApiResponse(payload) {
  if (isResponseEnvelope(payload)) {
    return attachEnvelopeMeta(payload.data, payload)
  }
  return payload
}

export function createApiError(payload, status) {
  if (isResponseEnvelope(payload)) {
    const firstError = payload.errors?.[0] || {}
    return new ApiError({
      message: firstError.message || 'API request failed',
      status,
      code: firstError.code,
      requestId: firstError.requestId || payload.requestId,
      details: firstError.details
    })
  }

  return new ApiError({
    message: payload?.message || 'API request failed',
    status
  })
}

export function formatApiError(error) {
  const parts = [error.message || 'API request failed']
  if (error.requestId) {
    parts.push(`Request ID: ${error.requestId}`)
  }
  return parts.join(' ')
}

export function createApiClient(endpoint, token, fetchImpl = fetch) {
  const buildUrl = (query = null) => {
    const searchParams = new URLSearchParams()
    Object.entries(query || {}).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.set(key, value)
      }
    })
    const search = searchParams.toString()
    return `/api${endpoint}${search ? `?${search}` : ''}`
  }

  const request = async (method = 'GET', body = null, query = null) => {
    try {
      const headers = {
        'Content-Type': 'application/json'
      }

      if (token) {
        headers.Authorization = `Bearer ${token}`
      }

      const options = {
        method,
        headers
      }

      if (body) {
        options.body = JSON.stringify(body)
      }

      const response = await fetchImpl(buildUrl(query), options)
      const payload = await response.json()

      if (!response.ok) {
        throw createApiError(payload, response.status)
      }

      return normalizeApiResponse(payload)
    } catch (error) {
      console.error(`API error [${method} ${endpoint}]:`, error)
      throw error
    }
  }

  return {
    get: (query) => request('GET', null, query),
    post: (body) => request('POST', body),
    put: (body) => request('PUT', body),
    delete: () => request('DELETE')
  }
}

export function useApi(endpoint) {
  const { token } = useAuth()
  return createApiClient(endpoint, token)
}
