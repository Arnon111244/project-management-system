import React, { memo, useRef, useState, useEffect } from "react";
import { Pressable, Animated, StyleSheet, View, Text } from "react-native";
import { Camera, Mic, Image, BarChart, Plus, X } from "lucide-react-native";

interface FabProps {
  size?: number;
  color?: string;
  accentColor?: string;
}

function SpiralFabComponent({
  size = 70,
  color = "#6366f1",
  accentColor = "#8b5cf6",
}: FabProps) {
  const [open, setOpen] = useState(false);
  const anim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(anim, {
        toValue: open ? 1 : 0,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: open ? 1.1 : 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, [open]);

  const toggleFab = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    setOpen((prev) => !prev);
  };

  const subButtons = [
    { icon: Camera, color: "#ef4444" },
    { icon: BarChart, color: "#f59e0b" },
    { icon: Image, color: "#10b981" },
    { icon: Mic, color: "#8b5cf6" },
    { icon: Camera, color: "#06b6d4" },
  ];

  const spiralRadius = 120;

  return (
    <View style={styles.spiralContainer}>
      <Animated.View
        style={[
          styles.overlay,
          {
            opacity: anim,
            pointerEvents: open ? "auto" : "none",
          },
        ]}
      />

      {subButtons.map((btn, index) => {
        const angle = (index / subButtons.length) * Math.PI * 2;

        const translateX = anim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, spiralRadius * Math.cos(angle)],
        });

        const translateY = anim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, spiralRadius * Math.sin(angle) * -1],
        });

        const scale = anim.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0, 0.8, 1],
        });

        const opacity = anim.interpolate({
          inputRange: [0, 0.7, 1],
          outputRange: [0, 0, 1],
        });

        const IconComponent = btn.icon;

        return (
          <Animated.View
            key={index}
            style={{
              position: "absolute",
              transform: [{ translateX }, { translateY }, { scale }],
              opacity,
            }}
          >
            <Pressable
              style={[styles.spiralSubButton, { backgroundColor: btn.color }]}
              onPress={() => console.log(`Pressed`)}
            >
              <IconComponent color="#fff" size={22} />
            </Pressable>
          </Animated.View>
        );
      })}

      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <Pressable
          onPress={toggleFab}
          style={[
            styles.spiralFab,
            {
              backgroundColor: color,
              shadowColor: color,
            },
          ]}
        >
          <Animated.View
            style={{
              transform: [
                {
                  rotate: anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0deg", "135deg"],
                  }),
                },
              ],
            }}
          >
            {open ? (
              <X color="#fff" size={28} />
            ) : (
              <Plus color="#fff" size={28} />
            )}
          </Animated.View>

          <Animated.View
            style={[
              styles.glowEffect,
              {
                opacity: anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.3, 0.6],
                }),
                transform: [
                  {
                    scale: anim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 1.3],
                    }),
                  },
                ],
              },
            ]}
          />
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  spiralContainer: {
    position: "absolute",
    width: 200,
    height: 200,
    alignItems: "center",
    justifyContent: "center",
  },
  overlay: {
    position: "absolute",
    top: -100,
    left: -100,
    right: -100,
    bottom: -100,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    borderRadius: 200,
  },
  spiralFab: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    position: "relative",
  },
  glowEffect: {
    position: "absolute",
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#6366f1",
    zIndex: -1,
  },
  spiralSubButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
});

export const SpiralFab = memo(SpiralFabComponent);
