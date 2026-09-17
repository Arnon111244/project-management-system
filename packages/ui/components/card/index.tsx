import * as React from "react";
import { View } from "ui/components/view";
import { Text } from "ui/components/text";
import { cn } from "ui/utils/cn";

type ViewProps = React.ComponentProps<typeof View>;

function Card({ className, ...props }: ViewProps) {
  return (
    <View
      data-slot="card"
      className={cn(
        // visuals
        "bg-surface dark:bg-black rounded-2xl border border-border dark:border-border-dark web:shadow-sm",
        // softer web shadow
        "web:[box-shadow:0_8px_24px_rgba(16,24,40,0.06)]",
        // layout
        `flex flex-col gap-6 px-6 py-8 `,
        className,
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: ViewProps) {
  return (
    <View
      data-slot="card-header"
      className={cn("items-center gap-2 text-center", className)}
      {...props}
    />
  );
}

function CardHeaderMain({ className, ...props }: ViewProps) {
  return (
    <View
      data-slot="card-header-main"
      className={cn("flex-1 gap-1.5", className)}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<typeof Text>) {
  return (
    <Text
      data-slot="card-title"
      className={cn(
        "font-semibold leading-none text-fg dark:text-fg-dark",
        className,
      )}
      {...props}
    />
  );
}

function CardDescription({
  className,
  ...props
}: React.ComponentProps<typeof Text>) {
  return (
    <Text
      data-slot="card-description"
      className={cn("text-sm text-fg/70 dark:text-fg-dark/70", className)}
      {...props}
    />
  );
}

function CardAction({ className, ...props }: ViewProps) {
  return (
    <View
      data-slot="card-action"
      className={cn("self-start", className)}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: ViewProps) {
  return (
    <View
      data-slot="card-content"
      className={cn("gap-3", className)}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }: ViewProps) {
  return (
    <View
      data-slot="card-footer"
      className={cn("flex-row items-center mx-auto", className)}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardHeaderMain,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
  CardFooter,
};
