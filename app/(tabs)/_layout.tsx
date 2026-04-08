import { Tabs } from "expo-router";
import {
  BarChart3,
  Newspaper,
  Plus,
  User,
} from "lucide-react-native";
import {
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import type { BottomTabBarButtonProps } from "@react-navigation/bottom-tabs";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const colors = {
    primary: isDark ? "#3b82f6" : "#2563eb",
    inactive: isDark ? "#6b7280" : "#9ca3af",
    tabBar: isDark ? "#1a1a1a" : "#f8f9fa",
    border: isDark ? "#2a2a2a" : "#e5e7eb",
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.inactive,
        tabBarStyle: {
          backgroundColor: colors.tabBar,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 80,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
      }}
    >
      {/* POLLS */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Polls",
          tabBarIcon: ({ color, size }) => (
            <BarChart3 size={size} color={color} />
          ),
        }}
      />

      {/* NEWS */}
      <Tabs.Screen
        name="news"
        options={{
          title: "News",
          tabBarIcon: ({ color, size }) => (
            <Newspaper size={size} color={color} />
          ),
        }}
      />

      {/* CENTER + BUTTON */}
      {/* <Tabs.Screen
        name="create"
        options={{
          title: "",
          tabBarButton: (props) => (
            <CenterCreateButton {...props} color={colors.primary} />
          ),
        }}
      /> */}

      {/* PROFILE */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <User size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

/* ---------- CENTER BUTTON ---------- */
function CenterCreateButton({
  onPress,
  color,
}: BottomTabBarButtonProps & { color: string }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={{
        top: -25,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View
        style={{
          width: 64,
          height: 64,
          borderRadius: 32,
          backgroundColor: color,
          justifyContent: "center",
          alignItems: "center",
          elevation: 6,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 6,
        }}
      >
        <Plus size={32} color="#fff" />
      </View>
    </TouchableOpacity>
  );
}