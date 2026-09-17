import React, { memo, useRef, useState, useEffect } from "react";
import { Pressable, Animated, StyleSheet, View } from "react-native";
import {
  Camera,
  Mic,
  Image,
  BarChart,
  Plus,
  X,
  Video,
  File,
  Heart,
  Send,
} from "lucide-react-native";

interface CubeFabProps {
  size?: number;
  color?: string;
}
function VortexFabComponent({ size = 70, color = "#7e22ce" }: CubeFabProps) {
  const [open, setOpen] = useState(false);
  const anim = useRef(new Animated.Value(0)).current;
  const vortexAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (open) {
      Animated.parallel([
        Animated.spring(anim, {
          toValue: 1,
          tension: 45,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.loop(
          Animated.timing(vortexAnim, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: true,
          }),
        ),
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(anim, {
          toValue: 0,
          tension: 45,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(vortexAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [open]);

  const toggleFab = () => {
    setOpen((prev) => !prev);
  };

  const subButtons = [
    { icon: Camera, color: "#ef4444", label: "Camera" },
    { icon: Video, color: "#8b5cf6", label: "Video" },
    { icon: Image, color: "#10b981", label: "Gallery" },
    { icon: File, color: "#f59e0b", label: "File" },
    { icon: Heart, color: "#ec4899", label: "Like" },
    { icon: Send, color: "#06b6d4", label: "Send" },
  ];

  const vortexRadius = 100;

  return (
    <View style={styles.vortexContainer}>
      <Animated.View
        style={[
          styles.vortexEffect,
          {
            opacity: anim,
            transform: [
              {
                rotate: vortexAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["0deg", "720deg"],
                }),
              },
              {
                scale: anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.5, 1],
                }),
              },
            ],
          },
        ]}
      />

      {subButtons.map((btn, index) => {
        const baseAngle = (index / subButtons.length) * Math.PI * 2;
        const radius = vortexRadius;

        const translateX = anim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, radius * Math.cos(baseAngle)],
        });

        const translateY = anim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, radius * Math.sin(baseAngle)],
        });

        const scale = anim.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0, 0.7, 1],
        });

        const opacity = anim.interpolate({
          inputRange: [0, 0.3, 1],
          outputRange: [0, 0.8, 1],
        });

        const rotate = vortexAnim.interpolate({
          inputRange: [0, 1],
          outputRange: ["0deg", "360deg"],
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
              style={[styles.vortexSubButton, { backgroundColor: btn.color }]}
              onPress={() => console.log(`Pressed ${btn.label}`)}
            >
              <Animated.View
                style={{
                  transform: [
                    {
                      rotate: vortexAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ["0deg", "-360deg"],
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

      <Pressable
        onPress={toggleFab}
        style={[
          styles.vortexMainButton,
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
                  outputRange: ["0deg", "180deg"],
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
  vortexContainer: {
    position: "absolute",
    width: 220,
    alignItems: "center",
    justifyContent: "center",
  },
  vortexEffect: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 2,
    borderColor: "rgba(126, 34, 206, 0.3)",
    borderTopColor: "rgba(126, 34, 206, 0.8)",
    borderRightColor: "rgba(126, 34, 206, 0.6)",
    backgroundColor: "transparent",
  },
  vortexMainButton: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    alignItems: "center",
    justifyContent: "center",
    elevation: 12,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    zIndex: 20,
  },
  vortexSubButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    zIndex: 15,
  },
});

export const VortexFab = memo(VortexFabComponent);
