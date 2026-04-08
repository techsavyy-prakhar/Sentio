import { Pressable, View, Text, StyleSheet } from 'react-native';
import { Star, Circle } from 'lucide-react-native';

/* =======================
   Types
======================= */
type Importance = 'High' | 'Medium';

interface Topic {
  id: string;
  title: string;
  summary: string;
  category: string;
  lastUpdated: string;
  importance: Importance;
  newUpdates?: number;
  isFollowing: boolean;
}

interface TopicCardProps {
  topic: Topic;
  onPress: () => void;
  onToggleFollow: () => void;
}

/* =======================
   Component
======================= */
export function TopicCard({
  topic,
  onPress,
  onToggleFollow,
}: TopicCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        pressed && styles.cardPressed,
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={2}>
          {topic.title}
        </Text>

        <Pressable
          onPress={onToggleFollow}
          hitSlop={8}
          style={styles.starButton}
        >
          <Star
            size={20}
            color={topic.isFollowing ? '#F59E0B' : '#94A3B8'}
            fill={topic.isFollowing ? '#F59E0B' : 'none'}
          />
        </Pressable>
      </View>

      {/* Summary */}
      <Text style={styles.summary} numberOfLines={3}>
        {topic.summary}
      </Text>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.metaLeft}>
          <View style={styles.categoryTag}>
            <Text style={styles.categoryText}>{topic.category}</Text>
          </View>

          <View
            style={[
              styles.importanceTag,
              topic.importance === 'High'
                ? styles.high
                : styles.medium,
            ]}
          >
            <Text
              style={[
                styles.importanceText,
                topic.importance === 'High'
                  ? styles.highText
                  : styles.mediumText,
              ]}
            >
              {topic.importance}
            </Text>
          </View>

          <Text style={styles.updatedText}>
            Updated {topic.lastUpdated}
          </Text>
        </View>

        {topic.newUpdates && topic.newUpdates > 0 && (
          <View style={styles.updateBadge}>
            <Circle size={8} fill="#10B981" color="#10B981" />
            <Text style={styles.updateText}>
              +{topic.newUpdates} new
            </Text>
          </View>
        )}
      </View>
    </Pressable>
  );
}

/* =======================
   Styles
======================= */
const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  cardPressed: {
    transform: [{ scale: 0.99 }],
    borderColor: '#93C5FD',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 6,
  },

  title: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#0F172A',
    lineHeight: 20,
  },

  starButton: {
    padding: 4,
  },

  summary: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
    marginBottom: 10,
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },

  metaLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },

  categoryTag: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },

  categoryText: {
    fontSize: 11,
    color: '#1D4ED8',
  },

  importanceTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },

  importanceText: {
    fontSize: 11,
    fontWeight: '500',
  },

  high: {
    backgroundColor: '#FEE2E2',
  },

  highText: {
    color: '#991B1B',
  },

  medium: {
    backgroundColor: '#FEF3C7',
  },

  mediumText: {
    color: '#92400E',
  },

  updatedText: {
    fontSize: 11,
    color: '#64748B',
  },

  updateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  updateText: {
    fontSize: 11,
    color: '#047857',
    fontWeight: '500',
  },
});