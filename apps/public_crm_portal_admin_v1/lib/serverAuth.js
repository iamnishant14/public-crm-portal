import { createRemoteJWKSet, jwtVerify } from 'jose'
import jwt from 'jsonwebtoken'
import { ROLE_PERMISSIONS } from './rbac'

export async function getUserFromRequest(req) {
  const auth = req.headers?.authorization || req.headers?.Authorization
  if (!auth) return null
  const parts = auth.split(' ')
  if (parts.length !== 2) return null
  const token = parts[1]

  const jwksUri = process.env.JWKS_URI
  if (jwksUri) {
    try {
      const JWKS = createRemoteJWKSet(new URL(jwksUri))
      const opts = {}
      if (process.env.JWT_AUDIENCE) opts.audience = process.env.JWT_AUDIENCE
      if (process.env.JWT_ISSUER) opts.issuer = process.env.JWT_ISSUER
      const { payload } = await jwtVerify(token, JWKS, opts)
      const role = payload.role || payload['role'] || payload['https://claims.role']
      const email = payload.email || payload.sub
      const permissions = ROLE_PERMISSIONS[role] || payload.permissions || []
      return { email, role, permissions }
    } catch (e) {
      // failed jwks verification
      return null
    }
  }

  // fallback to HMAC verify for local/dev tokens
  try {
    const secret = process.env.JWT_SECRET || 'dev-secret'
    const payload = jwt.verify(token, secret)
    const role = payload.role
    const email = payload.email
    const permissions = ROLE_PERMISSIONS[role] || payload.permissions || []
    return { email, role, permissions }
  } catch (e) {
    return null
  }
}
