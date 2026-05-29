let workflows = [
  { id: 'wf_1', name: 'Onboard New Tenant', createdAt: new Date().toISOString(), createdBy: 'admin@org.gov', data: { steps: [], connections: [] } }
]

export default function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json({ workflows })
  }

  if (req.method === 'POST') {
    const { name, data, createdBy } = req.body || {}
    const id = 'wf_' + (workflows.length + 1)
    const entry = { id, name: name || `Workflow ${workflows.length + 1}`, createdAt: new Date().toISOString(), createdBy: createdBy || 'admin@org.gov', data }
    workflows.unshift(entry)
    return res.status(201).json(entry)
  }

  return res.status(405).json({ message: 'Method not allowed' })
}
