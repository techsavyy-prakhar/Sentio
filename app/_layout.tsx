import React, { useEffect, useState } from "react";
import { Stack } from "expo-router";
import Toast from "react-native-toast-message";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ComplianceGate from "../components/ComplianceGate";
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  const [ready, setReady] = useState(false);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const checkCompliance = async () => {
      const age = await AsyncStorage.getItem("age_confirmed");
      const terms = await AsyncStorage.getItem("terms_accepted");

      setAllowed(age === "true" && terms === "true");
      setReady(true);
    };

    checkCompliance();
  }, []);

  if (!ready) return null;

  if (!allowed) {
    return <ComplianceGate onAccepted={() => setAllowed(true)} />;
  }

  return (
    <GestureHandlerRootView>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="poll/[id]" />
        <Stack.Screen name="+not-found" />
      </Stack>

      <Toast />
      <StatusBar style="auto" />
    </GestureHandlerRootView>
  );
}
