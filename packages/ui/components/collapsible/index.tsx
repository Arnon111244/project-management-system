import * as React from "react";
import { Animated, Easing, ViewStyle, Platform } from "react-native";

type Props = {
  show: boolean;
  duration?: number;
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
};

export function Collapsible({ show, duration = 220, children, style }: Props) {
  const h = React.useRef(new Animated.Value(show ? 1 : 0)).current;
  const v = React.useRef(new Animated.Value(show ? 1 : 0)).current;

  const [measuredH, setMeasuredH] = React.useState(0);

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(h, {
        toValue: show ? 1 : 0,
        duration,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
      Animated.timing(v, {
        toValue: show ? 1 : 0,
        duration,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: Platform.OS !== "web",
      }),
    ]).start();
  }, [show, duration, h, v]);

  const height = h.interpolate({
    inputRange: [0, 1],
    outputRange: [0, measuredH || 1],
  });

  return (
    <Animated.View style={[{ overflow: "hidden", height }, style]}>
      <Animated.View
        style={{ opacity: v, transform: [{ scaleY: v }] }}
        onLayout={(e) => {
          const next = e.nativeEvent.layout.height;
          if (next && next !== measuredH) setMeasuredH(next);
        }}
      >
        {children}
      </Animated.View>
    </Animated.View>
  );
}
export const AnimatedCollapsible = React.memo(Collapsible);
AnimatedCollapsible.displayName = "Collapsible";
