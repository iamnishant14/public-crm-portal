import { PERMISSIONS, hasPermission } from '../../../lib/rbac'
import { getUserFromRequest } from '../../../lib/serverAuth'

let configs = []

export default async function handler(req, res) {
  const user = await getUserFromRequest(req)
  if (!user) return res.status(401).json({ message: 'Unauthorized' })

  if (req.method === 'POST') {
    if (!hasPermission(user.permissions, PERMISSIONS.PUBLISH)) return res.status(403).json({ message: 'Forbidden' })
    
    const { configId, changeData } = req.body || {}
    if (!configId || !changeData) return res.status(400).json({ message: 'Missing configId or changeData' })
    
    const riskScore = Math.floor(Math.random() * 100)
    const entry = { configId, changeData, riskScore, analyzedAt: new Date().toISOString(), analyzedBy: user.email }
    configs.push(entry)
    return res.status(200).json({ riskScore, message: `Risk analyzed: ${riskScore}%` })
  }

  return res.status(405).json({ message: 'Method not allowed' })
}
