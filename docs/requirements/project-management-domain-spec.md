# Project Management System — Domain Specification (initial)

> **Status: initial / partially confirmed.** This document records what is _known_ about the
> business domain so far. Facts that have not been confirmed are explicitly marked
> **To be confirmed (TBC)** — they must not be guessed when implementing issues.
>
> **Source:** business workbook `Dev_Project69.xlsx`, analyzed into the initial domain model
> below. The workbook itself is not stored in this repository. When the product owner
> confirms a TBC item, update this document (via a `type:documentation` issue) and treat the
> updated text as the source of truth for implementation.

---

## 1. System purpose

The Project Management System (PMS) is an **internal system to manage organizational project
information** end to end — from project identification and lifecycle, through people,
contracts, milestones, timeline, finances, incentives, and warranty, to reports and a
management dashboard.

**Confirmed scope areas** (from the analyzed business source):

1. Projects
2. Project lifecycle / status
3. Project managers and team members
4. Contracts
5. Milestones
6. Timeline
7. Finance / budget / DEV cost
8. Incentive
9. Warranty
10. Reports
11. Management dashboard

Everything else (authentication, users/roles, notifications, integrations, deployment
environment) is **TBC** and out of scope until confirmed.

---

## 2. Domain areas

For each area: _Purpose_ states what the area covers (definitional only); _Open questions_
lists what must be confirmed before implementation details can be pinned down.

### 2.1 Projects

- **Purpose:** the core entity. The system manages organizational project records.
- **Open questions (TBC):** identifying fields (code/name/customer?); who can create a
  project; project types/categories; relationships between projects (parent/child?);
  archiving/deletion rules.

### 2.2 Project lifecycle / status

- **Purpose:** every project has a lifecycle state (e.g. where it currently stands).
- **Open questions (TBC):** the exact list of statuses and transitions; which transitions
  are allowed by whom; whether status changes require approval; whether status drives
  visibility or financial calculations (e.g. incentives, warranty start).

### 2.3 Project managers and team members

- **Purpose:** each project has a project manager (PM) and team members assigned to it.
- **Open questions (TBC):** whether people are imported from an HR system or maintained in
  the PMS; roles within a team (one PM only?); allocation/part-time membership; replacement
  history (who was PM when); permissions tied to membership.

### 2.4 Contracts

- **Purpose:** projects carry contract information.
- **Open questions (TBC):** contract fields (number, value, dates, parties?); whether one
  project can have multiple contracts or amendments; document storage; how contract value
  relates to budget/finance (§2.7).

### 2.5 Milestones

- **Purpose:** projects have milestones — key checkpoints along the project.
- **Open questions (TBC):** milestone definitions (fixed set per project type, or
  free-form?); planned vs. actual dates; milestone approval/sign-off; whether milestones
  trigger payments, incentives, or warranty start.

### 2.6 Timeline

- **Purpose:** projects have a timeline — the schedule view of the project from start to end.
- **Open questions (TBC):** whether the timeline is derived from milestones or has separate
  entries (phases?); planned vs. actual start/end; baseline vs. revised schedules; visual
  requirements (Gantt-style list vs. chart).

### 2.7 Finance / budget / DEV cost

- **Purpose:** financial information per project, including budget and development (DEV)
  cost.
- **Open questions (TBC):** exact financial fields and their definitions (contract value?
  approved budget? actual DEV cost? internal vs. external cost?); currency; cost categories;
  who may view/edit financial data (confidentiality); how budget vs. actual variance should
  be displayed.

### 2.8 Incentive

- **Purpose:** the system tracks incentives related to projects (for the team and/or PM).
- **Open questions (TBC):** incentive calculation rules; eligibility (who qualifies and when
  — milestone completion? project completion?); approval workflow; payout status tracking;
  relation to finance (§2.7) and lifecycle (§2.2).

### 2.9 Warranty

- **Purpose:** projects carry warranty terms — a warranty period following delivery.
- **Open questions (TBC):** warranty duration and start trigger (delivery? final milestone?
  contract date?); warranty status tracking; warranty claims/issues; relation to contracts
  (§2.4).

### 2.10 Reports

- **Purpose:** the system produces reports over project information.
- **Open questions (TBC):** which reports are required and by whom; export formats
  (Excel/PDF?); report frequency (ad-hoc vs. scheduled); whether reports span multiple
  projects (portfolio level) or are per-project.

### 2.11 Management dashboard

- **Purpose:** a management-facing dashboard summarizing the state of projects — designed
  for at-a-glance oversight rather than data entry.
- **Open questions (TBC):** which KPIs/widgets management needs (counts by status? budget
  utilization? upcoming milestones?); who the dashboard audience is (executives? PMs?
  both); drill-down expectations.

---

## 3. UI/UX direction (confirmed)

The UI direction below is **confirmed** and applies to all PMS screens:

- **Style:** modern premium SaaS.
- **Theme:** dark-first, with a light mode. (Implementation: Tailwind `darkMode: "class"`,
  theme tokens in `packages/ui/theme/` — see `CLAUDE.md` §4.)
- **Accent colors:** blue / indigo / cyan.
- **Layout language:** rounded cards; readable tables for tabular data.
- **Motion:** minimal animation. **No sliders/carousels.** Decorative effects must never
  reduce readability.

---

## 4. Working rules for issues

- Issues implement only what this spec (and the issue itself) confirms. Where an issue
  touches a TBC item, the issue owner must supply the missing fact, or the agent must stop
  and ask — **not invent**.
- When a business fact is confirmed, update this spec in the same effort (a
  `type:documentation` issue or as part of the implementing PR) so the spec stays the
  single source of truth.
