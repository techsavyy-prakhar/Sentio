import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");

export default function ThemeSkeleton() {
  const shimmer = useSharedValue(0);

  shimmer.value = withRepeat(withTiming(1, { duration: 1200 }), -1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: interpolate(shimmer.value, [0, 1], [-width, width]),
      },
    ],
  }));

  return (
    <View style={styles.card}>
      <Animated.View style={[styles.shimmer, animatedStyle]} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 260,
    height: 175,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.08)",
    marginRight: 12,
    overflow: "hidden",
  },

  shimmer: {
    ...StyleSheet.absoluteFillObject,
    width: "40%",
    backgroundColor: "rgba(255,255,255,0.15)",
  },
});
