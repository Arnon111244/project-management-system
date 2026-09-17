import { Stack } from "expo-router";
import "../global.css";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider } from "ui/theme/themeProvider";
import { ApiProvider } from "api";
import { KeyboardDismissSurface } from "./utils/KeyboardDismissSurface";
import { useGlobalStore } from "state";
import { useEnvironmentSync } from "shared_mono_app/features/environmentSync";
import { useFonts } from "../src/hooks/useFonts";
import ToastProviders from "ui/components/toastMessage/ToastProviders";

export default function RootLayout() {
  const hydrated = useGlobalStore((s) => s.hydrated);
  const { loaded: fontsLoaded } = useFonts();

  useEnvironmentSync();

  if (!hydrated || !fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <ToastProviders />
        <KeyboardDismissSurface>
          <ApiProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(public)" options={{ headerShown: false }} />
            </Stack>
          </ApiProvider>
        </KeyboardDismissSurface>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
