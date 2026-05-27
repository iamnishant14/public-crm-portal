# Delivery Roadmap

## Release Approach
- Deliver in phased increments with explicit exit criteria.
- Maintain a hard separation between platform foundation and domain expansion.

## Phase 0 Foundation (Weeks 1-4)
- Establish repos, environments, CI/CD, security baseline.
- Bootstrap Next.js frontend shell and Node BFF.
- Initialize FastAPI domain service skeleton.
- Define initial design tokens and shared components.
- Exit criteria:
  - end-to-end auth path works in dev/staging.
  - baseline observability stack active.

## Phase 1 Core CRM (Weeks 5-10)
- Implement contacts and case management services.
- Add operator dashboards and queue workflows.
- Build basic reports and exports.
- Exit criteria:
  - case lifecycle operational with SLA tracking.
  - role-based access functional for core personas.

## Phase 2 Config Engine And Admin Console (Weeks 11-16)
- Implement config schema registry and validation service.
- Build admin console areas for workflows/forms/roles/branding.
- Add preview, approval, publish, rollback flows.
- Exit criteria:
  - config lifecycle audited and rollback-capable.
  - no-code workflow changes applied safely.

## Phase 3 Provisioning Automation (Weeks 17-20)
- Build org onboarding and provisioning orchestrator.
- Integrate IaC-driven dedicated instance provisioning.
- Add smoke tests and activation gates.
- Exit criteria:
  - new org can be provisioned from template in target SLA.

## Phase 4 Domain Templates (Weeks 21-24)
- Release Hospital, School, and Electricity templates.
- Add template upgrade and compatibility checks.
- Exit criteria:
  - all three templates pass pilot readiness criteria.

## Phase 5 Enterprise Hardening (Weeks 25-30)
- DR drills, compliance evidence automation, performance hardening.
- Incident runbook validation and on-call readiness.
- Exit criteria:
  - SLOs achieved for two consecutive release cycles.

## Cross-Cutting Tracks
- Security and compliance controls integrated in every phase.
- Test automation maturity increases each phase.
- Change management and documentation updated continuously.
