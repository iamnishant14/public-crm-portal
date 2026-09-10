# 1. Architecture Requirements

## Goal
Design a production-grade, configurable integration + workflow orchestration platform. Users configure what to call and how to compose it; the platform controls where/how it executes, security, credentials, networking, limits, durability, and observability.

## Technology Direction
- Frontend: Next.js + React + TypeScript
- Control plane: Node.js + NestJS
- Execution/processing: Python + FastAPI/workers
- Durable state: PostgreSQL
- Ephemeral coordination: Redis
- Event plane: Kafka/Redpanda
- Durable orchestration: Temporal
- Large objects: S3-compatible object storage
- Runtime: Kubernetes
- Observability: OpenTelemetry + Prometheus + Grafana + centralized logs

## Core Architecture
Next.js
→ HTTPS/WebSocket
→ NestJS Control Plane
→ PostgreSQL
→ Workflow Compiler
→ Temporal
→ Python Workers
→ Adapter Layer
→ 12–15+ Upstreams

Parallel event path:
PostgreSQL state change
→ Transactional Outbox
→ Kafka
→ Realtime Consumer
→ WebSocket
→ Browser

Supporting:
Redis → cache / locks / rate limits / concurrency / circuit breakers / idempotency
S3 → large payloads / results / artifacts
Vault/Secret Manager → credentials

## User Requirements
Users must be able to:
→ register/use upstream integrations
→ select predefined operations
→ create authorized custom operations
→ configure routes, parameters and mappings
→ reference input and previous step outputs
→ define transformations and conditions
→ compose workflows as DAGs
→ run workflows asynchronously
→ cancel/retry jobs
→ monitor job/step status in real time
→ retrieve results

New normal workflows/configurations must not require backend deployments.

## Upstream Model
Integration
→ Upstream
→ Upstream Version
→ Adapter
→ Operations

Upstream controls:
→ base URL/host
→ authentication reference
→ TLS
→ network policy
→ rate limits
→ concurrency
→ timeout
→ retry/circuit-breaker policy

## Operation Model
Operation
→ predefined OR custom
→ method
→ route template
→ path/query parameters
→ request schema
→ request mapping
→ response schema
→ response mapping
→ security policy
→ execution policy

Custom operations may control route/method/parameters/mappings only within platform policy.

## Security Boundary
User controls:
→ workflow composition
→ authorized routes
→ parameters
→ mappings
→ conditions
→ transformations

Platform controls:
→ hosts/base URLs
→ credentials
→ network destinations
→ TLS
→ allowed methods/routes
→ timeouts
→ payload limits
→ rate limits
→ concurrency
→ retry boundaries
→ security policies

Prevent:
→ SSRF
→ arbitrary code execution
→ arbitrary network access
→ secret leakage
→ privilege escalation
→ cross-tenant access

Never execute arbitrary Python/JavaScript/eval from user configuration. Use a controlled expression language such as CEL/JSONata/JSONPath.

## Workflow Model
Workflow
→ immutable Workflow Version
→ input schema
→ DAG
→ steps

Initial step types:
→ UPSTREAM
→ TRANSFORM
→ CONDITION
→ PARALLEL
→ STORE

Future:
→ MERGE
→ FILTER
→ AGGREGATE
→ WAIT
→ NOTIFY

Runtime context:
→ input
→ variables
→ steps
→ metadata

Example expressions:
→ {{input.customer_id}}
→ {{steps.customer.id}}
→ {{steps.orders.total}}

## Compiler
Workflow Definition
→ syntax validation
→ reference resolution
→ operation/version resolution
→ schema validation
→ expression validation
→ dependency validation
→ cycle detection
→ security validation
→ policy validation
→ compile
→ immutable Execution Plan

Do not execute raw user workflow JSON directly.

## Execution
Temporal owns:
→ durable workflow state
→ activity execution
→ retries
→ timeouts
→ cancellation
→ timers/signals
→ recovery

Python workers own:
→ upstream calls
→ transformations
→ validation
→ CPU-intensive processing
→ artifacts

Independent DAG branches must run in parallel.

## Runtime Upstream Pipeline
Step
→ resolve references
→ evaluate expressions
→ build request
→ request schema validation
→ authentication
→ rate limiter
→ distributed concurrency limiter
→ circuit breaker
→ adapter
→ upstream
→ response validation
→ response mapping
→ persist output
→ emit event

## Retry
Define clear ownership between Temporal and HTTP/client retries.
Avoid retry multiplication such as:
Temporal 3 × HTTP 3 = 9 upstream calls.

Consider:
→ retryable vs non-retryable errors
→ exponential backoff
→ jitter
→ Retry-After
→ idempotency

## Data
PostgreSQL is the source of truth.

Core entities:
→ tenants
→ integrations
→ upstreams
→ upstream_versions
→ operations
→ operation_versions
→ configurations
→ configuration_versions
→ workflows
→ workflow_versions
→ jobs
→ job_steps
→ job_events
→ audit_logs
→ outbox_events

Redis is NOT business-state storage.

Large payloads:
Python
→ S3
→ ObjectReference
→ Temporal/Kafka/PostgreSQL/WebSocket carry references or metadata, not large bodies.

## Versioning
A job pins:
→ workflow version
→ configuration version
→ operation version
→ upstream version where relevant

Active versions are immutable.
New changes create new versions.
Running jobs retain pinned behavior.

## Events
Kafka topics may include:
→ platform.job.events
→ platform.workflow.events
→ platform.upstream.events
→ platform.configuration.events
→ platform.audit.events

Event envelope:
→ event_id
→ event_type
→ event_version
→ tenant_id
→ job_id
→ workflow_id
→ workflow_version
→ step_id
→ sequence
→ timestamp
→ trace_id
→ payload

Partition job events by job_id to preserve per-job ordering.
Support consumer groups, retries, DLQ, deduplication and schema evolution.

## Realtime
Initial:
Next.js
→ WebSocket
→ NestJS Realtime Gateway

Live event path:
Kafka
→ Realtime Consumer
→ WebSocket
→ Browser

Recovery:
WebSocket disconnect
→ reconnect
→ GET /jobs/:id/events?after={last_sequence}
→ replay missing events
→ resume WebSocket

WebSocket is not authoritative state.

## Job State
QUEUED
→ STARTING
→ RUNNING
→ COMPLETED

Alternative:
RUNNING
→ FAILED

Cancellation:
RUNNING
→ CANCELLING
→ CANCELLED

Step state:
PENDING
→ READY
→ RUNNING
→ RETRYING
→ SUCCESS / FAILED / SKIPPED / CANCELLED

## Job Creation
Next.js
→ POST /api/v1/jobs
→ auth
→ RBAC
→ tenant validation
→ input validation
→ idempotency
→ load pinned versions
→ create job in PostgreSQL
→ create outbox event
→ start Temporal
→ 202 Accepted

## Observability
Propagate:
→ trace_id
→ request_id
→ tenant_id
→ job_id
→ workflow_id
→ workflow_version
→ step_id
→ upstream_id
→ operation_id

Trace:
Browser
→ NestJS
→ Temporal
→ Python
→ Adapter
→ Upstream

Measure:
→ latency
→ errors
→ retries
→ timeouts
→ circuit breaker
→ rate-limit rejections
→ queue depth
→ Kafka lag
→ worker health

## Kubernetes
Deploy independently:
→ frontend
→ control-api
→ realtime
→ workflow workers
→ integration workers
→ processing workers
→ event consumers

Scale:
→ HPA for APIs
→ KEDA/queue-depth scaling for workers

Worker scaling must never bypass upstream rate/concurrency limits.

## Required LLD Output
Produce:
→ architecture diagrams
→ component responsibilities
→ runtime/data-flow diagrams
→ sequence diagrams
→ PostgreSQL ERD + DDL
→ JSON Schemas
→ TypeScript interfaces
→ Python/Pydantic models
→ workflow definition
→ execution plan
→ compiler design/pseudocode
→ Temporal workflows/activities
→ adapter interfaces
→ Redis key design
→ Kafka topics/events
→ REST APIs
→ WebSocket protocol
→ security model
→ failure/recovery model
→ Kubernetes deployment
→ observability
→ repository structure
→ complete worked example

For every system explain:
→ responsibility
→ inputs
→ outputs
→ state owned
→ interfaces
→ dependencies
→ failure behavior
→ retry behavior
→ scaling
→ security
→ observability

Do not hide implementation details behind generic phrases.

---

# 2. Initial Claude Architecture Prompt

Act as a Principal/Staff Architect and distributed-systems engineer.

Use `01_architecture_requirements.md` as the source of truth.

First reconstruct the architecture from first principles.

Do not jump directly to code.

Your architecture must be:
→ production-grade
→ implementation-oriented
→ secure
→ observable
→ horizontally scalable
→ failure-resilient
→ version-reproducible
→ configurable without backend deployments for normal workflows

Start with:
→ system context
→ control plane
→ execution plane
→ event plane
→ data plane
→ component boundaries
→ responsibilities
→ runtime flow

Then explain each individual system:
→ Next.js
→ NestJS
→ PostgreSQL
→ Configuration
→ Workflow Compiler
→ Temporal
→ Python workers
→ Adapter framework
→ Redis
→ Kafka
→ Realtime Gateway
→ S3
→ Secrets Manager
→ Observability
→ Kubernetes

For every boundary explicitly show:
Component A
→ protocol/API/event
→ data
→ Component B
→ persistence
→ failure handling

Then produce the complete implementation-level LLD requested by the requirements document.

Do not use generic statements such as "use a microservice" or "use a queue" without explaining the exact responsibility, interface, data, state and failure behavior.

Where alternatives exist, select one recommended design and explain the trade-off.

---

# 3. Architecture Review Prompt

Review the architecture you previously designed for the configurable integration/workflow platform.

Act as a hostile Principal Architect / production reliability reviewer.

Do not redesign it immediately.

Find concrete weaknesses in:

→ architecture boundaries
→ data ownership
→ consistency
→ versioning
→ workflow durability
→ Temporal usage
→ retry multiplication
→ idempotency
→ distributed rate limiting
→ concurrency limiting
→ circuit breakers
→ Kafka ordering
→ outbox reliability
→ WebSocket recovery
→ large payload handling
→ PostgreSQL scalability
→ Redis failure behavior
→ upstream failures
→ worker crashes
→ Kubernetes scaling
→ SSRF
→ arbitrary code execution
→ secrets
→ tenant isolation
→ authorization
→ observability
→ disaster recovery
→ operational complexity

For every issue provide:

→ problem
→ why it matters
→ failure scenario
→ impact
→ recommended correction
→ whether the correction changes an existing contract

Pay special attention to:
→ exactly-once assumptions
→ at-least-once delivery
→ duplicate events
→ duplicate jobs
→ stale versions
→ partial failures
→ retry storms
→ upstream overload
→ lost realtime events
→ database/event divergence
→ Temporal history growth

Finish with a prioritized list:
P0 = must fix
P1 = important
P2 = improvement

---

# 4. Final LLD Prompt

Using:
→ `01_architecture_requirements.md`
→ your previously generated architecture
→ your architecture review findings

produce the final implementation-level LLD.

Treat the corrected architecture as authoritative.

The output must be internally consistent across all layers.

Produce:

1. Architecture diagrams
2. Component diagram
3. Control/execution/event/data plane separation
4. Runtime data flow
5. End-to-end sequence diagrams
6. PostgreSQL ERD
7. Actual PostgreSQL DDL
8. TypeScript interfaces
9. Pydantic models
10. JSON Schemas
11. UpstreamDefinition
12. OperationDefinition
13. WorkflowDefinition
14. WorkflowStep
15. ExecutionPlan
16. Configuration models
17. Job and JobStep models
18. EventEnvelope
19. ObjectReference
20. Error model
21. Workflow compiler pseudocode
22. Temporal workflow/activity design
23. Python execution pipeline
24. REST adapter design
25. Expression engine
26. Transformation engine
27. Redis key model
28. Kafka topic/partition/event model
29. Transactional outbox
30. WebSocket protocol
31. REST API contracts
32. Security architecture
33. SSRF controls
34. Tenant isolation
35. Retry/idempotency strategy
36. Failure/recovery model
37. Kubernetes deployment
38. HPA/KEDA scaling
39. Observability
40. CI/CD
41. Repository structure
42. Complete worked example

Worked example:

Get Customer
→ Get Accounts
→ Get Orders
→ Risk Analysis
→ Store Result

Show the example at every layer:
→ workflow JSON
→ operation definitions
→ compiled plan
→ PostgreSQL records
→ Temporal execution
→ Python activity
→ adapter request
→ upstream response
→ transformations
→ Kafka events
→ WebSocket events
→ final result API

Do not leave important implementation details as placeholders.

For every interface specify:
→ owner
→ request
→ response
→ errors
→ idempotency
→ timeout
→ retry
→ authorization
→ observability

For every database table specify:
→ columns
→ types
→ keys
→ constraints
→ indexes
→ lifecycle

For every event specify:
→ producer
→ topic
→ partition key
→ schema
→ ordering
→ consumers
→ retry/DLQ
→ deduplication

Make sure all versions are immutable and jobs pin their execution dependencies.

The final document should be suitable for an engineering design review and as the starting point for implementation.

---

# 5. Ultra-Short Seed

Design a production-grade configurable integration + workflow orchestration platform:

Next.js
→ NestJS Control Plane
→ PostgreSQL Source of Truth
→ Workflow Compiler
→ Temporal Durable Orchestration
→ Python Integration/Processing Workers
→ Adapter Layer
→ 12–15+ Upstreams

Supporting:
Redis → cache/locks/rate limits/concurrency/circuit breakers/idempotency
Kafka → events/outbox/realtime
S3 → large payloads/results/artifacts
Vault → secrets
Kubernetes → runtime

Core:
Integration → Upstream → Operation → Version
Workflow → Version → DAG → Steps → Execution Plan

User controls:
→ routes/parameters/mappings/conditions/transforms/workflow composition

Platform controls:
→ host/credentials/network/TLS/security/limits/durability

Prevent:
→ SSRF
→ arbitrary code execution
→ arbitrary network access
→ secret leakage
→ retry multiplication

Compiler:
Definition
→ Validate
→ Resolve
→ Version
→ Schema
→ Expression
→ DAG
→ Security
→ Policy
→ Compile
→ Immutable Plan

Runtime:
Step
→ Resolve
→ Expression
→ Request
→ Validate
→ Auth
→ Rate Limit
→ Concurrency
→ Circuit Breaker
→ Adapter
→ Upstream
→ Response Validate
→ Mapping
→ Persist
→ Event

Realtime:
Postgres
→ Outbox
→ Kafka
→ Realtime Consumer
→ WebSocket
→ Browser

Recovery:
WebSocket reconnect
→ REST events after sequence
→ replay
→ resume

Now produce an implementation-level LLD with diagrams, DDL, schemas, TypeScript/Pydantic contracts, Temporal design, adapters, Redis, Kafka, APIs, WebSocket, security, failure recovery, Kubernetes, observability and a complete worked example.
