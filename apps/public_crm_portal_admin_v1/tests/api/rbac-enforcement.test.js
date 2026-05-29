const jwt = require('jsonwebtoken')

const secret = process.env.JWT_SECRET || 'dev-secret'

function makeRes() {
  let statusCode = 200
  let body = null
  let ended = false
  return {
    status(code) { statusCode = code; return this },
    json(obj) { body = obj; return { statusCode, body } },
    end() { ended = true; return { statusCode } },
    _get() { return { statusCode, body, ended } }
  }
}

// Helper to make token
function makeToken(role, email = 'test@org.gov') {
  return jwt.sign({ email, role }, secret)
}

// Config Preview Tests
test('POST /api/config/preview requires PUBLISH permission', () => {
  const handler = require('../../../pages/api/config/preview').default
  const token = makeToken('ViewerAuditor')
  const req = { method: 'POST', headers: { authorization: `Bearer ${token}` }, body: { configId: 'cfg_1', changeData: {} } }
  const res = makeRes()
  handler(req, res)
  expect(res._get().statusCode).toBe(403)
})

test('POST /api/config/preview allowed for org admin', async () => {
  const handler = require('../../../pages/api/config/preview').default
  const token = makeToken('OrgAdmin')
  const req = { method: 'POST', headers: { authorization: `Bearer ${token}` }, body: { configId: 'cfg_1', changeData: {} } }
  const res = makeRes()
  await handler(req, res)
  expect(res._get().statusCode).toBe(200)
})

// Config Publish Tests
test('POST /api/config/publish requires PUBLISH permission', () => {
  const handler = require('../../../pages/api/config/publish').default
  const token = makeToken('WorkflowManager')
  const req = { method: 'POST', headers: { authorization: `Bearer ${token}` }, body: { configId: 'cfg_1', configData: { name: 'Test' } } }
  const res = makeRes()
  handler(req, res)
  expect(res._get().statusCode).toBe(403)
})

test('POST /api/config/publish allowed for platform admin', async () => {
  const handler = require('../../../pages/api/config/publish').default
  const token = makeToken('PlatformSuperAdmin')
  const req = { method: 'POST', headers: { authorization: `Bearer ${token}` }, body: { configId: 'cfg_1', configData: { name: 'Test' } } }
  const res = makeRes()
  await handler(req, res)
  expect(res._get().statusCode).toBe(201)
})

// Audit Logs Tests
test('GET /api/audit/logs requires READ permission', () => {
  const handler = require('../../../pages/api/audit/logs').default
  const token = makeToken('PlatformSuperAdmin')
  const req = { method: 'GET', headers: { authorization: `Bearer ${token}` }, query: {} }
  const res = makeRes()
  handler(req, res)
  expect(res._get().statusCode).toBe(200)
})

test('POST /api/audit/logs requires WRITE permission', () => {
  const handler = require('../../../pages/api/audit/logs').default
  const token = makeToken('ViewerAuditor')
  const req = { method: 'POST', headers: { authorization: `Bearer ${token}` }, body: { action: 'login', resource: 'user' } }
  const res = makeRes()
  handler(req, res)
  expect(res._get().statusCode).toBe(403)
})

// Org Profile Tests
test('GET /api/organizations/profile requires READ permission', () => {
  const handler = require('../../../pages/api/organizations/profile').default
  const token = makeToken('OrgAdmin')
  const req = { method: 'GET', headers: { authorization: `Bearer ${token}` }, query: {} }
  const res = makeRes()
  handler(req, res)
  expect(res._get().statusCode).toBe(200)
})

test('PUT /api/organizations/profile requires WRITE permission', () => {
  const handler = require('../../../pages/api/organizations/profile').default
  const token = makeToken('ViewerAuditor')
  const req = { method: 'PUT', headers: { authorization: `Bearer ${token}` }, body: { name: 'Updated' } }
  const res = makeRes()
  handler(req, res)
  expect(res._get().statusCode).toBe(403)
})
