import jwt from 'jsonwebtoken'
import loginHandler from '../../pages/api/auth/login'
import auditHandler from '../../pages/api/audit/logs'
import previewHandler from '../../pages/api/config/preview'

function createReq({ method = 'GET', token, body = {}, query = {} } = {}) {
  return {
    method,
    headers: token ? { authorization: `Bearer ${token}` } : {},
    body,
    query
  }
}

function createRes() {
  const res = {
    statusCode: 200,
    payload: undefined,
    status: jest.fn((code) => {
      res.statusCode = code
      return res
    }),
    json: jest.fn((payload) => {
      res.payload = payload
      return res
    })
  }
  return res
}

function signRole(role, extra = {}) {
  return jwt.sign({ email: `${role}@example.test`, role, ...extra }, process.env.JWT_SECRET || 'dev-secret')
}

describe('API RBAC enforcement', () => {
  test('issues a JWT and user permissions for demo login', async () => {
    const res = createRes()

    await loginHandler(createReq({
      method: 'POST',
      body: { email: 'admin@org.gov', password: 'password' }
    }), res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.payload.user).toMatchObject({
      email: 'admin@org.gov',
      role: 'OrgAdmin',
      permissions: ['read', 'write', 'approve', 'publish']
    })
    expect(jwt.verify(res.payload.token, process.env.JWT_SECRET || 'dev-secret')).toMatchObject({
      email: 'admin@org.gov',
      role: 'OrgAdmin'
    })
  })

  test('requires authentication for audit logs', async () => {
    const res = createRes()

    await auditHandler(createReq(), res)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.payload).toEqual({ message: 'Unauthorized' })
  })

  test('allows read-only roles to read audit logs but not write them', async () => {
    const token = signRole('ViewerAuditor')

    const readRes = createRes()
    await auditHandler(createReq({ method: 'GET', token }), readRes)

    expect(readRes.status).toHaveBeenCalledWith(200)
    expect(readRes.payload).toHaveProperty('logs')

    const writeRes = createRes()
    await auditHandler(createReq({
      method: 'POST',
      token,
      body: { action: 'delete', resource: 'workflow' }
    }), writeRes)

    expect(writeRes.status).toHaveBeenCalledWith(403)
    expect(writeRes.payload).toEqual({ message: 'Forbidden' })
  })

  test('requires publish permission for config preview', async () => {
    const token = signRole('WorkflowManager')
    const res = createRes()

    await previewHandler(createReq({
      method: 'POST',
      token,
      body: { configId: 'cfg_1', changeData: { name: 'System Config' } }
    }), res)

    expect(res.status).toHaveBeenCalledWith(403)
    expect(res.payload).toEqual({ message: 'Forbidden' })
  })
})
