import { WorkspaceShell } from "../../components/pms/workspaceShell";

/**
 * PMS workspace shell layout (PM-002): every PMS route renders inside the shared
 * workspace shell — persistent left sidebar (IA §4.1), persistent topbar (IA §4.4),
 * and the bounded content column (screen-specification §2.1).
 */
export default function PmsLayout({ children }: { children: React.ReactNode }) {
  return <WorkspaceShell>{children}</WorkspaceShell>;
}
