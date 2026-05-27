# Domain Templates

## Purpose
Domain templates accelerate onboarding by providing pre-configured modules, workflows, forms, and KPIs per organization type.

## Template Strategy
- Base template contains common CRM building blocks.
- Domain templates extend base template with opinionated defaults.
- Organization-specific overrides are layered after template selection.

## Template Composition Layers
1. Platform Base Template
2. Domain Template
3. Org Override Package
4. Runtime Feature Flags

## Hospital Template
### Recommended Modules
- Patient/citizen contact registry
- Service request and grievance case management
- Appointment and follow-up workflows
- Referral tracking and department routing

### Core Workflows
- Complaint intake -> triage -> assignment -> SLA follow-up -> closure
- Referral intake -> validation -> specialist queue -> completion
- Service delay escalation -> supervisor review -> resolution

### Default KPIs
- Average response and resolution time
- Escalation rate by department
- Citizen satisfaction closure score
- Pending high-priority case count

## School Template
### Recommended Modules
- Student and guardian contact management
- Enrollment support cases
- Attendance and welfare intervention tracking
- Parent communication workflows

### Core Workflows
- Admission query -> document check -> counseling -> closure
- Student issue -> counselor assignment -> action plan -> review
- Scholarship request -> eligibility check -> approval -> disbursement update

### Default KPIs
- Admission query closure time
- Guardian communication turnaround
- Pending welfare interventions by urgency
- Scholarship processing SLA compliance

## Electricity Department Template
### Recommended Modules
- Consumer account contact management
- Billing and complaint case management
- Outage and service interruption workflows
- Field service dispatch coordination

### Core Workflows
- Billing complaint -> verification -> adjustment decision -> closure
- Outage report -> incident grouping -> field dispatch -> restoration update
- New connection request -> documentation -> site verification -> activation

### Default KPIs
- Outage response and restoration time
- Billing complaint first-contact resolution rate
- Field dispatch turnaround
- SLA breach count by service zone

## Extension Points
- Add custom case types and categories.
- Add domain-specific workflow states and transition rules.
- Add custom forms with conditional sections.
- Add report widgets and metrics definitions.
- Add connector mappings for local legacy systems.

## Template Governance
- Template versions are immutable and semantically versioned.
- Domain template updates include migration notes.
- Breaking template changes require compatibility checks and approval.

## Org Onboarding From Template
- Select domain template and version.
- Apply org profile and policy pack.
- Apply org overrides and run validation.
- Execute preview simulation and approval.
- Publish and activate instance.
