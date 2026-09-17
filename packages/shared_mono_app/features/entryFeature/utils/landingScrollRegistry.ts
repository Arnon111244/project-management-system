import { Platform, type ScrollView, type View } from "react-native";

export const landingScrollState = {
  scrollRef: null as ScrollView | null,
  headerOffset: 0,
  scrollY: 0,
};

const sectionNodes = new Map<string, View>();

export function bindLandingScrollView(
  scrollRef: ScrollView | null,
  headerOffset: number,
) {
  landingScrollState.scrollRef = scrollRef;
  landingScrollState.headerOffset = headerOffset;
}

export function setLandingScrollY(y: number) {
  landingScrollState.scrollY = y;
}

export function registerLandingSectionRef(
  sectionId: string,
  node: View | null,
) {
  if (node) {
    sectionNodes.set(sectionId, node);
    return;
  }
  sectionNodes.delete(sectionId);
}

function measureInWindow(view: View): Promise<{ x: number; y: number }> {
  return new Promise((resolve, reject) => {
    if (typeof view.measureInWindow !== "function") {
      reject(new Error("measureInWindow unavailable"));
      return;
    }

    view.measureInWindow((x, y, _width, _height) => resolve({ x, y }));
  });
}

export function scrollToLandingSection(sectionId: string) {
  if (Platform.OS === "web") {
    if (typeof document !== "undefined") {
      document
        .getElementById(sectionId)
        ?.scrollIntoView({ behavior: "smooth" });
    }
    return;
  }

  const { scrollRef, headerOffset, scrollY } = landingScrollState;
  const section = sectionNodes.get(sectionId);
  if (!section || !scrollRef) return;

  void measureInWindow(section)
    .then(({ y: sectionTop }) => {
      const targetTop = headerOffset + 12;
      const delta = sectionTop - targetTop;

      scrollRef.scrollTo({
        y: Math.max(0, scrollY + delta),
        animated: true,
      });
    })
    .catch(() => {
      // No-op: section anchor not measurable on this platform/build.
    });
}
