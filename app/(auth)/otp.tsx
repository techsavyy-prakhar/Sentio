import { useState, useRef, useEffect } from 'react';
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
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch } from 'react-redux';
import { setTokens, setUser } from '@/store/slices/authSlice';

const { width } = Dimensions.get('window');

export default function OTPScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { phone } = useLocalSearchParams();
  const dispatch = useDispatch();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<TextInput[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const colors = {
    background: isDark ? '#0a0a0a' : '#ffffff',
    text: isDark ? '#ffffff' : '#1f2937',
    subtext: isDark ? '#9ca3af' : '#6b7280',
    input: isDark ? '#141414' : '#ffffff',
    inputBorder: isDark ? '#242424' : '#e5e7eb',
    placeholder: isDark ? '#4b5563' : '#999',
  };

  const handleInputChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-move to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleBackspace = (index: number, value: string) => {
    if (!value && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const otpCode = otp.join('');
  const isValid = otpCode.length === 6;

  const handleVerify = async () => {
    if (!isValid) return;

    // For now, accept any 6-digit code
    try {
      const mockToken = `token_${phone}_${Date.now()}`;
      const mockRefresh = `refresh_${phone}_${Date.now()}`;

      // Save to Redux
      dispatch(
        setTokens({
          accessToken: mockToken,
          refreshToken: mockRefresh,
        })
      );

      dispatch(
        setUser({
          id: String(phone),
          name: '',
          username: '',
          email: '',
        })
      );

      // Save to AsyncStorage
      await AsyncStorage.setItem(
        'auth_tokens',
        JSON.stringify({
          accessToken: mockToken,
          refreshToken: mockRefresh,
        })
      );

      await AsyncStorage.setItem(
        'user',
        JSON.stringify({
          id: String(phone),
          name: '',
          username: '',
          email: '',
          phone: String(phone),
        })
      );

      // Navigate to main app
      router.replace('/(tabs)');
    } catch (error) {
      console.error('OTP verification error:', error);
    }
  };

  const formatTimer = () => {
    const mins = Math.floor(timer / 60);
    const secs = timer % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const maskPhone = () => {
    const p = String(phone);
    return p.slice(-10);
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
          Check your messages.
        </Text>

        {/* Subtitle */}
        <Text style={[styles.subtitle, { color: colors.subtext }]}>
          We sent a 6-digit code to +91 {maskPhone()}
        </Text>

        {/* OTP Inputs */}
        <View style={styles.otpSection}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => {
                if (ref) inputRefs.current[index] = ref;
              }}
              style={[
                styles.otpInput,
                {
                  backgroundColor: colors.input,
                  borderColor: digit ? '#D9A54C' : colors.inputBorder,
                  color: colors.text,
                },
              ]}
              placeholder="0"
              placeholderTextColor={colors.placeholder}
              maxLength={1}
              keyboardType="number-pad"
              value={digit}
              onChangeText={(value) => handleInputChange(index, value)}
              onKeyPress={({ nativeEvent }) => {
                if (nativeEvent.key === 'Backspace') {
                  handleBackspace(index, digit);
                }
              }}

            />
          ))}
        </View>

        {/* Resend */}
        <View style={styles.resendSection}>
          <Text style={[styles.resendText, { color: colors.subtext }]}>
            Didn't receive the code?{' '}
          </Text>
          {canResend ? (
            <TouchableOpacity
              onPress={() => {
                setTimer(60);
                setCanResend(false);
              }}
            >
              <Text style={styles.resendLink}>Resend now</Text>
            </TouchableOpacity>
          ) : (
            <Text style={[styles.resendTimer, { color: '#D9A54C' }]}>
              Resend in {formatTimer()}
            </Text>
          )}
        </View>

        {/* Verify Button */}
        <TouchableOpacity
          onPress={handleVerify}
          disabled={!isValid}
          activeOpacity={0.8}
          style={styles.buttonOuter}
        >
          {isValid ? (
            <LinearGradient
              colors={['#D9A54C', '#c9913e']}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>Verify & Continue</Text>
            </LinearGradient>
          ) : (
            <View style={[styles.buttonDisabled, { backgroundColor: colors.inputBorder }]}>
              <Text style={[styles.buttonText, { color: colors.subtext }]}>
                Verify & Continue
              </Text>
            </View>
          )}
        </TouchableOpacity>
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

  /* OTP Inputs */
  otpSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 8,
  },
  otpInput: {
    flex: 1,
    height: 56,
    borderWidth: 2,
    borderRadius: 12,
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
  },

  /* Resend */
  resendSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 28,
    gap: 4,
  },
  resendText: {
    fontSize: 13,
  },
  resendLink: {
    fontSize: 13,
    fontWeight: '600',
    color: '#D9A54C',
  },
  resendTimer: {
    fontSize: 13,
    fontWeight: '600',
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
});
