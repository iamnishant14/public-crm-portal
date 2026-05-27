# Pull Request Guidelines

## Purpose
This guide defines how pull requests should be prepared, reviewed, and merged for this repository using a senior software engineer standard.

## Core Principles
- Keep PRs focused on one logical change.
- Prefer small, reviewable PRs over large mixed changes.
- Base decisions on codebase evidence, not assumptions.
- Preserve existing architecture, style, and project conventions.

## Pre-PR Checklist
- Sync your branch with the latest `main`.
- Confirm the branch name reflects the change scope.
- Ensure no unintended files are modified.
- Re-read changed files to verify consistency with current patterns.
- Run relevant tests and checks before opening the PR.

## Change Scope Rules
- Include only files directly related to the task.
- Exclude generated noise, local editor artifacts, and unrelated refactors.
- If cleanup is needed, do it in a separate commit or PR.
- Avoid mixing functional changes and broad formatting changes.

## Commit Quality Rules
- Use concise, meaningful commit messages.
- Group related edits into coherent commits.
- Keep commit history understandable for reviewers.
- Do not rewrite shared history after review starts unless required.

## PR Title Guidelines
- Keep the title concise and action-oriented.
- Describe intent, not implementation details.
- Suggested style:
  - `Add ...`
  - `Update ...`
  - `Fix ...`
  - `Refactor ...`

## PR Description Template
Use this structure for every PR body:

```md
## Summary
- What changed
- Why it changed

## Scope
- Files/modules affected
- Explicitly out of scope items

## Validation
- Tests run
- Manual verification steps
- Any screenshots/log output if relevant

## Risks And Rollback
- Known risks
- How to rollback safely

## Follow-ups
- Deferred tasks or future improvements
```

## Reviewer Experience Rules
- Make diffs easy to scan.
- Add context for non-obvious design decisions.
- Link related docs/issues when relevant.
- Call out risky areas and assumptions explicitly.

## Testing Expectations
- Add or update tests when behavior changes.
- Validate edge cases for new logic paths.
- Ensure no existing critical workflow is regressed.
- If tests are not added, provide a clear justification.

## Documentation Expectations
- Update docs when architecture, behavior, or workflows change.
- Keep docs and implementation in sync in the same PR when possible.
- Add migration notes if existing behavior changes materially.

## Merge Readiness Checklist
- CI checks pass.
- Required reviewers approved.
- No unresolved review comments.
- Branch is up to date with base branch.
- PR description reflects final merged content.
