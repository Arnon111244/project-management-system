// ui/components/BudgetRadarChart.tsx
import React, { useMemo, useState } from "react";
import { useWindowDimensions, LayoutChangeEvent } from "react-native";
import Svg, {
  Polygon,
  Line,
  Text as SvgText,
  Circle,
  G,
} from "react-native-svg";
import { View } from "ui/components/view";
import { Text } from "ui/components/text";
import { colors } from "ui/theme";

interface RadarData {
  label: string;
  value: number;
}

interface RadarChartProps {
  data: RadarData[];
  title?: string;
  className?: string;
  height?: number;
  minHeight?: number;
  maxHeight?: number;
  aspectRatio?: number;
}

export function BudgetRadarChart({
  data,
  title = "Budget Distribution",
  className = "",
  height,
  minHeight = 300,
  maxHeight = 500,
  aspectRatio = 1,
}: RadarChartProps) {
  const { width: screenWidth } = useWindowDimensions();

  const [containerDimensions, setContainerDimensions] = useState({
    width: 0,
    height: 0,
  });

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setContainerDimensions({ width, height });
  };

  const svgSize = useMemo(() => {
    const containerWidth = containerDimensions.width;
    const containerHeight = containerDimensions.height;

    if (containerWidth === 0 || containerHeight === 0) {
      return 200;
    }

    const availableSize =
      Math.min(containerWidth, containerHeight * aspectRatio) - 60;
    return Math.max(100, Math.min(availableSize, 500));
  }, [containerDimensions, aspectRatio]);

  const center = svgSize / 2;
  const radius = (svgSize / 2) * 0.7;
  const angleStep = (Math.PI * 2) / data.length;

  const generateLevelPoints = (levelRadius: number) => {
    return data
      .map((_, i) => {
        const x = center + levelRadius * Math.cos(i * angleStep - Math.PI / 2);
        const y = center + levelRadius * Math.sin(i * angleStep - Math.PI / 2);
        return `${x},${y}`;
      })
      .join(" ");
  };

  const dataPoints = useMemo(() => {
    return data.map((item, i) => {
      const pointRadius = (item.value / 100) * radius;
      const x = center + pointRadius * Math.cos(i * angleStep - Math.PI / 2);
      const y = center + pointRadius * Math.sin(i * angleStep - Math.PI / 2);
      return { x, y, value: item.value };
    });
  }, [data, radius, center, angleStep]);

  const polygonPoints = dataPoints.map((p) => `${p.x},${p.y}`).join(" ");

  const containerHeight =
    height || Math.min(Math.max(minHeight, svgSize + 100), maxHeight);

  return (
    <View
      className={`bg-white dark:bg-black p-4 rounded-2xl border border-[#eaedf1] items-center m-2 mx-4 ${className}`}
      style={{ height: containerHeight }}
      onLayout={handleLayout}
    >
      <View className="w-full mb-2">
        <Text className="text-lg font-bold text-[#5d7186]">{title}</Text>
      </View>

      <View className="flex-1 justify-center items-center w-full">
        {svgSize > 100 && (
          <Svg height={svgSize} width={svgSize}>
            <G>
              {[0.2, 0.4, 0.6, 0.8, 1].map((level, idx) => (
                <Polygon
                  key={`level-${idx}`}
                  points={generateLevelPoints(radius * level)}
                  fill="none"
                  stroke="#eaedf1"
                  strokeWidth="1"
                />
              ))}

              {data.map((item, i) => {
                const x =
                  center + radius * Math.cos(i * angleStep - Math.PI / 2);
                const y =
                  center + radius * Math.sin(i * angleStep - Math.PI / 2);
                const labelRadius = radius + 30;
                const labelX =
                  center + labelRadius * Math.cos(i * angleStep - Math.PI / 2);
                const labelY =
                  center + labelRadius * Math.sin(i * angleStep - Math.PI / 2);

                return (
                  <G key={`axis-${i}`}>
                    <Line
                      x1={center}
                      y1={center}
                      x2={x}
                      y2={y}
                      stroke="#eaedf1"
                      strokeWidth="1"
                    />
                    <SvgText
                      x={labelX}
                      y={labelY}
                      fontSize={svgSize < 200 ? "10" : "12"}
                      fill="#999"
                      textAnchor="middle"
                      alignmentBaseline="middle"
                    >
                      {item.label}
                    </SvgText>
                  </G>
                );
              })}

              <Polygon
                points={polygonPoints}
                fill="rgba(100, 110, 245, 0.2)"
                stroke={colors.brand || "#646ef5"}
                strokeWidth="2"
              />

              {dataPoints.map((point, i) => (
                <G key={`point-${i}`}>
                  <Circle
                    cx={point.x}
                    cy={point.y}
                    r={svgSize < 200 ? 3 : 4}
                    fill={colors.brand || "#646ef5"}
                  />

                  <G>
                    <Polygon
                      points={`${point.x - 10},${point.y - 12} ${point.x + 10},${point.y - 12} ${point.x + 10},${point.y} ${point.x - 10},${point.y}`}
                      fill="#646ef5"
                    />
                    <SvgText
                      x={point.x}
                      y={point.y - 4}
                      fontSize={svgSize < 200 ? "8" : "10"}
                      fill="white"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {`${point.value}%`}
                    </SvgText>
                  </G>
                </G>
              ))}
            </G>
          </Svg>
        )}
      </View>
    </View>
  );
}
