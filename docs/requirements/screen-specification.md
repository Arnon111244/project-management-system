# Project Management System — Screen Specification (PM-001)

> **Status: specification (documentation only).** This document specifies **every screen in
> the information architecture**: its responsibility, layout in the existing UI template
> language, expected states, role visibility, and inputs/dependencies.
>
> **No component code and no route implementation are defined here** — routes named below
> are the indicative routes from the information architecture, used for identification
> only. This document does not modify any application source code.
>
> **Sources:**
>
> - Screen inventory and structure:
>   [`information-architecture.md`](information-architecture.md) (screen IDs SCR-01…SCR-14,
>   module IDs MOD-01…MOD-12).
> - Roles and visibility model: [`user-role-matrix.md`](user-role-matrix.md) (all TBC).
> - Business facts: [`project-management-domain-spec.md`](project-management-domain-spec.md)
>   (§2.1–§2.11); anything not confirmed there is **To be confirmed (TBC)** and carried
>   forward, not resolved.
> - Operating rules: [`../../CLAUDE.md`](../../CLAUDE.md) (§4 UI/UX rules — dark-first with
>   light mode, rounded cards, readable tables, minimal animation, readability wins).
>
> Consolidated TBC list for the product owner: see [§5](#5-consolidated-to-be-confirmed-list).

---

## 1. How to read this document

- Each screen section states: **Responsibility** (the single purpose of the screen),
  **Layout** (structure with existing `packages/ui` component and token names),
  **States** (empty / loading / error), **Navigation visibility by role** (cross-reference
  to the role matrix — all TBC), and **Inputs / dependencies** (data and screens/modules
  the screen needs).
- Component names refer to real components in `packages/ui/components/…` (e.g. `Card`,
  `UniversalTable`, `TextField`, `Dialog`). Token names refer to theme tokens exposed in
  `apps/web/tailwind.config.js` from `packages/ui/theme/colors.ts` (e.g. `surface`,
  `border`, `brand`, `danger`) and the configured radii (`rounded-xl` = 12px,
  `rounded-2xl` = 16px). They describe structure; pixel-level design is out of scope.
- All screens follow the shared conventions in §2; per-screen sections only note
  deviations or specifics.

---

## 2. Shared screen conventions

### 2.1 Page shell

- Every screen renders inside the workspace shell: persistent left sidebar (primary
  navigation — `packages/ui` navBar `webSideBar` / `workspaceLayout`) and persistent topbar
  (global elements — `topBar` / `topButtonBar`), per
  [information-architecture.md §4](information-architecture.md#4-application-navigation).
- Content area is bounded by the existing `workspaceContentBounds` pattern.
- Screen header: title + breadcrumb (`headerPage` family provides the back-navigation
  pattern) + screen-level primary action rendered as a `Button` (variant `primary`;
  decorative button variants in the template are not used for PMS primary actions).
- Theme: dark-first with light mode (confirmed, spec §3). All colors via theme tokens with
  the `dark:` variant (`darkMode: "class"`), never hard-coded hex; surfaces `surface`
  (light) / `black` / `muted-dark` (dark); text `fg` / `fg-dark`; borders `border` /
  `border-dark`; accents `brand` / `brand-dark` / `brand-hover`; destructive `danger`.
  Cards use `rounded-2xl`, inner elements `rounded-xl` (`CLAUDE.md` §4).

### 2.2 State conventions (all screens)

| State   | Convention                                                                                                                                                                                                                                            |
| ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Empty   | A `Card` containing a short `Text` explanation and, where the screen has a confirmed create action, a `Button` CTA. Empty states never show zero-rows as an error.                                                                                    |
| Loading | Tabular screens use the `UniversalTable` `loading` prop; non-tabular zones show placeholder (skeleton) blocks inside the `Card`. No spinners blocking the whole screen.                                                                               |
| Error   | A `Card` with `Text` in the `danger` token explaining that data could not be loaded and a retry `Button`; transient feedback (save success/failure) via the existing toast pattern (`toastMessage` / `ToastProviders`). Errors never lose user input. |

Per-screen sections name what "empty" and "error" mean for that screen's data. Global
error/loading copy wording: **To be confirmed** (SCR-TBC-03).

### 2.3 Forms

- Forms are built from `FormField` + `TextField` (layouts `stacked` / `horizontal`) /
  `TextArea` / `Select` (selectField) / `Checkbox` / `RadioButton` / `SwitchButton` /
  `DatePicker` (`packages/ui/components/date`) as appropriate.
- Destructive confirmations use the existing `Dialog` component. No new UI libraries
  (`CLAUDE.md` §4 "reuse first").
- Which fields are editable per role: TBC (role matrix §4).

---

## 3. Screen specifications

### SCR-01 — Management Dashboard

- **Indicative route:** `/dashboard` · **Module:** MOD-11 · **Zones:** A–F per
  [information-architecture.md §5](information-architecture.md#5-dashboard-structure-scr-01)
- **Responsibility:** management-facing at-a-glance oversight of the state of projects
  across the portfolio (spec §2.11). Shows summaries only — the dashboard is not a data
  entry surface.
- **Layout:** page header (zone A); KPI summary row of stat cards in the existing
  `StatsDashboard` (`StatsCards`) pattern (zone B); summary `Card`s for status overview
  (C), schedule outlook (D), financial summary (E), and attention list (F). Every
  KPI/widget and zone's content is **To be confirmed** (IA-TBC-11). Aggregate figures only;
  no project-level tables on this screen (proposed).
- **States:** empty — no projects exist yet (proposed: guidance `Card` linking to SCR-02);
  loading — skeleton blocks per zone; error — per-zone error `Card` with retry so one failed
  widget does not blank the dashboard (proposed).
- **Navigation visibility by role:** all roles TBC —
  [`user-role-matrix.md` §5](user-role-matrix.md#5-navigation-visibility-by-role-all-tbc)
  (SCR-01 row). Dashboard audience itself TBC (spec §2.11).
- **Inputs / dependencies:** aggregates from MOD-01–MOD-09 (project records, lifecycle
  status, milestones/timeline, finance) — depends on those modules' confirmed
  specifications; entry points to SCR-02 (filtered lists — drill-down TBC, IA-TBC-11).

### SCR-02 — Projects List

- **Indicative route:** `/projects` · **Module:** MOD-01 · **Structure:**
  [information-architecture.md §6](information-architecture.md#6-projects-list-structure-scr-02)
- **Responsibility:** the entry point to the core entity — lists the organizational project
  records with their lifecycle status and leads to each project's detail (SCR-03).
- **Layout:** page header with title and primary action `Button` "New project" (creation
  rights TBC, IA-TBC-01); proposed column set per IA §6 rendered as a `UniversalTable`
  (readable-table pattern, `CLAUDE.md` §4): consistent density and alignment, divider/zebra
  rows, status shown as a badge using accent tokens (`brand` family; color mapping per
  status **To be confirmed** — status values TBC, IA-TBC-02). Filter and pagination
  controls (`pageSize`); sorting, filter dimensions, row selection, page size all TBC
  (IA-TBC-16).
- **States:** empty — `Card` explaining no projects exist with "New project" CTA (if
  creation confirmed); loading — table `loading`; error — error `Card` + retry.
- **Navigation visibility by role:** all TBC (SCR-02 row, role matrix §5). Row click →
  SCR-03.
- **Inputs / dependencies:** project records (MOD-01) with lifecycle status (MOD-02);
  proposed columns consume contracts/timeline/finance data (MOD-04/06/07) — each proposed
  column is TBC until those modules are confirmed (IA §6 table).

### SCR-03 — Project Detail (container)

- **Indicative route:** `/projects/[projectId]` · **Module:** MOD-01 · **Structure:**
  [information-architecture.md §7](information-architecture.md#7-project-detail-structure-scr-03--scr-04scr-12)
- **Responsibility:** hosts one project's detail areas — header (project identity +
  lifecycle status badge) plus the secondary tab navigation to SCR-04…SCR-12; it holds no
  data content of its own beyond the header.
- **Layout:** breadcrumb `Projects > <project name>`; header row with identification
  (fields TBC, IA-TBC-01) and a lifecycle status badge (values TBC, IA-TBC-02); horizontal
  tab navigation (`rounded-xl` active pill on `brand` accent) listing the nine detail
  tabs; active tab content below, bounded by `workspaceContentBounds`.
- **States:** empty — not applicable (a project exists if SCR-03 is reachable); loading —
  header skeleton then tab content; error — unknown/deleted project id: not-found `Card`
  with back-to-list `Button` (SCR-02). Project archiving/deletion rules TBC (IA-TBC-01).
- **Navigation visibility by role:** container and tabs all TBC (SCR-03…SCR-12 rows, role
  matrix §5); default tab TBC (IA-TBC-17).
- **Inputs / dependencies:** the selected project record (SCR-02 → SCR-03); tab content
  provided by SCR-04…SCR-12.

### SCR-04 — Project Overview (tab 1)

- **Indicative route:** `/projects/[projectId]/overview` · **Module:** MOD-01 (spec §2.1)
- **Responsibility:** shows the selected project's identification and summary information
  in one place — the "who/what is this project" view.
- **Layout:** `Card` with a definition list (`Text` label/value pairs or `FormField` in
  read mode) of the project's identification fields — field set **To be confirmed**
  (spec §2.1 open question: code/name/customer, types/categories, parent/child relations,
  archiving; IA-TBC-01). Edit affordance only if creation/edit rights are confirmed.
- **States:** empty — not applicable once fields are confirmed (a project has identity);
  loading — field skeleton; error — error `Card` + retry.
- **Navigation visibility by role:** TBC (SCR-04 row, role matrix §5).
- **Inputs / dependencies:** the project record (MOD-01); SCR-03 provides the project
  context.

### SCR-05 — Project Lifecycle & Status (tab 2)

- **Indicative route:** `/projects/[projectId]/lifecycle` · **Module:** MOD-02 (spec §2.2)
- **Responsibility:** shows the project's current lifecycle state and how it came to be
  there; allows status change only after transitions/approval are confirmed.
- **Layout:** current status displayed prominently (badge, accent tokens); proposed status
  history as a `UniversalTable` (date, from → to, actor) — history contents **To be
  confirmed**; "change status" action via `Dialog` only if allowed transitions/who-may-
  change/approval are confirmed (all TBC, IA-TBC-02).
- **States:** empty — project with no recorded history yet (proposed: show current status
  only); loading — table `loading`; error — error `Card` + retry.
- **Navigation visibility by role:** view TBC; the change/approve action per role TBC
  (role matrix §4 — MOD-02 rows).
- **Inputs / dependencies:** project lifecycle data (MOD-02); status values shared with
  SCR-02 (status column) and SCR-01 (status overview zone); downstream effects on
  incentives/warranty are TBC (spec §2.2).

### SCR-06 — Project Contracts (tab 3)

- **Indicative route:** `/projects/[projectId]/contracts` · **Module:** MOD-04 (spec §2.4)
- **Responsibility:** lists the contract information the project carries and provides
  maintenance of it — fields, multiplicity, and documents all TBC.
- **Layout:** `UniversalTable` (readable-table pattern) — proposed columns per contract:
  number, value, dates, parties; **every column TBC** (spec §2.4 open questions,
  IA-TBC-04). Single vs. multiple contracts per project TBC (list vs. single panel hangs on
  that). Document storage/attachments TBC. Create/edit via `Dialog` form (`FormField`,
  `TextField`, `DatePicker`) once fields are confirmed.
- **States:** empty — "no contracts recorded" `Card` + CTA (if create confirmed); loading
  — table `loading`; error — error `Card` + retry.
- **Navigation visibility by role:** TBC (SCR-06 row, role matrix §5; edit rights role
  matrix §4).
- **Inputs / dependencies:** contract data (MOD-04); informs SCR-10 Finance (contract
  value relation TBC, spec §2.4 → §2.7) and the contract-value column of SCR-02 (TBC).

### SCR-07 — Project Milestones (tab 4)

- **Indicative route:** `/projects/[projectId]/milestones` · **Module:** MOD-05 (spec §2.5)
- **Responsibility:** lists the project's milestones — the key checkpoints along the
  project — and their state; planned vs. actual, sign-off, and trigger behavior all TBC.
- **Layout:** `UniversalTable` — proposed columns: milestone, planned date, actual date,
  status/sign-off; **all TBC** (spec §2.5 open questions, IA-TBC-05). Ordering
  (chronological proposed) TBC. Create/edit via `Dialog` (`TextField`, `DatePicker`) once
  the milestone model is confirmed; sign-off action per role TBC.
- **States:** empty — "no milestones defined" `Card` + CTA (if create confirmed); loading
  — table `loading`; error — error `Card` + retry.
- **Navigation visibility by role:** TBC (SCR-07 row, role matrix §5; sign-off per role
  §4).
- **Inputs / dependencies:** milestone data (MOD-05); may drive SCR-08 Timeline entries
  (derivation TBC, spec §2.6), SCR-11 Incentive eligibility (TBC, spec §2.8), and SCR-12
  Warranty start (TBC, spec §2.9); feeds SCR-01 schedule outlook (TBC).

### SCR-08 — Project Timeline (tab 5)

- **Indicative route:** `/projects/[projectId]/timeline` · **Module:** MOD-06 (spec §2.6)
- **Responsibility:** shows the schedule view of the project from start to end.
- **Layout:** visual form **To be confirmed** — Gantt-style chart vs. structured list is an
  open question (spec §2.6, IA-TBC-06). If list: rows of periods with start–end in a
  `UniversalTable`; if chart: rendered with existing template charting only (see
  `storeVisitsChart` pattern) — no new charting libraries (`CLAUDE.md` §4). Planned vs.
  actual and baseline vs. revised display TBC.
- **States:** empty — "no schedule entries" `Card`; loading — skeleton rows; error — error
  `Card` + retry.
- **Navigation visibility by role:** TBC (SCR-08 row, role matrix §5).
- **Inputs / dependencies:** timeline data (MOD-06); may derive from milestones MOD-05
  (TBC, spec §2.6); start–end summary proposed for SCR-02 (TBC).

### SCR-09 — Project Team (tab 6)

- **Indicative route:** `/projects/[projectId]/team` · **Module:** MOD-03 (spec §2.3)
- **Responsibility:** shows the project manager and team members assigned to the project —
  who is on it and in what role.
- **Layout:** PM highlighted in a `Card` (one PM per project is **not** confirmed — spec
  §2.3 open question, IA-TBC-03) with `avatarProfile`; members as a `UniversalTable` —
  proposed columns: person, role in team, allocation; **all TBC**. Assignment editing
  (add/remove via `Dialog` + `Select`) once sourcing/roles are confirmed; replacement
  history display TBC.
- **States:** empty — "no team assigned" `Card` + CTA (if editing confirmed); loading —
  table `loading`; error — error `Card` + retry.
- **Navigation visibility by role:** TBC (SCR-09 row, role matrix §5; membership rights
  tied to membership are TBC, spec §2.3).
- **Inputs / dependencies:** team data (MOD-03); people sourcing (PMS-maintained vs.
  external) TBC (IA-TBC-03/ROLE-TBC-06); PM name proposed for SCR-02 column (TBC).

### SCR-10 — Project Finance (tab 7)

- **Indicative route:** `/projects/[projectId]/finance` · **Module:** MOD-07 (spec §2.7)
- **Responsibility:** shows the project's financial information — budget and development
  (DEV) cost — as confirmed fields allow.
- **Layout:** summary `Card`s (e.g. budget, DEV cost, variance) + breakdown
  `UniversalTable` of cost entries; **every field, the currency, cost categories, and the
  variance display are TBC** (spec §2.7 open questions, IA-TBC-07). Visibility of financial
  data per role is explicitly TBC (spec §2.7 confidentiality; ROLE-TBC-09) — this tab may
  be role-restricted or partially masked once confirmed.
- **States:** empty — "no financial data recorded" `Card` + CTA (if create confirmed);
  loading — skeleton; error — error `Card` + retry. A role without confirmed access would
  see the tab hidden or a no-access state — TBC.
- **Navigation visibility by role:** TBC (SCR-10 row, role matrix §5; edit rights §4).
- **Inputs / dependencies:** finance data (MOD-07); relation to contract value from
  SCR-06/MOD-04 (TBC); budget utilization feeds SCR-01 financial summary (TBC).

### SCR-11 — Project Incentive (tab 8)

- **Indicative route:** `/projects/[projectId]/incentive` · **Module:** MOD-08 (spec §2.8)
- **Responsibility:** shows the incentives related to the project (for the team and/or PM)
  and their state through the approval/payout flow — mechanics TBC.
- **Layout:** `UniversalTable` — proposed columns: recipient, basis/calculation, status;
  **all TBC** (calculation rules, eligibility, approval workflow, payout tracking, and
  relations to finance/lifecycle are open questions, spec §2.8, IA-TBC-08). Approval
  action per role TBC (ROLE-TBC-08/10).
- **States:** empty — "no incentives recorded" `Card`; loading — table `loading`; error —
  error `Card` + retry.
- **Navigation visibility by role:** TBC (SCR-11 row, role matrix §5; payout visibility
  ROLE-TBC-10).
- **Inputs / dependencies:** incentive data (MOD-08); dependencies on lifecycle (MOD-02),
  milestones (MOD-05), finance (MOD-07) are TBC (spec §2.8); approval concept shared with
  role matrix §4.

### SCR-12 — Project Warranty (tab 9)

- **Indicative route:** `/projects/[projectId]/warranty` · **Module:** MOD-09 (spec §2.9)
- **Responsibility:** shows the project's warranty terms — the warranty period following
  delivery — and its current state; duration, start trigger, and claims are TBC.
- **Layout:** summary `Card` (proposed: warranty period, start date, end date, current
  status — **all TBC**, IA-TBC-09); claims/issues as a `UniversalTable` if claims are
  confirmed (TBC); relation to contracts display TBC (spec §2.9).
- **States:** empty — "no warranty terms recorded" `Card` + CTA (if editing confirmed);
  loading — skeleton; error — error `Card` + retry.
- **Navigation visibility by role:** TBC (SCR-12 row, role matrix §5).
- **Inputs / dependencies:** warranty data (MOD-09); start trigger may depend on
  delivery/milestones (MOD-05) or contract dates (MOD-04) — TBC (spec §2.9); warranty
  state may feed SCR-01 attention list (TBC).

### SCR-13 — Reports

- **Indicative route:** `/reports` · **Module:** MOD-10 (spec §2.10) · **Structure:**
  [information-architecture.md §8](information-architecture.md#8-reports-structure-scr-13)
- **Responsibility:** the place where reports over project information are produced and
  consumed.
- **Layout:** catalog view — each report as a row/`Card` entry (name, description, run
  action); run/output area with parameters (`FormField`, `Select`, `DatePicker`) and
  export trigger (`Button`). **Catalog contents, parameters, export formats (Excel/PDF),
  scheduling, and per-project vs. portfolio scope are all TBC** (spec §2.10,
  IA-TBC-10).
- **States:** empty — "no reports available" `Card` (if the confirmed catalog can be
  empty); loading — skeleton rows; error — error `Card` + retry; long-running exports show
  in-progress feedback via `toastMessage` (proposed).
- **Navigation visibility by role:** TBC (SCR-13 row, role matrix §5).
- **Inputs / dependencies:** aggregates from MOD-01–MOD-09 (per-project vs. portfolio scope
  TBC); export/rendering mechanism is an implementation concern, unspecified here.

### SCR-14 — Settings (placeholder)

- **Indicative route:** `/settings` · **Module:** MOD-12 · **Structure:**
  [information-architecture.md §9](information-architecture.md#9-settings-structure-scr-14-placeholder) ·
  **Status: placeholder — Settings is not a confirmed domain area** (spec §1, IA-TBC-12).
- **Responsibility:** **none confirmed.** Reserves a navigation home for future
  system-level configuration (candidates only, all TBC: user/role administration
  (ROLE-TBC-13), preferences). Must not be implemented as a feature until its contents are
  confirmed.
- **Layout:** intentionally unspecified. When contents are confirmed, follow §2
  conventions (`Card` sections, `FormField`-based forms).
- **States:** until contents exist — a `Card` stating "Settings — to be confirmed"
  (proposed); loading/error — per §2.2 once real content exists.
- **Navigation visibility by role:** TBC (SCR-14 row, role matrix §5); proposed
  System-Admin-only (not confirmed).
- **Inputs / dependencies:** none defined (depends entirely on IA-TBC-12).

---

## 4. Cross-screen navigation summary

| From    | Action                                | To                             |
| ------- | ------------------------------------- | ------------------------------ |
| SCR-01  | Click a summary zone (drill-down TBC) | SCR-02 (filtered — TBC)        |
| SCR-02  | Click a project row                   | SCR-03 (default tab TBC)       |
| SCR-03  | Select a detail tab                   | SCR-04 … SCR-12                |
| SCR-03+ | Breadcrumb "Projects"                 | SCR-02                         |
| Sidebar | Primary items                         | SCR-01, SCR-02, SCR-13, SCR-14 |

Back-navigation follows the `headerPage` back-button pattern on detail screens.

---

## 5. Consolidated "To be confirmed" list

Product owner: resolve item by item; when confirmed, update the domain spec (per its §4)
and the affected documents. Screen-level TBCs reference the IA and role TBC registers
rather than duplicating them.

| ID         | Item                                                                                                                            | Screen(s)             |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------- | --------------------- |
| SCR-TBC-01 | Dashboard: full KPI/widget set per zone (A–F), audience, drill-down targets (IA-TBC-11)                                         | SCR-01                |
| SCR-TBC-02 | Projects list: confirmed column set, sorting, filter dimensions, page size, row selection (IA-TBC-16; per-column TBCs in IA §6) | SCR-02                |
| SCR-TBC-03 | Global loading/empty/error copy and visual treatment (skeleton style, error wording)                                            | All (§2.2)            |
| SCR-TBC-04 | Project identification fields and edit rights for the Overview tab and detail header (IA-TBC-01)                                | SCR-03, SCR-04        |
| SCR-TBC-05 | Status values, history fields, transition/approval rules (IA-TBC-02)                                                            | SCR-02, SCR-05        |
| SCR-TBC-06 | Contract fields, multiplicity, attachments (IA-TBC-04)                                                                          | SCR-06                |
| SCR-TBC-07 | Milestone model: definitions, planned vs. actual, sign-off, triggers (IA-TBC-05)                                                | SCR-07                |
| SCR-TBC-08 | Timeline visual form: Gantt chart vs. structured list; planned vs. actual; baseline vs. revised (IA-TBC-06)                     | SCR-08                |
| SCR-TBC-09 | Team model: one PM?, member columns, assignment rights, replacement history (IA-TBC-03)                                         | SCR-09                |
| SCR-TBC-10 | Finance fields, currency, cost categories, variance display, and per-role confidentiality (IA-TBC-07, ROLE-TBC-09)              | SCR-10                |
| SCR-TBC-11 | Incentive calculation, eligibility, approval flow, payout statuses (IA-TBC-08, ROLE-TBC-10)                                     | SCR-11                |
| SCR-TBC-12 | Warranty duration, start trigger, status tracking, claims (IA-TBC-09)                                                           | SCR-12                |
| SCR-TBC-13 | Report catalog, parameters, export formats, scheduling, scope (IA-TBC-10)                                                       | SCR-13                |
| SCR-TBC-14 | Settings contents — Settings is not a confirmed domain area (IA-TBC-12)                                                         | SCR-14                |
| SCR-TBC-15 | Navigation visibility per role for every screen (all rows in role matrix §5)                                                    | All                   |
| SCR-TBC-16 | Default landing screen (SCR-01 proposed) and project detail default tab (SCR-04 proposed) (IA-TBC-15, IA-TBC-17)                | SCR-01, SCR-03        |
| SCR-TBC-17 | Which screens expose create/edit actions at all, and for which roles (role matrix §4; creation rights IA-TBC-01)                | SCR-02, SCR-06–SCR-12 |
| SCR-TBC-18 | Export/feedback mechanism for reports (toast pattern proposed)                                                                  | SCR-13                |
