import { PERMISSIONS, hasPermission } from '../../../lib/rbac'
import { getUserFromRequest } from '../../../lib/serverAuth'

let publishedConfigs = [
  { id: 'cfg_1', name: 'Default Config', version: 1, publishedAt: new Date().toISOString(), publishedBy: 'admin@sys' }
]

export default async function handler(req, res) {
  const user = await getUserFromRequest(req)
  if (!user) return res.status(401).json({ message: 'Unauthorized' })

  if (req.method === 'POST') {
    if (!hasPermission(user.permissions, PERMISSIONS.PUBLISH)) return res.status(403).json({ message: 'Forbidden' })
    
    const { configId, configData } = req.body || {}
    if (!configId || !configData) return res.status(400).json({ message: 'Missing configId or configData' })
    
    const existing = publishedConfigs.find(c => c.id === configId)
    const version = existing ? (existing.version || 1) + 1 : 1
    const entry = { id: configId, name: configData.name || configId, version, publishedAt: new Date().toISOString(), publishedBy: user.email, data: configData }
    const idx = publishedConfigs.findIndex(c => c.id === configId)
    if (idx >= 0) {
      publishedConfigs[idx] = entry
    } else {
      publishedConfigs.push(entry)
    }
    return res.status(201).json(entry)
  }

  return res.status(405).json({ message: 'Method not allowed' })
}
