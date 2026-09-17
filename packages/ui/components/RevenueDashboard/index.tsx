import React, { useState } from "react";
import { ScrollView, Pressable } from "react-native";
import { View } from "ui/components/view";
import { Text } from "ui/components/text";
import Svg, { Rect } from "react-native-svg";

const MAX_VAL = 120;
const DEFAULT_CHART_H = 200;

interface RevenueDashboardProps {
  className?: string;
  height?: number | string;
  title?: string;
  chartHeight?: number;
}

export function RevenueDashboard({
  className = "",
  chartHeight = DEFAULT_CHART_H,
}: RevenueDashboardProps) {
  const DATA = [
    { label: String("Jan"), earnings: 90, orders: 35, refunds: 10 },
    { label: String("Feb"), earnings: 100, orders: 65, refunds: 15 },
    { label: String("Mar"), earnings: 70, orders: 40, refunds: 8 },
    { label: String("Apr"), earnings: 110, orders: 70, refunds: 18 },
    { label: String("May"), earnings: 80, orders: 50, refunds: 22 },
    { label: String("Jun"), earnings: 85, orders: 60, refunds: 14 },
    { label: String("Jul"), earnings: 52, orders: 42, refunds: 6 },
    { label: String("Aug"), earnings: 30, orders: 45, refunds: 10 },
    { label: String("Sep"), earnings: 95, orders: 85, refunds: 8 },
    { label: String("Oct"), earnings: 75, orders: 55, refunds: 20 },
    { label: String("Nov"), earnings: 90, orders: 63, refunds: 12 },
    { label: String("Dec"), earnings: 40, orders: 68, refunds: 35 },
  ];

  const CATEGORIES = {
    orders: { label: "Orders", color: "#3b5998", key: "orders" },
    earnings: { label: "Earnings", color: "#1abc9c", key: "earnings" },
    refunds: { label: "Refunds", color: "#fa5c7c", key: "refunds" },
  };

  const [activeKey, setActiveKey] =
    useState<keyof (typeof DATA)[0]>("earnings");

  const [parentWidth, setParentWidth] = useState(700);
  const availableWidth = Math.max(parentWidth - 80, 250);
  const containerWidth = availableWidth;
  const stepX = containerWidth / DATA.length;

  const getY = (val: number) => chartHeight - (val / MAX_VAL) * chartHeight;

  return (
    <View
      onLayout={(e) => {
        const { width } = e.nativeEvent.layout;
        if (width) setParentWidth(width);
      }}
      className={`bg-white dark:bg-black rounded-xl border border-[#eaedf1] dark:border-zinc-800 overflow-hidden ${className}`}
    >
      <View className="flex-row justify-between items-center p-4">
        <Text className="text-lg font-bold text-[#313a46] dark:text-white">
          Revenue
        </Text>
      </View>

      <View className="flex-row border-y border-[#f1f3fa] dark:border-zinc-800">
        <StatBox
          label="Orders"
          value="7,585"
          isGreen={activeKey === "orders"}
          color={CATEGORIES.orders.color}
          onPress={() => setActiveKey("orders")}
        />
        <StatBox
          label="Earnings"
          value="$22.89k"
          isGreen={activeKey === "earnings"}
          color={CATEGORIES.earnings.color}
          onPress={() => setActiveKey("earnings")}
        />
        <StatBox
          label="Refunds"
          value="367"
          isGreen={activeKey === "refunds"}
          color={CATEGORIES.refunds.color}
          onPress={() => setActiveKey("refunds")}
        />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={true}
        className="mt-4"
      >
        <Pressable>
          <View
            style={{
              width: containerWidth + 50,
              height: chartHeight + 40,
              paddingLeft: 50,
              paddingRight: 50,
              position: "relative",
            }}
          >
            {[0, 20, 40, 60, 80, 100, 120].map((v) => (
              <View
                key={v}
                pointerEvents="none"
                className="absolute left-0 right-0 flex-row items-center"
                style={{ top: getY(v), zIndex: 0 }}
              >
                <Text className="text-[10px] text-gray-400 w-10 text-right pr-2 font-mono">
                  {v === 0 ? "0" : v}
                </Text>
                <View className="flex-1 border-b border-[#f1f3fa] dark:border-zinc-800" />
              </View>
            ))}

            <Svg
              width={containerWidth}
              height={chartHeight}
              style={{ zIndex: 1 }}
            >
              {DATA.map((d, i) => {
                const value = d[activeKey] as number;
                const barWidth = Math.min(stepX * 0.5, 45);
                const barX = i * stepX + (stepX - barWidth) / 2;

                return (
                  <Rect
                    key={`bar-${i}`}
                    x={barX}
                    y={getY(value)}
                    width={barWidth}
                    height={chartHeight - getY(value)}
                    fill={
                      CATEGORIES[activeKey as keyof typeof CATEGORIES].color
                    }
                    rx="3"
                  />
                );
              })}
            </Svg>

            <View
              className="flex-row mt-2"
              style={{ width: containerWidth, zIndex: 2 }}
            >
              {DATA.map((d, i) => (
                <View key={i} style={{ width: stepX }} className="items-center">
                  <Text className="text-[10px] text-gray-400 font-medium">
                    {d.label}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </Pressable>
      </ScrollView>

      <View className="flex-row justify-center space-x-6 py-4 border-t border-[#f1f3fa] dark:border-zinc-800">
        <LegendItem
          color={CATEGORIES.orders.color}
          label="Orders"
          isActive={activeKey === "orders"}
          onPress={() => setActiveKey("orders")}
        />
        <LegendItem
          color={CATEGORIES.earnings.color}
          label="Earnings"
          isActive={activeKey === "earnings"}
          onPress={() => setActiveKey("earnings")}
        />
        <LegendItem
          color={CATEGORIES.refunds.color}
          label="Refunds"
          isActive={activeKey === "refunds"}
          onPress={() => setActiveKey("refunds")}
        />
      </View>
    </View>
  );
}

interface StatBoxProps {
  onPress: () => void;
  color: string;
  label: string;
  value: string;
  isGreen: boolean;
}

const StatBox = ({ onPress, color, label, value, isGreen }: StatBoxProps) => (
  <Pressable
    onPress={onPress}
    className="flex-1 items-center py-4 border-r border-[#f1f3fa] dark:border-zinc-800 last:border-r-0"
  >
    <Text className="text-base font-bold text-[#313a46] dark:text-white">
      {value}
    </Text>
    <Text className="text-[10px] text-gray-400 uppercase mt-1">{label}</Text>
    {isGreen && (
      <View
        style={{ backgroundColor: color }}
        className="h-1 w-6 rounded-full mt-1"
      />
    )}
  </Pressable>
);

interface LegendItemProps {
  color: string;
  label: string;
  onPress: () => void;
  isActive: boolean;
}

const LegendItem = ({ color, label, onPress, isActive }: LegendItemProps) => (
  <Pressable
    onPress={onPress}
    className={`flex-row items-center mx-2 px-2 py-1 rounded-md ${isActive ? "bg-gray-100 dark:bg-zinc-800" : ""}`}
  >
    <View
      style={{ backgroundColor: color }}
      className="w-2.5 h-2.5 rounded-full mx-2"
    />
    <Text
      className={`text-xs ${isActive ? "font-bold text-black dark:text-white" : "text-gray-500"}`}
    >
      {label}
    </Text>
  </Pressable>
);
