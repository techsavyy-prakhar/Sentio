import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import Splash from './splash';
import Toast from 'react-native-toast-message';
import { StatusBar } from 'expo-status-bar';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    async function prepare() {
      await new Promise(resolve => setTimeout(resolve, 2500));
      setShowSplash(false);
      await SplashScreen.hideAsync();
    }

    prepare();
  }, []);

  if (showSplash) {
    return <Splash />;
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="poll/[id]" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <Toast />
      <StatusBar style="auto" />
    </>
  );
}
