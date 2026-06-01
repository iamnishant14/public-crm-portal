# Admin Console Component Inventory

Last Updated: 2026-05-30

## Purpose

This inventory maps the Admin Console information architecture to reusable UI components, design system primitives, API dependencies, and implementation status in `apps/public_crm_portal_admin_v1`.

Status values:
- `Implemented`: usable in `admin_v1`.
- `Prototype`: present but backed by local/in-memory APIs or incomplete UX.
- `Planned`: required by docs but not implemented.

## Shared Shell And Foundations

| Area | Components | Status | Notes |
| --- | --- | --- | --- |
| App shell | Header, sidebar navigation, main content region, page title | Implemented | Needs tenant/environment/config version context and role-aware nav visibility. |
| Route protection | Auth guard, unauthenticated redirect, loading state | Implemented | Uses `AuthContext`; future work should handle session expiry and refresh flow. |
| API client | `useApi` hook with JWT Authorization header | Implemented | Needs `/api/v1` envelope adapter, request ID propagation, cursor pagination, and standardized error handling. |
| Feedback | Loading, error, empty states | Prototype | Existing pages implement local states; should move to design system primitives. |
| Data display | Tables, status badges, cards | Prototype | Tables are non-virtualized; large audit/config history views require pagination and virtualized variants. |
| Forms | Text inputs, text areas, buttons | Prototype | Needs consistent design system adoption, validation states, help text, and accessibility review. |
| Dialog patterns | Confirm modal, drawer, detail panel | Planned | Required for publish, rollback, audit details, and evidence export flows. |
| Notifications | Toasts, banners, inline alerts | Planned | Required for API success/failure, long-running export jobs, and publish monitor updates. |

## Page Inventory

| Page | Route | Primary Components | Status | API Dependencies |
| --- | --- | --- | --- | --- |
| Dashboard | `/admin/dashboard` | Health summary, pending approvals, recent changes, policy alerts | Prototype | Reports/health APIs, approvals API, config history API. |
| Organization | `/admin/organization` | Profile form, lifecycle status, tier/compliance settings | Prototype | Organization profile read/update; final route should use `/api/v1` envelope. |
| Access Control | `/admin/access-control` | Role matrix, permission table, approval chain view, emergency access controls | Prototype | Roles, permissions, ABAC policy conditions, elevation lifecycle. |
| Process Studio | `/admin/process-studio` | Workflow builder, SLA policy editor, escalation matrix | Prototype | Workflow definitions, draft save, validation, simulation. |
| Form Studio | `/admin/form-studio` | Field catalog, form canvas, schema export, property editor | Prototype | Form schema draft, validation, versioning, preview. |
| Communications | `/admin/communications` | Template list, channel settings, delivery analytics | Prototype | Notification templates, channel configs, delivery attempts. |
| Integrations | `/admin/integrations` | Connector cards, mapping table, sync schedule, failure queue | Prototype | Connectors, credential references, sync/failure APIs. |
| Releases | `/admin/releases` | Safe-change workflow, config publish, version history | Prototype | Config draft, validate, preview, approve, publish, monitor, rollback. |
| Audit | `/admin/audit` | Audit filters, audit table, empty/error states | Prototype | Audit search, cursor pagination, detail, export jobs, signed log metadata. |
| Login | `/auth/login` | Email/password form, error/loading state | Implemented | Local demo `/api/auth/login`; production path requires SSO/session lifecycle. |

## Safe-Change Workflow Components

| Component | Status | Required Behavior |
| --- | --- | --- |
| Draft editor | Prototype | Edit JSON/config data, autosave, detect conflicts, show schema version and target org/environment. |
| Validation panel | Planned | Show schema, semantic, referential integrity, and security policy failures with actionable remediation. |
| Diff viewer | Planned | Compare draft against active `configVersion`; summarize affected modules, roles, workflows, forms, integrations. |
| Preview simulation | Prototype | Current risk preview exists; needs affected-screen/workflow simulation and deterministic risk metadata. |
| Risk score panel | Prototype | Current score exists; needs severity categories, guardrails, request ID, and policy rule references. |
| Approval gate | Planned | Show approvers, status, non-repudiation markers, dual-approval requirements, and expiration. |
| Publish confirmation | Prototype | Current publish action exists; needs idempotency, confirmation, unresolved-error blocking, and evidence capture. |
| Post-publish monitor | Planned | Show sync/apply status, smoke checks, health checks, and failure remediation. |
| Rollback action | Planned | Select rollback target, capture reason, freeze impacted settings, monitor rollback health, audit result. |
| Evidence bundle export | Planned | Generate/download audit evidence with actor, diff, risk score, approvals, checksums, and request IDs. |

## Audit Workbench Components

| Component | Status | Required Behavior |
| --- | --- | --- |
| Filter toolbar | Prototype | Add actor, action, resource, date range, status, request ID, and saved filters. |
| Audit table | Prototype | Add cursor pagination, sortable columns where supported, compact row density, and stable empty/loading/error states. |
| Audit detail drawer | Planned | Show actor, reason, ticket reference, impact scope, signed envelope metadata, and related request ID. |
| Export job panel | Planned | Create CSV/JSON/evidence exports, track status, show authorization errors, and link completed artifacts. |
| Access review view | Planned | Summarize role/permission review evidence and export status. |

## Design System Component Targets

| Primitive | Needed By | Priority |
| --- | --- | --- |
| App shell and navigation | All admin pages | High |
| Toolbar and filter group | Audit, Releases, Integrations, Communications | High |
| Data table with pagination | Audit, Releases, Access Control, Integrations | High |
| Form field and validation message | Login, Organization, Studios, Config Publish | High |
| Modal and drawer | Audit detail, publish confirmation, rollback reason, evidence export | High |
| Stepper/timeline | Safe-change lifecycle, approvals, publish monitor | High |
| Status badge and risk indicator | Dashboard, Audit, Releases, Integrations | High |
| Toast and inline alert | API success/failure, validation, export jobs | Medium |
| Empty/error/loading states | All data-backed pages | Medium |
| Command palette | Admin-wide navigation/search | Medium |
| Theme editor controls | Branding/localization | Medium |

## Accessibility And Test Coverage Targets

| Area | Required Checks |
| --- | --- |
| Shell navigation | Keyboard tab order, active route semantics, landmark roles. |
| Tables | Header semantics, row focus, pagination controls, no color-only state. |
| Forms | Label association, validation messaging, disabled/loading states, error summaries. |
| Modals/drawers | Focus trap, escape/close behavior, return focus, ARIA labelling. |
| Safe-change flow | Keyboard access to each step, confirmation states, screen-reader-readable risk and approval status. |
| Audit workbench | Filter accessibility, readable timestamps, export job status announcements. |

## Immediate Implementation Priorities

1. Add a small API envelope adapter around `useApi` before integrating staging `/api/v1` endpoints.
2. Refactor Audit Logs and Config Publish to use shared feedback and form primitives.
3. Add component tests for Audit Logs permission states, filter calls, Config Publish JSON validation, and publish gating.
4. Add audit detail and config diff UI skeletons so backend contracts can be validated against realistic screens.
5. Define design system gaps as component RFCs before expanding page-specific CSS.
