# CLAUDE.md — AI Assistant Guide for `Evan`

This file documents the repository conventions, development workflows, and guidelines for AI assistants (Claude Code and others) working in this codebase.

---

## Repository Overview

- **Name:** Evan
- **Organization:** bento-fifty
- **Remote:** `http://local_proxy@127.0.0.1:35421/git/bento-fifty/Evan`
- **Status:** Newly initialized repository — no source code yet committed.

---

## Git Conventions

### Branches

- Feature branches must follow the pattern: `claude/<description>-<sessionId>`
  - Example: `claude/add-claude-documentation-cSxRX`
- Never push directly to `main` or `master` without explicit permission.
- Always use `git push -u origin <branch-name>` when pushing a new branch.

### Commits

- Write clear, descriptive commit messages in the imperative mood.
  - Good: `Add user authentication module`
  - Bad: `added stuff`, `fix`, `wip`
- Commit messages should explain *why*, not just *what*.
- Do not use `--no-verify` to skip hooks unless explicitly instructed.
- Never amend a published commit; create a new one instead.

### Safety Rules

- Do **not** force-push to shared branches.
- Do **not** use `git reset --hard` without user confirmation.
- Do **not** stage or commit files that may contain secrets (`.env`, credentials, private keys).
- Confirm with the user before destructive operations.

---

## Development Workflow

> This section should be updated once the project stack is established.

### Getting Started

1. Clone the repository.
2. Install dependencies (update this once a package manager and `package.json`/`requirements.txt` exist).
3. Run tests before committing.

### Making Changes

1. Create or switch to a feature branch.
2. Make changes in small, focused commits.
3. Run lint and tests before pushing.
4. Push to the feature branch and open a pull request.

---

## Code Conventions

> To be filled in once source code is added. Typical areas to document:

- **Language(s) and runtime version(s)**
- **Formatting:** (e.g., Prettier, Black, gofmt)
- **Linting:** (e.g., ESLint, Flake8, golangci-lint)
- **Naming conventions:** files, functions, variables, constants
- **Import ordering**
- **Error handling patterns**
- **Testing patterns and frameworks**

---

## Project Structure

> To be filled in once source files are added. Example template:

```
/
├── src/           # Application source code
├── tests/         # Test files
├── docs/          # Documentation
├── scripts/       # Build and utility scripts
└── CLAUDE.md      # This file
```

---

## Testing

> To be filled in once a test framework is chosen. Document:

- How to run all tests
- How to run a single test
- Coverage requirements
- Where test fixtures live

---

## Build & Deployment

> To be filled in once CI/CD and build tooling are configured.

---

## AI Assistant Instructions

### General Guidance

- Always read files before editing them.
- Prefer targeted edits (`Edit` tool) over full rewrites.
- Do not create files unless strictly necessary.
- Keep changes minimal and focused on the task at hand.
- Do not add docstrings, comments, or type annotations to code you didn't change.
- Do not refactor or clean up surrounding code when fixing a bug.

### Before Pushing

- Confirm the target branch starts with `claude/` and matches the current session's branch.
- Run lint and tests if available.
- Ensure no secrets, credentials, or large binaries are staged.

### Updating This File

When the project gains source code, tests, or tooling, update the relevant sections of this file to reflect the actual state of the codebase. Treat CLAUDE.md as living documentation.

---

*Last updated: 2026-03-20*
