import React, { useEffect, useState } from "react";
import { Stack } from "expo-router";
import Toast from "react-native-toast-message";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ComplianceGate from "../components/ComplianceGate";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "../lib/utils/notifications";

import { registerDeviceForPush } from "../lib/utils/push";
import { apiEndpoint } from "@/lib/config/api";
import { getDeviceId } from "@/lib/utils/deviceId";

import { View, ActivityIndicator } from "react-native";

export default function RootLayout() {
  const [ready, setReady] = useState(false);
  const [allowed, setAllowed] = useState(false);
  const [pushRegistered, setPushRegistered] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null); // 👈 NEW

  useEffect(() => {
    const init = async () => {
      const age = await AsyncStorage.getItem("age_confirmed");
      const terms = await AsyncStorage.getItem("terms_accepted");

      const user = await AsyncStorage.getItem("user"); // 👈 NEW

      setAllowed(age === "true" && terms === "true");
      setIsLoggedIn(!!user); // 👈 NEW

      setReady(true);
    };

    init();
  }, []);

  useEffect(() => {
    if (!allowed || pushRegistered) return;

    const register = async () => {
      try {
        const data = await registerDeviceForPush();
        if (!data?.expoPushToken) return;

        const deviceId = await getDeviceId();

        const response = await fetch(apiEndpoint("/register-device/"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            device_id: deviceId,
            push_token: data.expoPushToken,
          }),
        });

        if (!response.ok) {
          console.error("Failed to register device for push");
          return;
        }

        setPushRegistered(true);
      } catch (err) {
        console.error("Push registration error", err);
      }
    };

    register();
  }, [allowed, pushRegistered]);

  // ⏳ Wait for everything
  if (!ready || isLoggedIn === null) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  // 🚫 Compliance gate FIRST
  if (!allowed) {
    return <ComplianceGate onAccepted={() => setAllowed(true)} />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        {isLoggedIn ? (
          <>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="poll/[id]" />
          </>
        ) : (
          <Stack.Screen name="(auth)" /> // 👈 LOGIN FLOW
        )}

        <Stack.Screen name="+not-found" />
      </Stack>

      <Toast />
      <StatusBar style="auto" />
    </GestureHandlerRootView>
  );
}