"use client";

import { useEffect, useMemo, useRef } from "react";
import { Animated, Easing, Platform } from "react-native";
import Svg, { Circle, Line, Rect } from "react-native-svg";

import { View } from "ui/components/view";
import { Text } from "ui/components/text";
import { FloatingOrb } from "shared_mono_app/features/entryFeature/components/floatingOrb";
import {
  isWeb,
  webBlurStyle,
} from "shared_mono_app/features/entryFeature/components/platformStyles";
import { useNeuralPalette, useTheme } from "ui/theme/themeProvider";

import { NEURAL, neuralAlpha } from "ui/theme/neuralRuntime";

const ORB_BLUR = isWeb ? 68 : 0;

/** Feed-forward network topology — input → hidden → output */
const INPUT_NEURONS = [
  { x: 10, y: 22 },
  { x: 10, y: 40 },
  { x: 10, y: 60 },
  { x: 10, y: 78 },
] as const;

const HIDDEN_NEURONS = [
  { x: 50, y: 14 },
  { x: 50, y: 32 },
  { x: 50, y: 50 },
  { x: 50, y: 68 },
  { x: 50, y: 86 },
] as const;

const OUTPUT_NEURONS = [
  { x: 90, y: 32 },
  { x: 90, y: 50 },
  { x: 90, y: 68 },
] as const;

type Point = { x: number; y: number };

function buildSynapses(): { from: Point; to: Point; weight: number }[] {
  const edges: { from: Point; to: Point; weight: number }[] = [];
  INPUT_NEURONS.forEach((input, i) => {
    HIDDEN_NEURONS.forEach((hidden, j) => {
      edges.push({
        from: input,
        to: hidden,
        weight: 0.35 + ((i + j) % 5) * 0.12,
      });
    });
  });
  HIDDEN_NEURONS.forEach((hidden, i) => {
    OUTPUT_NEURONS.forEach((output, j) => {
      edges.push({
        from: hidden,
        to: output,
        weight: 0.4 + ((i + j) % 4) * 0.14,
      });
    });
  });
  return edges;
}

const SYNAPSES = buildSynapses();

const TOKEN_LABELS = [
  "embed",
  "attn",
  "ctx",
  "gen",
  "tok",
  "vec",
  "llm",
  "out",
] as const;

function SynapsePulse({
  from,
  to,
  delay,
  duration,
  color,
}: {
  from: Point;
  to: Point;
  delay: number;
  duration: number;
  color: string;
}) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(progress, {
          toValue: 1,
          duration,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: false,
        }),
        Animated.timing(progress, {
          toValue: 0,
          duration: 0,
          useNativeDriver: false,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [progress, delay, duration]);

  const left = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [`${from.x}%`, `${to.x}%`],
  });
  const top = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [`${from.y}%`, `${to.y}%`],
  });
  const opacity = progress.interpolate({
    inputRange: [0, 0.08, 0.85, 1],
    outputRange: [0, 1, 0.9, 0],
  });
  const scale = progress.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.6, 1.4, 0.8],
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: "absolute",
        left,
        top,
        width: 6,
        height: 6,
        marginLeft: -3,
        marginTop: -3,
        borderRadius: 3,
        backgroundColor: color,
        opacity,
        transform: [{ scale }],
        ...(isWeb
          ? ({
              boxShadow: `0 0 10px ${color}`,
            } as object)
          : null),
      }}
    />
  );
}

function NeuronNode({
  cx,
  cy,
  layer,
  index,
}: {
  cx: number;
  cy: number;
  layer: "input" | "hidden" | "output";
  index: number;
}) {
  const fire = useRef(new Animated.Value(0)).current;
  const layerDelay = layer === "input" ? 0 : layer === "hidden" ? 600 : 1200;
  const cycleDuration = 4200;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(layerDelay + index * 280),
        Animated.timing(fire, {
          toValue: 1,
          duration: 380,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(fire, {
          toValue: 0,
          duration: 900,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.delay(cycleDuration - layerDelay - index * 280 - 1280),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [fire, index, layer, layerDelay]);

  const glow = fire.interpolate({
    inputRange: [0, 1],
    outputRange: [0.35, 1],
  });
  const ringScale = fire.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.85],
  });
  const ringOpacity = fire.interpolate({
    inputRange: [0, 0.4, 1],
    outputRange: [0, 0.7, 0],
  });

  const color =
    layer === "input"
      ? NEURAL.cyan
      : layer === "hidden"
        ? NEURAL.violet
        : NEURAL.positive;
  const size = layer === "hidden" ? 10 : 8;

  return (
    <>
      <Animated.View
        pointerEvents="none"
        style={{
          position: "absolute",
          left: `${cx}%`,
          top: `${cy}%`,
          width: size * 3,
          height: size * 3,
          marginLeft: -(size * 3) / 2,
          marginTop: -(size * 3) / 2,
          borderRadius: size * 3,
          borderWidth: 1.5,
          borderColor: color,
          opacity: ringOpacity,
          transform: [{ scale: ringScale }],
        }}
      />
      <Animated.View
        pointerEvents="none"
        style={{
          position: "absolute",
          left: `${cx}%`,
          top: `${cy}%`,
          width: size,
          height: size,
          marginLeft: -size / 2,
          marginTop: -size / 2,
          borderRadius: size / 2,
          backgroundColor: color,
          opacity: glow,
          ...(isWeb
            ? ({
                boxShadow: `0 0 14px ${color}`,
              } as object)
            : null),
        }}
      />
    </>
  );
}

function StaticNeuralNetwork() {
  return (
    <View
      pointerEvents="none"
      className="absolute inset-0"
      style={{ opacity: 0.4 }}
    >
      <Svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {SYNAPSES.map((synapse, index) => (
          <Line
            key={`static-synapse-${index}`}
            x1={synapse.from.x}
            y1={synapse.from.y}
            x2={synapse.to.x}
            y2={synapse.to.y}
            stroke={index % 3 === 0 ? NEURAL.cyan : NEURAL.violet}
            strokeWidth={0.08 + synapse.weight * 0.12}
            strokeOpacity={0.28 + synapse.weight * 0.32}
          />
        ))}
        {[...INPUT_NEURONS, ...HIDDEN_NEURONS, ...OUTPUT_NEURONS].map(
          (node, index) => (
            <Circle
              key={`static-core-${index}`}
              cx={node.x}
              cy={node.y}
              r={index < 4 ? 0.65 : index < 9 ? 0.75 : 0.7}
              fill={NEURAL.canvas}
              stroke={
                index < 4
                  ? NEURAL.cyan
                  : index < 9
                    ? NEURAL.violet
                    : NEURAL.positive
              }
              strokeWidth={0.22}
              fillOpacity={0.55}
            />
          ),
        )}
      </Svg>
    </View>
  );
}

function StaticGlowOrb({
  className,
  color,
}: {
  className?: string;
  color: string;
}) {
  return (
    <View
      pointerEvents="none"
      className={className}
      style={{ backgroundColor: color }}
    />
  );
}

/** Native-only: same neural look, zero Animated loops (performance). */
function NeuralStaticBackground() {
  const neural = useNeuralPalette();
  const staticEmbeddings = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => ({
        leftPercent: ((i * 23 + 8) % 88) + 6,
        topPercent: ((i * 31 + 14) % 72) + 12,
        heights: [0.5, 0.85, 0.4, 0.7, 0.55],
      })),
    [],
  );

  return (
    <View
      pointerEvents="none"
      className="absolute inset-0 overflow-hidden"
      style={{ backgroundColor: NEURAL.canvas }}
    >
      <StaticGlowOrb
        className="absolute top-[-35%] left-[-15%] w-[140%] aspect-square rounded-full"
        color="rgba(34,211,238,0.2)"
      />
      <StaticGlowOrb
        className="absolute top-[5%] right-[-25%] w-[120%] aspect-square rounded-full"
        color="rgba(167,139,250,0.16)"
      />
      <StaticGlowOrb
        className="absolute bottom-[-28%] left-[12%] w-[112%] aspect-square rounded-full"
        color="rgba(52,211,153,0.12)"
      />

      <StaticNeuralNetwork />

      {staticEmbeddings.map((seed, index) => (
        <View
          key={`static-emb-${index}`}
          pointerEvents="none"
          className="absolute"
          style={{
            left: `${seed.leftPercent}%`,
            top: `${seed.topPercent}%`,
            opacity: 0.45,
          }}
        >
          <View
            className="flex-row items-end gap-[2px] px-1 py-1 rounded border"
            style={{ borderColor: `${NEURAL.cyan}33` }}
          >
            {seed.heights.map((h, i) => (
              <View
                key={i}
                className="w-[2px] rounded-full"
                style={{
                  height: 6 + h * 10,
                  backgroundColor: i % 2 === 0 ? NEURAL.cyan : NEURAL.violet,
                }}
              />
            ))}
          </View>
        </View>
      ))}

      <View
        className="absolute inset-0"
        style={{ backgroundColor: `${NEURAL.canvas}33` }}
      />
    </View>
  );
}

function AINeuralNetwork() {
  const wave = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(wave, {
        toValue: 1,
        duration: 5200,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [wave]);

  const meshOpacity = wave.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.22, 0.48, 0.22],
  });

  return (
    <Animated.View
      pointerEvents="none"
      className="absolute inset-0"
      style={{ opacity: meshOpacity }}
    >
      <Svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {SYNAPSES.map((synapse, index) => (
          <Line
            key={`synapse-${index}`}
            x1={synapse.from.x}
            y1={synapse.from.y}
            x2={synapse.to.x}
            y2={synapse.to.y}
            stroke={index % 3 === 0 ? NEURAL.cyan : NEURAL.violet}
            strokeWidth={0.08 + synapse.weight * 0.12}
            strokeOpacity={0.25 + synapse.weight * 0.35}
            strokeDasharray={isWeb ? "1.2 1.8" : undefined}
          />
        ))}
        {[...INPUT_NEURONS, ...HIDDEN_NEURONS, ...OUTPUT_NEURONS].map(
          (node, index) => (
            <Circle
              key={`core-${index}`}
              cx={node.x}
              cy={node.y}
              r={index < 4 ? 0.65 : index < 9 ? 0.75 : 0.7}
              fill={NEURAL.canvas}
              stroke={
                index < 4
                  ? NEURAL.cyan
                  : index < 9
                    ? NEURAL.violet
                    : NEURAL.positive
              }
              strokeWidth={0.22}
              fillOpacity={0.55}
            />
          ),
        )}
      </Svg>

      {INPUT_NEURONS.map((node, index) => (
        <NeuronNode
          key={`in-${index}`}
          cx={node.x}
          cy={node.y}
          layer="input"
          index={index}
        />
      ))}
      {HIDDEN_NEURONS.map((node, index) => (
        <NeuronNode
          key={`hid-${index}`}
          cx={node.x}
          cy={node.y}
          layer="hidden"
          index={index}
        />
      ))}
      {OUTPUT_NEURONS.map((node, index) => (
        <NeuronNode
          key={`out-${index}`}
          cx={node.x}
          cy={node.y}
          layer="output"
          index={index}
        />
      ))}
    </Animated.View>
  );
}

function TokenStreamChip({
  leftPercent,
  delay,
  duration,
  labelIndex,
}: {
  leftPercent: number;
  delay: number;
  duration: number;
  labelIndex: number;
}) {
  const progress = useRef(new Animated.Value(0)).current;
  const label = TOKEN_LABELS[labelIndex % TOKEN_LABELS.length];

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(progress, {
          toValue: 1,
          duration,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(progress, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [progress, delay, duration]);

  const translateY = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [80, -120],
  });
  const opacity = progress.interpolate({
    inputRange: [0, 0.12, 0.75, 1],
    outputRange: [0, 0.85, 0.7, 0],
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: "absolute",
        left: `${leftPercent}%`,
        bottom: 0,
        opacity,
        transform: [{ translateY }],
      }}
    >
      <View
        className="rounded-md px-2 py-1.5 border"
        style={{
          backgroundColor: `${NEURAL.tile}cc`,
          borderColor: `${NEURAL.cyan}55`,
          minWidth: 52,
        }}
      >
        <View className="flex-row items-center gap-1 mb-1">
          <View
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: NEURAL.violet }}
          />
          <View
            className="h-[3px] rounded-full flex-1"
            style={{ backgroundColor: `${NEURAL.cyan}88`, maxWidth: 28 }}
          />
        </View>
        {isWeb ? (
          <Text
            className="text-[9px] font-mono tracking-wider"
            style={{ color: NEURAL.cyan }}
          >
            {label}
          </Text>
        ) : (
          <View
            className="h-[3px] w-8 rounded-full"
            style={{ backgroundColor: NEURAL.textDim }}
          />
        )}
        <View className="flex-row gap-0.5 mt-1">
          {[0.6, 1, 0.45, 0.8].map((h, i) => (
            <View
              key={i}
              className="w-[3px] rounded-full"
              style={{
                height: 4 + h * 6,
                backgroundColor: `${NEURAL.violet}99`,
              }}
            />
          ))}
        </View>
      </View>
    </Animated.View>
  );
}

function EmbeddingVector({
  leftPercent,
  topPercent,
  delay,
  duration,
}: {
  leftPercent: number;
  topPercent: number;
  delay: number;
  duration: number;
}) {
  const drift = useRef(new Animated.Value(0)).current;
  const heights = useMemo(() => [0.5, 0.85, 0.4, 0.7, 0.55], []);

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(drift, {
          toValue: 1,
          duration,
          delay,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(drift, {
          toValue: 0,
          duration,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [drift, delay, duration]);

  const translateY = drift.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -18],
  });
  const opacity = drift.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.25, 0.75, 0.25],
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: "absolute",
        left: `${leftPercent}%`,
        top: `${topPercent}%`,
        opacity,
        transform: [{ translateY }],
      }}
    >
      <View
        className="flex-row items-end gap-[2px] px-1 py-1 rounded border"
        style={{ borderColor: `${NEURAL.cyan}33` }}
      >
        {heights.map((h, i) => (
          <View
            key={i}
            className="w-[2px] rounded-full"
            style={{
              height: 6 + h * 10,
              backgroundColor: i % 2 === 0 ? NEURAL.cyan : NEURAL.violet,
            }}
          />
        ))}
      </View>
    </Animated.View>
  );
}

function InferenceScan() {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(progress, {
        toValue: 1,
        duration: 7500,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [progress]);

  const translateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["-8%", "108%"],
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: "absolute",
        top: 0,
        bottom: 0,
        width: 180,
        opacity: 0.5,
        transform: [{ translateX }],
      }}
    >
      <View
        className="w-full h-full"
        style={
          isWeb
            ? ({
                backgroundImage: `linear-gradient(90deg, transparent, ${NEURAL.cyan}44, ${NEURAL.violet}55, transparent)`,
              } as object)
            : { backgroundColor: `${NEURAL.violet}22` }
        }
      />
      {isWeb ? (
        <Svg
          width="100%"
          height="100%"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={{ position: "absolute", inset: 0 }}
        >
          {[18, 38, 58, 78].map((y) => (
            <Rect
              key={y}
              x={42}
              y={y}
              width={16}
              height={1.2}
              fill={NEURAL.cyan}
              fillOpacity={0.35}
            />
          ))}
        </Svg>
      ) : null}
    </Animated.View>
  );
}

type AmbientOrbProps = {
  className: string;
  color: string;
  amplitude: number;
  amplitudeX?: number;
  pulseScale?: number;
  duration: number;
  delay?: number;
};

function ComputeGlowOrb({
  className,
  color,
  amplitude,
  amplitudeX = 0,
  pulseScale = 0.08,
  duration,
  delay = 0,
}: AmbientOrbProps) {
  return (
    <FloatingOrb
      className={className}
      style={{
        ...webBlurStyle(ORB_BLUR),
        backgroundColor: color,
      }}
      amplitude={amplitude}
      amplitudeX={amplitudeX}
      pulseScale={pulseScale}
      duration={duration}
      delay={delay}
    />
  );
}

export function NeuralAnimatedBackground() {
  return <NeuralStaticBackground />;
}
