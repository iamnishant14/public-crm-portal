import { PERMISSIONS, hasPermission } from '../../../lib/rbac'
import { getUserFromRequest } from '../../../lib/serverAuth'

let organizations = [
  { id: 'org_1', name: 'Primary Org', status: 'active', createdAt: new Date().toISOString() }
]

export default async function handler(req, res) {
  const user = await getUserFromRequest(req)
  if (!user) return res.status(401).json({ message: 'Unauthorized' })

  if (req.method === 'GET') {
    if (!hasPermission(user.permissions, PERMISSIONS.READ)) return res.status(403).json({ message: 'Forbidden' })
    return res.status(200).json({ organizations })
  }

  if (req.method === 'PUT') {
    if (!hasPermission(user.permissions, PERMISSIONS.WRITE)) return res.status(403).json({ message: 'Forbidden' })
    
    const { name, settings } = req.body || {}
    if (!name) return res.status(400).json({ message: 'Missing name' })
    
    const org = organizations[0]
    org.name = name
    org.settings = settings || {}
    org.updatedAt = new Date().toISOString()
    org.updatedBy = user.email
    return res.status(200).json(org)
  }

  return res.status(405).json({ message: 'Method not allowed' })
}
