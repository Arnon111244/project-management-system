import React, { memo, useRef, useState, useEffect } from "react";
import { Pressable, Animated, Easing, StyleSheet, View } from "react-native";
import { colors } from "ui/theme";
import { Camera, Image, Mic } from "lucide-react-native";

interface FabProps {
  size?: number;
  color?: string;
}

function FabMenuComponent({ size = 60, color = colors.brand }: FabProps) {
  const [open, setOpen] = useState(false);
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: open ? 1 : 0,
      duration: 300,
      easing: Easing.out(Easing.circle),
      useNativeDriver: true,
    }).start();
  }, [open]);

  const toggleFab = () => setOpen((prev) => !prev);

  const subButtons = [
    { icon: Camera, color: "#dc2626" },
    { icon: Image, color: "#7c3aed" },
    { icon: Mic, color: "#059669" },
  ];

  const buttonTranslateY = (index: number) =>
    anim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -70 * (index + 1)],
    });

  const buttonOpacity = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const rotateLine1 = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "45deg"],
  });

  const rotateLine2 = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "-45deg"],
  });

  return (
    <View style={styles.container}>
      <Pressable
        onPress={toggleFab}
        accessibilityRole="button"
        style={[styles.fab, { backgroundColor: color }]}
      >
        <Animated.View
          style={[
            styles.line,
            {
              transform: [{ rotate: rotateLine1 }],
            },
          ]}
        />

        <Animated.View
          style={[
            styles.line,
            {
              transform: [{ rotate: rotateLine2 }],
            },
          ]}
        />
      </Pressable>

      {subButtons.map((btn, index) => {
        const translateY = buttonTranslateY(index);
        const opacity = buttonOpacity;
        const IconComponent = btn.icon;

        return (
          <Animated.View
            key={index}
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              transform: [{ translateY }],
              opacity,
            }}
          >
            <Pressable
              style={[
                styles.button,
                {
                  backgroundColor: btn.color,
                  shadowColor: btn.color,
                },
              ]}
              onPress={toggleFab}
            >
              <IconComponent color="#fff" size={24} />
            </Pressable>
          </Animated.View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  fab: {
    width: 50,
    height: 50,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  line: {
    position: "absolute",
    width: 25,
    height: 4,
    backgroundColor: "white",
    borderRadius: 2,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ccc",
    marginBottom: 10,
    width: 50,
    height: 50,
    borderRadius: 25,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
});

export const FabMenu = memo(FabMenuComponent);
