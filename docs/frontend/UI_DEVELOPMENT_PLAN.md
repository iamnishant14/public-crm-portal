UI Development Plan — Government CRM Platform

Overview

This plan operationalizes the frontend/docs: admin_console_design.md and ui_ux_design_system.md into an actionable UI development roadmap. Goal: deliver an accessible, performant Admin Console and shared Design System that supports theming, i18n, RBAC-aware flows, and safe-change workflows.

Folder structure & naming standard

All applications must be placed in separate top-level folders following the convention: public_crm_portal_{model_name}. Create versioned variants when needed (for example: public_crm_portal_admin_v1, public_crm_portal_admin_v2) so multiple implementations can coexist and be evaluated before selecting a final one. Recommended repository layout:

- apps/
  - public_crm_portal_admin_v1/
  - public_crm_portal_admin_v2/
  - public_crm_portal_designsystem_v1/

Align package names, Storybook project names, CI artifacts, and deployment manifests with the folder name. Keep design tokens and shared libraries in a single package that other app folders reference to avoid duplication.

Milestones & Timeline (recommended)

1) Discovery & Spec (Week 0-1)
- Review docs and API contracts. Confirm data models and error contracts with middleware.
- Deliverable: UI spec + component inventory (mapped to design tokens).

2) Design System Implementation (Week 2-4)
- Foundation: tokens (color, type, spacing), layout primitives, accessibility baselines.
- Component library v1: form controls, data table (virtualized), cards, modals, steppers, timeline, command palette.
- Deliverable: npm package (or monorepo package) + Storybook + Figma link parity.

3) Admin Console Core (Week 5-8)
- Shell: list-detail layout, routing, auth guard.
- Key pages: Dashboard, Organization, Access Control, Process Studio (editor placeholder), Form Studio, Integrations, Releases, Audit.
- Deliverable: Admin Console MVP with mocked data and feature-flag hooks for BFF integration.

4) Integration & Policies (Week 9-10)
- Connect to middleware contracts for auth, role/permission checks, config publish/rollback endpoints.
- Implement safe-change workflow UI: draft, preview simulation, risk scoring view, approvals.
- Deliverable: End-to-end flows against staging APIs.

5) QA, Accessibility, Performance (Week 10-12)
- WCAG compliance verification, keyboard flows, ARIA semantics, focus management.
- Visual regression tests and unit tests; performance audits (low-bandwidth targets, FCP goals).
- Deliverable: Test reports, remediation tickets, performance baseline.

6) Release & Handoff (Week 12)
- Docs: component usage, theming guide, release notes.
- Handoff: runbook for deploy, feature flags, rollback steps.
- Deliverable: Release candidate and design/code parity checklist.

Tasks (high level)
- Component RFCs and small spikes for complex widgets (workflow/form editors).
- Implement token overrides + theme editor with validation for contrast.
- Autosave and conflict resolution primitives for collaborative editing drafts.
- RBAC/ABAC UI controls and just-in-time elevation UX.
- Internationalization scaffolding and locale resource pipeline.

Deliverables (concrete)
- UI spec & component inventory (markdown)
- Design tokens package and Theming guide
- Component library (Storybook + tests) with visual snapshots
- Admin Console MVP (routed app) with the listed pages
- Safe-change workflow UI and diff/preview views
- Accessibility compliance report and remediation list
- Integration tests with middleware contracts (mock + staging)
- Release docs and runbook

Acceptance Criteria
- Components meet accessibility checklist (keyboard, contrast, ARIA) and have unit+visual tests.
- Dashboard and Organization pages load under latency targets (P95 under 2s on common screens in test environment).
- Safe-change publish flow enforces validation and dual-approval guardrails per docs.
- Theming supports org overrides without breaking component layouts; theme editor validates contrast.

Dependencies & Risks
- Middleware API contracts must be stable; allocate 1-week buffer for API contract adjustments.
- Complex editors (Process/Form Studio) may require dedicated spikes and may be delivered in an iterative fashion.
- Performance targets require backend support for pagination/virtualization and efficient APIs.

Owners & Roles (suggested)
- PM/Designer: specs, Figma parity, acceptance
- Frontend Eng Lead: architecture, release gating
- Frontend Engineers: components, console pages
- QA/Accessibility Engineer: tests and audits
- Backend/Middleware Engineers: API contracts and staging endpoints

Next steps (immediate)
- Produce component inventory (start with admin_console_design.md sections)
- Kickoff design token implementation and Storybook
- Schedule API contract sync with middleware owner

Notes
- Follow design governance: component RFCs for breaking changes, UI regression snapshots each release.
- Keep all docs updated alongside code changes; include links to these deliverables in backend/deliverables_tracker.md and delivery_roadmap.md

