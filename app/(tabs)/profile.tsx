import { View, Text, ScrollView, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { clearAuth } from '@/store/slices/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { LogOut, Edit2, Mail, Phone } from 'lucide-react-native';

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const user = useAppSelector((s) => s.auth.user);
  const dispatch = useAppDispatch();
  const [stats, setStats] = useState({
    polls: 47,
    votes: 1200,
    topics: 12,
    reach: 8400,
  });

  const colors = {
    background: isDark ? '#0a0a0a' : '#ffffff',
    text: isDark ? '#ffffff' : '#1f2937',
    subtext: isDark ? '#9ca3af' : '#6b7280',
    card: isDark ? '#1a1a1a' : '#f5f5f5',
    border: isDark ? '#2a2a2a' : '#e5e7eb',
    golden: '#D9A54C',
  };

  const handleLogout = async () => {
    try {
      dispatch(clearAuth());
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('auth_tokens');
      router.replace('/(auth)');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const userName = user?.name || 'User';
  const userInitial = userName[0]?.toUpperCase() || 'U';
  const userPhone = user?.phone || '+91 98765 43210';
  const userEmail = user?.email || 'user@sentio.app';

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>PROFILE</Text>
      </View>

      {/* User Info Card */}
      <View style={[styles.userCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <LinearGradient
          colors={[colors.golden, '#c9913e']}
          style={styles.avatar}
        >
          <Text style={styles.avatarText}>{userInitial}</Text>
        </LinearGradient>

        <View style={styles.userInfo}>
          <Text style={[styles.userName, { color: colors.text }]}>{userName}</Text>
          <Text style={[styles.userUsername, { color: colors.subtext }]}>
            @{userName.toLowerCase().replace(/\s+/g, '')}
          </Text>
          <Text style={[styles.userJoinDate, { color: colors.subtext }]}>
            Joined Mar 2026
          </Text>
        </View>

        <TouchableOpacity style={styles.editButton}>
          <Edit2 size={16} color={colors.golden} />
          <Text style={[styles.editText, { color: colors.golden }]}>Edit</Text>
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={styles.statsSection}>
        <View
          style={[
            styles.statCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.statValue, { color: colors.golden }]}>{stats.polls}</Text>
          <Text style={[styles.statLabel, { color: colors.subtext }]}>Polls</Text>
        </View>
        <View
          style={[
            styles.statCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.statValue, { color: colors.golden }]}>
            {stats.votes > 999
              ? (stats.votes / 1000).toFixed(1) + 'k'
              : stats.votes}
          </Text>
          <Text style={[styles.statLabel, { color: colors.subtext }]}>Votes</Text>
        </View>
        <View
          style={[
            styles.statCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.statValue, { color: colors.golden }]}>{stats.topics}</Text>
          <Text style={[styles.statLabel, { color: colors.subtext }]}>Topics</Text>
        </View>
      </View>

      {/* Your Impact */}
      <View style={[styles.impactCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.subtext }]}>YOUR IMPACT</Text>
        <Text style={[styles.impactNumber, { color: colors.golden }]}>
          {(stats.reach / 1000).toFixed(1)}k
        </Text>
        <Text style={[styles.impactSubtext, { color: colors.subtext }]}>
          reach on your polls
        </Text>

        {/* Simple Bar Chart */}
        <View style={styles.chartSection}>
          {[40, 60, 30, 70, 45, 50, 65, 35, 80, 55, 60, 75].map((height, i) => (
            <View
              key={i}
              style={[
                styles.bar,
                {
                  height: (height / 100) * 60 + 8,
                  backgroundColor: i % 3 === 2 ? colors.golden : colors.border,
                },
              ]}
            />
          ))}
        </View>
      </View>

      {/* Following */}
      <View style={styles.followingSection}>
        <Text style={[styles.sectionTitle, { color: colors.subtext }]}>FOLLOWING</Text>
        <View style={styles.tagContainer}>
          {['AI Regulation', 'Global Economy', 'Climate Policy', 'Space Exploration'].map(
            (topic, i) => (
              <View
                key={i}
                style={[
                  styles.tag,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
              >
                <Text style={[styles.tagText, { color: colors.text }]}>{topic}</Text>
              </View>
            )
          )}
        </View>
      </View>

      {/* Account */}
      <View style={styles.accountSection}>
        <Text style={[styles.sectionTitle, { color: colors.subtext }]}>ACCOUNT</Text>

        {/* Email */}
        <View
          style={[
            styles.accountRow,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <View style={styles.accountIcon}>
            <Mail size={20} color={colors.golden} />
          </View>
          <View style={styles.accountContent}>
            <Text style={[styles.accountValue, { color: colors.text }]}>{userEmail}</Text>
            <Text style={[styles.accountLabel, { color: colors.subtext }]}>Email</Text>
          </View>
        </View>

        {/* Phone */}
        <View
          style={[
            styles.accountRow,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <View style={styles.accountIcon}>
            <Phone size={20} color={colors.golden} />
          </View>
          <View style={styles.accountContent}>
            <Text style={[styles.accountValue, { color: colors.text }]}>{userPhone}</Text>
            <Text style={[styles.accountLabel, { color: colors.subtext }]}>Phone</Text>
          </View>
        </View>

        {/* Logout */}
        <TouchableOpacity
          onPress={handleLogout}
          style={[
            styles.logoutRow,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <View style={styles.accountIcon}>
            <LogOut size={20} color="#ef4444" />
          </View>
          <Text style={[styles.accountValue, { color: '#ef4444' }]}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.spacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
  },

  /* User Card */
  userCard: {
    flexDirection: 'row',
    marginHorizontal: 24,
    marginBottom: 24,
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  userUsername: {
    fontSize: 13,
    marginBottom: 4,
  },
  userJoinDate: {
    fontSize: 12,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  editText: {
    fontSize: 12,
    fontWeight: '600',
  },

  /* Stats */
  statsSection: {
    flexDirection: 'row',
    marginHorizontal: 24,
    marginBottom: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },

  /* Impact */
  impactCard: {
    marginHorizontal: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  impactNumber: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 2,
  },
  impactSubtext: {
    fontSize: 13,
    marginBottom: 16,
  },
  chartSection: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
    height: 80,
  },
  bar: {
    flex: 1,
    borderRadius: 4,
  },

  /* Following */
  followingSection: {
    marginHorizontal: 24,
    marginBottom: 24,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
  },

  /* Account */
  accountSection: {
    marginHorizontal: 24,
    marginBottom: 24,
  },
  accountRow: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    gap: 12,
  },
  logoutRow: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    gap: 12,
  },
  accountIcon: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: 'rgba(217, 165, 76, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  accountContent: {
    flex: 1,
  },
  accountValue: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  accountLabel: {
    fontSize: 12,
  },

  spacer: {
    height: 40,
  },
});
