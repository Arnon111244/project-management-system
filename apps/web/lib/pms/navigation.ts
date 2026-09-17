import {
  FileBarChart,
  FolderKanban,
  LayoutDashboard,
  Settings,
} from "lucide-react-native";
import type { NavItem } from "ui/components/navBar/nav";

/**
 * PMS navigation configuration (app-level, PM-002).
 *
 * Primary navigation per information-architecture.md §4.1: Dashboard, Projects,
 * Reports, Settings — in that order. Items follow the existing packages/ui `NavItem`
 * shape; the PMS supplies its own human-readable `label` because the template's
 * `NavBarTranslations` keys are fixed and do not cover the PMS entries.
 */

export type PmsNavItem = Omit<NavItem, "labelKey" | "path"> & {
  label: string;
  path: string;
};

/** Primary sidebar entries — cross-project screens only (SCR-01, SCR-02, SCR-13, SCR-14). */
export const PMS_PRIMARY_NAV: PmsNavItem[] = [
  {
    key: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    key: "projects",
    label: "Projects",
    icon: FolderKanban,
    path: "/projects",
  },
  // MOD-10 — the report catalog is TBC (IA-TBC-10)
  { key: "reports", label: "Reports", icon: FileBarChart, path: "/reports" },
  // MOD-12 placeholder — Settings is not a confirmed domain area (IA-TBC-12)
  { key: "settings", label: "Settings", icon: Settings, path: "/settings" },
];

/** True when `pathname` is the item's own route or inside its section (/projects/<id>/…). */
export function isPmsNavActive(itemPath: string, pathname: string): boolean {
  if (pathname === itemPath) return true;
  return pathname.startsWith(`${itemPath}/`);
}

/**
 * Project detail tabs (IA §4.2) — the SCR-03 secondary navigation. Tab order follows
 * the proposed project-detail flow and is To be confirmed (IA-TBC-17); the default tab
 * (Overview) is also only proposed.
 */
export type ProjectDetailTab = {
  slug: string;
  label: string;
  screenId: string;
  /** Responsibility sentence from screen-specification.md §3 (abridged). */
  responsibility: string;
  /** Empty-state copy for detail areas with no confirmed data model yet. */
  emptyTitle: string;
  emptyMessage: string;
  tbcId: string;
};

export const PROJECT_DETAIL_TABS: ProjectDetailTab[] = [
  {
    slug: "overview",
    label: "Overview",
    screenId: "SCR-04",
    responsibility:
      "Shows the project's identification and summary information in one place.",
    emptyTitle: "No identification recorded",
    emptyMessage: "Project identifying fields are to be confirmed.",
    tbcId: "IA-TBC-01",
  },
  {
    slug: "lifecycle",
    label: "Lifecycle & Status",
    screenId: "SCR-05",
    responsibility:
      "Shows the project's current lifecycle state and how it came to be there.",
    emptyTitle: "No status history recorded",
    emptyMessage:
      "The status list, allowed transitions, and approval flow are to be confirmed.",
    tbcId: "IA-TBC-02",
  },
  {
    slug: "contracts",
    label: "Contracts",
    screenId: "SCR-06",
    responsibility: "Lists the contract information the project carries.",
    emptyTitle: "No contracts recorded",
    emptyMessage:
      "Contract fields, single vs. multiple contracts, and document storage are to be confirmed.",
    tbcId: "IA-TBC-04",
  },
  {
    slug: "milestones",
    label: "Milestones",
    screenId: "SCR-07",
    responsibility:
      "Lists the project's milestones — the key checkpoints along the project.",
    emptyTitle: "No milestones defined",
    emptyMessage:
      "Milestone definitions, planned vs. actual dates, and sign-off are to be confirmed.",
    tbcId: "IA-TBC-05",
  },
  {
    slug: "timeline",
    label: "Timeline",
    screenId: "SCR-08",
    responsibility: "Shows the schedule view of the project from start to end.",
    emptyTitle: "No schedule entries",
    emptyMessage:
      "The visual form (Gantt-style list vs. chart) and planned vs. actual display are to be confirmed.",
    tbcId: "IA-TBC-06",
  },
  {
    slug: "team",
    label: "Team",
    screenId: "SCR-09",
    responsibility:
      "Shows the project manager and team members assigned to the project.",
    emptyTitle: "No team assigned",
    emptyMessage:
      "The team model (one PM?, member roles, allocation, sourcing) is to be confirmed.",
    tbcId: "IA-TBC-03",
  },
  {
    slug: "finance",
    label: "Finance",
    screenId: "SCR-10",
    responsibility:
      "Shows the project's financial information — budget and development (DEV) cost.",
    emptyTitle: "No financial data recorded",
    emptyMessage:
      "Financial fields, currency, cost categories, and confidentiality are to be confirmed.",
    tbcId: "IA-TBC-07",
  },
  {
    slug: "incentive",
    label: "Incentive",
    screenId: "SCR-11",
    responsibility:
      "Shows the incentives related to the project and their state through the approval flow.",
    emptyTitle: "No incentives recorded",
    emptyMessage:
      "Calculation rules, eligibility, approval workflow, and payout tracking are to be confirmed.",
    tbcId: "IA-TBC-08",
  },
  {
    slug: "warranty",
    label: "Warranty",
    screenId: "SCR-12",
    responsibility:
      "Shows the project's warranty terms — the warranty period following delivery.",
    emptyTitle: "No warranty terms recorded",
    emptyMessage:
      "Warranty duration, start trigger, and claims handling are to be confirmed.",
    tbcId: "IA-TBC-09",
  },
];

export function getProjectDetailTab(
  slug: string,
): ProjectDetailTab | undefined {
  return PROJECT_DETAIL_TABS.find((tab) => tab.slug === slug);
}
