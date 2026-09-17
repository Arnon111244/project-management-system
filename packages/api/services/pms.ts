/**
 * PMS mock/demo data source (PM-002).
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

/** Project record (MOD-01) — identifying fields are TBC (IA-TBC-01). */
export type PmsProjectRecord = {
  projectId: string;
  /** Provisional identifier — identifying fields TBC (IA-TBC-01). */
  code: string;
  /** Provisional display name — identifying fields TBC (IA-TBC-01). */
  name: string;
  /** Provisional demo value — the lifecycle status list is TBC (IA-TBC-02). */
  lifecycleStatus: string;
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
  },
  {
    projectId: "prj-002",
    code: "PRJ-002",
    name: "Warehouse Automation",
    lifecycleStatus: "In execution",
  },
];

/**
 * Demo project ids — used by the SCR-03 route's generateStaticParams so the static
 * export build (GitHub Pages deploy) can prerender the demo detail routes. Unknown
 * ids still resolve through PmsProjectsService.getProject's error path at runtime.
 */
export const PMS_MOCK_PROJECT_IDS = MOCK_PROJECTS.map(
  (project) => project.projectId,
);

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
};
