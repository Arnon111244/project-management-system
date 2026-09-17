export type NavBarTranslations = {
  mainMenu?: string;
  overview?: string;
  accounts?: string;
  transactions?: string;
  cards?: string;
  transfers?: string;
  payments?: string;
  beneficiaries?: string;
  analytics?: string;
  home?: string;
  portfolio?: string;
  aiChat?: string;
  aiStudio?: string;
  agents?: string;
  workflows?: string;
  collaboration?: string;
  tasks?: string;
  markets?: string;
  activity?: string;
  stocks?: string;
  crypto?: string;
  wallet?: string;
  mainPage?: string;
  settings?: string;
  profile?: string;
  security?: string;
  mainList?: string;
  contracts?: string;
  pro?: string;
  documentation?: string;
  status?: string;
  tierDiamond?: string;
  action?: string;
  form?: string;
  components?: string;
  logOut?: string;
  generalComponents?: string;
  fab?: string;
  buttons?: string;
  table?: string;
  user?: string;
  card?: string;
  AvatarProfile?: string;
  bell?: string;
  api?: string;
  developerTools?: string;
};

export type NavItem = {
  key: string;
  labelKey?: keyof NavBarTranslations;
  icon: React.ComponentType<{ size?: number; color?: string }>;
  path?: string;
  action?: () => void;
  isAnimationActive?: boolean;
  children?: NavItem[];
};

export const NAV_LABELS: Record<keyof NavBarTranslations, string> = {
  mainMenu: "Main Menu",
  overview: "Overview",
  accounts: "Accounts",
  transactions: "Transactions",
  cards: "Cards",
  transfers: "Transfers",
  payments: "Payments",
  beneficiaries: "Beneficiaries",
  analytics: "Analytics",
  home: "Home",
  portfolio: "Portfolio",
  aiChat: "AI Chat",
  aiStudio: "AI Studio",
  agents: "Agents",
  workflows: "Workflows",
  collaboration: "Team",
  tasks: "Tasks",
  markets: "Markets",
  activity: "Activity",
  stocks: "Stocks",
  crypto: "Crypto",
  wallet: "Wallet",
  mainPage: "Main Page",
  settings: "Settings",
  profile: "Profile",
  security: "Security",
  mainList: "Main List",
  contracts: "Contracts",
  pro: "Pro",
  documentation: "Documentation",
  status: "Status",
  tierDiamond: "Diamond",
  action: "Action",
  form: "Form",
  components: "Components",
  logOut: "Log out",
  generalComponents: "General Components",
  fab: "FAB",
  buttons: "Buttons",
  table: "Table",
  user: "User",
  card: "Card Demo",
  AvatarProfile: "Avatar Profile",
  bell: "Notifications",
  api: "API",
  developerTools: "Developer Tools",
};

export function getNavLabel(key?: keyof NavBarTranslations): string {
  return key ? (NAV_LABELS[key] ?? "") : "";
}
