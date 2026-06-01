# Public CRM Portal — Design System (v1)

Shared component library and design tokens for the Public CRM Portal Admin Console.

## Components

### Basic Components
- **Button** — Primary action button with hover states
- **Card** — Container with optional title and border
- **TextField** — Input with label, error handling, and validation
- **Table** — Data table with columns and rows

### Advanced Components
- **Modal** — Dialog with title, content, and action buttons
- **Toast** — Notification message (success, error, warning, info)
- **Stepper** — Multi-step workflow indicator

## Design Tokens

Located in `tokens.json`:
- Colors: background, surface, text, muted, accent
- Spacing: sm, md, lg
- Radius: sm, md

## Storybook

View component documentation and live previews:

```bash
npm run storybook
```

Publishes to GitHub Pages on push to main branch.

## Usage

Import from design system:

```javascript
import { Button, Card, Modal } from 'public_crm_portal_designsystem_v1'
```

## Architecture

- Token-based theming (no component forks)
- CSS Modules for scoped styles
- React functional components
- Accessibility-first design (ARIA, keyboard nav)
