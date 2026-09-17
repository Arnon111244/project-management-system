"use client";

import { useState, useCallback } from "react";
import { Platform, Pressable, useWindowDimensions } from "react-native";

import { View } from "ui/components/view";
import { AnimatedSection } from "./animatedSection";
import { SectionHeading } from "./sectionHeading";
import { FaqAccordionItem } from "./faqAccordionItem";
import { FaqStaticItem } from "./faqStaticItem";

const FAQ_ITEMS = [
  {
    q: "What ships in this template?",
    a: "A Turborepo monorepo with `apps/web` (Next.js), `apps/mobile` (Expo), shared packages, and a landing page wired to those packages.",
  },
  {
    q: "Can I use only web or only mobile?",
    a: "Yes. Run the web app alone, the mobile app alone, or both — shared packages work with either target.",
  },
  {
    q: "How do I add a new package?",
    a: "Create a folder under `packages/`, register it in the root workspace config, then import it from your apps.",
  },
  {
    q: "Where should new features go?",
    a: "Put reusable logic in `packages/shared_mono_app` or a new package. Keep `apps/*` focused on routing and app wiring.",
  },
  {
    q: "How do I get the premium version?",
    a: "Use the Get the Full Version button in the Free vs Premium section to open the official product page with live demo, pricing, and purchase options.",
  },
] as const;

const DESKTOP_BREAKPOINT = 768;

function useStaticFaqLayout() {
  const { width } = useWindowDimensions();
  return Platform.OS !== "web" || width < DESKTOP_BREAKPOINT;
}

export function FaqSection() {
  const useStaticLayout = useStaticFaqLayout();
  const [open, setOpen] = useState<number | null>(null);

  const handleToggle = useCallback((index: number) => {
    setOpen((current) => (current === index ? null : index));
  }, []);

  return (
    <AnimatedSection nativeID="faq" className="w-full px-6 pt-1">
      <View className="w-full max-w-[720px] mx-auto">
        <SectionHeading
          variant="dark"
          badge="FAQ"
          title="Monorepo questions"
          subtitle="Short answers about this workspace template."
        />
        <Pressable className="gap-3">
          {FAQ_ITEMS.map((item, i) =>
            useStaticLayout ? (
              <FaqStaticItem key={item.q} question={item.q} answer={item.a} />
            ) : (
              <FaqAccordionItem
                key={item.q}
                question={item.q}
                answer={item.a}
                isOpen={open === i}
                onToggle={() => handleToggle(i)}
              />
            ),
          )}
        </Pressable>
      </View>
    </AnimatedSection>
  );
}
