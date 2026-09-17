# Project Management System — User Role Matrix (PM-001)

> **Status: specification (documentation only) — everything in this document is
> "To be confirmed".** Authentication, users, and roles are **not** confirmed domain areas
> (domain spec §1). This document proposes a **minimal baseline role set and permission
> model as a starting point only**; no role, permission, or visibility rule below has been
> confirmed by the product owner. Nothing here may be implemented as an access rule until
> confirmed.
>
> **Sources:**
>
> - Domain spec: [`project-management-domain-spec.md`](project-management-domain-spec.md)
>   (§1 scope — users/roles TBC; §2.3 team membership; §2.7 financial confidentiality).
> - Operating rules: [`../../CLAUDE.md`](../../CLAUDE.md).
> - Companion documents: [`information-architecture.md`](information-architecture.md)
>   (screen IDs SCR-01…SCR-14, module IDs MOD-01…MOD-12) and
>   [`screen-specification.md`](screen-specification.md) (per-screen role visibility,
>   cross-referenced from §5 here).
>
> Consolidated TBC list for the product owner: see [§7](#7-consolidated-to-be-confirmed-list).

---

## 1. Purpose and scope

This document defines:

- a **proposed baseline role set** for the PMS (§3);
- a **permission matrix** — role × module × action (§4);
- **navigation visibility by role** — which navigation items/screens each proposed role can
  see, keyed by the screen IDs from the information architecture (§5).

Out of scope: authentication mechanism, user administration screens, and any enforcement
design — all dependent on IA-TBC-13 (users/roles TBC, spec §1).

---

## 2. Status of the role model

Per domain spec §1: "Everything else (authentication, users/roles, notifications,
integrations, deployment environment) is **TBC** and out of scope until confirmed."

Consequences for this document:

- **Every role definition is marked: To be confirmed (proposed — not confirmed by product
  owner).**
- The role set is deliberately **minimal** (five roles) so it can be narrowed or widened
  cheaply once the real organizational model is known.
- Role names use generic organizational language, not system-specific rules; they imply
  **no** business rule (e.g. "Project Manager" does not assert the one-PM-per-project rule,
  which is TBC — spec §2.3).

---

## 3. Proposed baseline role set

| Role ID  | Role name       | Definition (proposed — every definition To be confirmed: proposed, not confirmed by product owner)                                                                                                                                                       |
| -------- | --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ROLE-ADM | System Admin    | To be confirmed (proposed — not confirmed by product owner). Proposed purpose: operates the system itself — user/role administration, configuration, and the Settings placeholder (SCR-14). Implies no business-level authority over project data.       |
| ROLE-MGT | Management      | To be confirmed (proposed — not confirmed by product owner). Proposed purpose: the dashboard audience (spec §2.11 "management-facing") — at-a-glance oversight across all projects, portfolio reports; read-oriented.                                    |
| ROLE-PM  | Project Manager | To be confirmed (proposed — not confirmed by product owner). Proposed purpose: the project manager (spec §2.3) of one or more projects — works day to day in project detail areas (lifecycle, milestones, timeline, team, finance, incentive, warranty). |
| ROLE-TM  | Team Member     | To be confirmed (proposed — not confirmed by product owner). Proposed purpose: a team member assigned to projects (spec §2.3) — contributes to the projects they are assigned to, with no portfolio-wide view.                                           |
| ROLE-VWR | Viewer          | To be confirmed (proposed — not confirmed by product owner). Proposed purpose: read-only access to project information for parties that need visibility but not editing.                                                                                 |

Notes:

- Whether a person may hold multiple roles at once: **To be confirmed** (proposed: yes,
  roles combine — not confirmed).
- Whether project-level role binding is needed (e.g. "is the PM **of** project X" vs.
  global role): **To be confirmed** (proposed: PM/Team Member visibility is scoped to
  project membership per spec §2.3; Management is portfolio-wide — not confirmed).
- Whether roles are maintained inside the PMS or imported with people (spec §2.3 open
  question on people sourcing): **To be confirmed**.

---

## 4. Permission matrix (role × module × action)

**Every cell is To be confirmed.** Actions: V = view, C = create, E = edit, D = delete,
A = approve (approve applies only where the domain spec names an approval concept — status
changes §2.2, milestone sign-off §2.5, incentive approval §2.8; all those concepts
themselves TBC). Blank cell = action not applicable to the module (proposed).

Symbols below are **placeholders for discussion**, ordered by the proposed role set; they
illustrate the shape of the matrix, not a decision.

| Module (ID, screen)                     | Action             | ROLE-ADM | ROLE-MGT | ROLE-PM | ROLE-TM | ROLE-VWR |
| --------------------------------------- | ------------------ | -------- | -------- | ------- | ------- | -------- |
| Projects (MOD-01, SCR-02/03/04)         | V                  | TBC      | TBC      | TBC     | TBC     | TBC      |
|                                         | C                  | TBC      | TBC      | TBC     | —       | —        |
|                                         | E                  | TBC      | TBC      | TBC     | TBC     | —        |
|                                         | D                  | TBC      | TBC      | TBC     | —       | —        |
| Lifecycle / status (MOD-02, SCR-05)     | V                  | TBC      | TBC      | TBC     | TBC     | TBC      |
|                                         | E                  | TBC      | TBC      | TBC     | TBC     | —        |
|                                         | A                  | TBC      | TBC      | TBC     | —       | —        |
| Team (MOD-03, SCR-09)                   | V                  | TBC      | TBC      | TBC     | TBC     | TBC      |
|                                         | C / E / D          | TBC      | TBC      | TBC     | —       | —        |
| Contracts (MOD-04, SCR-06)              | V                  | TBC      | TBC      | TBC     | TBC     | TBC      |
|                                         | C / E / D          | TBC      | TBC      | TBC     | —       | —        |
| Milestones (MOD-05, SCR-07)             | V                  | TBC      | TBC      | TBC     | TBC     | TBC      |
|                                         | C / E / D          | TBC      | TBC      | TBC     | TBC     | —        |
|                                         | A (sign-off)       | TBC      | TBC      | TBC     | —       | —        |
| Timeline (MOD-06, SCR-08)               | V                  | TBC      | TBC      | TBC     | TBC     | TBC      |
|                                         | E                  | TBC      | TBC      | TBC     | TBC     | —        |
| Finance (MOD-07, SCR-10)                | V                  | TBC      | TBC      | TBC     | TBC     | TBC      |
|                                         | C / E / D          | TBC      | TBC      | TBC     | —       | —        |
| Incentive (MOD-08, SCR-11)              | V                  | TBC      | TBC      | TBC     | TBC     | TBC      |
|                                         | C / E / D          | TBC      | TBC      | TBC     | —       | —        |
|                                         | A                  | TBC      | TBC      | TBC     | —       | —        |
| Warranty (MOD-09, SCR-12)               | V                  | TBC      | TBC      | TBC     | TBC     | TBC      |
|                                         | C / E / D          | TBC      | TBC      | TBC     | —       | —        |
| Reports (MOD-10, SCR-13)                | V (run)            | TBC      | TBC      | TBC     | TBC     | TBC      |
|                                         | C / E / D (define) | TBC      | TBC      | TBC     | —       | —        |
| Dashboard (MOD-11, SCR-01)              | V                  | TBC      | TBC      | TBC     | TBC     | TBC      |
| Settings (MOD-12, SCR-14 — placeholder) | V / E              | TBC      | —        | —       | —       | —        |

Confidentiality note: spec §2.7 explicitly raises **who may view/edit financial data** as an
open question; the Finance rows above therefore cannot be proposed even directionally and
are fully TBC, including the proposed blank cells (e.g. whether Team Members see DEV cost
is TBC). Same for Incentive amounts (spec §2.8 — payout visibility TBC).

Delete caution: archiving/deletion rules for projects are an open question in spec §2.1 —
the Projects delete row cannot be assumed to exist (proposed alternative: archive instead
of delete), fully TBC.

---

## 5. Navigation visibility by role (all TBC)

Which navigation items/screens each proposed role can see. **Every cell is To be
confirmed.** Screen IDs from
[`information-architecture.md` §3](information-architecture.md#3-screen-inventory); the
same visibility rules are restated per screen in
[`screen-specification.md`](screen-specification.md).

| Screen ID | Screen                     | ROLE-ADM | ROLE-MGT | ROLE-PM | ROLE-TM | ROLE-VWR |
| --------- | -------------------------- | -------- | -------- | ------- | ------- | -------- |
| SCR-01    | Management Dashboard       | TBC      | TBC      | TBC     | TBC     | TBC      |
| SCR-02    | Projects List              | TBC      | TBC      | TBC     | TBC     | TBC      |
| SCR-03    | Project Detail             | TBC      | TBC      | TBC     | TBC     | TBC      |
| SCR-04    | Project Overview           | TBC      | TBC      | TBC     | TBC     | TBC      |
| SCR-05    | Project Lifecycle & Status | TBC      | TBC      | TBC     | TBC     | TBC      |
| SCR-06    | Project Contracts          | TBC      | TBC      | TBC     | TBC     | TBC      |
| SCR-07    | Project Milestones         | TBC      | TBC      | TBC     | TBC     | TBC      |
| SCR-08    | Project Timeline           | TBC      | TBC      | TBC     | TBC     | TBC      |
| SCR-09    | Project Team               | TBC      | TBC      | TBC     | TBC     | TBC      |
| SCR-10    | Project Finance            | TBC      | TBC      | TBC     | TBC     | TBC      |
| SCR-11    | Project Incentive          | TBC      | TBC      | TBC     | TBC     | TBC      |
| SCR-12    | Project Warranty           | TBC      | TBC      | TBC     | TBC     | TBC      |
| SCR-13    | Reports                    | TBC      | TBC      | TBC     | TBC     | TBC      |
| SCR-14    | Settings (placeholder)     | TBC      | TBC      | TBC     | TBC     | TBC      |

Proposed shape of the answer (for discussion only — not confirmed):

- Primary sidebar for Management: Dashboard, Projects, Reports; Settings hidden
  (IA-TBC-12).
- Project-scoped tabs (SCR-04…SCR-12) visible only when a project is open; within a
  project, tab visibility may differ per role (e.g. Finance tab — tied to the spec §2.7
  confidentiality question).
- Visibility scoping (portfolio-wide vs. own-projects-only) is orthogonal to navigation
  visibility and is part of the §4 matrix discussion.

---

## 6. Open modeling questions

Questions the product owner should resolve **before or with** the TBC items in §7:

1. Are the five proposed roles the right granularity, or should they merge/split
   (e.g. Viewer into Team Member)?
2. Is authorization enforced per **project membership** (PM/Team Member of project X), per
   **global role**, or both? (Ties to spec §2.3 "permissions tied to membership".)
3. Can one user hold several roles simultaneously?
4. Which actions genuinely require an "approve" step today (status change? milestone
   sign-off? incentive?) — see spec §2.2, §2.5, §2.8 open questions.
5. Where are users and role assignments maintained (PMS vs. external system) — spec §2.3
   sourcing open question, and IA-TBC-13.

---

## 7. Consolidated "To be confirmed" list

Product owner: resolve item by item; when confirmed, update the domain spec (per its §4)
and this document.

| ID          | Item                                                                                                                                | Where  |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------- | ------ |
| ROLE-TBC-01 | Confirm that a role model is needed at launch, and that users/roles leave TBC status (spec §1)                                      | §2     |
| ROLE-TBC-02 | Role set: confirm, rename, merge, or split the five proposed roles (System Admin, Management, Project Manager, Team Member, Viewer) | §3     |
| ROLE-TBC-03 | Each individual role definition (all five are proposed, none confirmed)                                                             | §3     |
| ROLE-TBC-04 | Whether one user may hold multiple roles at once                                                                                    | §3     |
| ROLE-TBC-05 | Whether PM / Team Member visibility is scoped to project membership, and how Management scope is defined                            | §3, §5 |
| ROLE-TBC-06 | Where users and role assignments are maintained (PMS vs. external/HR source) — spec §2.3                                            | §3, §6 |
| ROLE-TBC-07 | Full permission matrix: every role × module × action cell (view/create/edit/delete/approve)                                         | §4     |
| ROLE-TBC-08 | Which actions actually require an "approve" step (status change §2.2, milestone sign-off §2.5, incentive approval §2.8)             | §4, §6 |
| ROLE-TBC-09 | Financial data visibility per role — spec §2.7 confidentiality open question (who may view/edit)                                    | §4     |
| ROLE-TBC-10 | Incentive visibility per role (payout amounts) — spec §2.8                                                                          | §4     |
| ROLE-TBC-11 | Project deletion vs. archiving, and who may do it — spec §2.1                                                                       | §4     |
| ROLE-TBC-12 | Navigation visibility per role for all 14 screens                                                                                   | §5     |
| ROLE-TBC-13 | User administration screen / role assignment UI (currently not in the IA; would extend SCR-14 Settings if confirmed)                | §6, §7 |
