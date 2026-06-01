# Frontend Docs

This folder contains frontend-focused documentation: admin console design, UI/UX design system, and related guidance for building the Next.js frontend and design system.

Files:
- admin_console_design.md — Admin console UX and safe-change workflows
- ui_ux_design_system.md — Design tokens, components, accessibility rules, theming
- UI_DEVELOPMENT_PLAN.md — Frontend roadmap, implementation backlog, acceptance criteria
- admin_console_component_inventory.md — Admin console route/component inventory and implementation status

Folder & naming convention

All apps should live in separate folders using the naming standard: public_crm_portal_{model_name}. Create versioned variants when experimenting or evolving an app (for example: public_crm_portal_admin_v1, public_crm_portal_admin_v2). This enables parallel implementations and simple clean-up once a variant is chosen.

Recommended layout example:

- apps/
  - public_crm_portal_admin_v1/
  - public_crm_portal_admin_v2/
  - public_crm_portal_designsystem_v1/

When creating a new app folder, ensure CI, package names, Storybook configs, and deployment manifests are updated to use the same folder-based identifier.

Refer to docs/backend and docs/middleware for platform and API-level documentation.
