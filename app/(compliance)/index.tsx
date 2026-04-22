import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { acceptCompliance } from '@/store/slices/complianceSlice';
import { Flag, AlertCircle } from 'lucide-react-native';
import ExpoCheckbox from 'expo-checkbox';

const { width } = Dimensions.get('window');

export default function ComplianceScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [agreed, setAgreed] = useState(false);
  const dispatch = useDispatch();

  const colors = {
    background: isDark ? '#0a0a0a' : '#ffffff',
    text: isDark ? '#ffffff' : '#1f2937',
    subtext: isDark ? '#9ca3af' : '#6b7280',
    card: isDark ? '#1a1a1a' : '#f5f5f5',
    border: isDark ? '#2a2a2a' : '#e5e7eb',
    golden: '#D9A54C',
  };

  const handleAgree = async () => {
    if (!agreed) return;

    try {
      await AsyncStorage.setItem('terms_accepted', 'true');
      await AsyncStorage.setItem('age_confirmed', 'true');
      dispatch(acceptCompliance());
    } catch (error) {
      console.error('Error accepting compliance:', error);
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Logo */}
      <View style={styles.logoSection}>
        <LinearGradient colors={['#D9A54C', '#c9913e']} style={styles.logo}>
          <Text style={styles.logoText}>S</Text>
        </LinearGradient>
      </View>

      {/* Title & Description */}
      <Text style={[styles.title, { color: colors.text }]}>
        A place for honest opinions.
      </Text>
      <Text style={[styles.subtitle, { color: colors.subtext }]}>
        Before you start, a quick note on how we keep Sentio civil.
      </Text>

      {/* Rules */}
      <View style={styles.rulesSection}>
        {/* Rule 1 */}
        <View style={[styles.ruleCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.ruleNumber, { backgroundColor: colors.golden }]}>
            <Text style={styles.ruleNumberText}>1</Text>
          </View>
          <View style={styles.ruleContent}>
            <Text style={[styles.ruleTitle, { color: colors.text }]}>Be respectful</Text>
            <Text style={[styles.ruleDescription, { color: colors.subtext }]}>
              No hate speech, harassment, or targeted attacks on individuals or groups.
            </Text>
          </View>
        </View>

        {/* Rule 2 */}
        <View style={[styles.ruleCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.ruleNumber, { backgroundColor: colors.golden }]}>
            <Text style={styles.ruleNumberText}>2</Text>
          </View>
          <View style={styles.ruleContent}>
            <Text style={[styles.ruleTitle, { color: colors.text }]}>Vote honestly</Text>
            <Text style={[styles.ruleDescription, { color: colors.subtext }]}>
              One person, one vote per poll. Manipulation will lead to account action.
            </Text>
          </View>
        </View>

        {/* Rule 3 */}
        <View style={[styles.ruleCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.ruleNumber, { backgroundColor: colors.golden }]}>
            <Text style={styles.ruleNumberText}>3</Text>
          </View>
          <View style={styles.ruleContent}>
            <Text style={[styles.ruleTitle, { color: colors.text }]}>Keep it real</Text>
            <Text style={[styles.ruleDescription, { color: colors.subtext }]}>
              Polls must be factual questions — not misinformation or spam.
            </Text>
          </View>
        </View>
      </View>

      {/* Checkbox */}
      <View style={styles.checkboxSection}>
        <ExpoCheckbox
          value={agreed}
          onValueChange={setAgreed}
          color={agreed ? '#D9A54C' : undefined}
        />
        <Text style={[styles.checkboxText, { color: colors.text }]}>
          I agree to follow the community guidelines and accept the{' '}
          <Text style={{ color: colors.golden, fontWeight: '600' }}>Terms of Use</Text>.
        </Text>
      </View>

      {/* Button */}
      <TouchableOpacity
        onPress={handleAgree}
        disabled={!agreed}
        activeOpacity={0.8}
        style={styles.buttonOuter}
      >
        {agreed ? (
          <LinearGradient
            colors={['#D9A54C', '#c9913e']}
            style={styles.buttonGradient}
          >
            <Text style={styles.buttonText}>Enter Sentio</Text>
          </LinearGradient>
        ) : (
          <View style={[styles.buttonDisabled, { backgroundColor: colors.border }]}>
            <Text style={[styles.buttonText, { color: colors.subtext }]}>
              Enter Sentio
            </Text>
          </View>
        )}
      </TouchableOpacity>

      <View style={styles.spacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 40,
    justifyContent: 'flex-start',
  },

  /* Logo */
  logoSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
  },

  /* Title */
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
    lineHeight: 36,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 32,
  },

  /* Rules */
  rulesSection: {
    marginBottom: 32,
    gap: 12,
  },
  ruleCard: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  ruleNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  ruleNumberText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  ruleContent: {
    flex: 1,
  },
  ruleTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  ruleDescription: {
    fontSize: 13,
    lineHeight: 18,
  },

  /* Checkbox */
  checkboxSection: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
    alignItems: 'flex-start',
  },
  checkboxText: {
    fontSize: 13,
    lineHeight: 18,
    flex: 1,
    paddingTop: 2,
  },

  /* Button */
  buttonOuter: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  buttonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },

  spacer: {
    height: 40,
  },
});
