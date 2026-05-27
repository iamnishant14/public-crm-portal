# Data Model And API Contracts

## Data Domain Overview
- Identity: users, roles, policies, sessions.
- Organization: org profile, config versions, environment metadata.
- Contacts: person, household, institution, relationships.
- Cases: case, task, status history, SLA checkpoints, escalation events.
- Workflows: workflow definitions, states, transitions, execution logs.
- Notifications: templates, channel configs, delivery attempts.
- Documents: metadata, storage references, retention tags.

## Core Entity Guidelines
- Every domain entity includes:
  - `id`, `orgId`, `createdAt`, `updatedAt`, `createdBy`, `updatedBy`.
- Soft delete for operational entities where auditability is required.
- Version columns for concurrency-safe updates.

## Data Ownership
- Service owns its transactional write model.
- Shared reads happen through APIs or materialized read models.
- Cross-service joins are avoided in transactional paths.

## API Standards
- REST-first with versioned prefix: `/api/v1`.
- Consistent response envelope:
  - `data`, `meta`, `errors`, `requestId`.
- Idempotency support for create actions where retries are common.
- Pagination standard: cursor-based for large collections.

## Error Contract
- Unified error shape:
  - `code`, `message`, `details`, `requestId`.
- Error classes:
  - validation, authorization, conflict, dependency, internal.

## Key Endpoint Groups
- `/auth/*` for login/session lifecycle.
- `/contacts/*` for contact CRUD, search, and relationship operations.
- `/cases/*` for case lifecycle, assignment, SLA, escalation.
- `/workflows/*` for definitions and execution state.
- `/config/*` for draft, validate, publish, rollback.
- `/reports/*` for dashboard and export access.

## API Governance
- OpenAPI contract per service.
- Contract tests in CI for backward compatibility.
- Deprecation policy with sunset windows and migration notes.

## Events And Async Contracts
- Event naming: `<domain>.<entity>.<action>`.
- Include `eventId`, `occurredAt`, `orgId`, and payload version.
- Use schema registry for event version compatibility.
