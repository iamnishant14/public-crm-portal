import jwt from 'jsonwebtoken'
import { ROLE_PERMISSIONS, ROLES } from '../../../lib/rbac'

const DEMO_USERS = {
  'admin@org.gov': {
    email: 'admin@org.gov',
    name: 'Organization Admin',
    role: ROLES.ORG_ADMIN
  },
  'auditor@org.gov': {
    email: 'auditor@org.gov',
    name: 'Viewer Auditor',
    role: ROLES.VIEWER_AUDITOR
  },
  'workflow@org.gov': {
    email: 'workflow@org.gov',
    name: 'Workflow Manager',
    role: ROLES.WORKFLOW_MANAGER
  },
  'super@platform.gov': {
    email: 'super@platform.gov',
    name: 'Platform Super Admin',
    role: ROLES.PLATFORM_SUPER_ADMIN
  }
}

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { email, password } = req.body || {}
  if (!email || !password) {
    return res.status(400).json({ message: 'Missing email or password' })
  }

  const user = DEMO_USERS[email.toLowerCase()]
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' })
  }

  const permissions = ROLE_PERMISSIONS[user.role] || []
  const token = jwt.sign(
    {
      email: user.email,
      role: user.role,
      permissions
    },
    process.env.JWT_SECRET || 'dev-secret',
    { expiresIn: '1h' }
  )

  return res.status(200).json({
    token,
    user: {
      ...user,
      permissions
    }
  })
}
