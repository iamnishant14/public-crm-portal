import { workflows } from './index'
import { PERMISSIONS, hasPermission } from '../../../lib/rbac'
import { getUserFromRequest } from '../../../lib/serverAuth'

export default async function handler(req, res) {
  const user = await getUserFromRequest(req)
  if (!user) return res.status(401).json({ message: 'Unauthorized' })

  const { id } = req.query
  if (req.method === 'GET') {
    if (!hasPermission(user.permissions, PERMISSIONS.READ)) return res.status(403).json({ message: 'Forbidden' })
    const wf = workflows.find(w => w.id === id)
    if (!wf) return res.status(404).json({ message: 'Not found' })
    return res.status(200).json(wf)
  }

  if (req.method === 'DELETE') {
    if (!hasPermission(user.permissions, PERMISSIONS.WRITE)) return res.status(403).json({ message: 'Forbidden' })
    const idx = workflows.findIndex(w => w.id === id)
    if (idx === -1) return res.status(404).json({ message: 'Not found' })
    workflows.splice(idx, 1)
    return res.status(204).end()
  }

  return res.status(405).json({ message: 'Method not allowed' })
}
