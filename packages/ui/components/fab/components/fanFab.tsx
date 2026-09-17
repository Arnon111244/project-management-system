import React, { memo, useRef, useState, useEffect } from "react";
import {
  Pressable,
  Animated,
  StyleSheet,
  View,
  Dimensions,
} from "react-native";
import {
  Camera,
  Mic,
  Image,
  BarChart,
  Plus,
  X,
  File,
  Video,
} from "lucide-react-native";

interface FanFabProps {
  size?: number;
  color?: string;
}

function FanFabComponent({ size = 70, color = "#ec4899" }: FanFabProps) {
  const [open, setOpen] = useState(false);
  const anim = useRef(new Animated.Value(0)).current;
  const rotationAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (open) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [open]);

  useEffect(() => {
    Animated.parallel([
      Animated.spring(anim, {
        toValue: open ? 1 : 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(rotationAnim, {
        toValue: open ? 1 : 0,
        tension: 40,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();
  }, [open]);

  const toggleFab = () => {
    setOpen((prev) => !prev);
  };

  const subButtons = [
    { icon: Camera, color: "#ef4444", label: "Camera" },
    { icon: Video, color: "#8b5cf6", label: "Video" },
    { icon: Image, color: "#10b981", label: "Gallery" },
    { icon: File, color: "#f59e0b", label: "File" },
    { icon: BarChart, color: "#06b6d4", label: "Poll" },
    { icon: Mic, color: "#84cc16", label: "Audio" },
  ];

  const fanRadius = 110;
  const startAngle = -Math.PI / 2;
  const endAngle = Math.PI / 2;

  return (
    <View style={styles.fanContainer}>
      <Animated.View
        style={[
          styles.backgroundEffect,
          {
            opacity: anim,
            transform: [
              {
                scale: anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1.2],
                }),
              },
            ],
          },
        ]}
      />

      {subButtons.map((btn, index) => {
        const totalButtons = subButtons.length - 1;
        const angle =
          startAngle + (index / totalButtons) * (endAngle - startAngle);

        const translateX = anim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, fanRadius * Math.cos(angle)],
        });

        const translateY = anim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, fanRadius * Math.sin(angle)],
        });

        const scale = anim.interpolate({
          inputRange: [0, 0.3, 1],
          outputRange: [0, 0.5, 1],
        });

        const opacity = anim.interpolate({
          inputRange: [0, 0.2, 1],
          outputRange: [0, 0.8, 1],
        });

        const rotate = anim.interpolate({
          inputRange: [0, 1],
          outputRange: ["-180deg", "0deg"],
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
              style={[styles.fanSubButton, { backgroundColor: btn.color }]}
              onPress={() => console.log(`Pressed ${btn.label}`)}
            >
              <IconComponent color="#fff" size={20} />
            </Pressable>
          </Animated.View>
        );
      })}

      <Animated.View
        style={{
          transform: [
            { scale: pulseAnim },
            {
              rotate: rotationAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ["0deg", "45deg"],
              }),
            },
          ],
        }}
      >
        <Pressable
          onPress={toggleFab}
          style={[
            styles.fanMainButton,
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
                  rotate: rotationAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0deg", "135deg"],
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
              styles.haloEffect,
              {
                opacity: anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 0.4],
                }),
                transform: [
                  {
                    scale: anim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 1.5],
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
  fanContainer: {
    position: "absolute",
    width: 220,
    alignItems: "center",
    justifyContent: "center",
  },
  backgroundEffect: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(236, 72, 153, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(236, 72, 153, 0.2)",
  },
  fanMainButton: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    alignItems: "center",
    justifyContent: "center",
    elevation: 10,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    position: "relative",
    zIndex: 20,
  },
  haloEffect: {
    position: "absolute",
    width: 65,
    height: 65,
    borderRadius: 32.5,
    backgroundColor: "#ec4899",
    zIndex: -1,
  },
  fanSubButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    zIndex: 10,
  },
});

export const FanFab = memo(FanFabComponent);
