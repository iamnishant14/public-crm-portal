import { workflows } from './index'

export default function handler(req, res) {
  const { id } = req.query
  if (req.method === 'GET') {
    const wf = workflows.find(w => w.id === id)
    if (!wf) return res.status(404).json({ message: 'Not found' })
    return res.status(200).json(wf)
  }

  if (req.method === 'DELETE') {
    const idx = workflows.findIndex(w => w.id === id)
    if (idx === -1) return res.status(404).json({ message: 'Not found' })
    workflows.splice(idx, 1)
    return res.status(204).end()
  }

  return res.status(405).json({ message: 'Method not allowed' })
}
