# Deliverables Tracker

## Purpose
This tracker is the single source of truth for planning deliverables tracked across docs in this repository.

## Tracking Conventions
- Allowed statuses: `Not Started`, `In Progress`, `Blocked`, `Done`.
- Update cadence: refresh this tracker at least once per week and in every planning/status PR.
- Owner expectation: each deliverable must have exactly one accountable owner (use team aliases if needed).
- Dates: use ISO format (`YYYY-MM-DD`) for `Target` and `Last Updated`.

## How To Update
- Add or update one row per deliverable in the register below.
- Keep `Source Plan Doc` linked to the originating doc.
- If blocked, add a clear unblock action in `Dependencies/Blockers`.
- Update `Last Updated` whenever `Status`, `Owner`, or `Target` changes.

## Deliverables Register
| Deliverable | Source Plan Doc | Owner | Target | Status | Dependencies/Blockers | Last Updated |
| --- | --- | --- | --- | --- | --- | --- |
| Finalize product vision and measurable success criteria | [`vision_and_principles.md`](vision_and_principles.md) | TBD | TBD | Not Started | Needs stakeholder sign-off on scope and outcomes | 2026-05-27 |
| Approve baseline platform architecture and service boundaries | [`architecture_overview.md`](architecture_overview.md) | TBD | TBD | Not Started | Depends on infra constraints and tenancy decisions | 2026-05-27 |
| Lock phased delivery plan with explicit phase exit criteria | [`delivery_roadmap.md`](delivery_roadmap.md) | TBD | TBD | Not Started | Depends on architecture and staffing assumptions | 2026-05-27 |
| Define tenant provisioning lifecycle and automation requirements | [`tenant_and_provisioning_design.md`](tenant_and_provisioning_design.md) | TBD | TBD | Not Started | Depends on deployment model and cloud account strategy | 2026-05-27 |
| Finalize configuration schema, validation, publish, and rollback flow | [`configuration_system_design.md`](configuration_system_design.md) | TBD | TBD | Not Started | Needs decision on config ownership and approval workflow | 2026-05-27 |
| Establish admin console capabilities, RBAC scope, and safe-change UX | [`admin_console_design.md`](admin_console_design.md) | TBD | TBD | Not Started | Depends on RBAC model and workflow approvals | 2026-05-27 |
| Baseline domain templates and extension model for target sectors | [`domain_templates.md`](domain_templates.md) | TBD | TBD | Not Started | Needs product input on first-wave domains | 2026-05-27 |
| Publish canonical entities and API/event contract standards | [`data_model_and_api_contracts.md`](data_model_and_api_contracts.md) | TBD | TBD | Not Started | Depends on domain model finalization | 2026-05-27 |
| Formalize UI system rules including accessibility and theming baseline | [`ui_ux_design_system.md`](ui_ux_design_system.md) | TBD | TBD | Not Started | Requires design approval on component primitives | 2026-05-27 |
| Track admin console v1 prototype status and gaps | [`../frontend/UI_DEVELOPMENT_PLAN.md`](../frontend/UI_DEVELOPMENT_PLAN.md) | Frontend Eng Lead | TBD | In Progress | Current prototype uses local Next API routes; final BFF contracts pending | 2026-05-30 |
| Produce admin console component inventory and route map | [`../frontend/UI_DEVELOPMENT_PLAN.md`](../frontend/UI_DEVELOPMENT_PLAN.md) | Frontend Eng Lead | TBD | In Progress | Needs design review and Figma/code parity checkpoint | 2026-05-30 |
| Define frontend-facing `/api/v1` BFF contracts for auth, audit, and config lifecycle | [`admin_bff_api_contracts.md`](../middleware/admin_bff_api_contracts.md) | Middleware Engineers | TBD | In Progress | Needs OpenAPI/spec review and backend staging alignment | 2026-05-30 |
| Expand config publish UI to safe-change lifecycle with approval and rollback | [`../frontend/UI_DEVELOPMENT_PLAN.md`](../frontend/UI_DEVELOPMENT_PLAN.md) | Frontend Engineers | TBD | Not Started | Depends on config draft, validation, approval, publish, rollback, and audit evidence APIs | 2026-05-30 |
| Evolve audit page into immutable audit workbench | [`../frontend/UI_DEVELOPMENT_PLAN.md`](../frontend/UI_DEVELOPMENT_PLAN.md) | Frontend Engineers | TBD | Not Started | Depends on audit search, detail, export job, and signed log metadata APIs | 2026-05-30 |
| Maintain ADR process and record key architectural decisions | [`decision_log.md`](decision_log.md) | TBD | TBD | In Progress | Requires recurring architecture review cadence | 2026-05-27 |
| Define security controls, governance model, and compliance obligations | [`security_compliance_governance.md`](security_compliance_governance.md) | TBD | TBD | Not Started | Needs legal/compliance alignment | 2026-05-27 |
| Define SLOs, observability standards, and incident response runbooks | [`observability_and_sre.md`](observability_and_sre.md) | TBD | TBD | Not Started | Depends on service boundaries and runtime platform | 2026-05-27 |
| Enforce PR quality and merge-readiness workflow | [`pull_request_guidelines.md`](pull_request_guidelines.md) | TBD | TBD | In Progress | Requires team adoption and review discipline | 2026-05-27 |

## Milestone Rollup
### Near-Term Milestones
- Assign owner and target date for all open deliverables.
- Move architecture, roadmap, and tenancy deliverables to `In Progress`.
- Confirm first set of domain templates for implementation.
- Finalize frontend-facing BFF contracts before replacing local admin prototype API shapes.
- Review admin component inventory against design system primitives and accessibility requirements.

### Later Milestones
- Complete security, compliance, and SRE operational readiness deliverables.
- Mark API contract and UI system standards as `Done` after cross-team review.
- Keep decision log current for all architecture-impacting changes.
