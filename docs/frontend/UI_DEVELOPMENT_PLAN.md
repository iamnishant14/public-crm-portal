# UI Development Plan — Government CRM Platform

Last Updated: 2026-05-30

## Overview

This plan operationalizes `admin_console_design.md`, `ui_ux_design_system.md`, `../middleware/admin_bff_api_contracts.md`, middleware API standards, and backend platform guidance into an actionable UI development roadmap. Goal: deliver an accessible, performant Admin Console and shared Design System that supports theming, i18n, RBAC/ABAC-aware flows, safe-change workflows, immutable auditability, and tenant-aware operations.

## Current Implementation Baseline

The current working implementation is `apps/public_crm_portal_admin_v1`.

Implemented or in progress:
- Next.js admin shell with protected routes and core admin navigation.
- Auth context with persisted JWT and a `useApi` hook that sends `Authorization: Bearer <token>` for UI API calls.
- Demo `/api/auth/login` route for local JWT issuance against existing server-side verification.
- RBAC-protected Audit Logs page backed by `/api/audit/logs`.
- Config Publish UI backed by `/api/config/preview` and `/api/config/publish`.
- JWKS verification tests that mock a JWKS endpoint and validate RS256 JWT verification with public keys.
- RBAC enforcement tests for auth, audit, and config preview paths.

Known gaps against docs:
- API routes are local Next.js prototypes, not final `/api/v1` BFF contracts.
- Responses do not yet use the standard `{ data, meta, errors, requestId }` envelope.
- Audit logs and config publish flows are in-memory prototypes, not immutable signed audit/event pipelines.
- Config publish lacks draft persistence, diff view, approval gate, rollback UI, maintenance-window checks, and evidence bundle export.
- Design system primitives exist but are not consistently adopted across the admin app.
- Accessibility, visual regression, keyboard-flow, and i18n test coverage still need to be formalized.

## Folder Structure And Naming Standard

All applications must be placed in separate top-level folders following the convention: public_crm_portal_{model_name}. Create versioned variants when needed (for example: public_crm_portal_admin_v1, public_crm_portal_admin_v2) so multiple implementations can coexist and be evaluated before selecting a final one. Recommended repository layout:

- apps/
  - public_crm_portal_admin_v1/
  - public_crm_portal_admin_v2/
  - public_crm_portal_designsystem_v1/

Align package names, Storybook project names, CI artifacts, and deployment manifests with the folder name. Keep design tokens and shared libraries in a single package that other app folders reference to avoid duplication.

## Architecture Alignment

Frontend implementation must align with these platform constraints:
- Experience layer: role-based navigation and role-specific dashboard surfaces.
- API layer: BFF/gateway boundary owns frontend-facing aggregation, auth checks, API versioning, and standard error/envelope shaping.
- Policy layer: UI reflects RBAC/ABAC decisions from backend policy evaluation and does not rely on client-only permission checks for enforcement.
- Config lifecycle: publish creates immutable `configVersion` artifacts with diff, risk score, approval trail, audit bundle, and rollback path.
- Tenant model: UI must treat `orgId`, environment, template version, and config version as first-class context.
- Observability: critical UI calls should carry or display `requestId` when backend contracts provide one.

## Revised Milestones And Timeline

1. Discovery And Spec (Week 0-1)
- Review docs and API contracts. Confirm data models and error contracts with middleware.
- Produce IA map, route inventory, permission matrix, and page-level acceptance criteria.
- Deliverable: UI spec + component inventory (mapped to design tokens).

2. Design System Implementation (Week 2-4)
- Foundation: tokens (color, type, spacing), layout primitives, accessibility baselines.
- Component library v1: form controls, data table (virtualized), cards, modals, steppers, timeline, command palette.
- Add status badges, risk indicators, empty/error/loading states, confirmation dialogs, and audit/event timeline primitives.
- Deliverable: npm package (or monorepo package) + Storybook + Figma link parity.

3. Admin Console Core (Week 5-8)
- Shell: list-detail layout, routing, auth guard.
- Key pages: Dashboard, Organization, Access Control, Process Studio (editor placeholder), Form Studio, Integrations, Releases, Audit.
- Add role-aware navigation, request/error surfaces, tenant/environment switch context, and API client envelope handling.
- Deliverable: Admin Console MVP with mocked data, local prototype APIs, and feature-flag hooks for BFF integration.

4. Integration And Policies (Week 9-10)
- Connect to middleware contracts for auth, role/permission checks, config publish/rollback endpoints.
- Implement safe-change workflow UI: draft, validate, diff, preview simulation, risk scoring, approval gate, publish, post-publish monitor, rollback.
- Replace local response shapes with `/api/v1` envelope handling and unified error rendering.
- Deliverable: End-to-end flows against staging APIs.

5. QA, Accessibility, Performance (Week 10-12)
- WCAG compliance verification, keyboard flows, ARIA semantics, focus management.
- Visual regression tests and unit tests; performance audits (low-bandwidth targets, FCP goals).
- Contract tests for BFF integration and JWT/JWKS auth paths.
- Deliverable: Test reports, remediation tickets, performance baseline.

6. Release And Handoff (Week 12)
- Docs: component usage, theming guide, release notes.
- Handoff: runbook for deploy, feature flags, rollback steps.
- Deliverable: Release candidate and design/code parity checklist.

## Implementation Backlog

### Auth, Session, And Policy
- Keep `AuthContext` as the UI source of authenticated session state, including JWT, user profile, role, permissions, and future `orgId`/environment context.
- Add refresh-token and session-expiry UX once middleware supports session lifecycle endpoints.
- Show permission-denied states from server responses; use client permissions only to hide impossible actions and improve ergonomics.
- Add just-in-time elevation UX for restricted operations when backend policy supports it.
- Continue JWKS/public-key verification coverage for server-side auth paths.

### API Client And Contract Handling
- Extend `useApi` or replace it with a typed API client that supports:
  - `/api/v1` base paths.
  - Standard response envelope: `data`, `meta`, `errors`, `requestId`.
  - Cursor pagination and saved filters for large audit/config/history tables.
  - Idempotency keys for publish, rollback, export, and create actions.
  - Error classes: validation, authorization, conflict, dependency, internal.
- Ensure request IDs are shown in error/details surfaces for support and audit traceability.
- Keep local prototype endpoints until staging BFF contracts are ready, but isolate shape adapters so migration is low-friction.

### Admin Shell And Navigation
- Preserve the current app folder: `apps/public_crm_portal_admin_v1`.
- Add tenant/environment header context: org name, environment, config version, and user role.
- Make navigation role-aware using backend-provided permissions.
- Add global loading, error, and toast patterns through design system primitives.

### Audit Logs
- Evolve the current Audit Logs page into an immutable audit workbench:
  - Server-side filters for actor, action, resource, date range, status, and request ID.
  - Cursor pagination and export job creation.
  - Detail drawer showing actor, reason, ticket reference, impact scope, and signed log metadata.
  - Access review and evidence export views.
- Acceptance: read-only roles can search and export within policy; write/publish roles do not gain audit mutation abilities through UI.

### Config Publish And Release Management
- Expand the current Config Publish UI into the documented safe-change lifecycle:
  - Draft editor with autosave and conflict detection.
  - Schema and semantic validation with inline remediation.
  - Diff view between draft and active `configVersion`.
  - Preview simulation for affected workflows/forms/policies.
  - Risk score with policy guardrails and maintenance-window warnings.
  - Approval trail for high-impact changes.
  - Publish action producing immutable `configVersion`.
  - Post-publish monitor and rollback action with reason capture.
  - Compliance evidence bundle export.
- Block publish when unresolved high-severity validation errors exist.
- Require explicit confirmation and approval states for high-risk publish/rollback actions.

### Design System Adoption
- Replace page-level ad hoc styles with shared primitives where available.
- Required primitives for admin v1:
  - App shell, toolbar, tabs, segmented controls, form fields, text areas, data table, modal/drawer, toast, status badge, timeline, stepper, empty state, error state, skeleton/loading.
- Maintain token governance for org branding, light/dark mode, and contrast validation.

### Accessibility And Internationalization
- Add keyboard navigation checks for shell, filters, editors, tables, modals, and publish flow.
- Add focus management for dialogs/drawers and multi-step workflows.
- Externalize user-visible strings and add locale-aware date/time/number formatting.
- Ensure color is never the only status signal for risk, publish state, validation, or audit results.

### Testing And Quality Gates
- Keep unit tests for RBAC logic, API enforcement, login, and JWKS verification.
- Add component tests for Audit Logs and Config Publish workflows.
- Add contract tests for response envelopes once `/api/v1` BFF endpoints exist.
- Add visual regression snapshots for design system primitives and critical admin pages.
- Add accessibility checks in CI for keyboard and contrast regressions.

### Observability And Supportability
- Surface request IDs in API errors.
- Log client-side route-level failures through the observability pipeline once available.
- Track publish flow metrics: preview success, validation failure, approval wait, publish success/failure, rollback usage.
- Add admin-visible status indicators for org/data-plane health when fleet/org telemetry APIs are available.

## Tasks (High Level)
- Component RFCs and small spikes for complex widgets (workflow/form editors).
- Implement token overrides + theme editor with validation for contrast.
- Autosave and conflict resolution primitives for collaborative editing drafts.
- RBAC/ABAC UI controls and just-in-time elevation UX.
- Internationalization scaffolding and locale resource pipeline.
- API client envelope migration and request ID propagation.
- Config publish diff, approval, rollback, and audit evidence UX.
- Audit search/export workbench with cursor pagination.

## Deliverables (Concrete)
- UI spec & component inventory (markdown)
- Design tokens package and Theming guide
- Component library (Storybook + tests) with visual snapshots
- Admin Console MVP (routed app) with the listed pages
- Authenticated API client with JWT/JWKS-tested backend verification
- Safe-change workflow UI with draft, validate, diff, preview, approval, publish, monitor, rollback
- Audit workbench with search, detail, export, and access review surfaces
- Accessibility compliance report and remediation list
- Integration tests with middleware contracts (mock + staging)
- Release docs and runbook

## Acceptance Criteria
- Components meet accessibility checklist (keyboard, contrast, ARIA) and have unit+visual tests.
- Dashboard and Organization pages load under latency targets (P95 under 2s on common screens in test environment).
- Safe-change publish flow enforces validation and dual-approval guardrails per docs.
- Theming supports org overrides without breaking component layouts; theme editor validates contrast.
- UI API calls include valid auth tokens and handle 401/403/validation/conflict responses consistently.
- `/api/v1` integrations use the standard response envelope and display request IDs for support.
- Config publish and rollback actions emit visible audit/evidence states.
- Audit pages respect read-only permission boundaries and support export job tracking.

## Dependencies And Risks
- Middleware API contracts must be stable; allocate 1-week buffer for API contract adjustments.
- Complex editors (Process/Form Studio) may require dedicated spikes and may be delivered in an iterative fashion.
- Performance targets require backend support for pagination/virtualization and efficient APIs.
- Current local Next API prototypes must not be mistaken for final control-plane/BFF contracts.
- In-memory local endpoints are acceptable for UI prototyping only; immutable audit/config persistence is a backend dependency.
- ABAC and just-in-time elevation UX depend on policy engine response contracts.
- Evidence bundles, signed logs, and request IDs depend on backend observability/audit pipeline readiness.

## Owners And Roles (Suggested)
- PM/Designer: specs, Figma parity, acceptance
- Frontend Eng Lead: architecture, release gating
- Frontend Engineers: components, console pages
- QA/Accessibility Engineer: tests and audits
- Backend/Middleware Engineers: API contracts and staging endpoints

## Immediate Next Steps
- Convert the current `admin_v1` prototype status into a tracked checklist in the deliverables tracker.
- Maintain the page-level component inventory in `admin_console_component_inventory.md`.
- Use `../middleware/admin_bff_api_contracts.md` as the `/api/v1` BFF contract source for auth session, audit logs/search/export, config draft/validate/preview/publish/rollback.
- Refactor Audit Logs and Config Publish to consume a small envelope adapter before staging APIs land.
- Add component tests for Audit Logs and Config Publish.
- Schedule API contract sync with middleware owner for envelope, pagination, error, request ID, and idempotency behavior.

## Notes
- Follow design governance: component RFCs for breaking changes, UI regression snapshots each release.
- Keep all docs updated alongside code changes; include links to these deliverables in backend/deliverables_tracker.md and delivery_roadmap.md
