# Decision Log

## ADR-001: Tenancy Model
- Decision: Use dedicated instance per organization with shared control plane.
- Rationale: strongest isolation and compliance posture for government workloads.
- Consequence: higher infra footprint but simpler data boundary guarantees.

## ADR-002: Configuration Strategy
- Decision: Use versioned config bundles with strict schema and policy validation.
- Rationale: support no-code customization with safety and auditability.
- Consequence: requires schema governance and migration tooling.

## ADR-003: Stack Baseline
- Decision: Next.js frontend, Node.js API gateway, FastAPI domain services.
- Rationale: balances developer productivity with service-level performance and clarity.
- Consequence: requires cross-runtime standards for contracts and telemetry.

## ADR-004: Workflow Execution
- Decision: config-driven workflow engine with explicit state transition rules.
- Rationale: enables domain flexibility across hospital/school/electricity variants.
- Consequence: needs strong simulation and validation tooling.

## ADR-005: Security Posture
- Decision: enforce RBAC + ABAC, immutable audit logs, encryption at rest/in transit.
- Rationale: mandatory for regulated public sector environments.
- Consequence: additional integration and operational complexity accepted.

## ADR-006: Provisioning Automation
- Decision: IaC-driven provisioning with activation smoke tests and rollback.
- Rationale: predictable repeatability and reduced manual error.
- Consequence: platform engineering investment is front-loaded.
