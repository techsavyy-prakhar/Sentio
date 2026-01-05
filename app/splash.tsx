import { View, Text, StyleSheet, Animated } from 'react-native';
import { useEffect, useRef } from 'react';
import { useColorScheme } from 'react-native';

export default function SplashScreen() {
  const scale = useRef(new Animated.Value(0.8)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const slideUp = useRef(new Animated.Value(20)).current;

  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.timing(slideUp, {
        toValue: 0,
        duration: 700,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDark ? '#0f172a' : '#f8fafc' },
      ]}
    >
      <Animated.Text
        style={[
          styles.logo,
          {
            color: isDark ? '#e5e7eb' : '#020617',
            transform: [{ scale }],
            opacity,
          },
        ]}
      >
        SENTIO
      </Animated.Text>

      <Animated.Text
        style={[
          styles.tagline,
          {
            color: isDark ? '#94a3b8' : '#475569',
            transform: [{ translateY: slideUp }],
            opacity,
          },
        ]}
      >
        Your voice matters
      </Animated.Text>

      {/* Poll bars animation */}
      <View style={styles.pollBars}>
        <Animated.View style={[styles.yesBar, { opacity }]} />
        <Animated.View style={[styles.noBar, { opacity }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    fontSize: 40,
    fontWeight: '800',
    letterSpacing: 2,
  },
  tagline: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  pollBars: {
    flexDirection: 'row',
    marginTop: 24,
    gap: 10,
  },
  yesBar: {
    width: 50,
    height: 6,
    backgroundColor: '#22c55e',
    borderRadius: 4,
  },
  noBar: {
    width: 30,
    height: 6,
    backgroundColor: '#ef4444',
    borderRadius: 4,
  },
});
