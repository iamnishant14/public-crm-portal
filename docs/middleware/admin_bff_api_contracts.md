# Admin BFF API Contracts

Last Updated: 2026-05-30

## Purpose

This document defines the frontend-facing `/api/v1` BFF contracts needed by the Admin Console. It narrows the generic API standards in `data_model_and_api_contracts.md` into concrete contracts for auth/session, audit, and configuration lifecycle UI work.

These contracts are the migration target for the current `apps/public_crm_portal_admin_v1` local prototype routes.

## Contract Standards

### Versioning

All frontend-facing BFF routes use:

```text
/api/v1
```

### Authentication

Admin UI calls send:

```http
Authorization: Bearer <access_token>
```

Privileged mutation routes should also accept an idempotency key:

```http
Idempotency-Key: <client-generated-uuid>
```

### Response Envelope

Successful responses:

```json
{
  "data": {},
  "meta": {
    "pagination": null
  },
  "errors": [],
  "requestId": "req_01HX..."
}
```

Error responses:

```json
{
  "data": null,
  "meta": {},
  "errors": [
    {
      "code": "authorization.forbidden",
      "message": "You do not have permission to perform this action.",
      "details": {
        "requiredPermission": "publish"
      },
      "requestId": "req_01HX..."
    }
  ],
  "requestId": "req_01HX..."
}
```

### Error Classes

| HTTP Status | Code Prefix | UI Behavior |
| --- | --- | --- |
| 400 | `validation.*` | Show field-level or section-level remediation. |
| 401 | `auth.unauthenticated` | Clear local session and redirect to login/session recovery. |
| 403 | `authorization.*` | Show permission-denied state and required capability if safe to reveal. |
| 409 | `conflict.*` | Show conflict resolution or reload/diff action. |
| 422 | `policy.*` | Show policy guardrail details and remediation. |
| 424 | `dependency.*` | Show retry/blocked dependency state. |
| 500 | `internal.*` | Show generic failure with request ID. |

### Pagination

Cursor-paginated responses use:

```json
{
  "meta": {
    "pagination": {
      "nextCursor": "cursor_next",
      "previousCursor": "cursor_prev",
      "limit": 50,
      "hasMore": true
    }
  }
}
```

## Auth And Session

### `POST /api/v1/auth/login`

Local/demo environments may use password-based login. Production should route through SSO/session lifecycle.

Request:

```json
{
  "email": "admin@org.gov",
  "password": "redacted"
}
```

Response:

```json
{
  "data": {
    "accessToken": "jwt",
    "expiresAt": "2026-05-30T12:30:00.000Z",
    "user": {
      "id": "usr_123",
      "email": "admin@org.gov",
      "name": "Organization Admin",
      "role": "OrgAdmin",
      "permissions": ["read", "write", "approve", "publish"],
      "orgId": "org_123"
    },
    "session": {
      "id": "sess_123",
      "mfaRequired": false,
      "riskLevel": "low"
    }
  },
  "meta": {},
  "errors": [],
  "requestId": "req_123"
}
```

### `GET /api/v1/auth/session`

Returns the current authenticated session and UI policy context.

Response data:

```json
{
  "user": {
    "id": "usr_123",
    "email": "admin@org.gov",
    "name": "Organization Admin",
    "role": "OrgAdmin",
    "permissions": ["read", "write", "approve", "publish"],
    "orgId": "org_123"
  },
  "context": {
    "orgId": "org_123",
    "environment": "staging",
    "activeConfigVersion": "cfgv_42",
    "templateVersion": "hospital-v1.2.0"
  },
  "navigation": [
    { "label": "Dashboard", "href": "/admin/dashboard", "visible": true },
    { "label": "Audit", "href": "/admin/audit", "visible": true }
  ]
}
```

### `POST /api/v1/auth/logout`

Invalidates the active session. Response `data` can be `{ "loggedOut": true }`.

## Audit Contracts

### `GET /api/v1/audit/logs`

Query params:

| Param | Required | Notes |
| --- | --- | --- |
| `cursor` | No | Cursor from prior page. |
| `limit` | No | Default 50, max 200. |
| `actorId` | No | User or service principal ID. |
| `action` | No | Event action, exact or backend-supported partial. |
| `resourceType` | No | Config, role, workflow, form, integration, auth, export. |
| `resourceId` | No | Resource identifier. |
| `status` | No | `success`, `failure`, `blocked`, `pending`. |
| `requestId` | No | Trace/support lookup. |
| `from` | No | ISO timestamp inclusive. |
| `to` | No | ISO timestamp exclusive. |

Response data:

```json
{
  "logs": [
    {
      "id": "aud_123",
      "orgId": "org_123",
      "occurredAt": "2026-05-30T10:15:00.000Z",
      "actor": {
        "id": "usr_123",
        "email": "admin@org.gov",
        "role": "OrgAdmin"
      },
      "action": "config.publish",
      "resource": {
        "type": "configVersion",
        "id": "cfgv_43",
        "name": "Hospital staging config"
      },
      "status": "success",
      "requestId": "req_123",
      "summary": "Published configuration version cfgv_43",
      "riskScore": 32
    }
  ]
}
```

### `GET /api/v1/audit/logs/{auditLogId}`

Response data:

```json
{
  "id": "aud_123",
  "orgId": "org_123",
  "occurredAt": "2026-05-30T10:15:00.000Z",
  "actor": {
    "id": "usr_123",
    "email": "admin@org.gov",
    "role": "OrgAdmin"
  },
  "action": "config.publish",
  "resource": {
    "type": "configVersion",
    "id": "cfgv_43"
  },
  "reason": "Release approved for staging validation",
  "ticketReference": "CHG-1042",
  "impactScope": ["workflow", "roles"],
  "before": { "configVersion": "cfgv_42" },
  "after": { "configVersion": "cfgv_43" },
  "signature": {
    "algorithm": "ed25519",
    "keyId": "audit-key-2026-05",
    "digest": "sha256:..."
  },
  "requestId": "req_123"
}
```

### `POST /api/v1/audit/exports`

Creates an export job.

Request:

```json
{
  "format": "csv",
  "filters": {
    "from": "2026-05-01T00:00:00.000Z",
    "to": "2026-06-01T00:00:00.000Z",
    "action": "config.publish"
  },
  "reason": "Monthly compliance review"
}
```

Response data:

```json
{
  "exportJob": {
    "id": "exp_123",
    "status": "pending",
    "format": "csv",
    "createdAt": "2026-05-30T10:20:00.000Z"
  }
}
```

### `GET /api/v1/audit/exports/{exportJobId}`

Response data:

```json
{
  "exportJob": {
    "id": "exp_123",
    "status": "completed",
    "downloadUrl": "/api/v1/audit/exports/exp_123/download",
    "expiresAt": "2026-05-31T10:20:00.000Z"
  }
}
```

## Config Lifecycle Contracts

### `GET /api/v1/config/versions`

Returns published config versions.

Response data:

```json
{
  "versions": [
    {
      "id": "cfgv_43",
      "orgId": "org_123",
      "status": "active",
      "schemaVersion": "1.0.0",
      "templateVersion": "hospital-v1.2.0",
      "publishedAt": "2026-05-30T10:15:00.000Z",
      "publishedBy": "usr_123",
      "riskScore": 32
    }
  ]
}
```

### `POST /api/v1/config/drafts`

Creates a draft from an active config version or template.

Request:

```json
{
  "sourceConfigVersion": "cfgv_42",
  "name": "May workflow update",
  "reason": "Adjust triage workflow SLA",
  "ticketReference": "CHG-1042"
}
```

Response data:

```json
{
  "draft": {
    "id": "cfgd_123",
    "name": "May workflow update",
    "orgId": "org_123",
    "baseConfigVersion": "cfgv_42",
    "schemaVersion": "1.0.0",
    "status": "editing",
    "version": 1,
    "updatedAt": "2026-05-30T10:25:00.000Z"
  }
}
```

### `GET /api/v1/config/drafts/{draftId}`

Returns draft metadata, config payload, latest validation state, and conflict/version metadata.

### `PUT /api/v1/config/drafts/{draftId}`

Updates a draft. Requires optimistic concurrency.

Headers:

```http
If-Match: "draft-version-1"
```

Request:

```json
{
  "config": {
    "schemaVersion": "1.0.0",
    "orgId": "org_123",
    "workflows": {}
  }
}
```

Response data includes the updated draft and latest `etag`.

### `POST /api/v1/config/drafts/{draftId}/validate`

Runs schema, semantic, referential, and security validation.

Response data:

```json
{
  "validation": {
    "status": "failed",
    "checkedAt": "2026-05-30T10:30:00.000Z",
    "results": [
      {
        "severity": "error",
        "code": "workflow.dead_end_state",
        "path": "workflows.triage.states.closed",
        "message": "Workflow state has no allowed transition.",
        "remediation": "Add a transition or mark the state as terminal."
      }
    ]
  }
}
```

### `GET /api/v1/config/drafts/{draftId}/diff`

Returns a UI-ready diff against the draft base version.

Response data:

```json
{
  "diff": {
    "baseConfigVersion": "cfgv_42",
    "draftId": "cfgd_123",
    "summary": {
      "added": 2,
      "changed": 5,
      "removed": 0
    },
    "sections": [
      {
        "domain": "workflows",
        "path": "workflows.triage.sla",
        "changeType": "changed",
        "before": { "hours": 48 },
        "after": { "hours": 24 },
        "impact": "Shortens triage SLA"
      }
    ]
  }
}
```

### `POST /api/v1/config/drafts/{draftId}/preview`

Runs preview simulation and risk scoring.

Response data:

```json
{
  "preview": {
    "id": "prev_123",
    "status": "completed",
    "riskScore": 72,
    "riskLevel": "medium",
    "policyFindings": [
      {
        "severity": "warning",
        "code": "policy.sla_tightening",
        "message": "Triage SLA reduced by more than 40%."
      }
    ],
    "affectedSurfaces": ["Process Studio", "Dashboard", "Case SLA Monitor"]
  }
}
```

### `POST /api/v1/config/drafts/{draftId}/approvals`

Requests or records an approval action.

Request:

```json
{
  "action": "request",
  "reason": "Medium risk workflow change ready for review"
}
```

Response data:

```json
{
  "approval": {
    "id": "appr_123",
    "status": "pending",
    "requiredApprovals": 2,
    "receivedApprovals": 0,
    "expiresAt": "2026-06-01T10:30:00.000Z"
  }
}
```

### `POST /api/v1/config/drafts/{draftId}/publish`

Publishes a validated and approved draft. Requires `Idempotency-Key`.

Request:

```json
{
  "reason": "Approved staging release",
  "ticketReference": "CHG-1042",
  "maintenanceWindowId": "mw_123"
}
```

Response data:

```json
{
  "publish": {
    "id": "pub_123",
    "status": "applying",
    "configVersion": "cfgv_43",
    "auditLogId": "aud_123",
    "monitorUrl": "/api/v1/config/publishes/pub_123"
  }
}
```

### `GET /api/v1/config/publishes/{publishId}`

Returns publish/apply status.

Response data:

```json
{
  "publish": {
    "id": "pub_123",
    "status": "completed",
    "configVersion": "cfgv_43",
    "checks": [
      { "name": "runtime_sync", "status": "passed" },
      { "name": "post_apply_health", "status": "passed" }
    ],
    "completedAt": "2026-05-30T10:45:00.000Z"
  }
}
```

### `POST /api/v1/config/rollback`

Rolls back to a prior config version. Requires `Idempotency-Key`.

Request:

```json
{
  "targetConfigVersion": "cfgv_42",
  "reason": "Post-publish health regression",
  "ticketReference": "INC-2201"
}
```

Response data:

```json
{
  "rollback": {
    "id": "rb_123",
    "status": "applying",
    "targetConfigVersion": "cfgv_42",
    "auditLogId": "aud_124",
    "monitorUrl": "/api/v1/config/rollbacks/rb_123"
  }
}
```

### `GET /api/v1/config/rollbacks/{rollbackId}`

Returns rollback status and post-rollback checks.

### `POST /api/v1/config/evidence-bundles`

Creates a compliance evidence bundle for publish, rollback, or date range.

Request:

```json
{
  "scope": {
    "type": "configVersion",
    "id": "cfgv_43"
  },
  "format": "zip"
}
```

Response data:

```json
{
  "evidenceBundle": {
    "id": "evb_123",
    "status": "pending",
    "createdAt": "2026-05-30T11:00:00.000Z"
  }
}
```

## UI Migration Notes

Current prototype routes should map as follows:

| Prototype Route | Target Contract |
| --- | --- |
| `POST /api/auth/login` | `POST /api/v1/auth/login` |
| `GET /api/audit/logs` | `GET /api/v1/audit/logs` |
| `POST /api/config/preview` | `POST /api/v1/config/drafts/{draftId}/preview` |
| `POST /api/config/publish` | `POST /api/v1/config/drafts/{draftId}/publish` |

Before switching UI pages to staging APIs:
- Add an envelope-aware API client adapter.
- Update UI error states to use `errors[0].code`, `errors[0].message`, and top-level `requestId`.
- Introduce cursor pagination in table components.
- Add idempotency keys for publish, rollback, export, and evidence-bundle creation.
- Keep server-side authorization as the source of truth; client permission checks are only presentation hints.
