import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated, Dimensions } from "react-native";

const SCREEN_WIDTH = Dimensions.get("window").width;

export default function LoadPollSkeleton({ colors }: any) {
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(shimmer, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      })
    ).start();
  }, []);
  

  const translateX = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [-SCREEN_WIDTH, SCREEN_WIDTH],
  });

  const Shimmer = ({ style }: any) => (
    <View style={[styles.skeleton, style]}>
      <Animated.View
        style={[
          styles.shimmer,
          {
            transform: [{ translateX }],
          },
        ]}
      />
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <Shimmer style={{ width: 24, height: 24, borderRadius: 12 }} />
        <Shimmer style={{ width: 120, height: 20, borderRadius: 6 }} />
        <View style={{ width: 24 }} />
      </View>

      {/* Poll Card */}
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Shimmer style={{ width: 90, height: 24, borderRadius: 20 }} />
        <Shimmer style={{ height: 26, marginTop: 16 }} />
        <Shimmer style={{ height: 20, width: "80%", marginTop: 10 }} />

        <View style={styles.statsRow}>
          <Shimmer style={{ width: 100, height: 16 }} />
          <Shimmer style={{ width: 80, height: 16 }} />
        </View>
      </View>

      {/* Voting Buttons */}
      <View style={styles.section}>
        <Shimmer style={{ width: 140, height: 18 }} />
        <Shimmer style={{ height: 54, borderRadius: 14, marginTop: 16 }} />
        <Shimmer style={{ height: 54, borderRadius: 14, marginTop: 12 }} />
        <Shimmer style={{ height: 52, borderRadius: 14, marginTop: 20 }} />
      </View>

      {/* Results */}
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Shimmer style={{ width: 160, height: 18 }} />

        {[1, 2].map((_, i) => (
          <View key={i} style={{ marginTop: 18 }}>
            <View style={styles.resultHeader}>
              <Shimmer style={{ width: 40, height: 14 }} />
              <Shimmer style={{ width: 40, height: 14 }} />
            </View>
            <Shimmer style={{ height: 10, borderRadius: 6, marginTop: 8 }} />
            <Shimmer style={{ width: 80, height: 12, marginTop: 6 }} />
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  card: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 20,
  },
  section: {
    marginHorizontal: 16,
    marginTop: 24,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 18,
  },
  resultHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  skeleton: {
    backgroundColor: "#e5e7eb",
    overflow: "hidden",
  },
  shimmer: {
    position: "absolute",
    left: 0,
    top: 0,
    height: "100%",
    width: "60%",
    backgroundColor: "rgba(255,255,255,0.4)",
  },
});
