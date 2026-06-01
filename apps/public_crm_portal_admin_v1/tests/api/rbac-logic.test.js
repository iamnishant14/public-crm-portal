import { hasPermission, PERMISSIONS, ROLES, ROLE_PERMISSIONS } from '../../lib/rbac.js'

describe('RBAC Permission Logic', () => {
  test('ViewerAuditor has READ but not WRITE', () => {
    const permissions = ROLE_PERMISSIONS[ROLES.VIEWER_AUDITOR]
    expect(hasPermission(permissions, PERMISSIONS.READ)).toBe(true)
    expect(hasPermission(permissions, PERMISSIONS.WRITE)).toBe(false)
    expect(hasPermission(permissions, PERMISSIONS.PUBLISH)).toBe(false)
  })

  test('WorkflowManager has READ and WRITE', () => {
    const permissions = ROLE_PERMISSIONS[ROLES.WORKFLOW_MANAGER]
    expect(hasPermission(permissions, PERMISSIONS.READ)).toBe(true)
    expect(hasPermission(permissions, PERMISSIONS.WRITE)).toBe(true)
    expect(hasPermission(permissions, PERMISSIONS.PUBLISH)).toBe(false)
  })

  test('OrgAdmin has READ, WRITE, APPROVE, and PUBLISH', () => {
    const permissions = ROLE_PERMISSIONS[ROLES.ORG_ADMIN]
    expect(hasPermission(permissions, PERMISSIONS.READ)).toBe(true)
    expect(hasPermission(permissions, PERMISSIONS.WRITE)).toBe(true)
    expect(hasPermission(permissions, PERMISSIONS.APPROVE)).toBe(true)
    expect(hasPermission(permissions, PERMISSIONS.PUBLISH)).toBe(true)
  })

  test('PlatformSuperAdmin has all permissions', () => {
    const permissions = ROLE_PERMISSIONS[ROLES.PLATFORM_SUPER_ADMIN]
    expect(hasPermission(permissions, PERMISSIONS.READ)).toBe(true)
    expect(hasPermission(permissions, PERMISSIONS.WRITE)).toBe(true)
    expect(hasPermission(permissions, PERMISSIONS.APPROVE)).toBe(true)
    expect(hasPermission(permissions, PERMISSIONS.PUBLISH)).toBe(true)
    expect(hasPermission(permissions, PERMISSIONS.ROLLBACK)).toBe(true)
  })

  test('hasPermission returns false for undefined permissions', () => {
    expect(hasPermission(undefined, PERMISSIONS.READ)).toBe(false)
  })

  test('hasPermission returns false for missing permission', () => {
    const permissions = [PERMISSIONS.READ]
    expect(hasPermission(permissions, PERMISSIONS.WRITE)).toBe(false)
  })
})
