import React, { memo, useRef, useState, useEffect } from "react";
import { Pressable, Animated, StyleSheet, View } from "react-native";
import {
  Camera,
  Image,
  Plus,
  X,
  Video,
  File,
  Heart,
} from "lucide-react-native";

interface CubeFabProps {
  size?: number;
  color?: string;
}

function WaterfallFabComponent({ size = 70, color = "#4f46e5" }: CubeFabProps) {
  const [open, setOpen] = useState(false);
  const anim = useRef(new Animated.Value(0)).current;
  const dropAnim = useRef(new Animated.Value(0)).current;

  const SUB_BUTTON_COUNT = 5;
  const BUTTON_SPACING = 80;
  const TOTAL_HEIGHT = BUTTON_SPACING * SUB_BUTTON_COUNT - (!open ? 500 : 0);

  useEffect(() => {
    if (open) {
      Animated.parallel([
        Animated.spring(anim, {
          toValue: 1,
          tension: 40,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(dropAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(dropAnim, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    } else {
      Animated.spring(anim, {
        toValue: 0,
        tension: 40,
        friction: 7,
        useNativeDriver: true,
      }).start();
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
  ];

  return (
    <View style={[styles.waterfallContainer, { height: TOTAL_HEIGHT + 100 }]}>
      <Animated.View
        style={[
          styles.waterDrop,
          {
            opacity: dropAnim,
            transform: [
              {
                translateY: dropAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, TOTAL_HEIGHT],
                }),
              },
            ],
          },
        ]}
      />

      {subButtons.map((btn, index) => {
        const buttonDistance = BUTTON_SPACING * (index + 1);

        const bounce = anim.interpolate({
          inputRange: [0, 0.7, 0.85, 0.95, 1],
          outputRange: [0, -15, 8, -3, 0],
        });

        const delay = index * 0.08;
        const delayedAnim = anim.interpolate({
          inputRange: [0, delay, 1],
          outputRange: [0, 0, 1],
        });

        const IconComponent = btn.icon;

        return (
          <Animated.View
            key={index}
            style={[
              styles.subButtonContainer,
              {
                transform: [
                  {
                    translateY: Animated.add(
                      delayedAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, -buttonDistance],
                      }),
                      bounce,
                    ),
                  },
                  {
                    scale: delayedAnim.interpolate({
                      inputRange: [0, 0.5, 1],
                      outputRange: [0, 0.8, 1],
                    }),
                  },
                ],
                opacity: delayedAnim.interpolate({
                  inputRange: [0, 0.3, 1],
                  outputRange: [0, 0.5, 1],
                }),
              },
            ]}
          >
            <Pressable
              style={[
                styles.waterfallSubButton,
                {
                  backgroundColor: btn.color,
                  shadowColor: btn.color,
                  cursor: "pointer",
                },
              ]}
              onPress={() => {
                console.log(`Pressed ${btn.label}`);
                toggleFab();
              }}
            >
              <IconComponent color="#fff" size={24} />
            </Pressable>
          </Animated.View>
        );
      })}

      <Pressable
        onPress={toggleFab}
        style={[
          styles.waterfallMainButton,
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
            <X color="#fff" size={28} />
          ) : (
            <Plus color="#fff" size={28} />
          )}
        </Animated.View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  waterfallContainer: {
    alignItems: "center",
    justifyContent: "flex-end",
    position: "relative",
    width: 70,
  },
  waterfallLine: {
    position: "absolute",
    width: 3,
    backgroundColor: "#4f46e5",
    borderRadius: 2,
    bottom: 35,
    opacity: 0.7,
  },
  waterDrop: {
    position: "absolute",
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#4f46e5",
    bottom: 35,
    opacity: 0.9,
  },
  subButtonContainer: {
    position: "absolute",
    bottom: 35,
    alignItems: "center",
    justifyContent: "center",
  },
  waterfallMainButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    elevation: 15,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    zIndex: 9999,
  },
  waterfallSubButton: {
    width: 40,
    height: 40,
    borderRadius: 22,

    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    zIndex: 9999,
  },
});

export const WaterfallFab = memo(WaterfallFabComponent);
