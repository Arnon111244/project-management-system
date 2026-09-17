import React, { memo, useRef, useState, useEffect } from "react";
import { Pressable, Animated, StyleSheet, View } from "react-native";
import { Camera, Mic, Image, BarChart } from "lucide-react-native";

interface FabProps {
  size?: number;
  color?: string;
}

function FabFlowerComponent({ size = 60, color = "#007bff" }: FabProps) {
  const [open, setOpen] = useState(false);
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: open ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [open]);

  const toggleFab = () => setOpen((prev) => !prev);

  const subButtons = [
    { icon: Camera, color: "#dc2626" },
    { icon: BarChart, color: "#7c3aed" },
    { icon: Image, color: "#059669" },
    { icon: Mic, color: "#0891b2" },
  ];

  const radius = 90;

  return (
    <View style={styles.container}>
      {subButtons.map((btn, index) => {
        const angle = (index / subButtons.length) * Math.PI * 2;
        const translateX = anim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, radius * Math.cos(angle)],
        });
        const translateY = anim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, radius * Math.sin(angle) * -1],
        });
        const opacity = anim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 1],
        });
        const IconComponent = btn.icon;

        return (
          <Animated.View
            key={index}
            style={{
              position: "absolute",
              transform: [{ translateX }, { translateY }],
              opacity,
            }}
          >
            <Pressable
              style={[
                styles.subButton,
                {
                  backgroundColor: btn.color,
                  shadowColor: btn.color,
                },
              ]}
              onPress={() => console.log(`Pressed `)}
            >
              <IconComponent color="#fff" size={24} />
            </Pressable>
          </Animated.View>
        );
      })}

      <Pressable
        onPress={toggleFab}
        style={[styles.fab, { backgroundColor: color }]}
      >
        <Animated.View
          style={[
            styles.line,
            {
              transform: [
                {
                  rotate: anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0deg", "45deg"],
                  }),
                },
              ],
            },
          ]}
        />
        <Animated.View
          style={[
            styles.line,
            {
              transform: [
                {
                  rotate: anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0deg", "-45deg"],
                  }),
                },
              ],
            },
          ]}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: 220,
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
    backgroundColor: "#007bff",
    position: "absolute",
    alignSelf: "center",
  },
  line: {
    position: "absolute",
    width: 30,
    height: 4,
    backgroundColor: "white",
    borderRadius: 2,
  },
  subButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#007bff",
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
});

export const FabFlower = memo(FabFlowerComponent);
