import http from 'http'
import { exportJWK, generateKeyPair, SignJWT } from 'jose'
import { getUserFromRequest } from '../../lib/serverAuth'

function listen(server) {
  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => {
      resolve(server.address())
    })
  })
}

function close(server) {
  return new Promise((resolve, reject) => {
    server.close((error) => {
      if (error) reject(error)
      else resolve()
    })
  })
}

describe('JWKS JWT verification', () => {
  const originalEnv = process.env
  let server

  beforeEach(() => {
    jest.resetModules()
    process.env = { ...originalEnv }
    delete process.env.JWT_SECRET
    delete process.env.JWT_AUDIENCE
    delete process.env.JWT_ISSUER
    delete process.env.JWKS_URI
  })

  afterEach(async () => {
    process.env = originalEnv
    if (server?.listening) {
      await close(server)
    }
    server = undefined
  })

  test('verifies an RS256 JWT with a public key from the JWKS endpoint', async () => {
    const { publicKey, privateKey } = await generateKeyPair('RS256')
    const publicJwk = await exportJWK(publicKey)
    const kid = 'admin-test-key'
    const issuer = 'https://issuer.example.test'
    const audience = 'public-crm-admin'

    server = http.createServer((req, res) => {
      if (req.url === '/.well-known/jwks.json') {
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({
          keys: [{ ...publicJwk, kid, alg: 'RS256', use: 'sig' }]
        }))
        return
      }

      res.writeHead(404)
      res.end()
    })

    const address = await listen(server)
    process.env.JWKS_URI = `http://${address.address}:${address.port}/.well-known/jwks.json`
    process.env.JWT_ISSUER = issuer
    process.env.JWT_AUDIENCE = audience

    const token = await new SignJWT({
      email: 'org-admin@example.test',
      role: 'OrgAdmin'
    })
      .setProtectedHeader({ alg: 'RS256', kid })
      .setIssuedAt()
      .setIssuer(issuer)
      .setAudience(audience)
      .setExpirationTime('5m')
      .sign(privateKey)

    const user = await getUserFromRequest({
      headers: { authorization: `Bearer ${token}` }
    })

    expect(user).toEqual({
      email: 'org-admin@example.test',
      role: 'OrgAdmin',
      permissions: ['read', 'write', 'approve', 'publish']
    })
  })

  test('rejects JWTs that cannot be verified by the JWKS public keys', async () => {
    const validKeys = await generateKeyPair('RS256')
    const invalidKeys = await generateKeyPair('RS256')
    const publicJwk = await exportJWK(validKeys.publicKey)
    const kid = 'admin-test-key'

    server = http.createServer((req, res) => {
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({
        keys: [{ ...publicJwk, kid, alg: 'RS256', use: 'sig' }]
      }))
    })

    const address = await listen(server)
    process.env.JWKS_URI = `http://${address.address}:${address.port}/.well-known/jwks.json`

    const token = await new SignJWT({
      email: 'org-admin@example.test',
      role: 'OrgAdmin'
    })
      .setProtectedHeader({ alg: 'RS256', kid })
      .setIssuedAt()
      .setExpirationTime('5m')
      .sign(invalidKeys.privateKey)

    const user = await getUserFromRequest({
      headers: { authorization: `Bearer ${token}` }
    })

    expect(user).toBeNull()
  })
})
