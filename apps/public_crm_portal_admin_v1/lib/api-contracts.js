export const API_ENDPOINTS = {
  // Auth
  AUTH_LOGIN: '/auth/login',
  AUTH_LOGOUT: '/auth/logout',
  AUTH_REFRESH: '/auth/refresh',

  // Organization
  ORG_PROFILE: '/organizations/profile',
  ORG_UPDATE: '/organizations/profile',

  // Access Control
  ROLES_LIST: '/roles',
  ROLES_CREATE: '/roles',
  ROLES_UPDATE: '/roles/:id',
  PERMISSIONS_LIST: '/permissions',

  // Config
  CONFIG_VERSIONS: '/configs/versions',
  CONFIG_PUBLISH: '/configs/publish',
  CONFIG_ROLLBACK: '/configs/rollback',
  CONFIG_PREVIEW: '/configs/preview',

  // Audit
  AUDIT_LOGS: '/audit/logs',
  AUDIT_EXPORT: '/audit/export'
}

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message)
    this.status = status
    this.data = data
  }
}
