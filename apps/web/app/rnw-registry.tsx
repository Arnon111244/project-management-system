"use client";
import type { ReactNode } from "react";
import { useServerInsertedHTML } from "next/navigation";
import { StyleSheet } from "react-native";

export default function RNWRegistry({ children }: { children: ReactNode }) {
  // Inject React Native Web (and NativeWind) styles during SSR to avoid initial layout shift/FOUC
  useServerInsertedHTML(() => {
    const sheet = (StyleSheet as any)?.getSheet?.();
    if (!sheet) return null;
    return (
      <style
        id={sheet.id}
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: sheet.textContent }}
      />
    );
  });

  return <>{children}</>;
}
