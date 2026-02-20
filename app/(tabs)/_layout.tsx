import { Tabs } from "expo-router";
import { BarChart3, PlusCircle } from "lucide-react-native";
import { Pressable, useColorScheme, TouchableOpacity } from "react-native";
import type { BottomTabBarButtonProps } from "@react-navigation/bottom-tabs";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const colors = {
    primary: isDark ? "#3b82f6" : "#2563eb",
    inactive: isDark ? "#6b7280" : "#9ca3af",
    tabBar: isDark ? "#1a1a1a" : "#f8f9fa",
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.inactive,
        tabBarStyle: {
          backgroundColor: colors.tabBar,
          borderTopWidth: 1,
          borderTopColor: isDark ? "#2a2a2a" : "#e5e7eb",
          height: 80,
        },

        tabBarButton: (props: BottomTabBarButtonProps) => (
          <TouchableOpacity
            onPress={props.onPress}
            accessibilityState={props.accessibilityState}
            accessibilityLabel={props.accessibilityLabel}
            testID={props.testID}
            style={props.style}
            hitSlop={{ top: 30, bottom: 30, left: 30, right: 30 }}
            activeOpacity={0.7}
          >
            {props.children}
          </TouchableOpacity>
        ),

        tabBarItemStyle: {
          justifyContent: "center",
          alignItems: "center",
          paddingVertical: 8,
        },

        tabBarIconStyle: {
          marginBottom: 2,
        },

        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Polls",
          tabBarItemStyle: {
            borderRightWidth: 2,
            borderRightColor: isDark ? "#2a2a2a" : "#e5e7eb",
            marginTop: 8,
          },

          tabBarIcon: ({ size, color }) => (
            <BarChart3 size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="create"
        options={{
          title: "Create",
          tabBarIcon: ({ size, color }) => (
            <PlusCircle size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
