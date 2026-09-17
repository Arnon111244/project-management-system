"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Text } from "ui/components/text";
import { View } from "ui/components/view";

/**
 * PM-002: the app opens on the dashboard (SCR-01 — proposed default landing,
 * IA-TBC-15). The previous template landing page was moved intact to /entry.
 * Implemented as a client-side redirect so it also works under static export.
 */
export default function Page() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard");
  }, [router]);

  return (
    <View className="min-h-screen w-full items-center justify-center">
      <Text className="text-sm text-fg/60 dark:text-fg-dark/60">
        Redirecting to the dashboard…
      </Text>
    </View>
  );
}
