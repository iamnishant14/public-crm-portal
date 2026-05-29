const handler = require('../../../pages/api/workflows/index').default
const idHandler = require('../../../pages/api/workflows/[id]').default
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

test('GET /api/workflows allowed for viewer (read)', () => {
  const token = jwt.sign({ email: 'auditor@org.gov', role: 'ViewerAuditor' }, secret)
  const req = { method: 'GET', headers: { authorization: `Bearer ${token}` } }
  const res = makeRes()
  const result = handler(req, res)
  expect(result.statusCode).toBe(200)
})

test('POST /api/workflows forbidden for viewer', () => {
  const token = jwt.sign({ email: 'auditor@org.gov', role: 'ViewerAuditor' }, secret)
  const req = { method: 'POST', headers: { authorization: `Bearer ${token}` }, body: { name: 'x', data: { steps: [], connections: [] } } }
  const res = makeRes()
  const result = handler(req, res)
  expect(result.statusCode).toBe(403)
})

test('POST /api/workflows allowed for workflow manager', () => {
  const token = jwt.sign({ email: 'workflow@org.gov', role: 'WorkflowManager' }, secret)
  const req = { method: 'POST', headers: { authorization: `Bearer ${token}` }, body: { name: 'wf test', data: { steps: [], connections: [] } } }
  const res = makeRes()
  const result = handler(req, res)
  expect(result.statusCode).toBe(201)
  expect(result.body).toHaveProperty('id')
})

test('DELETE api/workflows/[id] forbidden for viewer', () => {
  const tokenMgr = jwt.sign({ email: 'workflow@org.gov', role: 'WorkflowManager' }, secret)
  // create
  let req = { method: 'POST', headers: { authorization: `Bearer ${tokenMgr}` }, body: { name: 'to-delete', data: { steps: [], connections: [] } } }
  let res = makeRes()
  const created = handler(req, res).body
  const id = created.id

  const tokenViewer = jwt.sign({ email: 'auditor@org.gov', role: 'ViewerAuditor' }, secret)
  req = { method: 'DELETE', headers: { authorization: `Bearer ${tokenViewer}` }, query: { id } }
  res = makeRes()
  const del = idHandler(req, res)
  expect(del.statusCode).toBe(403)
})

test('DELETE api/workflows/[id] allowed for workflow manager', () => {
  const tokenMgr = jwt.sign({ email: 'workflow@org.gov', role: 'WorkflowManager' }, secret)
  let req = { method: 'POST', headers: { authorization: `Bearer ${tokenMgr}` }, body: { name: 'to-delete-2', data: { steps: [], connections: [] } } }
  let res = makeRes()
  const created = handler(req, res).body
  const id = created.id
  req = { method: 'DELETE', headers: { authorization: `Bearer ${tokenMgr}` }, query: { id } }
  res = makeRes()
  const del = idHandler(req, res)
  expect(del.statusCode).toBe(204)
})
