"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "ui/components/card";
import { PageShell } from "../../../components/pms/pageShell";
import { AwaitingConfirmation } from "../../../components/pms/states";

/**
 * SCR-13 — Reports (PM-002 scaffold).
 *
 * Purpose (spec §2.10): the place where reports over project information are produced
 * and consumed. The report catalog, parameters, export formats, scheduling, and scope
 * are all TBC (IA-TBC-10) — the screen renders the structural placeholder only.
 */
export default function ReportsPage() {
  return (
    <PageShell
      screenId="SCR-13"
      title="Reports"
      responsibility="The place where reports over project information are produced and consumed — aggregates across projects (scope to be confirmed)."
    >
      <Card>
        <CardHeader className="items-start">
          <CardTitle className="text-base">Report catalog</CardTitle>
          <CardDescription>
            Which reports exist, for whom, in which formats (Excel/PDF), on
            which schedule, and at which scope (portfolio vs. per project) is to
            be confirmed — no catalog entries are defined yet.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AwaitingConfirmation
            label="Awaiting confirmation — report catalog not yet defined"
            tbcId="IA-TBC-10"
          />
        </CardContent>
      </Card>
    </PageShell>
  );
}
