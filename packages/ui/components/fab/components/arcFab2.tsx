import React, { memo, useRef, useState, useEffect } from "react";
import { Pressable, Animated, StyleSheet, View, Easing } from "react-native";
import {
  Camera,
  Mic,
  Image,
  BarChart,
  Plus,
  X,
  Heart,
  Star,
  MessageCircle,
  Share,
} from "lucide-react-native";

interface OrbitalFabProps {
  size?: number;
  color?: string;
}

function ArcFabComponent({ size = 70, color = "#059669" }: OrbitalFabProps) {
  const [open, setOpen] = useState(false);
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(anim, {
      toValue: open ? 1 : 0,
      tension: 40,
      friction: 6,
      useNativeDriver: true,
    }).start();
  }, [open]);

  const toggleFab = () => {
    setOpen((prev) => !prev);
  };

  const subButtons = [
    { icon: Camera, color: "#dc2626", label: "Camera" },
    { icon: Image, color: "#2563eb", label: "Gallery" },
    { icon: Mic, color: "#7c3aed", label: "Voice" },
    { icon: BarChart, color: "#ea580c", label: "Poll" },
    { icon: Share, color: "#0891b2", label: "Share" },
  ];

  const arcRadius = 90;
  const arcAngle = Math.PI * 0.8;

  return (
    <View style={styles.arcContainer}>
      <Animated.View
        style={[
          styles.arcLine,
          {
            opacity: anim,
            transform: [
              {
                scale: anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1],
                }),
              },
            ],
          },
        ]}
      />

      {subButtons.map((btn, index) => {
        const totalButtons = subButtons.length - 1;
        const angle = -arcAngle / 2 + (index / totalButtons) * arcAngle;

        const translateX = anim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, arcRadius * Math.sin(angle)],
        });

        const translateY = anim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -arcRadius * Math.cos(angle)],
        });

        const scale = anim.interpolate({
          inputRange: [0, 0.3, 0.6, 1],
          outputRange: [0, 0.5, 0.8, 1],
        });

        const opacity = anim.interpolate({
          inputRange: [0, 0.2, 1],
          outputRange: [0, 0.7, 1],
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
              style={[styles.arcSubButton, { backgroundColor: btn.color }]}
              onPress={() => console.log(`Pressed ${btn.label}`)}
            >
              <IconComponent color="#fff" size={20} />
            </Pressable>
          </Animated.View>
        );
      })}

      <Pressable
        onPress={toggleFab}
        style={[
          styles.arcMainButton,
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
                  outputRange: ["0deg", "45deg"],
                }),
              },
            ],
          }}
        >
          {open ? (
            <X color="#fff" size={26} />
          ) : (
            <Plus color="#fff" size={26} />
          )}
        </Animated.View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  arcContainer: {
    position: "absolute",
    width: 220,
    alignItems: "center",
    justifyContent: "center",
  },
  arcLine: {
    position: "absolute",
    width: 180,
    height: 90,
    borderTopWidth: 2,
    borderTopColor: "rgba(5, 150, 105, 0.3)",
    borderTopLeftRadius: 90,
    borderTopRightRadius: 90,
    backgroundColor: "transparent",
  },
  arcMainButton: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    alignItems: "center",
    justifyContent: "center",
    elevation: 10,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    zIndex: 20,
  },
  arcSubButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    zIndex: 15,
  },
});

export const ArcFab2 = memo(ArcFabComponent);
