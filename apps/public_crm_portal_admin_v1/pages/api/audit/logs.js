import { PERMISSIONS, hasPermission } from '../../../lib/rbac'
import { getUserFromRequest } from '../../../lib/serverAuth'

let auditLogs = []

export default async function handler(req, res) {
  const user = await getUserFromRequest(req)
  if (!user) return res.status(401).json({ message: 'Unauthorized' })

  if (req.method === 'GET') {
    if (!hasPermission(user.permissions, PERMISSIONS.READ)) return res.status(403).json({ message: 'Forbidden' })
    
    const filters = req.query || {}
    let filtered = auditLogs
    if (filters.action) filtered = filtered.filter(l => l.action === filters.action)
    if (filters.userId) filtered = filtered.filter(l => l.userId === filters.userId)
    return res.status(200).json({ logs: filtered })
  }

  if (req.method === 'POST') {
    if (!hasPermission(user.permissions, PERMISSIONS.WRITE)) return res.status(403).json({ message: 'Forbidden' })
    
    const { action, resource, details } = req.body || {}
    if (!action || !resource) return res.status(400).json({ message: 'Missing action or resource' })
    
    const entry = {
      id: 'audit_' + (auditLogs.length + 1),
      action,
      resource,
      details: details || {},
      userId: user.email,
      timestamp: new Date().toISOString()
    }
    auditLogs.push(entry)
    return res.status(201).json(entry)
  }

  return res.status(405).json({ message: 'Method not allowed' })
}
