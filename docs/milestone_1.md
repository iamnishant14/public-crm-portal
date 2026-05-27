# Milestone 1: Core Features

## Overview
This milestone establishes platform foundations and delivers the first usable CRM slice for government operators.

## Scope
- Bootstrap Next.js frontend shell with role-aware routing and core layouts.
- Build Node.js BFF/API gateway baseline.
- Implement FastAPI core services for contacts and cases.
- Implement authentication and role-based access for key personas.
- Deliver initial operational dashboards and basic reports.

## Engineering Tasks
- Define API standards, error model, and request tracing IDs.
- Create foundational data models for org, users, contacts, and cases.
- Add SLA tracking primitives for case lifecycle.
- Build reusable UI component primitives and design tokens.
- Setup CI/CD checks (lint, test, security scan baseline).

## Testing And Quality
- Unit tests for service-layer business logic.
- API contract tests for key endpoints.
- Basic integration tests for case creation-to-closure flow.
- Accessibility checks for priority operator screens.

## Exit Criteria
- Core case and contact flows are functional for pilot users.
- Auth and role checks are enforced on protected endpoints.
- Baseline observability is enabled (logs, metrics, traces).