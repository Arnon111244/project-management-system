# CLAUDE.md — Project Management System

Operating instructions for Claude Code in this repository. When implementing an issue, follow this file. Do not rewrite existing architecture or replace the UI framework.

## 1. Project purpose

Internal **Project Management System (PMS)** — an organizational tool to manage company project information end to end: projects, lifecycle/status, project managers and team members, contracts, milestones, timeline, finance (budget / DEV cost), incentives, warranty, reports, and a management dashboard.

Business source: `Dev_Project69.xlsx`, analyzed into the initial domain model in [`docs/requirements/project-management-domain-spec.md`](docs/requirements/project-management-domain-spec.md). Requirements not confirmed in that spec must not be invented — they are marked "To be confirmed" and need human input.

## 2. Tech stack

| Layer   | Technology                                                                              |
| ------- | --------------------------------------------------------------------------------------- |
| Repo    | Yarn 1.22 workspaces + Turborepo 2, TypeScript 5.9, Node 18+                            |
| Web app | Next.js 15 (App Router), React 19 — `apps/web` (primary target of the PMS)              |
| Mobile  | Expo 54 (Expo Router) — `apps/mobile` (keep building; secondary)                        |
| UI kit  | `packages/ui` — cross-platform components, CVA variants, lucide icons                   |
| State   | `packages/state` — Zustand store slices                                                 |
| Data    | `packages/api` — TanStack Query + HTTP layer, env-switchable (sandbox/prod)             |
| Styling | Tailwind 3.4 + NativeWind preset, theme tokens from `packages/ui/theme/`                |
| Quality | ESLint (next/core-web-vitals), Prettier (lint-staged), commitlint (husky)               |
| Tests   | **Not yet configured** — see §6                                                         |
| CI      | GitHub Actions: `.github/workflows/ci.yml` (PR validation), `nextjs.yml` (Pages deploy) |

## 3. Repository structure

```
apps/
  web/                  # Next.js 15 web app (App Router) — the PMS UI
  mobile/               # Expo mobile app
packages/
  ui/                   # Cross-platform UI components + theme (colors, tokens)
  state/                # Zustand slices
  api/                  # API services, hooks (TanStack Query), lib
  shared_mono_app/      # Shared screens/features/hooks (web + mobile)
docs/
  requirements/         # Domain spec and business requirements
  issue-driven-workflow.md  # The Issue → PR execution model
scripts/                # Monorepo tooling (env switch, api scaffolding)
.github/                # Issue templates, workflows
```

Key commands (run from repo root, Yarn 1):

| Command                        | What it does                       |
| ------------------------------ | ---------------------------------- |
| `yarn web`                     | Dev server (http://localhost:3000) |
| `yarn build:web`               | Production web build               |
| `yarn workspace web lint`      | ESLint for the web app             |
| `yarn workspace web typecheck` | `tsc --noEmit` for the web app     |
| `yarn lint` / `yarn typecheck` | Same via Turbo across workspaces   |
| `yarn env`                     | Show current API environment       |

Troubleshooting: if `next build` fails at "Collecting page data" with `PageNotFoundError`
or a missing webpack chunk, the `.next` cache is stale — delete `apps/web/.next` and rebuild.

## 4. UI/UX rules

Direction: **modern premium SaaS — dark-first with light mode**.

- **Dark-first**: default experience is dark; support light mode. Tailwind is configured with `darkMode: "class"` — implement themes with the `dark:` variant and a root class, never hard-code colors.
- **Accents**: blue / indigo / cyan. Use existing theme tokens from `packages/ui/theme/` (`brand`, `surface`, `light-cyan`, `neural`, …) exposed in `apps/web/tailwind.config.js`. Extend tokens there instead of inlining hex values in components.
- **Rounded cards**: use the configured radii (`rounded-xl` = 12px, `rounded-2xl` = 16px).
- **Readable tables**: prefer real tables/rows with consistent density, alignment, and zebra or divider rows over card grids for tabular data.
- **Minimal animation**: subtle transitions only. No slider/carousel components.
- **Readability wins**: decorative effects (glows, gradients, blur) must never reduce text contrast or legibility.
- **Reuse first**: use `packages/ui` components and existing patterns before writing new ones. Do not add UI libraries without issue-level justification.

## 5. Coding rules

- TypeScript everywhere; no `any` unless the surrounding code already requires it.
- Match the existing style of the file you edit (naming, imports, comment density).
- Keep changes **within issue scope**. No drive-by refactors, renames, or file reorganization.
- No unnecessary abstractions — three similar lines beat a premature abstraction.
- Reuse existing components, hooks, and utilities (`packages/ui`, `packages/shared_mono_app`, `packages/state`, `packages/api`).
- Env vars: only `NEXT_PUBLIC_*` may be committed as examples (`.env.example`). Never commit real secrets — use GitHub Secrets.
- Prettier runs on commit via lint-staged; commitlint enforces message format. Do not bypass hooks (`--no-verify`).

## 6. Testing requirements

- **Current state**: no test framework is installed. CI validates **lint + typecheck + build**.
- When a test framework is adopted (first test-infra issue), wire it as a Turbo `test` task, add it to `.github/workflows/ci.yml`, and update this section.
- Until then, verification = run the app/feature path locally (`yarn web`), plus lint + typecheck + build. State exactly what you ran in the PR description.
- Feature issues may list a "Test requirements" section — implement what it asks if tooling exists; otherwise verify manually and say so.

## 7. Git workflow

Branches:

```
main        # production-ready; protected; human merges only
develop     # integration branch; human merges only
feature/PM-<issue-number>-<short-description>
fix/PM-<issue-number>-<short-description>
```

Rules (all mandatory):

- Never force push.
- Never `git reset --hard` against shared branches (`main`, `develop`).
- Never delete shared branches.
- Never merge PRs automatically — the human merges. Claude must not run `gh pr merge`.
- Never bypass hooks with `--no-verify`.
- Never amend already-pushed (published) commits — push follow-up commits instead.
- One branch per implementation issue.

## 8. GitHub Issue workflow (Claude execution loop)

When working an issue (number `N`):

1. **Read the entire issue** — objective, scope, acceptance criteria, constraints. Do not start on a partial read.
2. **Inspect the repo** — read the files the issue touches before editing anything.
3. **Branch**: `feature/PM-<N>-<slug>` (or `fix/PM-<N>-<slug>` for bugs) from `develop`.
4. **Implement** — make the change, don't just suggest it. Stay in scope; reuse existing code.
5. **Validate** — `yarn workspace web lint`, `yarn workspace web typecheck`, `yarn build:web`; run whatever the issue's test requirements specify. Fix failures caused by your own changes; report pre-existing failures honestly.
6. **Review the diff** (`git diff`, `git status`) before committing — no stray files, no secrets.
7. **Commit** — conventional commit format (§9), referencing `PM-<N>`.
8. **Push** the feature branch.
9. **Open a PR** into `develop` titled with the conventional commit subject, body linking `Closes PM-<N>` (or `Refs PM-<N>` if partial), summary of changes, and validation performed.
10. **Update the issue/PR** with progress comments and the final result when automation is available (`@claude` via GitHub Actions, or a local session).
11. CI validates the PR; address review feedback on the same branch with new commits.
12. The **human** reviews and merges into `develop`/`main`.

Behavior rules:

- Avoid unnecessary yes/no questions. Decide and act within documented rules.
- Ask a human only when a decision materially affects **architecture, security, destructive operations, product requirements, or business rules** that cannot be inferred from `docs/` — and then ask one concrete question with options.
- If an issue is ambiguous or missing acceptance criteria, note it in the issue (or ask once) before implementing guesses at business rules.

## 9. Commit convention

Conventional Commits, enforced by commitlint (see [`docs/commitlint.md`](docs/commitlint.md)):

```
<type>(<scope>): <subject>
```

- `type`: `feat` `fix` `docs` `style` `refactor` `perf` `test` `build` `ci` `chore` `revert`
- `scope`: `web` `mobile` `ui` `api` `state` `shared_mono_app` `repo` (extend when a new area lands)
- Reference the issue in the subject or body: `feat(web): add project list table (PM-12)`

Examples:

```
feat(web): add milestone timeline view (PM-7)
fix(ui): fix table row overflow on narrow screens (PM-9)
docs: update domain spec finance section
```

## 10. Pull Request requirements

- Target branch: `develop` (release PRs into `main` are human-driven).
- Title: conventional commit style.
- Body includes: linked issue (`Closes PM-<N>`), what changed and why, validation performed (exact commands + results), screenshots for UI changes.
- Scope: one issue per PR.
- CI (`.github/workflows/ci.yml`: lint, typecheck, build) must be green.
- Merging is done by a human, never by Claude.

## 11. Definition of Done

An implementation is done when all of the following hold:

- [ ] All acceptance criteria in the issue are met.
- [ ] Changes stay within the issue's scope; no unrelated modifications.
- [ ] `yarn workspace web lint` passes.
- [ ] `yarn workspace web typecheck` passes.
- [ ] `yarn build:web` succeeds.
- [ ] Any tests specified by the issue pass (once a framework exists).
- [ ] UI changes follow §4 and look correct in **both dark and light mode**.
- [ ] No secrets, credentials, tokens, or generated artifacts (`node_modules`, `out/`, `.next/`) committed.
- [ ] Final diff reviewed; commits are conventional and reference the issue.
- [ ] PR opened against `develop` with linked issue; CI green.
