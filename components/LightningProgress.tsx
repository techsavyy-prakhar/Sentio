import React, { useEffect, useState } from "react";
import { View, StyleSheet, LayoutChangeEvent } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  Easing,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

const AnimatedGradient = Animated.createAnimatedComponent(LinearGradient);
const LIGHTNING_WIDTH = 120;
type LightningProgressProps = {
  percentage: number; // yes OR no
  colors: {
    light: string;
    solid: string;
  };
};

export default function LightningProgress({
  percentage,
  colors,
}: LightningProgressProps) {
  const [barWidth, setBarWidth] = useState<number | null>(null);

  const progress = useSharedValue(0);
  const sweep = useSharedValue(0);

  // Fill animation
  useEffect(() => {
    progress.value = withTiming(percentage, {
      duration: 1000,
      easing: Easing.out(Easing.cubic),
    });
  }, [percentage]);

  // Lightning animation
  useEffect(() => {
    if (!barWidth || percentage <= 0) return;

    sweep.value = 0;
    sweep.value = withRepeat(
      withTiming(1, {
        duration: 1800,
        easing: Easing.out(Easing.cubic),
      }),
      -1,
      false
    );
  }, [barWidth, percentage]);

  const fillStyle = useAnimatedStyle(() => ({
    width: `${progress.value}%`,
  }));

  const lightningStyle = useAnimatedStyle(() => {
    if (!barWidth || progress.value <= 0) return { opacity: 0 };

    const filledWidth = (progress.value / 100) * barWidth;
    const startX = -LIGHTNING_WIDTH;
    const endX = filledWidth;

    return {
      transform: [
        {
          translateX: startX + sweep.value * (endX - startX),
        },
      ],
      opacity: 1,
    };
  });

  return (
    <View
      style={[styles.progressBar, { backgroundColor: colors.light }]}
      onLayout={(e: LayoutChangeEvent) =>
        setBarWidth(e.nativeEvent.layout.width)
      }
    >
      <Animated.View
        style={[
          styles.progressFill,
          { backgroundColor: colors.solid },
          fillStyle,
        ]}
      >
        <AnimatedGradient
          colors={[
            "rgba(255,255,255,0.3)",
            "rgba(255,255,255,0.3)",
            "rgba(255,255,255,0.3)",
            "rgba(255,255,255,0.3)",
            "rgba(255,255,255,0.3)",
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.lightning, lightningStyle]}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  progressBar: {
    height: 12,
    borderRadius: 6,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    overflow: "hidden",
  },
  lightning: {
    position: "absolute",
    height: "100%",
    width: LIGHTNING_WIDTH,
  },
});
