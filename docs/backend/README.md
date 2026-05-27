# Backend Docs

This folder contains backend/platform-focused documentation: architecture, provisioning, configuration, SRE, security, and delivery planning.

## Foundational
- vision_and_principles.md — Product vision, personas, core principles, non-functional expectations
- architecture_overview.md — System context, tech baseline, service boundaries, deployment topology
- decision_log.md — Architecture decision records (ADRs)

## Platform Design
- configuration_system_design.md — Config schema, validation pipeline, publish/rollback lifecycle, guardrails
- tenant_and_provisioning_design.md — Tenancy model, isolation, provisioning workflow, rollback strategy
- domain_templates.md — Hospital/School/Electricity templates, extension points, governance

## Operations & Security
- observability_and_sre.md — SLOs, monitoring, alerting, incident management, backup/DR, runbooks
- security_compliance_governance.md — Auth, authz, data protection, audit, compliance, incident response

## Execution & Delivery
- delivery_roadmap.md — Phased delivery (Phases 0-5) with exit criteria
- deliverables_tracker.md — Centralized tracker for deliverable ownership and status
- EXECUTION_PLAN.md — Detailed week-by-week TDD execution plan
- EXECUTION_PLAN_UPDATED.md — Modernized plan with GitOps, Policy-as-Code, automated provisioning

Refer to docs/frontend for UI guidance and docs/middleware for API contracts.
