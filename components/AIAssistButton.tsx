import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Pressable,
  ViewStyle,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

export default function AIAssistButton() {
  const BUTTON_WIDTH = 100;
  const BUTTON_HEIGHT = 40;

  const ripple1 = useRef(new Animated.Value(0)).current;
  const ripple2 = useRef(new Animated.Value(0)).current;
  const ripple3 = useRef(new Animated.Value(0)).current;

  const createRipple = (anim: Animated.Value, delay: number) => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(anim, {
          toValue: 1,
          duration: 2400,
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  useEffect(() => {
    createRipple(ripple1, 0);
    createRipple(ripple2, 700);
    createRipple(ripple3, 1400);
  }, []);

  const rippleStyle = (
    anim: Animated.Value,
    color: string
  ): Animated.WithAnimatedObject<ViewStyle> => ({
    width: BUTTON_WIDTH,
    height: BUTTON_HEIGHT,
    transform: [
      {
        scale: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.8],
        }),
      },
    ],
    opacity: anim.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0.4, 0.2, 0],
    }),
    backgroundColor: color,
    borderRadius: 40,
    position: "absolute" as "absolute",
  });

  return (
    <View style={styles.container}>
      {/* Ripple Layers */}
      <Animated.View style={rippleStyle(ripple1, "#4b3fd9")} />
      <Animated.View style={rippleStyle(ripple2, "#655afc")} />
      <Animated.View style={rippleStyle(ripple3, "#8e2de2")} />

      {/* Gradient Border */}
      <LinearGradient
        colors={["#655afc", "#8e2de2", "#ff00cc"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          padding: 1.5,
          borderRadius: 40,
        }}
      >
        <Pressable
          onPress={() => router.push("/ai-builder")}
          style={{
            width: BUTTON_WIDTH,
            height: BUTTON_HEIGHT,
            borderRadius: 40,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={styles.text}>✨ AI Assist</Text>
        </Pressable>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },

  text: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
});
