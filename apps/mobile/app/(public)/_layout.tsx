import { Stack } from "expo-router";
import { useMemo } from "react";
import { useTheme } from "ui/theme/themeProvider";

export default function PublicLayout() {
  const { effective, neural: palette } = useTheme();

  const screenOptions = useMemo(
    () => ({
      headerShown: false,
      contentStyle: { backgroundColor: palette.canvas },
    }),
    [palette.canvas],
  );

  return <Stack key={effective} screenOptions={screenOptions} />;
}
