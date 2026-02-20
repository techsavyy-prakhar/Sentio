import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated } from "react-native";

const ActivePollBadge = ({ size = 10 }) => {
  const ripple1 = useRef(new Animated.Value(0)).current;
  const ripple2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animateRipple = (anim, delay) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      ).start();

    animateRipple(ripple1, 0);
    animateRipple(ripple2, 1000);
  }, []);

  const rippleStyle = (anim) => ({
    transform: [
      {
        scale: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 2.6],
        }),
      },
    ],
    opacity: anim.interpolate({
      inputRange: [0, 1],
      outputRange: [0.45, 0],
    }),
  });

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Animated.View
        style={[
          styles.ripple,
          { width: size, height: size, borderRadius: size / 2 },
          rippleStyle(ripple1),
        ]}
      />
      <Animated.View
        style={[
          styles.ripple,
          { width: size, height: size, borderRadius: size / 2 },
          rippleStyle(ripple2),
        ]}
      />

      {/* Main Green Circle */}
      <View
        style={[
          styles.core,
          { width: size, height: size, borderRadius: size / 2 },
        ]}
      />
    </View>
  );
};

export default ActivePollBadge;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  core: {
    backgroundColor: "#22c55e", // solid green
    position: "absolute",
  },
  ripple: {
    position: "absolute",
    backgroundColor: "rgba(34,197,94,0.3)", // light green ripple
  },
});
