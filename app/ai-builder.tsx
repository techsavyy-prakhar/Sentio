import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { Sparkles } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { POLL_CATEGORIES } from "@/lib/constants/categories";
import Animated, { FadeIn } from "react-native-reanimated";
import { apiEndpoint } from "@/lib/config/api";
import ThemeSkeleton from "@/components/ThemeSkeleton";
import PollSkeleton from "@/components/PollSkeleton";
import { useLocalSearchParams } from "expo-router";



type Theme = {
  theme: string;
  description: string;
};

type Poll = {
  question: string;
  description: string;
  categories: string[];
};

export default function AIChatScreen() {
  const [step, setStep] = useState(1);

  const [category, setCategory] = useState("");
  const [themes, setThemes] = useState<Theme[]>([]);
  const [polls, setPolls] = useState<Poll[]>([]);
  const [selectedPoll, setSelectedPoll] = useState<Poll | null>(null);

  const [loading, setLoading] = useState(false);
  const [loadingStep2, setLoadingStep2] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState("");



  const fetchThemes = async (category: string) => {
    try {
      setLoadingStep2(true);

      const res = await fetch(apiEndpoint("/ai/themes/"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category }),
      });

      const data = await res.json();
      setThemes(data.themes || []);
    } catch (e) {
      console.log("Theme error", e);
    } finally {
      setLoadingStep2(false);
    }
  };

  const fetchPolls = async (theme: string) => {
    try {
      setLoading(true);

      const res = await fetch(apiEndpoint("/ai/polls/"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          theme,
        }),
      });

      const data = await res.json();
      setPolls(data.polls || []);
    } catch (e) {
      console.log("Poll error", e);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- HANDLERS ---------------- */

  const handleCategory = async (cat: string) => {
    setCategory(cat);
    setStep(2);
    await fetchThemes(cat);
  };

  const handleTheme = async (theme: string) => {
    setStep(3);
    setSelectedTheme(theme);
    await fetchPolls(theme);
  };

  const useSelectedPoll = () => {
    if (!selectedPoll) return;

    router.replace({
      pathname: "/create",
      params: {
        question: selectedPoll.question,
        description: selectedPoll.description,
        categories: category ? [category] : [],
      },
    });
  };

  /* ---------------- UI ---------------- */

  return (
    <LinearGradient
      colors={["#0F172A", "#1E1B4B", "#6D28D9"]}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>AI Poll Builder</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>
          <Animated.View entering={FadeIn} style={styles.aiBubble}>
            <Sparkles size={18} color="#A78BFA" />
            <Text style={styles.aiText}>
              Tell me what category you’re interested in
            </Text>
          </Animated.View>

          {/* STEP 1 CATEGORY */}
          {step === 1 && (
            <View style={styles.chipWrap}>
              {POLL_CATEGORIES.slice(1).map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={styles.chip}
                  onPress={() => handleCategory(cat)}
                >
                  <Text style={styles.chipText}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {step >= 2 && (
            <View style={styles.userBubble}>
              <Text style={styles.userText}>{category}</Text>
            </View>
          )}
          {step >= 2 && (
            <>
              <Animated.View entering={FadeIn} style={styles.aiBubble}>
                <Sparkles size={18} color="#A78BFA" />
                <Text style={styles.aiText}>Here are trending themes</Text>
              </Animated.View>

              {loadingStep2 && (
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {[1, 2, 3].map((i) => (
                    <ThemeSkeleton key={i} />
                  ))}
                </ScrollView>
              )}
            </>
          )}

          {step === 2 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingVertical: 4 }}
            >
              {themes.map((item) => (
                <TouchableOpacity
                  key={item.theme}
                  style={[styles.pollCard, { marginRight: 12, width: 260 }]}
                  onPress={() => handleTheme(item.theme)}
                >
                  <Text style={styles.pollQuestion}>{item.theme}</Text>
                  <Text style={styles.pollDesc}>{item.description}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
          {step >= 3 && (
            <View style={styles.userBubble}>
              <Text style={styles.userText}>{selectedTheme}</Text>
            </View>
          )}

          {step >= 3 && (
            <>
              <Animated.View entering={FadeIn} style={styles.aiBubble}>
                <Sparkles size={18} color="#A78BFA" />
                <Text style={styles.aiText}>Here are some poll ideas</Text>
              </Animated.View>

              {loading && (
                <ScrollView showsVerticalScrollIndicator={false}>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <PollSkeleton key={i} />
                  ))}
                </ScrollView>
              )}
            </>
          )}

          {step === 3 &&
            polls.map((poll) => {
              const isSelected = selectedPoll?.question === poll.question;

              return (
                <TouchableOpacity
                  key={poll.question}
                  style={[styles.pollCard, isSelected && styles.selectedCard]}
                  onPress={() => setSelectedPoll(poll)}
                >
                  <Text style={styles.pollQuestion}>{poll.question}</Text>
                  <Text style={styles.pollDesc}>{poll.description}</Text>
                </TouchableOpacity>
              );
            })}
        </ScrollView>

        <View style={styles.bottomBar}>
          <TouchableOpacity
            disabled={!selectedPoll}
            onPress={useSelectedPoll}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={selectedPoll ? ["#A78BFA", "#22D3EE"] : ["#444", "#444"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.useButton, !selectedPoll && { opacity: 0.4 }]}
            >
              <Text style={styles.useButtonText}>Use This Poll</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: { flex: 1 },

  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  backText: { color: "#A78BFA", fontWeight: "600" },

  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
  },

  aiBubble: {
    padding: 16,
    borderRadius: 20,
    marginBottom: 20,
    backgroundColor: "rgba(255,255,255,0.08)",
    flexDirection: "row",
    gap: 10,
  },

  aiText: { color: "#fff" },

  chipWrap: { flexDirection: "row", flexWrap: "wrap", gap: 10 },

  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.08)",
  },

  chipText: { color: "#fff" },

  userBubble: {
    alignSelf: "flex-end",
    backgroundColor: "#7C3AED",
    padding: 14,
    borderRadius: 18,
    marginBottom: 14,
  },

  userText: { color: "#fff", fontWeight: "600" },

  pollCard: {
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    backgroundColor: "rgba(255,255,255,0.06)",
  },

  selectedCard: { borderColor: "#A78BFA", borderWidth: 1 },

  pollQuestion: { fontWeight: "700", color: "#fff" },

  pollDesc: { color: "#CBD5E1", marginTop: 6 },

  bottomBar: { padding: 16, marginHorizontal: 10, marginBottom: 12 },

  useButton: {
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#A78BFA",
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },

  useButtonText: { color: "#fff", fontWeight: "700" },
});
