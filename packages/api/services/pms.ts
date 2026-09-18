/**
 * PMS mock/demo data source (PM-002; list/detail/create extended by PM-003).
 *
 * The real backend/API is To be confirmed (domain spec §1) — data access for the PMS
 * goes through this service layer with mock implementations until the backend exists.
 * The shape follows the existing service pattern (see services/ip.ts).
 *
 * Every demo field below is PROVISIONAL and traceable to the "to be confirmed"
 * register in docs/requirements/information-architecture.md §11. Demo values exist so
 * navigation and the shared screen state conventions (screen-specification §2.2) can
 * be exercised; they must not be treated as confirmed business data or business rules.
 */

/**
 * Project record (MOD-01) — identifying fields are TBC (IA-TBC-01). The further
 * provisional fields carry the SCR-02 list columns (IA §6) and the SCR-04 overview;
 * each is null until a demo value exists and stays TBC until its module is confirmed.
 */
export type PmsProjectRecord = {
  projectId: string;
  /** Provisional identifier — identifying fields TBC (IA-TBC-01). */
  code: string;
  /** Provisional display name — identifying fields TBC (IA-TBC-01). */
  name: string;
  /** Provisional demo value — the lifecycle status list is TBC (IA-TBC-02). */
  lifecycleStatus: string;
  /** Provisional demo value — the one-PM rule is TBC (IA-TBC-03). */
  projectManager: string | null;
  /** Provisional demo value (currency TBC) — contract fields are TBC (IA-TBC-04). */
  contractValue: string | null;
  /** Provisional demo values — planned/actual dates are TBC (IA-TBC-06). */
  plannedStart: string | null;
  plannedEnd: string | null;
  /** Provisional demo values (currency TBC) — financial fields are TBC (IA-TBC-07). */
  budget: string | null;
  devCost: string | null;
};

/**
 * Input of the provisional create-project flow (PM-003): collects only the
 * identification/status fields; everything else stays unset until its module is
 * confirmed (IA-TBC-04/06/07). No business rules are asserted here.
 */
export type CreatePmsProjectInput = {
  code: string;
  name: string;
  /** Provisional demo value — the status list is TBC (IA-TBC-02). */
  lifecycleStatus: string;
  /** Optional only because the field itself is provisional (IA-TBC-03). */
  projectManager?: string | null;
};

export type PmsMockScenario = "default" | "empty" | "error";

let mockScenario: PmsMockScenario = "default";

/**
 * Demo-only switch for exercising the shared loading/empty/error state conventions
 * (screen-specification §2.2) without a backend: "empty" makes the project list come
 * back empty; "error" rejects every request. Defaults to "default".
 */
export function setPmsMockScenario(scenario: PmsMockScenario) {
  mockScenario = scenario;
}

/** Small delay so the loading state is visible in the demo. */
const MOCK_DELAY_MS = 400;

const MOCK_PROJECTS: PmsProjectRecord[] = [
  {
    projectId: "prj-001",
    code: "PRJ-001",
    name: "ERP Migration Pilot",
    lifecycleStatus: "Initiated",
    projectManager: "A. Promsri",
    contractValue: "4,500,000",
    plannedStart: "2026-01-12",
    plannedEnd: "2026-06-30",
    budget: "3,200,000",
    devCost: "1,950,000",
  },
  {
    projectId: "prj-002",
    code: "PRJ-002",
    name: "Warehouse Automation",
    lifecycleStatus: "In execution",
    projectManager: "K. Tanwong",
    contractValue: "12,800,000",
    plannedStart: "2025-11-03",
    plannedEnd: "2026-09-15",
    budget: "9,600,000",
    devCost: "6,140,000",
  },
];

/**
 * Demo project ids — used by the SCR-03 route's generateStaticParams so the static
 * export build (GitHub Pages deploy) can prerender the demo detail routes. Unknown
 * ids still resolve through PmsProjectsService.getProject's error path at runtime.
 * Records created through the provisional create flow live only in the client
 * session and are therefore not part of the prerendered set.
 */
export const PMS_MOCK_PROJECT_IDS = MOCK_PROJECTS.map(
  (project) => project.projectId,
);

/**
 * Sequence for ids of records created through the provisional create flow —
 * continues after the seeded demo ids.
 */
let mockProjectSequence = MOCK_PROJECTS.length;

function mockResolve<T>(value: T): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(value), MOCK_DELAY_MS);
  });
}

function mockReject(message: string): Promise<never> {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error(message)), MOCK_DELAY_MS);
  });
}

export const PmsProjectsService = {
  /** Lists the organizational project records (SCR-02 entry point). */
  listProjects(): Promise<PmsProjectRecord[]> {
    if (mockScenario === "error") {
      return mockReject("PMS mock data source is in error mode (demo)");
    }
    if (mockScenario === "empty") return mockResolve([]);
    return mockResolve(MOCK_PROJECTS);
  },

  /** Loads one project record; unknown ids reject so SCR-03 can show its error state. */
  getProject(projectId: string): Promise<PmsProjectRecord> {
    if (mockScenario === "error") {
      return mockReject("PMS mock data source is in error mode (demo)");
    }
    const project = MOCK_PROJECTS.find(
      (candidate) => candidate.projectId === projectId,
    );
    if (!project) {
      return mockReject(`Unknown project id: ${projectId}`);
    }
    return mockResolve(project);
  },

  /**
   * Creates a record in the in-memory mock store only (PM-003) — no persistence
   * and no business rules beyond the trivial required-field UX in the form. The
   * demo "error" scenario also rejects creates so the form's error path can be
   * exercised.
   */
  createProject(input: CreatePmsProjectInput): Promise<PmsProjectRecord> {
    if (mockScenario === "error") {
      return mockReject("PMS mock data source is in error mode (demo)");
    }
    mockProjectSequence += 1;
    const record: PmsProjectRecord = {
      projectId: `prj-${String(mockProjectSequence).padStart(3, "0")}`,
      code: input.code,
      name: input.name,
      lifecycleStatus: input.lifecycleStatus,
      projectManager: input.projectManager ?? null,
      // Unset until their modules are confirmed — the UI renders "—".
      contractValue: null,
      plannedStart: null,
      plannedEnd: null,
      budget: null,
      devCost: null,
    };
    MOCK_PROJECTS.push(record);
    return mockResolve(record);
  },
};
