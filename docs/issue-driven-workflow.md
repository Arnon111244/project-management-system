# Issue-driven development workflow

This repository is configured so that **GitHub Issues are the primary unit of work** and Claude Code can take an issue from implementation to a reviewable Pull Request with minimal manual supervision.

```
Human creates/approves Issue
  → Claude reads the Issue
  → Claude inspects the repository
  → Claude creates feature branch
  → Claude implements the Issue
  → Claude runs validation
  → Claude fixes failures caused by its changes
  → Claude reviews the final diff
  → Claude commits (conventional commit)
  → Claude pushes the branch
  → Claude opens a PR linked to the Issue
  → CI validates the PR
  → Claude addresses review feedback
  → HUMAN merges into develop / main
```

## 1. Who does what

| Step                            | Actor          | Notes                                                                 |
| ------------------------------- | -------------- | --------------------------------------------------------------------- |
| Create / approve issue          | Human          | Use the issue templates (`.github/ISSUE_TEMPLATE/`).                  |
| Implementation loop             | Claude Code    | Follows `CLAUDE.md` §8 and §11.                                       |
| CI on PR (lint/typecheck/build) | GitHub Actions | `.github/workflows/ci.yml`.                                           |
| Code review                     | Human          | May delegate first-pass review to Claude (`@claude` in a PR comment). |
| **Merge into develop/main**     | **Human only** | Claude never merges PRs.                                              |

## 2. Branches

```
main        # production-ready, protected; Pages deploy runs on push
develop     # integration branch; all implementation PRs target this
feature/PM-<issue-number>-<short-description>
fix/PM-<issue-number>-<short-description>
```

Rules: no force push; no `reset --hard` on shared branches; no deleting shared branches; no auto-merge; no `--no-verify`; no amending published commits; one branch per issue. (Full contract: `CLAUDE.md` §7.)

## 3. Issue conventions

- Templates: **Feature**, **Bug**, **UI/UX**, **Technical/Refactoring**, **Documentation**.
- An issue is _implementation-ready_ when Claude Code can implement it without inferring major requirements: objective, scope, requirements, and acceptance criteria are explicit.
- Uncertain business facts are marked **"To be confirmed"** — Claude must not invent them (see the domain spec).
- Issue numbering: GitHub issue numbers double as `PM-<n>` references (e.g. issue #12 → `PM-12`) used in branch names and commit messages.

### Labels

| Group    | Labels                                                                                                                       |
| -------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Type     | `type:feature` `type:bug` `type:ui` `type:technical` `type:documentation`                                                    |
| Priority | `priority:high` `priority:medium` `priority:low`                                                                             |
| Area     | `area:dashboard` `area:projects` `area:milestones` `area:team` `area:finance` `area:warranty` `area:reports` `area:settings` |
| Status   | `status:blocked` `status:needs-review`                                                                                       |

Every issue gets exactly one `type:` label, optionally one `area:`, and a `priority:`.

## 4. Commits & PRs

- Commits: Conventional Commits (`docs/commitlint.md`), referencing the issue: `feat(web): add project list table (PM-12)`.
- PRs target **`develop`**, body links the issue (`Closes PM-<n>`), lists changes and exact validation commands performed.
- CI must be green before merge. Merging is manual.

## 5. Claude Code automation (GitHub Actions)

`.github/workflows/claude.yml` runs the official [`claude-code-action`](https://github.com/anthropics/claude-code-action) when:

- someone comments `@claude` on an issue, PR, PR review, or review comment, or
- an issue is assigned (assignees with `@claude`-style automation) or a new issue body mentions `@claude`.

### One-time setup (human, ~2 minutes)

1. Add the API key as a repository secret — **never commit it**:
   - `Settings → Secrets and variables → Actions → New repository secret`
   - Name: `ANTHROPIC_API_KEY` (or `CLAUDE_CODE_OAUTH_TOKEN` and switch the action input in `claude.yml` accordingly).
2. Optionally install the Claude GitHub App for tighter permission control.
3. Test: comment `@claude` on any issue — Claude should respond.

Until the secret is added, the workflow is present but will not run; local Claude Code sessions work with no extra setup.

### Typical usage patterns

| You want…                    | Do this                                                                  |
| ---------------------------- | ------------------------------------------------------------------------ |
| Claude to implement an issue | Comment `@claude implement this issue` on an implementation-ready issue. |
| Claude to fix CI failures    | Comment `@claude fix the CI failures` on the PR.                         |
| Claude to review a PR        | Comment `@claude review this PR`.                                        |
| Claude to answer a question  | Mention `@claude` in any thread.                                         |

## 6. Local loop (no Actions)

1. `gh issue view <n>` — read the issue completely.
2. Create the branch, implement, validate (`yarn workspace web lint && yarn workspace web typecheck && yarn build:web`).
3. Review the diff, commit conventionally, push, `gh pr create --base develop`.
4. Human merges.
