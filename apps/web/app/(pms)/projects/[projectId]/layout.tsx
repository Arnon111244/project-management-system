import { ProjectDetailContainer } from "../../../../components/pms/projectDetail";
// Deep import on purpose: the api barrel is a "use client" module, and a server
// component cannot read plain values across that boundary.
import { PMS_MOCK_PROJECT_IDS } from "api/services/pms";

/**
 * SCR-03 — Project Detail container route (PM-002). Hosts the project header and the
 * secondary tab navigation (IA §4.2); the active tab's content comes from the child
 * route (SCR-04…SCR-12).
 *
 * generateStaticParams covers the demo project ids so the static export build
 * (GitHub Pages deploy) can prerender the detail routes; unknown ids fall through to
 * the container's not-found state at runtime in the normal (non-export) build.
 */
export function generateStaticParams() {
  return PMS_MOCK_PROJECT_IDS.map((projectId) => ({ projectId }));
}

export default async function ProjectDetailLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;

  return (
    <ProjectDetailContainer projectId={projectId}>
      {children}
    </ProjectDetailContainer>
  );
}
