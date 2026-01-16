import React, { useRef } from "react";
import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  ScrollView,
  Animated,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ArrowLeft, CheckCircle, TrendingUp, Users } from "lucide-react-native";
import { type Poll } from "@/lib/types";
import { getDeviceId } from "../../lib/utils/deviceId";
import { apiEndpoint } from "@/lib/config/api";
import LoadPollSkeleton from "../../components/LoadPollSkeleton";

export default function PollDetailScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [selectedVote, setSelectedVote] = useState<"yes" | "no" | null>(null);
  const { id, hasVoted } = useLocalSearchParams<{
    id: string;
    hasVoted?: string;
  }>();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const yesScale = useRef(new Animated.Value(1)).current;
  const noScale = useRef(new Animated.Value(1)).current;
  const [poll, setPoll] = useState<
    (Poll & { yes_votes: number; no_votes: number; total_votes: number }) | null
  >(null);

  const colors = {
    background: isDark ? "#0a0a0a" : "#f5f7fa",
    card: isDark ? "#1a1a1a" : "#ffffff",
    text: isDark ? "#ffffff" : "#1f2937",
    subtext: isDark ? "#9ca3af" : "#6b7280",
    border: isDark ? "#2a2a2a" : "#e5e7eb",
    primary: isDark ? "#3b82f6" : "#2563eb",
    yesColor: "#10b981",
    noColor: "#ef4444",
    yesLight: isDark ? "#10b98120" : "#10b98110",
    noLight: isDark ? "#ef444420" : "#ef444410",
  };

  useEffect(() => {
    fetchPoll();
  }, [id]);

  const fetchPoll = async () => {
    try {
      setLoading(true);

      const response = await fetch(apiEndpoint(`/polls/${id}/`));

      if (!response.ok) {
        throw new Error("Failed to fetch poll");
      }

      const pollData = await response.json();

      setPoll({
        id: pollData.id,
        question: pollData.question,
        description: pollData.description,
        created_at: pollData.created_at,
        updated_at: pollData.updated_at,
        is_active: pollData.is_active,
        yes_votes: pollData.yes_votes,
        no_votes: pollData.no_votes,
        total_votes: pollData.total_votes,
      });
    } catch (error) {
      console.error("Error fetching poll:", error);
      setPoll(null);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = (vote: "yes" | "no") => {
    setSelectedVote(vote);

    const anim = vote === "yes" ? yesScale : noScale;

    Animated.sequence([
      Animated.timing(anim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(anim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const submitVote = async () => {
    if (!selectedVote) return;

    const deviceId = await getDeviceId();

    try {
      setSubmitting(true);

      const response = await fetch(apiEndpoint(`/polls/${id}/vote/`), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          vote_value: selectedVote === "yes",
          device_id: deviceId,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error?.detail || "Voting failed");
      }

      router.replace("/");
    } catch (err) {
      console.error("Voting failed:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadPollSkeleton colors={colors} />;
  }

  if (!poll) {
    return (
      <View
        style={[
          styles.container,
          styles.centerContent,
          { backgroundColor: colors.background },
        ]}
      >
        <Text style={{ color: colors.text }}>Failed to load poll</Text>
      </View>
    );
  }

  const yesPercentage =
    poll.total_votes > 0 ? (poll.yes_votes / poll.total_votes) * 100 : 0;
  const noPercentage =
    poll.total_votes > 0 ? (poll.no_votes / poll.total_votes) * 100 : 0;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Poll Details
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.pollCard, { backgroundColor: colors.card }]}>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: `${colors.primary}20` },
            ]}
          >
            <CheckCircle size={16} color={colors.primary} />
            <Text style={[styles.statusText, { color: colors.primary }]}>
              {poll.is_active ? "Active Poll" : "Closed Poll"}
            </Text>
          </View>

          <Text style={[styles.question, { color: colors.text }]}>
            {poll.question}
          </Text>

          {poll.description && (
            <Text style={[styles.description, { color: colors.subtext }]}>
              {poll.description}
            </Text>
          )}

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Users size={18} color={colors.primary} />
              <Text style={[styles.statText, { color: colors.subtext }]}>
                {poll?.total_votes?.toLocaleString()} votes
              </Text>
            </View>
            <View style={styles.statItem}>
              <TrendingUp size={18} color={colors.primary} />
              <Text style={[styles.statText, { color: colors.subtext }]}>
                Trending
              </Text>
            </View>
          </View>
        </View>

        {hasVoted == "false" && poll.is_active ? (
          <View style={styles.votingSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Cast Your Vote
            </Text>

            <Animated.View style={{ transform: [{ scale: yesScale }] }}>
              <TouchableOpacity
                onPress={() => handleVote("yes")}
                activeOpacity={0.9}
                style={[
                  styles.voteButton,
                  {
                    backgroundColor:
                      selectedVote === "yes"
                        ? colors.yesColor
                        : colors.yesLight,
                    borderColor: colors.yesColor,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.voteButtonText,
                    {
                      color: selectedVote === "yes" ? "#fff" : colors.yesColor,
                    },
                  ]}
                >
                  Yes
                </Text>
              </TouchableOpacity>
            </Animated.View>

            <Animated.View style={{ transform: [{ scale: noScale }] }}>
              <TouchableOpacity
                onPress={() => handleVote("no")}
                activeOpacity={0.9}
                style={[
                  styles.voteButton,
                  {
                    backgroundColor:
                      selectedVote === "no" ? colors.noColor : colors.noLight,
                    borderColor: colors.noColor,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.voteButtonText,
                    {
                      color: selectedVote === "no" ? "#fff" : colors.noColor,
                    },
                  ]}
                >
                  No
                </Text>
              </TouchableOpacity>
            </Animated.View>

            <TouchableOpacity
              style={[
                styles.submitButton,
                {
                  backgroundColor: selectedVote
                    ? colors.primary
                    : colors.border,
                },
              ]}
              onPress={submitVote}
              disabled={!selectedVote || submitting}
              activeOpacity={0.8}
            >
              {submitting ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text
                  style={[
                    styles.submitButtonText,
                    { color: selectedVote ? "#ffffff" : colors.subtext },
                  ]}
                >
                  Submit Vote
                </Text>
              )}
            </TouchableOpacity>
          </View>
        ) : null}

        <View style={[styles.resultsCard, { backgroundColor: colors.card }]}>
          {hasVoted == "true" && (
            <>
              <View style={styles.successBadge}>
                <CheckCircle size={48} color={colors.yesColor} />
                <Text style={[styles.successText, { color: colors.text }]}>
                  Vote Submitted!
                </Text>
                <Text
                  style={[styles.successSubtext, { color: colors.subtext }]}
                >
                  Thank you for participating
                </Text>
              </View>
              <View
                style={[styles.divider, { backgroundColor: colors.border }]}
              />
            </>
          )}

          <Text style={[styles.resultsTitle, { color: colors.text }]}>
            Current Results
          </Text>

          <View style={styles.resultItem}>
            <View style={styles.resultHeader}>
              <Text style={[styles.resultLabel, { color: colors.text }]}>
                Yes
              </Text>
              <Text style={[styles.resultPercentage, { color: colors.text }]}>
                {yesPercentage.toFixed(1)}%
              </Text>
            </View>
            <View
              style={[styles.progressBar, { backgroundColor: colors.yesLight }]}
            >
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${yesPercentage}%`,
                    backgroundColor: colors.yesColor,
                  },
                ]}
              />
            </View>
            <Text style={[styles.voteCount, { color: colors.subtext }]}>
              {poll?.yes_votes?.toLocaleString()} votes
            </Text>
          </View>

          <View style={styles.resultItem}>
            <View style={styles.resultHeader}>
              <Text style={[styles.resultLabel, { color: colors.text }]}>
                No
              </Text>
              <Text style={[styles.resultPercentage, { color: colors.text }]}>
                {noPercentage.toFixed(1)}%
              </Text>
            </View>
            <View
              style={[styles.progressBar, { backgroundColor: colors.noLight }]}
            >
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${noPercentage}%`,
                    backgroundColor: colors.noColor,
                  },
                ]}
              />
            </View>
            <Text style={[styles.voteCount, { color: colors.subtext }]}>
              {poll?.no_votes?.toLocaleString()} votes
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  pollCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
    alignSelf: "flex-start",
    marginBottom: 16,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "600",
  },
  question: {
    fontSize: 24,
    fontWeight: "700",
    lineHeight: 32,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: "row",
    gap: 20,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statText: {
    fontSize: 14,
    fontWeight: "500",
  },
  votingSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
  },
  voteButton: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  voteButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  radioCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  voteButtonText: {
    fontSize: 18,
    fontWeight: "600",
  },
  submitButton: {
    borderRadius: 12,
    padding: 18,
    alignItems: "center",
    marginTop: 8,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "700",
  },
  resultsCard: {
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  successBadge: {
    alignItems: "center",
    marginBottom: 24,
  },
  successText: {
    fontSize: 24,
    fontWeight: "700",
    marginTop: 12,
  },
  successSubtext: {
    fontSize: 16,
    marginTop: 4,
  },
  divider: {
    height: 1,
    marginBottom: 24,
  },
  resultsTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 20,
  },
  resultItem: {
    marginBottom: 20,
  },
  resultHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  resultLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
  resultPercentage: {
    fontSize: 20,
    fontWeight: "700",
  },
  progressBar: {
    height: 12,
    borderRadius: 6,
    overflow: "hidden",
    marginBottom: 6,
  },
  progressFill: {
    height: "100%",
    borderRadius: 6,
  },
  voteCount: {
    fontSize: 14,
  },
});
