"use client";
import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

/**
 * SCR-03 container entry — the default tab is Overview (SCR-04, proposed default,
 * IA-TBC-17). Client-side redirect so it also works under static export.
 */
export default function ProjectDetailIndexPage() {
  const params = useParams<{ projectId: string }>();
  const router = useRouter();

  useEffect(() => {
    router.replace(`/projects/${params.projectId}/overview`);
  }, [params.projectId, router]);

  return null;
}
