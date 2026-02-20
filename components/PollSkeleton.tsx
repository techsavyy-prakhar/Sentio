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

export default function PollSkeleton() {
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
      {/* QUESTION */}
      <View style={styles.questionSkeleton} />

      {/* DESCRIPTION */}
      <View style={styles.descSkeleton} />

      {/* CATEGORY BADGES */}
      <View style={styles.badgeRow}>
        <View style={styles.badgeSkeleton} />
        <View style={styles.badgeSkeleton} />
      </View>

      {/* SHIMMER OVERLAY */}
      <Animated.View style={[styles.shimmer, animatedStyle]} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    backgroundColor: "rgba(255,255,255,0.06)",
    overflow: "hidden",
  },

  questionSkeleton: {
    height: 18,
    width: "80%",
    borderRadius: 6,
    backgroundColor: "rgba(255,255,255,0.12)",
    marginBottom: 10,
  },

  descSkeleton: {
    height: 14,
    width: "65%",
    borderRadius: 6,
    backgroundColor: "rgba(255,255,255,0.08)",
    marginBottom: 16,
  },

  badgeRow: {
    flexDirection: "row",
  },

  badgeSkeleton: {
    height: 24,
    width: 70,
    borderRadius: 14,
    backgroundColor: "rgba(167,139,250,0.18)",
    marginRight: 8,
  },

  shimmer: {
    ...StyleSheet.absoluteFillObject,
    width: "40%",
    backgroundColor: "rgba(255,255,255,0.15)",
  },
});
