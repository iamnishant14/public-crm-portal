export let workflows = [
  { id: 'wf_1', name: 'Onboard New Tenant', version: 1, createdAt: new Date().toISOString(), createdBy: 'admin@org.gov', data: { steps: [], connections: [] } }
]

function validateWorkflowPayload(body) {
  if (!body) return 'Missing body'
  if (!body.data) return 'Missing data'
  if (!Array.isArray(body.data.steps)) return 'data.steps must be array'
  if (!Array.isArray(body.data.connections)) return 'data.connections must be array'
  return null
}

import { PERMISSIONS, hasPermission } from '../../../lib/rbac'
import { getUserFromRequest } from '../../../lib/serverAuth'

export default async function handler(req, res) {
  const user = await getUserFromRequest(req)
  if (!user) return res.status(401).json({ message: 'Unauthorized' })

  if (req.method === 'GET') {
    if (!hasPermission(user.permissions, PERMISSIONS.READ)) return res.status(403).json({ message: 'Forbidden' })
    return res.status(200).json({ workflows })
  }

  if (req.method === 'POST') {
    if (!hasPermission(user.permissions, PERMISSIONS.WRITE)) return res.status(403).json({ message: 'Forbidden' })
    const validationError = validateWorkflowPayload(req.body)
    if (validationError) return res.status(400).json({ message: validationError })

    const { name, data } = req.body || {}
    // versioning: increment if same name exists
    const existing = workflows.find(w => w.name === name)
    const version = existing ? (existing.version || 1) + 1 : 1
    const id = 'wf_' + (workflows.length + 1)
    const entry = { id, name: name || `Workflow ${workflows.length + 1}`, version, createdAt: new Date().toISOString(), createdBy: user.email || 'unknown', data }
    workflows.unshift(entry)
    return res.status(201).json(entry)
  }

  return res.status(405).json({ message: 'Method not allowed' })
}
