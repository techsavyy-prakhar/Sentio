import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Share,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  ZoomIn,
  FadeIn,
  Easing,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import { getDeviceId } from "@/lib/utils/deviceId";
import { apiEndpoint } from "@/lib/config/api";

// ─── Types ────────────────────────────────────────────────────────────────────

type PollOption = {
  id: string;
  label: string;
  votes: number;
};

type PollCardProps = {
  /** Poll unique id */
  id: string;
  yes_votes: number;
  no_votes: number;
  /** Category tag shown in the header pill */
  category: string;
  /** Total vote count before the user votes */
  totalVotes: number;
  /** Bold title line */
  title: string;
  /** Sub-question line */
  question: string;
  /**
   * Exactly two options.
   * Index 0 → "Yes" (green treatment)
   * Index 1 → "No"  (red treatment)
   */
  options: [PollOption, PollOption];
  /** Device id of the poll creator – forwarded to swipeable actions */
  creatorDeviceId?: string;
  /** Called with the poll id + chosen option id after the user submits */
  onVote?: (pollId: string, optionId: string) => void;
  /**
   * Render the right swipe actions.
   * Kept identical to the existing code signature:
   *   renderRightActions(pollId, creatorDeviceId)
   */
  renderRightActions: (
    pollId: string,
    creatorDeviceId: string
  ) => React.ReactNode;
};

// ─── Palette ─────────────────────────────────────────────────────────────────

const C = {
  card: "#ffffff",
  text: "#0f172a",
  subtext: "#94a3b8",
  question: "#64748b",
  categoryBg: "#f1f5f9",
  categoryText: "#475569",
  defaultBorder: "#e2e8f0",
  defaultBg: "#ffffff",
  // yes = green
  yesBase: "#22c55e",
  yesDark: "#16a34a",
  yesBg: "#f0fdf4",
  yesBorder: "#22c55e",
  // no = red
  noBase: "#ef4444",
  noDark: "#dc2626",
  noBg: "#fff1f2",
  noBorder: "#ef4444",
  // submit
  submitGradStart: "#6366f1",
  submitGradEnd: "#8b5cf6",
  submitDisabledBg: "#e2e8f0",
  submitDisabledText: "#94a3b8",
  // voted badge
  votedGreen: "#22c55e",
} as const;

// ─── OptionRow ────────────────────────────────────────────────────────────────

type OptionRowProps = {
  option: PollOption;
  isSelected: boolean;
  hasVoted: boolean;
  percentage: number;
  isFirst: boolean;
  onPress: () => void;
};

const OptionRow: React.FC<OptionRowProps> = ({
  option,
  isSelected,
  hasVoted,
  percentage,
  isFirst,
  onPress,
}) => {
  const progress = useSharedValue(0);
  const rowScale = useSharedValue(1);
  console.log("I am logging the value of hasVoted", hasVoted);

  useEffect(() => {
    if (hasVoted) {
      progress.value = withTiming(percentage / 100, {
        duration: 900,
        easing: Easing.out(Easing.cubic),
      });
    } else {
      progress.value = withTiming(0, { duration: 200 });
    }
  }, [hasVoted, percentage]);

  const barAnimStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%` as `${number}%`,
  }));

  const rowAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: rowScale.value }],
  }));

  const handlePress = () => {
    if (hasVoted) return;
    rowScale.value = withSpring(0.97, { damping: 14 }, () => {
      rowScale.value = withSpring(1, { damping: 14 });
    });
    onPress();
  };

  // Border + background colour
  const active = !hasVoted ? isSelected : isSelected;
  const borderColor = active
    ? isFirst
      ? C.yesBorder
      : C.noBorder
    : C.defaultBorder;
  const bgColor = active ? (isFirst ? C.yesBg : C.noBg) : C.defaultBg;

  const barColors: [string, string] = isFirst
    ? [C.yesBase, C.yesDark]
    : [C.noBase, C.noDark];

  return (
    <Animated.View
      style={[
        styles.optionRow,
        { borderColor, backgroundColor: bgColor },
        rowAnimStyle,
      ]}
    >
      {/* Animated tinted progress bar rendered behind the label */}
      {hasVoted && (
        <View
          style={[StyleSheet.absoluteFill, styles.barTrack]}
          pointerEvents="none"
        >
          <Animated.View style={[styles.barFill, barAnimStyle]}>
            <LinearGradient
              colors={barColors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={StyleSheet.absoluteFill}
            />
          </Animated.View>
        </View>
      )}

      <TouchableOpacity
        style={styles.optionInner}
        onPress={handlePress}
        activeOpacity={hasVoted ? 1 : 0.7}
        disabled={hasVoted}
      >
        {/* Label */}
        <Text
          style={[
            styles.optionLabel,
            hasVoted &&
              isSelected && {
                fontWeight: "700",
                color: isFirst ? C.yesDark : C.noDark,
              },
          ]}
        >
          {option.label}
        </Text>

        {/* Right side: radio (pre-vote) | percentage (post-vote) */}
        {!hasVoted ? (
          isSelected ? (
            <Animated.View
              entering={ZoomIn.duration(220)}
              style={[
                styles.radioOuter,
                { borderColor: isFirst ? C.yesBase : C.noBase },
              ]}
            >
              <View
                style={[
                  styles.radioInner,
                  { backgroundColor: isFirst ? C.yesBase : C.noBase },
                ]}
              />
            </Animated.View>
          ) : (
            <View
              style={[styles.radioOuter, { borderColor: C.defaultBorder }]}
            />
          )
        ) : (
          <Animated.Text
            entering={FadeIn.duration(400).delay(350)}
            style={[
              styles.percentText,
              { color: isFirst ? C.yesDark : C.noDark },
            ]}
          >
            {Math.round(percentage)}%
          </Animated.Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

// ─── PollCard ─────────────────────────────────────────────────────────────────

const PollCard: React.FC<PollCardProps> = ({
  id,
  category,
  yes_votes,
  no_votes,
  totalVotes,
  title,
  question,
  options,
  creatorDeviceId,
  onVote,
  renderRightActions,
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);

  const submitOpacity = useSharedValue(0.45);
  const submitScale = useSharedValue(0.97);

  useEffect(() => {
    if (selectedId && !hasVoted) {
      submitOpacity.value = withTiming(1, { duration: 220 });
      submitScale.value = withSpring(1, { damping: 14 });
    } else if (!selectedId) {
      submitOpacity.value = withTiming(0.45, { duration: 180 });
      submitScale.value = withTiming(0.97, { duration: 180 });
    }
  }, [selectedId, hasVoted]);

  const submitAnimStyle = useAnimatedStyle(() => ({
    opacity: submitOpacity.value,
    transform: [{ scale: submitScale.value }],
  }));

  const handleSelect = useCallback(
    (optId: string) => {
      if (!hasVoted) setSelectedId(optId);
    },
    [hasVoted]
  );

  const handleSubmit = useCallback(async () => {
    if (!selectedId || hasVoted) return;
    const deviceId = await getDeviceId();
    try {

      const response = await fetch(apiEndpoint(`/polls/${id}/vote/`), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          vote_value: selectedId === "yes",
          device_id: deviceId,
        }),
      });
      console.log("Logging the response of the handleSubmit fetch call: ", deviceId);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error?.detail || "Voting failed");
      }
    } catch (err) {
      console.error("Voting failed:", err);
    }
    setHasVoted(true);
    onVote?.(id, selectedId);
  }, [selectedId, hasVoted, id, onVote]);

  const handleShare = useCallback(() => {
    Share.share({ message: `${title}\n${question}` });
  }, [title, question]);

  const getPercentage = (optId: string): number => {
    const base = optId === "yes" ? yes_votes : no_votes;
    const votes = optId === selectedId ? base + 1 : base;
    return (votes / (totalVotes + 1)) * 100;

  };

  const formatVotes = (n: number): string =>
    n >= 1000 ? `${(n / 1000).toFixed(1)}k` : `${n}`;

  return (
    <Swipeable
      renderRightActions={() => renderRightActions(id, creatorDeviceId ?? "")}
    >
      <View style={styles.card}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.categoryPill}>
              <Text style={styles.categoryText}>{category}</Text>
            </View>
            <Text style={styles.votesText}>
              {formatVotes(totalVotes)} votes
            </Text>
          </View>

          {/* Right: "Voted" badge + share icon */}
          <View style={styles.headerRight}>
            {hasVoted && (
              <Animated.View entering={FadeIn.duration(350).delay(500)}>
                <Text style={styles.votedBadgeText}>✓ Voted</Text>
              </Animated.View>
            )}
            <TouchableOpacity onPress={handleShare} hitSlop={10}>
              {/* Simple share SVG approximation */}
              <Text style={styles.shareIcon}>{"⤴"}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Title & question ── */}
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.question}>{question}</Text>

        {/* ── Options ── */}
        <View style={styles.optionsContainer}>
          {options.map((opt, index) => (
            <OptionRow
              key={opt.id}
              option={opt}
              isSelected={selectedId === opt.id}
              hasVoted={hasVoted}
              percentage={getPercentage(opt.id)}
              isFirst={index === 0}
              onPress={() => handleSelect(opt.id)}
            />
          ))}
        </View>

        {/* ── Submit button (hidden after voting) ── */}
        {!hasVoted && (
          <Animated.View style={submitAnimStyle}>
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={!selectedId}
              activeOpacity={0.82}
            >
              {selectedId ? (
                <LinearGradient
                  colors={[C.submitGradStart, C.submitGradEnd]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.submitBtn}
                >
                  <Text style={styles.submitTextActive}>Submit Vote</Text>
                </LinearGradient>
              ) : (
                <View
                  style={[
                    styles.submitBtn,
                    { backgroundColor: C.submitDisabledBg },
                  ]}
                >
                  <Text style={styles.submitTextDisabled}>Submit Vote</Text>
                </View>
              )}
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>
    </Swipeable>
  );
};

export default PollCard;

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  // ── Card shell
  card: {
    backgroundColor: C.card,
    borderRadius: 16,
    padding: 16,
    // borderBlockColor: ,
    borderWidth: 0.2,
    marginVertical: 8,
    ...Platform.select({
      ios: {
        shadowColor: "#94a3b8",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.14,
        shadowRadius: 10,
      },
      android: { elevation: 4 },
    }),
  },

  // ── Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  categoryPill: {
    backgroundColor: C.categoryBg,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  categoryText: {
    fontSize: 12,
    color: C.categoryText,
    fontWeight: "500",
  },
  votesText: {
    fontSize: 13,
    color: C.subtext,
  },
  shareIcon: {
    fontSize: 17,
    color: C.subtext,
  },
  votedBadgeText: {
    fontSize: 12,
    color: C.votedGreen,
    fontWeight: "600",
  },

  // ── Title / question
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: C.text,
    marginBottom: 4,
    lineHeight: 22,
  },
  question: {
    fontSize: 13,
    color: C.question,
    lineHeight: 19,
    marginBottom: 14,
  },

  // ── Options list
  optionsContainer: {
    gap: 10,
    marginBottom: 14,
  },

  // ── Single option row
  optionRow: {
    borderRadius: 10,
    borderWidth: 1.5,
    overflow: "hidden",
    minHeight: 50,
  },
  optionInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  optionLabel: {
    fontSize: 14,
    color: C.text,
    fontWeight: "500",
    flex: 1,
  },

  // ── Progress bar (post-vote)
  barTrack: {
    borderRadius: 8,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: 8,
    overflow: "hidden",
    opacity: 0.2,
  },

  // ── Radio button (pre-vote)
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },

  // ── Percentage (post-vote)
  percentText: {
    fontSize: 14,
    fontWeight: "700",
  },

  // ── Submit button
  submitBtn: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  submitTextActive: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  submitTextDisabled: {
    color: C.submitDisabledText,
    fontSize: 15,
    fontWeight: "600",
  },
});
