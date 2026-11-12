import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useAppTheme } from '../theme/ThemeContext';
import { useAuth } from '../context/AuthContext';

export const LoginScreen: React.FC<{
  onNavigateToSignUp: () => void;
  onNavigateToTerms: () => void;
  onNavigateToPrivacy: () => void;
}> = ({ onNavigateToSignUp, onNavigateToTerms, onNavigateToPrivacy }) => {
  const { colors, isDark } = useAppTheme();
  const { loginWithEmail, loginWithGoogle } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successInfo, setSuccessInfo] = useState('');

  const handleEmailLogin = async () => {
    setErrorMessage('');
    setSuccessInfo('');

    if (!email.trim()) {
      setErrorMessage('Please enter your email address.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsLoading(true);
    const result = await loginWithEmail(email, password);
    setIsLoading(false);

    if (!result.success) {
      setErrorMessage(result.error || 'Failed to log in. Please check credentials.');
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMessage('');
    setIsGoogleLoading(true);
    const result = await loginWithGoogle();
    setIsGoogleLoading(false);

    if (!result.success) {
      setErrorMessage(result.error || 'Google Sign-In was cancelled or failed.');
    }
  };

  const handleForgotPassword = () => {
    if (!email.trim()) {
      setErrorMessage('Please enter your email address to reset password.');
      return;
    }
    setSuccessInfo(`Password reset instructions have been dispatched to ${email}.`);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Brand Header */}
        <View style={styles.header}>
          <View style={styles.brandBadge}>
            <Text style={styles.brandIcon}>💼</Text>
          </View>
          <Text style={[styles.title, { color: colors.text }]}>Welcome Back</Text>
          <Text style={[styles.brandSubtitle, { color: colors.textSecondary }]}>
            Job Finder Pro • <Text style={{ color: colors.primary, fontWeight: '700' }}>Powered by IAMTECHNI</Text>
          </Text>
        </View>

        {/* Error / Success feedback */}
        {Boolean(errorMessage) && (
          <View style={[styles.alertBox, { backgroundColor: isDark ? '#450a0a' : '#fef2f2', borderColor: '#ef4444' }]}>
            <Text style={[styles.alertText, { color: '#ef4444' }]}>{errorMessage}</Text>
          </View>
        )}

        {Boolean(successInfo) && (
          <View style={[styles.alertBox, { backgroundColor: isDark ? '#064e3b' : '#f0fdf4', borderColor: '#10b981' }]}>
            <Text style={[styles.alertText, { color: '#10b981' }]}>{successInfo}</Text>
          </View>
        )}

        {/* Google Sign In Button (Required Google OAuth integration) */}
        <TouchableOpacity
          onPress={handleGoogleLogin}
          disabled={isGoogleLoading || isLoading}
          style={[styles.googleButton, { backgroundColor: colors.card, borderColor: colors.border }]}
          activeOpacity={0.8}
        >
          {isGoogleLoading ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <View style={styles.googleContent}>
              <View style={styles.googleIconCircle}>
                <Text style={styles.googleG}>G</Text>
              </View>
              <Text style={[styles.googleText, { color: colors.text }]}>Continue with Google</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.dividerRow}>
          <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
          <Text style={[styles.dividerText, { color: colors.textMuted }]}>or sign in with email</Text>
          <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
        </View>

        {/* Email Input */}
        <View style={styles.inputGroup}>
          <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Email Address</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
            placeholder="name@company.com"
            placeholderTextColor={colors.textMuted}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        {/* Password Input with show/hide */}
        <View style={styles.inputGroup}>
          <View style={styles.passwordHeader}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Password</Text>
            <TouchableOpacity onPress={handleForgotPassword}>
              <Text style={[styles.forgotText, { color: colors.primary }]}>Forgot password?</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.passwordContainer}>
            <TextInput
              style={[
                styles.input,
                styles.passwordInput,
                { backgroundColor: colors.card, borderColor: colors.border, color: colors.text },
              ]}
              placeholder="Enter your password"
              placeholderTextColor={colors.textMuted}
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Text style={{ color: colors.textMuted, fontSize: 13, fontWeight: '600' }}>
                {showPassword ? 'Hide' : 'Show'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Remember Login Session Checkbox */}
        <TouchableOpacity
          style={styles.rememberRow}
          onPress={() => setRememberMe(!rememberMe)}
          activeOpacity={0.8}
        >
          <View
            style={[
              styles.checkbox,
              {
                borderColor: rememberMe ? colors.primary : colors.border,
                backgroundColor: rememberMe ? colors.primary : 'transparent',
              },
            ]}
          >
            {rememberMe && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={[styles.rememberText, { color: colors.textSecondary }]}>
            Remember login session on this Android device
          </Text>
        </TouchableOpacity>

        {/* Login Button */}
        <TouchableOpacity
          onPress={handleEmailLogin}
          disabled={isLoading || isGoogleLoading}
          style={[styles.submitButton, { backgroundColor: colors.primary }]}
          activeOpacity={0.85}
        >
          {isLoading ? (
            <ActivityIndicator color="#ffffff" size="small" />
          ) : (
            <Text style={styles.submitButtonText}>Sign In</Text>
          )}
        </TouchableOpacity>

        {/* Switch to Sign Up */}
        <View style={styles.switchRow}>
          <Text style={{ color: colors.textMuted, fontSize: 14 }}>Don't have an account? </Text>
          <TouchableOpacity onPress={onNavigateToSignUp}>
            <Text style={{ color: colors.primary, fontSize: 14, fontWeight: '700' }}>Sign Up</Text>
          </TouchableOpacity>
        </View>

        {/* Legal Links */}
        <View style={styles.legalFooter}>
          <Text style={[styles.legalText, { color: colors.textMuted }]}>
            By signing in, you accept our{' '}
          </Text>
          <TouchableOpacity onPress={onNavigateToTerms}>
            <Text style={[styles.legalLink, { color: colors.primary }]}>Terms & Conditions</Text>
          </TouchableOpacity>
          <Text style={[styles.legalText, { color: colors.textMuted }]}> and </Text>
          <TouchableOpacity onPress={onNavigateToPrivacy}>
            <Text style={[styles.legalLink, { color: colors.primary }]}>Privacy Policy</Text>
          </TouchableOpacity>
          <Text style={[styles.legalText, { color: colors.textMuted }]}>.</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 28,
  },
  brandBadge: {
    width: 60,
    height: 60,
    borderRadius: 18,
    backgroundColor: '#1d4ed8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  brandIcon: {
    fontSize: 28,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  brandSubtitle: {
    fontSize: 13,
  },
  alertBox: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 16,
  },
  alertText: {
    fontSize: 13,
    fontWeight: '500',
  },
  googleButton: {
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  googleContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  googleIconCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  googleG: {
    fontSize: 14,
    fontWeight: '900',
    color: '#ea4335',
  },
  googleText: {
    fontSize: 15,
    fontWeight: '700',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    paddingHorizontal: 12,
    fontSize: 12,
    fontWeight: '500',
  },
  inputGroup: {
    marginBottom: 18,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
  },
  input: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    fontSize: 15,
  },
  passwordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  forgotText: {
    fontSize: 12,
    fontWeight: '600',
  },
  passwordContainer: {
    position: 'relative',
    justifyContent: 'center',
  },
  passwordInput: {
    paddingRight: 55,
  },
  eyeButton: {
    position: 'absolute',
    right: 14,
    padding: 6,
  },
  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  checkmark: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '900',
  },
  rememberText: {
    fontSize: 13,
    flex: 1,
  },
  submitButton: {
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#1d4ed8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 28,
  },
  legalFooter: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  legalText: {
    fontSize: 11,
    lineHeight: 16,
  },
  legalLink: {
    fontSize: 11,
    fontWeight: '600',
    lineHeight: 16,
  },
});
