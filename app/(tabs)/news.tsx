import { useMemo, useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { useRouter } from "expo-router";

import { CategorySelector } from "../../components/CategorySelecter";
import { TopicCard } from "@/components/TopicCard";
// import { BottomNavigation } from '@/components/BottomNavigation';

/* =====================
Types
===================== */
type Importance = "High" | "Medium";

type Topic = {
  id: string;
  title: string;
  summary: string;
  category: string;
  lastUpdated: string;
  importance: Importance;
  newUpdates?: number;
  isFollowing: boolean;
};

/* =====================
   Screen
===================== */
export default function TopicsListScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = {
    background: isDark ? "#0a0a0a" : "#f5f7fa",
    card: isDark ? "#1a1a1a" : "#ffffff",
    text: isDark ? "#ffffff" : "#1f2937",
    subtext: isDark ? "#9ca3af" : "#6b7280",
    border: isDark ? "#2a2a2a" : "#e5e7eb",
    active: isDark ? "#10b981" : "#059669",
    inactive: isDark ? "#ef4444" : "#dc2626",
    primary: isDark ? "#3b82f6" : "#2563eb",
    progressBg: isDark ? "#374151" : "#e5e7eb",
    yesColor: "#10b981",
    noColor: "#ef4444",
  };
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>("Economy");

  const [topics, setTopics] = useState<Topic[]>([
    {
      id: "semiconductor-mission-2024",
      title: "India's Semiconductor Mission 2024",
      summary:
        "₹76,000 crore investment commitments from global chipmakers for fab units in Gujarat and Assam",
      category: "Economy",
      lastUpdated: "6h ago",
      importance: "High",
      newUpdates: 2,
      isFollowing: false,
    },
    {
      id: "digital-rupee-pilot",
      title: "Digital Rupee Pilot Expansion",
      summary:
        "RBI extends CBDC trials to 15 cities, targeting 1 million users in retail segment",
      category: "Economy",
      lastUpdated: "12h ago",
      importance: "High",
      isFollowing: true,
    },
    {
      id: "gst-council-reforms",
      title: "GST Council Tax Reform Proposals",
      summary:
        "Council discusses rate rationalization and online gaming taxation framework changes",
      category: "Economy",
      lastUpdated: "1d ago",
      importance: "Medium",
      isFollowing: false,
    },
    {
      id: "inflation-targeting",
      title: "Inflation Targeting Framework Review",
      summary:
        "Government considers revising RBI's inflation mandate from current 2–6% band",
      category: "Economy",
      lastUpdated: "2d ago",
      importance: "High",
      newUpdates: 1,
      isFollowing: false,
    },
    {
      id: "startup-funding-winter",
      title: "Startup Funding Landscape 2026",
      summary:
        "Early-stage investments drop 40% YoY as global investors adopt cautious approach",
      category: "Economy",
      lastUpdated: "3d ago",
      importance: "Medium",
      isFollowing: true,
    },
  ]);

  const categories = [
    "Polity & Governance",
    "International Relations",
    "Economy",
    "Science & Technology",
    "Environment & Climate",
    "Security & Defence",
    "Social Issues",
  ];

  const filteredTopics = useMemo(
    () => topics.filter((t) => t.category === selectedCategory),
    [topics, selectedCategory]
  );

  const handleTopicPress = (topicId: string) => {
    // router.push(`/topic/${topicId}`);
  };

  const toggleFollow = (topicId: string) => {
    setTopics((prev) =>
      prev.map((topic) =>
        topic.id === topicId
          ? { ...topic, isFollowing: !topic.isFollowing }
          : topic
      )
    );
  };

  return (
    <View style={[styles.container, {}]}>
      <View style={[{ flexDirection: "row", justifyContent: "space-between" }]}>
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Current Affairs Vault
          </Text>
          <Text style={[styles.headerSubtitle, { color: colors.subtext }]}>
          Real-time updates on the topics that matter
          </Text>
        </View>
      </View>
      <CategorySelector
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      <ScrollView contentContainerStyle={styles.list}>
        {filteredTopics.map((topic) => (
          <TopicCard
            key={topic.id}
            topic={topic}
            onPress={() => handleTopicPress(topic.id)}
            onToggleFollow={() => toggleFollow(topic.id)}
          />
        ))}
      </ScrollView>

      {/* <BottomNavigation /> */}
    </View>
  );
}

/* =====================
   Styles
===================== */
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  list: {
    padding: 16,
    paddingBottom: 90, // space for bottom nav
    gap: 12,
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  contactUsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
  },
});
