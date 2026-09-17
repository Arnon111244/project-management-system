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
 * SCR-14 — Settings placeholder (PM-002 scaffold).
 *
 * Settings is NOT a confirmed domain area (domain spec §1, IA-TBC-12). It exists only
 * as the navigation home reserved by IA §4.1/§9 and must not be implemented as a
 * feature until its contents are confirmed.
 */
export default function SettingsPage() {
  return (
    <PageShell
      screenId="SCR-14"
      title="Settings"
      responsibility="No responsibility confirmed — reserved for future system-level configuration (candidates, all TBC: user/role administration, preferences)."
    >
      <Card>
        <CardHeader className="items-start">
          <CardTitle className="text-base">
            Settings — to be confirmed
          </CardTitle>
          <CardDescription>
            Settings is not a confirmed domain area (domain spec §1). Its
            contents are to be confirmed (IA-TBC-12); the structure is
            intentionally unspecified until then.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AwaitingConfirmation
            label="Awaiting confirmation — settings contents not yet defined"
            tbcId="IA-TBC-12"
          />
        </CardContent>
      </Card>
    </PageShell>
  );
}
