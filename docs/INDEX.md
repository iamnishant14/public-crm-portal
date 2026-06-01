# Documentation Index — Government CRM Platform

Complete index organized by feature area. Docs are grouped into frontend, middleware, and backend for team-specific discovery.

## Frontend Documentation
Design systems, UX patterns, and admin console guidance.

- **[admin_console_design.md](frontend/admin_console_design.md)** — Admin UX, safe-change workflows, access control, permission model, guardrails.
- **[ui_ux_design_system.md](frontend/ui_ux_design_system.md)** — Design tokens, component library, accessibility, theming, branding, internationalization.
- **[Frontend README](frontend/README.md)** — Frontend folder overview.

## Middleware Documentation
API standards, data contracts, and BFF guidance.

- **[data_model_and_api_contracts.md](middleware/data_model_and_api_contracts.md)** — Entity definitions, API standards, error contracts, event naming, governance.
- **[admin_bff_api_contracts.md](middleware/admin_bff_api_contracts.md)** — Frontend-facing Admin Console BFF contracts for auth, audit, and config lifecycle.
- **[pull_request_guidelines.md](middleware/pull_request_guidelines.md)** — PR quality standards, commit rules, review practices, merge readiness.

## Backend Documentation
Platform architecture, provisioning, configuration, SRE, security, and execution plans.

### Foundational Docs
- **[vision_and_principles.md](backend/vision_and_principles.md)** — Product vision, objectives, personas, core principles, non-functional expectations.
- **[architecture_overview.md](backend/architecture_overview.md)** — System context, tech baseline, logical layers, service boundaries, deployment topology.
- **[decision_log.md](backend/decision_log.md)** — Architecture decision records (ADRs) for major platform choices.

### Platform Design
- **[configuration_system_design.md](backend/configuration_system_design.md)** — Config schema, validation pipeline, publish/rollback lifecycle, policy guardrails, testing strategy.
- **[tenant_and_provisioning_design.md](backend/tenant_and_provisioning_design.md)** — Tenancy model, isolation boundaries, provisioning workflow, states, rollback strategy, sizing/scaling.
- **[domain_templates.md](backend/domain_templates.md)** — Hospital, School, Electricity templates; extension points; governance; org onboarding.

### Operations & Security
- **[observability_and_sre.md](backend/observability_and_sre.md)** — SLO framework, telemetry standards, monitoring views, alerting, incident management, backup/DR, runbooks.
- **[security_compliance_governance.md](backend/security_compliance_governance.md)** — Authentication, authorization, data protection, audit/non-repudiation, compliance controls, incident response.

### Execution & Delivery
- **[delivery_roadmap.md](backend/delivery_roadmap.md)** — Phased delivery approach with exit criteria for each phase (0-5).
- **[deliverables_tracker.md](backend/deliverables_tracker.md)** — Centralized tracker for deliverable ownership, status, targets, and blockers.
- **[EXECUTION_PLAN.md](backend/EXECUTION_PLAN.md)** — Detailed week-by-week execution plan with TDD approach (full version in repo).
- **[EXECUTION_PLAN_UPDATED.md](backend/EXECUTION_PLAN_UPDATED.md)** — Modernized plan with GitOps, Policy-as-Code, automated provisioning SLAs, compliance automation.

## How to Navigate
1. **Getting Started**: Read [backend/vision_and_principles.md](backend/vision_and_principles.md) and [backend/architecture_overview.md](backend/architecture_overview.md).
2. **UI Development**: See [frontend/](frontend/) docs for design system and admin console specs.
3. **API Development**: See [middleware/data_model_and_api_contracts.md](middleware/data_model_and_api_contracts.md) for contracts and standards.
4. **Backend Implementation**: See [backend/](backend/) docs for config, provisioning, and operational guidance.
5. **Quality Standards**: Review [middleware/pull_request_guidelines.md](middleware/pull_request_guidelines.md) before opening PRs.

## Maintenance Notes
- Documentation is organized by team responsibility (frontend, middleware, backend).
- Each folder includes a README explaining scope.
- Update docs alongside code changes (same PR when possible).
- Architecture decisions should be recorded in [backend/decision_log.md](backend/decision_log.md).
- Delivery progress tracked in [backend/deliverables_tracker.md](backend/deliverables_tracker.md).
