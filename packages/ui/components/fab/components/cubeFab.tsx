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

function CubeFabComponent({ size = 70, color = "#db2777" }: CubeFabProps) {
  const [open, setOpen] = useState(false);
  const anim = useRef(new Animated.Value(0)).current;
  const flipAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (open) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
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
      Animated.spring(flipAnim, {
        toValue: open ? 1 : 0,
        tension: 60,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();
  }, [open]);

  const toggleFab = () => {
    setOpen((prev) => !prev);
  };

  const subButtons = [
    { icon: Camera, color: "#dc2626", label: "Camera", layer: 0 },
    { icon: Video, color: "#7c3aed", label: "Video", layer: 1 },
    { icon: Image, color: "#059669", label: "Gallery", layer: 0 },
    { icon: File, color: "#ea580c", label: "File", layer: 1 },
    { icon: Heart, color: "#db2777", label: "Like", layer: 2 },
    { icon: Send, color: "#0891b2", label: "Send", layer: 2 },
    { icon: BarChart, color: "#ca8a04", label: "Poll", layer: 1 },
    { icon: Mic, color: "#65a30d", label: "Voice", layer: 0 },
  ];

  return (
    <View style={styles.cubeContainer}>
      <Animated.View
        style={[
          styles.cubeBackground,
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
        const radius = 90;
        const angle = (index / subButtons.length) * Math.PI * 2;

        const translateX = anim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, radius * Math.cos(angle)],
        });

        const translateY = anim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, radius * Math.sin(angle)],
        });

        const scale = anim.interpolate({
          inputRange: [0, 0.3, 1],
          outputRange: [0, 0.6, 1],
        });

        const opacity = anim.interpolate({
          inputRange: [0, 0.2, 1],
          outputRange: [0, 0.8, 1],
        });

        const rotate2D = flipAnim.interpolate({
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
                {
                  rotate: rotate2D,
                },
              ],
              opacity,
              zIndex: 10 - btn.layer,
            }}
          >
            <Pressable
              style={[
                styles.cubeSubButton,
                {
                  backgroundColor: btn.color,
                  shadowColor: btn.color,
                },
              ]}
              onPress={() => console.log(`Pressed ${btn.label}`)}
            >
              <Animated.View
                style={{
                  transform: [
                    {
                      rotate: flipAnim.interpolate({
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

      <Animated.View
        style={{
          transform: [
            { scale: pulseAnim },
            {
              rotate: flipAnim.interpolate({
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
            styles.cubeMainButton,
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
              <X color="#fff" size={24} />
            ) : (
              <Plus color="#fff" size={24} />
            )}
          </Animated.View>

          <Animated.View
            style={[
              styles.cubeShine,
              {
                opacity: anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 0.6],
                }),
                transform: [
                  {
                    rotate: flipAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ["0deg", "360deg"],
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
  cubeContainer: {
    position: "absolute",
    width: 220,
    alignItems: "center",
    justifyContent: "center",
  },
  cubeBackground: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(219, 39, 119, 0.1)",
    borderWidth: 3,
    borderColor: "rgba(219, 39, 119, 0.3)",
  },
  cubeMainButton: {
    width: 65,
    height: 65,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    elevation: 15,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    position: "relative",
    zIndex: 30,
  },
  cubeShine: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    zIndex: -1,
  },
  cubeSubButton: {
    width: 46,
    height: 46,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    elevation: 10,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    zIndex: 20,
  },
});

export const CubeFab = memo(CubeFabComponent);
