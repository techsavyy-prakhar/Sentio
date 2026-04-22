import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  useColorScheme,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Phone, ArrowRight } from 'lucide-react-native';

export default function LoginScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [phone, setPhone] = useState('');

  const colors = {
    background: isDark ? '#0a0a0a' : '#ffffff',
    text: isDark ? '#ffffff' : '#1f2937',
    subtext: isDark ? '#9ca3af' : '#6b7280',
    card: isDark ? '#1a1a1a' : '#f5f5f5',
    border: isDark ? '#2a2a2a' : '#e5e7eb',
    input: isDark ? '#141414' : '#ffffff',
    placeholder: isDark ? '#4b5563' : '#999',
  };

  const isValid = phone.replace(/\D/g, '').length === 10;

  const handleContinue = () => {
    if (!isValid) return;
    router.push({
      pathname: '/(auth)/otp',
      params: { phone: phone.replace(/\D/g, '') },
    });
  };

  const formatPhoneDisplay = () => {
    const clean = phone.replace(/\D/g, '');
    if (clean.length === 0) return '';
    if (clean.length <= 5) return clean;
    return clean.slice(0, 5) + ' ' + clean.slice(5);
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Logo */}
        <View style={styles.logoSection}>
          <LinearGradient colors={['#D9A54C', '#c9913e']} style={styles.logo}>
            <Text style={styles.logoText}>S</Text>
          </LinearGradient>
        </View>

        {/* Title */}
        <Text style={[styles.title, { color: colors.text }]}>
          Make your{' '}
          <Text style={{ color: '#D9A54C' }}>voice</Text> heard.
        </Text>

        {/* Subtitle */}
        <Text style={[styles.subtitle, { color: colors.subtext }]}>
          Sign in to vote, create polls, and track what the world is thinking.
        </Text>

        {/* Phone Input */}
        <View style={styles.formSection}>
          <Text style={[styles.label, { color: colors.subtext }]}>MOBILE NUMBER</Text>

          <View
            style={[
              styles.inputContainer,
              {
                backgroundColor: colors.input,
                borderColor: colors.border,
              },
            ]}
          >
            {/* Country Code */}
            <View style={styles.countrySection}>
              <Text style={styles.flag}>🇮🇳</Text>
              <Text style={[styles.countryCode, { color: colors.subtext }]}>+91</Text>
            </View>

            {/* Divider */}
            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            {/* Phone Input */}
            <TextInput
              style={[styles.input, { color: colors.text, flex: 1 }]}
              placeholder="98765 43210"
              placeholderTextColor={colors.placeholder}
              keyboardType="phone-pad"
              maxLength={10}
              value={phone}
              onChangeText={setPhone}
              returnKeyType="done"
              onSubmitEditing={handleContinue}
            />

            {/* Phone Icon */}
            {phone.length > 0 && (
              <Phone size={18} color={colors.subtext} style={{ marginRight: 8 }} />
            )}
          </View>
        </View>

        {/* Continue Button */}
        <TouchableOpacity
          onPress={handleContinue}
          disabled={!isValid}
          activeOpacity={0.8}
          style={styles.buttonOuter}
        >
          {isValid ? (
            <LinearGradient
              colors={['#D9A54C', '#c9913e']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>Continue</Text>
              <ArrowRight size={18} color="#fff" />
            </LinearGradient>
          ) : (
            <View
              style={[styles.buttonDisabled, { backgroundColor: colors.border }]}
            >
              <Text style={[styles.buttonText, { color: colors.subtext }]}>
                Continue
              </Text>
              <ArrowRight size={18} color={colors.subtext} />
            </View>
          )}
        </TouchableOpacity>

        {/* Terms */}
        <Text style={[styles.terms, { color: colors.subtext }]}>
          By continuing you agree to our{' '}
          <Text style={{ color: '#D9A54C', fontWeight: '600' }}>Terms</Text> and{' '}
          <Text style={{ color: '#D9A54C', fontWeight: '600' }}>Privacy Policy</Text>
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
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
    justifyContent: 'center',
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
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 12,
    lineHeight: 40,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 36,
  },

  /* Form */
  formSection: {
    marginBottom: 24,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 52,
  },
  countrySection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  flag: {
    fontSize: 18,
  },
  countryCode: {
    fontSize: 14,
    fontWeight: '600',
  },
  divider: {
    width: 1,
    height: 20,
    marginHorizontal: 12,
  },
  input: {
    fontSize: 16,
  },

  /* Button */
  buttonOuter: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  buttonDisabled: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
    borderRadius: 12,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },

  /* Terms */
  terms: {
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
  },
});
