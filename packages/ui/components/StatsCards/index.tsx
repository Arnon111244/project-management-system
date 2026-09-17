import React, { useRef, useState } from "react";
import { View, Animated, Pressable, Platform } from "react-native";
import { Text } from "ui/components/text";
import {
  DollarSign,
  ShoppingBag,
  Users,
  Wallet,
  TrendingUp,
  TrendingDown,
} from "lucide-react-native";

interface StatItem {
  title: string;
  value: string;
  percentage: string;
  isPositive: boolean;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  onPress?: () => void;
}

export const StatsDashboard = () => {
  const stats: StatItem[] = [
    {
      title: "Total Earnings",
      value: "$1400.25k",
      percentage: "+16.24 %",
      isPositive: true,
      icon: DollarSign,
      iconBg: "bg-[#e6f7f4]",
      iconColor: "#0acf97",
    },
    {
      title: "Orders",
      value: "140,8K",
      percentage: "-8.87 %",
      isPositive: false,
      icon: ShoppingBag,
      iconBg: "bg-[#e1f0fe]",
      iconColor: "#39afd1",
    },
    {
      title: "Customers",
      value: "183.35M",
      percentage: "+29.08 %",
      isPositive: true,
      icon: Users,
      iconBg: "bg-[#ffede1]",
      iconColor: "#ffbc00",
    },
    {
      title: "My Balance",
      value: "$195.89k",
      percentage: "+20.00 %",
      isPositive: true,
      icon: Wallet,
      iconBg: "bg-[#eef2f7]",
      iconColor: "#90a4ae",
    },
  ];

  return (
    <View className="flex-row flex-wrap w-full p-2 gap-3 ">
      {stats.map((item, index) => (
        <StatCard key={index} item={item} />
      ))}
    </View>
  );
};

const StatCard = ({ item }: { item: StatItem }) => {
  const Icon = item.icon;
  const translateY = useRef(new Animated.Value(0)).current;
  const [isHovered, setIsHovered] = useState(false);

  const handleHoverIn = () => {
    setIsHovered(true);
    if (Platform.OS === "web") {
      Animated.timing(translateY, {
        toValue: -6,
        duration: 150,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleHoverOut = () => {
    setIsHovered(false);
    if (Platform.OS === "web") {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start();
    }
  };

  return (
    <Pressable
      onHoverIn={handleHoverIn}
      onHoverOut={handleHoverOut}
      style={{ flex: 1, minWidth: 220 }}
      className="mx-2"
    >
      <Animated.View
        style={[
          { borderRadius: 7 },
          Platform.OS === "web" && {
            transform: [{ translateY }],
            shadowColor: isHovered ? item.iconColor : "",
            shadowOpacity: isHovered ? 0.8 : 0.05,
            shadowRadius: isHovered ? 10 : 5,
            elevation: isHovered ? 10 : 2,
          },
        ]}
      >
        <View className="p-5 bg-white dark:bg-black rounded-md border border-[#eaedf1] dark:border-zinc-800 ">
          <View className="flex-row justify-between items-start mb-2">
            <View>
              <Text className="text-[#8a96a3] text-[12px] font-bold tracking-wider mb-3">
                {item.title}
              </Text>
              <Text className="text-[#313a46] dark:text-white text-2xl font-bold">
                {item.value}
              </Text>
            </View>

            <View className="items-end">
              <View className="flex-row items-center mb-4">
                {item.isPositive ? (
                  <TrendingUp size={14} color="#0acf97" />
                ) : (
                  <TrendingDown size={14} color="#fa5c7c" />
                )}
                <Text
                  className={`mx-1 text-[13px] font-semibold ${
                    item.isPositive ? "text-[#0acf97]" : "text-[#fa5c7c]"
                  }`}
                >
                  {item.percentage}
                </Text>
              </View>

              <View className={`p-2 rounded-lg ${item.iconBg}`}>
                <Icon size={20} color={item.iconColor} />
              </View>
            </View>
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
};
