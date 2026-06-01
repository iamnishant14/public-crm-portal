export function hasPermission(userPermissions, requiredPermission) {
  return userPermissions?.includes(requiredPermission) ?? false
}

export function hasRole(userRole, allowedRoles) {
  if (typeof allowedRoles === 'string') {
    return userRole === allowedRoles
  }
  return allowedRoles.includes(userRole)
}

export const ROLES = {
  PLATFORM_SUPER_ADMIN: 'PlatformSuperAdmin',
  ORG_ADMIN: 'OrgAdmin',
  COMPLIANCE_OFFICER: 'ComplianceOfficer',
  WORKFLOW_MANAGER: 'WorkflowManager',
  INTEGRATION_MANAGER: 'IntegrationManager',
  VIEWER_AUDITOR: 'ViewerAuditor'
}

export const PERMISSIONS = {
  READ: 'read',
  WRITE: 'write',
  APPROVE: 'approve',
  PUBLISH: 'publish',
  ROLLBACK: 'rollback'
}

export const ROLE_PERMISSIONS = {
  [ROLES.PLATFORM_SUPER_ADMIN]: [PERMISSIONS.READ, PERMISSIONS.WRITE, PERMISSIONS.APPROVE, PERMISSIONS.PUBLISH, PERMISSIONS.ROLLBACK],
  [ROLES.ORG_ADMIN]: [PERMISSIONS.READ, PERMISSIONS.WRITE, PERMISSIONS.APPROVE, PERMISSIONS.PUBLISH],
  [ROLES.COMPLIANCE_OFFICER]: [PERMISSIONS.READ, PERMISSIONS.APPROVE],
  [ROLES.WORKFLOW_MANAGER]: [PERMISSIONS.READ, PERMISSIONS.WRITE],
  [ROLES.INTEGRATION_MANAGER]: [PERMISSIONS.READ, PERMISSIONS.WRITE],
  [ROLES.VIEWER_AUDITOR]: [PERMISSIONS.READ]
}
