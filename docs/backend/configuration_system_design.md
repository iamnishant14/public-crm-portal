# Configuration System Design

## Goals
- Represent org-specific behavior without source code changes.
- Keep configuration safe, versioned, auditable, and reversible.
- Provide staged rollout and rollback controls.

## Configuration Domains
- Module flags: enabled features and domain modules.
- Access model: roles, permissions, policy conditions.
- Workflow model: states, transitions, SLA thresholds, escalation rules.
- Form model: fields, validation, visibility rules, conditional sections.
- Notification model: channels, templates, rate limits, failure handling.
- Branding and localization: theme tokens, language packs, labels.
- Integrations: endpoints, auth methods, mapping/transformation rules.

## Versioned Schema Model
- `schemaVersion`: semantic version for configuration contract.
- `templateVersion`: base domain template release used by org.
- `configVersion`: immutable org config snapshot ID.
- `compatibility`: supported platform versions for safe deployment.

## Suggested Top-Level Structure
```json
{
  "schemaVersion": "1.0.0",
  "orgId": "org_hospital_001",
  "templateVersion": "hospital-v1.2.0",
  "modules": {},
  "identityAccess": {},
  "workflows": {},
  "forms": {},
  "notifications": {},
  "branding": {},
  "integrations": {},
  "policy": {}
}
```

## Validation Pipeline
- Schema validation: JSON schema and static type constraints.
- Semantic validation:
  - workflows have no dead-end terminal states unless explicit.
  - SLA timers are within allowed policy limits.
  - role-permission matrix does not violate separation-of-duties rules.
- Referential integrity checks:
  - workflow references existing forms/templates.
  - notification templates reference valid channels.
- Security checks:
  - forbidden external domains and insecure callback URLs blocked.
  - privilege escalation patterns blocked.

## Publish Lifecycle
1. Draft created by admin.
2. Draft edited and auto-validated on each save.
3. Preview mode renders affected screens/workflows for simulation.
4. Approval gate (role-based) for high-impact changes.
5. Publish creates immutable `configVersion`.
6. Runtime sync applies config to org instance with post-apply checks.

## Rollback Lifecycle
- Any published config can be marked rollback target.
- Rollback operation:
  - freeze new writes to impacted settings during switch.
  - re-apply prior `configVersion`.
  - run health and policy checks.
  - emit rollback audit event with reason and actor.

## Change Management And Audit
- Every config mutation stores:
  - actor, timestamp, diff summary, risk score, approval chain.
- Maintain full historical diff and restore points.
- Export change history for compliance audits.

## Policy Guardrails
- Global platform policies cannot be overridden by org config.
- Restricted fields require multi-party approval.
- High-risk changes can enforce maintenance window constraints.

## Testing Strategy
- Unit tests for schema rules and policy validators.
- Contract tests for config-to-runtime adapters.
- Integration tests for draft/publish/rollback flows.
- Snapshot tests for preview rendering consistency.

## Migration Strategy
- Provide migration scripts between schema versions.
- Backward compatibility window for at least one major schema version.
- Reject publish if migration fails validation.

## Operational Metrics
- Config validation failure rate.
- Publish success rate and mean publish time.
- Rollback frequency and recovery time.
- Policy violation attempts by category.
