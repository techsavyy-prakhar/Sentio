import { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import Toast from "react-native-toast-message";
import { apiEndpoint } from "@/lib/config/api";

import { router, useFocusEffect, useRouter } from "expo-router";
import { Clock, CheckCircle, TrendingUp, Contact } from "lucide-react-native";
import { type Poll } from "@/lib/types";
import { getDeviceId } from "../../lib/utils/deviceId";
import { TextInput } from "react-native";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import { Alert } from "react-native";
import { Eye, Flag, X } from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { contactUs } from "@/lib/utils/contactUs";
import CategoryChips from "@/components/CategoryChips";

export default function PollsScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [polls, setPolls] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [hiddenPolls, setHiddenPolls] = useState<string[]>([]);
  const [isNavigating, setIsNavigating] = useState(false);
  const [deviceId, setDeviceId] = useState<string>("");

  const [selectedCategory, setSelectedCategory] = useState(["All"]);
  const [hasNewPolls, setHasNewPolls] = useState(false);
  const [latestData, setLatestData] = useState<any[]>([]);

  const feedCache = useRef<Record<string, any[]>>({});
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
  const renderRightActions = (pollId: string, creatorDeviceId: string) => (
    <View
      style={{
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
        justifyContent: "center",
        height: "95%",
      }}
    >
      <TouchableOpacity
        onPress={() => handlePollHide(pollId)}
        style={styles.rightActionHide}
      >
        <Eye size={18} color="#fff" />
        <Text
          style={[styles.actionText, { fontSize: 10, textAlign: "center" }]}
        >
          Remove from feed{" "}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => handleReport(pollId, creatorDeviceId)}
        style={styles.rightActionReport}
      >
        <Flag size={18} color="#fff" />
        <Text style={styles.actionText}>Report</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => handleBlockUser(creatorDeviceId)}
        style={[styles.rightActionHide, { backgroundColor: "#F59E0B" }]}
      >
        <X size={18} color="#fff" />
        <Text
          style={[styles.actionText, { fontSize: 10, textAlign: "center" }]}
        >
          Block User
        </Text>
      </TouchableOpacity>
    </View>
  );
  const filteredPolls = polls.filter((poll) => {
    if (!searchQuery.trim()) return true;
    const queryWords = searchQuery.toLowerCase().split(/\s+/);
    const searchableText = (
      poll.question +
      " " +
      (poll.description ?? "")
    ).toLowerCase();
    return queryWords.some((word) => searchableText.includes(word));
  });

  const handleReport = async (pollId: string, creatorDeviceId: string) => {
    if (creatorDeviceId === deviceId) {
      Toast.show({
        type: "info",
        text1: "You can't report your own poll",
        text2: "This poll was created by you",
      });
      return;
    }

    Alert.alert(
      "Report Poll",
      "Why are you reporting this poll?",
      [
        {
          text: "Inappropriate content",
          onPress: async () => {
            try {
              const response = await fetch(
                apiEndpoint(`/polls/${pollId}/report/`),
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    device_id: deviceId,
                    reason: "inappropriate_content",
                  }),
                }
              );

              if (response.status === 409) {
                Toast.show({
                  type: "error",
                  text1: "You already reported this poll",
                });
                return;
              }

              if (!response.ok) {
                Toast.show({
                  type: "error",
                  text1: "Failed to report poll",
                });
                return;
              }

              Toast.show({
                type: "success",
                text1: "Poll reported",
              });
            } catch (err) {
              Toast.show({
                type: "error",
                text1: "Network error",
                text2: "Please try again later",
              });
            }
          },
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ],
      { cancelable: true }
    );
  };

  const getActiveCategory = () => {
    return selectedCategory.length > 0 && !selectedCategory.includes("All")
      ? selectedCategory[0]
      : "All";
  };

  const applyLocalFilters = (data: any[]) => {
    return data.filter((poll) => !hiddenPolls.includes(poll.id));
  };

  useEffect(() => {
    const init = async () => {
      const id = await getDeviceId();
      setDeviceId(id);
      const storedHidden = await AsyncStorage.getItem("hiddenPolls");
      setHiddenPolls(storedHidden ? JSON.parse(storedHidden) : []);
    };

    init();
  }, []);

  useEffect(() => {
    if (!deviceId) return;
    loadPolls();
  }, [deviceId, selectedCategory, hiddenPolls]);
  const loadPolls = async () => {
    const category = getActiveCategory();
    if (feedCache.current[category]) {
      const filtered = applyLocalFilters(feedCache.current[category]);
      setPolls(filtered);
      fetchFromServer(category, false);
      return;
    }

    setLoading(true);
    await fetchFromServer(category, true);
  };

  const fetchFromServer = async (category: string, showLoader = true) => {
    try {
      let query =
        category !== "All" ? `?category=${encodeURIComponent(category)}` : "";
      deviceId && (query += `${query ? "&" : "?"}device_id=${deviceId}`);

      const response = await fetch(apiEndpoint(`/polls/${query}`));
      if (!response.ok) {
        const text = await response.text();
        console.log("Server error response:", text);
        return;
      }

      const data = await response.json();

      if (!feedCache.current[category]) {
        feedCache.current[category] = data;
        setPolls(applyLocalFilters(data));
        return;
      }

      if (data.length > feedCache.current[category].length) {
        setLatestData(data);
        setHasNewPolls(true);
        return;
      }
    } catch (err) {
      console.log("Fetch error:", err);
    } finally {
      if (showLoader) setLoading(false);
    }
  };

  /* =========================
   REFRESH
========================= */

  const onRefresh = async () => {
    setRefreshing(true);

    const category = getActiveCategory();
    await fetchFromServer(category, false);

    setRefreshing(false);
  };
  const handleBlockUser = async (creatorDeviceId: string) => {
    if (creatorDeviceId === deviceId) {
      Toast.show({
        type: "info",
        text1: "You can't block yourself",
      });
      return;
    }

    Alert.alert("Block this user?", "You will no longer see their polls.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Block",
        style: "destructive",
        onPress: async () => {
          try {
            await fetch(apiEndpoint("/block-user/"), {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                blocker_device_id: deviceId,
                blocked_device_id: creatorDeviceId,
              }),
            });

            setPolls((prev) =>
              prev.filter((poll) => poll.creator_device_id !== creatorDeviceId)
            );
            feedCache.current = {};

            Toast.show({
              type: "success",
              text1: "User blocked",
            });
            loadPolls();
          } catch {
            Toast.show({
              type: "error",
              text1: "Failed to block user",
            });
          }
        },
      },
    ]);
  };

  const handlePollHide = async (pollId: string) => {
    const updated = [...hiddenPolls, pollId];

    await AsyncStorage.setItem("hiddenPolls", JSON.stringify(updated));

    setHiddenPolls(updated);

    setPolls((prev) => prev.filter((poll) => poll.id !== pollId));
  };

  /* =========================
   NAVIGATION LOCK
========================= */

  const handlePollPress = async (poll: any) => {
    if (isNavigating) return;

    setIsNavigating(true);

    try {
      const res = await fetch(apiEndpoint(`/polls/${poll.id}/vote/`), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ device_id: deviceId }),
      });

      const data = await res.json();
      

      router.push({
        pathname: "/poll/[id]",
        params: {
          id: poll.id,
          hasVoted: data.has_voted === undefined ? "false" : data.has_voted,
          voteValue: data.vote_value ? data.vote_value : null,
        },
      });
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Something went wrong",
      });
    } finally {
      setIsNavigating(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const PollCard = ({
    poll,
  }: {
    poll: Poll & {
      yes_votes: number;
      no_votes: number;
      total_votes: number;
    };
  }) => {
    const yesPercentage =
      poll.total_votes > 0 ? (poll.yes_votes / poll.total_votes) * 100 : 0;
    const noPercentage =
      poll.total_votes > 0 ? (poll.no_votes / poll.total_votes) * 100 : 0;

    return (
      <Swipeable
        renderRightActions={() =>
          renderRightActions(poll.id, poll.creator_device_id!)
        }
      >
        <TouchableOpacity
          style={[styles.pollCard, { backgroundColor: colors.card }]}
          onPress={() => handlePollPress(poll)}
          activeOpacity={poll.is_active ? 0.7 : 1}
          disabled={!poll.is_active}
        >
          <View style={styles.pollHeader}>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor: poll.is_active
                      ? `${colors.active}20`
                      : `${colors.inactive}20`,
                  },
                ]}
              >
                {poll.is_active ? (
                  <CheckCircle size={14} color={colors.active} />
                ) : (
                  <Clock size={14} color={colors.inactive} />
                )}
                <Text
                  style={[
                    styles.statusText,
                    { color: poll.is_active ? colors.active : colors.inactive },
                  ]}
                >
                  {poll.is_active ? "Active" : "Closed"}
                </Text>
              </View>
            </View>
            <View style={styles.dateContainer}>
              <Clock size={12} color={colors.subtext} />
              <Text style={[styles.dateText, { color: colors.subtext }]}>
                {formatDate(poll.created_at)}
              </Text>
            </View>
          </View>

          <Text style={[styles.question, { color: colors.text }]}>
            {poll.question}
          </Text>

          <View style={styles.resultsContainer}>
            <View
              style={[
                styles.progressBar,
                { backgroundColor: colors.progressBg },
              ]}
            >
              <View style={styles.progressContainer}>
                {/* YES */}
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${yesPercentage}%`,
                      backgroundColor: colors.yesColor,
                    },
                  ]}
                />

                {/* NO */}
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
            </View>

            <View style={styles.voteStats}>
              <View style={styles.voteStat}>
                <View style={styles.voteLabel}>
                  <View
                    style={[
                      styles.colorDot,
                      { backgroundColor: colors.yesColor },
                    ]}
                  />
                  <Text style={[styles.voteText, { color: colors.text }]}>
                    Yes
                  </Text>
                </View>
                <Text style={[styles.votePercentage, { color: colors.text }]}>
                  {yesPercentage.toFixed(1)}%
                </Text>
              </View>

              <View style={styles.voteStat}>
                <View style={styles.voteLabel}>
                  <View
                    style={[
                      styles.colorDot,
                      { backgroundColor: colors.noColor },
                    ]}
                  />
                  <Text style={[styles.voteText, { color: colors.text }]}>
                    No
                  </Text>
                </View>
                <Text style={[styles.votePercentage, { color: colors.text }]}>
                  {noPercentage.toFixed(1)}%
                </Text>
              </View>
            </View>
          </View>

          <View style={[styles.footer, { borderTopColor: colors.border }]}>
            <View style={styles.totalVotes}>
              <TrendingUp size={14} color={colors.primary} />
              <Text style={[styles.totalVotesText, { color: colors.subtext }]}>
                {poll?.total_votes?.toLocaleString()} votes
              </Text>
            </View>
            {poll.is_active && (
              <Text style={[styles.tapHint, { color: colors.primary }]}>
                Tap to vote
              </Text>
            )}
          </View>
        </TouchableOpacity>
      </Swipeable>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[{ flexDirection: "row", justifyContent: "space-between" }]}>
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Public Polls
          </Text>
          <Text style={[styles.headerSubtitle, { color: colors.subtext }]}>
            Vote on trending topics
          </Text>
        </View>
        <TouchableOpacity
          style={styles.contactUsHeader}
          onPress={async () => {
            contactUs(await getDeviceId());
          }}
        >
          <Contact
            size={18}
            color={colors.primary}
            style={{ marginRight: 6 }}
          />
          <Text style={[styles.tapHint, { color: colors.primary }]}>
            Contact Us
          </Text>
        </TouchableOpacity>
      </View>
      <View
        style={[
          styles.searchContainer,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}
      >
        <TextInput
          placeholder="Search polls..."
          placeholderTextColor={colors.subtext}
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={[
            styles.searchInput,
            {
              color: colors.text,
            },
          ]}
          clearButtonMode="while-editing"
        />
      </View>
      <View style={{ marginHorizontal: 20, marginBottom: 12 }}>
        <CategoryChips
          mode="feed"
          setSelectedCategory={setSelectedCategory}
          selectedCategory={selectedCategory}
        />
      </View>
      {hasNewPolls && (
        <TouchableOpacity
          style={{
            backgroundColor: "#2563eb",
            padding: 10,
            marginBottom: 10,
            alignItems: "center",
          }}
          onPress={() => {
            const category = getActiveCategory();
            feedCache.current[category] = latestData;
            setPolls(applyLocalFilters(latestData));
            setHasNewPolls(false);
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "600" }}>
            New polls available • Tap to refresh
          </Text>
        </TouchableOpacity>
      )}

      {loading ? (
        <View style={[styles.centerContent, { flex: 1 }]}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : filteredPolls.length === 0 ? (
        <View
          style={[styles.emptyState, { backgroundColor: colors.background }]}
        >
          <Text style={[styles.emptyText, { color: colors.text }]}>
            No polls yet
          </Text>
          <Text style={[styles.emptySubtext, { color: colors.subtext }]}>
            Create the first poll to get started!
          </Text>
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {filteredPolls.map((poll) => (
            <PollCard key={poll.id} poll={poll} />
          ))}
        </ScrollView>
      )}
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
  scrollContent: {
    padding: 20,
    paddingTop: 0,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
  },
  pollCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  pollHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  ownerStatus: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
    backgroundColor: "#efd71d",
    opacity: 0.4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  rightActionReport: {
    backgroundColor: "#ef4444",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
    height: "25%",
    width: 75,
    borderRadius: 30,
    alignSelf: "center",
    marginLeft: 10,
  },
  rightActionHide: {
    backgroundColor: "#6b7280",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    height: "30%",
    width: 80,
    borderRadius: 30,
    alignSelf: "center",
    marginLeft: 10,
  },

  actionText: {
    color: "#fff",
    fontWeight: "600",
    marginTop: 4,
    fontSize: 10,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  dateText: {
    fontSize: 12,
  },
  question: {
    fontSize: 18,
    fontWeight: "600",
    lineHeight: 26,
    marginBottom: 16,
  },
  resultsContainer: {
    marginBottom: 16,
  },
  progressContainer: {
    width: "100%",
    height: 10,
    backgroundColor: "#e0e0e0",
    borderRadius: 6,
    overflow: "hidden",
    flexDirection: "row",
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 12,
  },
  progressFill: {
    height: "100%",
  },
  voteStats: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  voteStat: {
    flex: 1,
  },
  voteLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  colorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  voteText: {
    fontSize: 14,
    fontWeight: "500",
  },
  votePercentage: {
    fontSize: 20,
    fontWeight: "700",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
  },
  totalVotes: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  totalVotesText: {
    fontSize: 14,
    fontWeight: "500",
  },
  tapHint: {
    fontSize: 14,
    fontWeight: "600",
  },
  searchContainer: {
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },

  searchInput: {
    fontSize: 16,
  },
});
