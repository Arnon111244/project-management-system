"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "ui/components/card";
import { FormField } from "ui/components/FormField/FormField";
import { Text } from "ui/components/text";
import { View } from "ui/components/view";
import { colors } from "ui/theme";
import { useGlobalStore } from "state/index";
import { useCreatePmsProject } from "api";
import { PageShell } from "../../../../components/pms/pageShell";

/**
 * Create-project entry point of SCR-02 (PM-003) — a provisional form shell.
 *
 * The IA defines creation only as SCR-02's primary action ("New project", IA §6);
 * there is no confirmed create screen and the field set is TBC (IA-TBC-01). This
 * form collects the provisional identification fields and writes the record to the
 * in-memory mock store only — no persistence and no business rules beyond the
 * trivial required-field UX. The lifecycle status options mirror the PM-002 demo
 * values; the real status list is TBC (IA-TBC-02).
 */

type CreateProjectFormValues = {
  code: string;
  name: string;
  lifecycleStatus: string;
  projectManager: string;
};

/** Demo-only options mirroring the PM-002 mock values — the real list is TBC (IA-TBC-02). */
const LIFECYCLE_STATUS_OPTIONS = [
  { label: "Initiated (demo)", value: "Initiated" },
  { label: "In execution (demo)", value: "In execution" },
];

export default function NewProjectPage() {
  const router = useRouter();
  const { control, handleSubmit } = useForm<CreateProjectFormValues>({
    defaultValues: {
      code: "",
      name: "",
      lifecycleStatus: "Initiated",
      projectManager: "",
    },
  });
  const createProject = useCreatePmsProject();
  const showToast = useGlobalStore((s) => s.showToast);

  const onSubmit = handleSubmit((values) => {
    createProject.mutate(
      {
        code: values.code.trim(),
        name: values.name.trim(),
        lifecycleStatus: values.lifecycleStatus,
        projectManager: values.projectManager.trim() || null,
      },
      {
        onSuccess: (created) => {
          // Transient feedback via the existing toast pattern (screen-spec §2.2),
          // then straight to the new project's detail overview (SCR-04).
          showToast({
            message: `Project "${created.name}" created in the mock store (provisional)`,
            color: colors.brand,
          });
          router.push(`/projects/${created.projectId}/overview`);
        },
        onError: () => {
          showToast({
            message: "The project could not be created. Please try again.",
            color: colors.danger,
            textColor: colors.white,
          });
        },
      },
    );
  });

  return (
    <PageShell
      screenId="SCR-02"
      title="New project"
      breadcrumbs={[
        { label: "Projects", href: "/projects" },
        { label: "New project" },
      ]}
      responsibility="Provisional create-project form for the SCR-02 primary action. The confirmed creation flow and field set are to be confirmed (IA-TBC-01) — submission writes to the mock store only."
    >
      <Card className="max-w-[720px]">
        <CardHeader className="items-start">
          <CardTitle className="text-base">
            Project details (provisional)
          </CardTitle>
          <CardDescription>
            All fields are provisional demo data — identification fields are to
            be confirmed (IA-TBC-01); the status list is to be confirmed
            (IA-TBC-02); the one-PM rule is to be confirmed (IA-TBC-03).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FormField<CreateProjectFormValues>
            control={control}
            name="code"
            label="Project code"
            placeholder="e.g. PRJ-003"
            required
          />
          <FormField<CreateProjectFormValues>
            control={control}
            name="name"
            label="Project name"
            placeholder="Project name"
            required
          />
          <FormField<CreateProjectFormValues>
            control={control}
            name="lifecycleStatus"
            label="Lifecycle status"
            type="select"
            options={LIFECYCLE_STATUS_OPTIONS}
          />
          <FormField<CreateProjectFormValues>
            control={control}
            name="projectManager"
            label="Project manager"
            placeholder="Leave empty if not assigned yet"
          />

          <View className="flex-row items-center gap-3 pt-2">
            <Button
              label={createProject.isPending ? "Creating…" : "Create project"}
              onPress={onSubmit}
              loading={createProject.isPending}
              disabled={createProject.isPending}
              className="w-auto"
            />
            <Button
              label="Cancel"
              variant="outline"
              onPress={() => router.push("/projects")}
              className="w-auto"
            />
          </View>
          <Text className="text-xs text-fg/50 dark:text-fg-dark/50">
            Writes to the in-memory mock store only — no persistence and no
            business rules (PM-003).
          </Text>
        </CardContent>
      </Card>
    </PageShell>
  );
}
