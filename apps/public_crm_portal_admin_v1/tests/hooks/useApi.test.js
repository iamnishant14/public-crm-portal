jest.mock('../../context/AuthContext', () => ({
  useAuth: jest.fn()
}))

import { createApiClient } from '../../hooks/useApi'

function mockResponse({ ok = true, status = 200, payload }) {
  return {
    ok,
    status,
    json: jest.fn().mockResolvedValue(payload)
  }
}

describe('useApi client', () => {
  let fetchImpl
  let consoleError

  beforeEach(() => {
    fetchImpl = jest.fn()
    consoleError = jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleError.mockRestore()
  })

  test('returns prototype response payloads unchanged', async () => {
    fetchImpl.mockResolvedValue(mockResponse({
      payload: { logs: [{ id: 'audit_1' }] }
    }))

    const api = createApiClient('/audit/logs', 'token-123', fetchImpl)

    await expect(api.get()).resolves.toEqual({ logs: [{ id: 'audit_1' }] })
  })

  test('returns data from successful response envelopes and exposes metadata', async () => {
    fetchImpl.mockResolvedValue(mockResponse({
      payload: {
        data: { logs: [{ id: 'aud_123' }] },
        meta: { pagination: { hasMore: false } },
        errors: [],
        requestId: 'req_123'
      }
    }))

    const api = createApiClient('/audit/logs', 'token-123', fetchImpl)
    const result = await api.get()

    expect(result).toEqual({ logs: [{ id: 'aud_123' }] })
    expect(result.meta).toEqual({ pagination: { hasMore: false } })
    expect(result.requestId).toBe('req_123')
  })

  test('throws normalized errors for prototype error responses', async () => {
    fetchImpl.mockResolvedValue(mockResponse({
      ok: false,
      status: 403,
      payload: { message: 'Forbidden' }
    }))

    const api = createApiClient('/audit/logs', 'token-123', fetchImpl)

    await expect(api.get()).rejects.toMatchObject({
      message: 'Forbidden',
      status: 403
    })
  })

  test('throws normalized errors for enveloped error responses', async () => {
    fetchImpl.mockResolvedValue(mockResponse({
      ok: false,
      status: 403,
      payload: {
        data: null,
        meta: {},
        errors: [{
          code: 'authorization.forbidden',
          message: 'You do not have permission.',
          details: { requiredPermission: 'publish' }
        }],
        requestId: 'req_denied'
      }
    }))

    const api = createApiClient('/config/publish', 'token-123', fetchImpl)

    await expect(api.post({ configId: 'cfg_1' })).rejects.toMatchObject({
      message: 'You do not have permission.',
      status: 403,
      code: 'authorization.forbidden',
      requestId: 'req_denied',
      details: { requiredPermission: 'publish' }
    })
  })

  test('sends authorization header when token exists', async () => {
    fetchImpl.mockResolvedValue(mockResponse({
      payload: { logs: [] }
    }))

    const api = createApiClient('/audit/logs', 'token-123', fetchImpl)
    await api.get({ action: 'login' })

    expect(fetchImpl).toHaveBeenCalledWith('/api/audit/logs?action=login', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer token-123'
      }
    })
  })
})
