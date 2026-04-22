import React, { useEffect, useState } from "react";
import { Stack } from "expo-router";
import Toast from "react-native-toast-message";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider } from "react-redux";
import { store } from "@/store";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { acceptCompliance } from "@/store/slices/complianceSlice";
import { setTokens, setUser } from "@/store/slices/authSlice";
import "../lib/utils/notifications";

import { registerDeviceForPush } from "../lib/utils/push";
import { apiEndpoint } from "@/lib/config/api";
import { getDeviceId } from "@/lib/utils/deviceId";

import { View, ActivityIndicator } from "react-native";

function AppShell() {
  const dispatch = useAppDispatch();
  const complianceAccepted = useAppSelector((s) => s.compliance.complianceAccepted);
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);

  const [ready, setReady] = useState(false);
  const [pushRegistered, setPushRegistered] = useState(false);

  useEffect(() => {
    const init = async () => {
      // Hydrate compliance state FIRST
      const age = await AsyncStorage.getItem("age_confirmed");
      const terms = await AsyncStorage.getItem("terms_accepted");
      if (age === "true" && terms === "true") {
        dispatch(acceptCompliance());
      }

      // Hydrate auth state ONLY after compliance is checked
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        dispatch(setUser(parsed));

        const storedTokens = await AsyncStorage.getItem("auth_tokens");
        if (storedTokens) {
          dispatch(setTokens(JSON.parse(storedTokens)));
        }
      }

      setReady(true);
    };

    init();
  }, [dispatch]);

  useEffect(() => {
    if (!complianceAccepted || pushRegistered) return;

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
  }, [complianceAccepted, pushRegistered]);

  if (!ready) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          // Auth screens - shown first
          <Stack.Screen name="(auth)" />
        ) : !complianceAccepted ? (
          // Compliance gate - after auth
          <Stack.Screen name="(compliance)" />
        ) : (
          // Main app - if authenticated and compliance accepted
          <>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="poll/[id]" />
          </>
        )}

        <Stack.Screen name="+not-found" />
      </Stack>

      <Toast />
      <StatusBar style="auto" />
    </GestureHandlerRootView>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <AppShell />
    </Provider>
  );
}
