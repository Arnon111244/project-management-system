import React, { memo, useRef, useState, useEffect } from "react";
import { Pressable, Animated, StyleSheet, View, Easing } from "react-native";
import {
  Camera,
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

function OrbitalFabComponent({
  size = 70,
  color = "#7c3aed",
}: OrbitalFabProps) {
  const [open, setOpen] = useState(false);
  const anim = useRef(new Animated.Value(0)).current;
  const orbitAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (open) {
      Animated.loop(
        Animated.timing(orbitAnim, {
          toValue: 1,
          duration: 8000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ).start();
    } else {
      orbitAnim.setValue(0);
    }
  }, [open]);

  useEffect(() => {
    Animated.sequence([
      Animated.timing(glowAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(glowAnim, {
        toValue: 0.3,
        duration: 700,
        useNativeDriver: true,
      }),
    ]).start();
  }, [open]);

  useEffect(() => {
    Animated.spring(anim, {
      toValue: open ? 1 : 0,
      tension: 45,
      friction: 7,
      useNativeDriver: true,
    }).start();
  }, [open]);

  const toggleFab = () => {
    setOpen((prev) => !prev);
  };

  const subButtons = [
    { icon: Heart, color: "#ef4444", label: "Like" },
    { icon: MessageCircle, color: "#3b82f6", label: "Comment" },
    { icon: Share, color: "#10b981", label: "Share" },
    { icon: Star, color: "#f59e0b", label: "Favorite" },
    { icon: Camera, color: "#8b5cf6", label: "Camera" },
    { icon: BarChart, color: "#06b6d4", label: "Poll" },
  ];

  const orbitRadius = 100;

  return (
    <View style={styles.orbitalContainer}>
      {[0, 1, 2].map((wave) => (
        <Animated.View
          key={wave}
          style={[
            styles.wave,
            {
              opacity: anim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.1 - wave * 0.03],
              }),
              transform: [
                {
                  scale: anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 1.4 + wave * 0.2],
                  }),
                },
              ],
            },
          ]}
        />
      ))}

      {subButtons.map((btn, index) => {
        const totalButtons = subButtons.length;
        const baseAngle = (index / totalButtons) * Math.PI * 2;

        const currentAngle = orbitAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [baseAngle, baseAngle + Math.PI * 2],
        });

        const translateX = anim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, orbitRadius * Math.cos(baseAngle)],
        });

        const translateY = anim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, orbitRadius * Math.sin(baseAngle)],
        });

        const scale = anim.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0, 0.8, 1],
        });

        const opacity = anim.interpolate({
          inputRange: [0, 0.3, 1],
          outputRange: [0, 0.9, 1],
        });

        const rotate = anim.interpolate({
          inputRange: [0, 1],
          outputRange: ["0deg", "720deg"],
        });

        const IconComponent = btn.icon;

        return (
          <Animated.View
            key={index}
            style={{
              position: "absolute",
              transform: [
                { translateX },
                { translateY },
                { scale },
                { rotate },
              ],
              opacity,
            }}
          >
            <Pressable
              style={[styles.orbitalSubButton, { backgroundColor: btn.color }]}
              onPress={() => console.log(`Pressed ${btn.label}`)}
            >
              <Animated.View
                style={{
                  transform: [
                    {
                      rotate: orbitAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ["0deg", "360deg"],
                      }),
                    },
                  ],
                }}
              >
                <IconComponent color="#fff" size={18} />
              </Animated.View>
            </Pressable>
          </Animated.View>
        );
      })}

      <Animated.View
        style={{
          transform: [
            {
              scale: anim.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 1.1],
              }),
            },
            {
              rotate: anim.interpolate({
                inputRange: [0, 1],
                outputRange: ["0deg", "180deg"],
              }),
            },
          ],
        }}
      >
        <Pressable
          onPress={toggleFab}
          style={[
            styles.orbitalMainButton,
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

          <Animated.View
            style={[
              styles.glow,
              {
                opacity: glowAnim,
                transform: [
                  {
                    scale: glowAnim.interpolate({
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
  orbitalContainer: {
    position: "absolute",
    width: 220,
    alignItems: "center",
    justifyContent: "center",
  },
  wave: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#7c3aed",
    borderWidth: 2,
    borderColor: "rgba(124, 58, 237, 0.3)",
  },
  orbitalMainButton: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: "center",
    justifyContent: "center",
    elevation: 12,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    position: "relative",
    zIndex: 30,
  },
  glow: {
    position: "absolute",
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: "#7c3aed",
    zIndex: -1,
  },
  orbitalSubButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    zIndex: 20,
  },
});

export const OrbitalFab = memo(OrbitalFabComponent);
