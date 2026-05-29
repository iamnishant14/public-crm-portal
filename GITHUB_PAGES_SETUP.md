# GitHub Pages Configuration

This file (.nojekyll) tells GitHub Pages to serve files as-is without Jekyll processing.

## Setup Instructions

1. Go to repo Settings → Pages
2. Under "Build and deployment":
   - Source: select "Deploy from a branch"
   - Branch: select "gh-pages" 
   - Folder: select "/ (root)"
3. Click Save

## Publishing

When a commit is pushed to main that modifies apps/public_crm_portal_designsystem_v1/:
- The designsystem.yml workflow builds Storybook
- Output is deployed to gh-pages branch at storybook/public_crm_portal_designsystem_v1/
- Access at: https://iamnishant14.github.io/public-crm-portal/storybook/public_crm_portal_designsystem_v1/
