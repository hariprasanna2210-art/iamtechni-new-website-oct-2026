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

export const SignUpScreen: React.FC<{
  onNavigateToLogin: () => void;
  onNavigateToTerms: () => void;
  onNavigateToPrivacy: () => void;
}> = ({ onNavigateToLogin, onNavigateToTerms, onNavigateToPrivacy }) => {
  const { colors, isDark } = useAppTheme();
  const { signUpWithEmail, loginWithGoogle } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSignUp = async () => {
    setErrorMessage('');

    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }
    if (!acceptedTerms) {
      setErrorMessage('Please accept the Terms & Conditions to proceed.');
      return;
    }

    setIsLoading(true);
    const result = await signUpWithEmail({
      fullName,
      email,
      mobileNumber: mobileNumber || undefined,
      password,
    });
    setIsLoading(false);

    if (!result.success) {
      setErrorMessage(result.error || 'Failed to create account.');
    }
  };

  const handleGoogleSignUp = async () => {
    setErrorMessage('');
    setIsGoogleLoading(true);
    const result = await loginWithGoogle();
    setIsGoogleLoading(false);

    if (!result.success) {
      setErrorMessage(result.error || 'Google Sign-Up failed.');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Create Account</Text>
          <Text style={[styles.brandSubtitle, { color: colors.textSecondary }]}>
            Join Job Finder Pro • <Text style={{ color: colors.primary, fontWeight: '700' }}>Powered by IAMTECHNI</Text>
          </Text>
        </View>

        {Boolean(errorMessage) && (
          <View style={[styles.alertBox, { backgroundColor: isDark ? '#450a0a' : '#fef2f2', borderColor: '#ef4444' }]}>
            <Text style={[styles.alertText, { color: '#ef4444' }]}>{errorMessage}</Text>
          </View>
        )}

        {/* Google Quick Sign Up */}
        <TouchableOpacity
          onPress={handleGoogleSignUp}
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
              <Text style={[styles.googleText, { color: colors.text }]}>Sign up with Google</Text>
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.dividerRow}>
          <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
          <Text style={[styles.dividerText, { color: colors.textMuted }]}>or register with email</Text>
          <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
        </View>

        {/* Full Name */}
        <View style={styles.inputGroup}>
          <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Full Name *</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
            placeholder="John Doe"
            placeholderTextColor={colors.textMuted}
            value={fullName}
            onChangeText={setFullName}
          />
        </View>

        {/* Email */}
        <View style={styles.inputGroup}>
          <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Email Address *</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
            placeholder="john.doe@example.com"
            placeholderTextColor={colors.textMuted}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        {/* Mobile Number (Optional) */}
        <View style={styles.inputGroup}>
          <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Mobile Number (Optional)</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
            placeholder="+91 98765 43210"
            placeholderTextColor={colors.textMuted}
            keyboardType="phone-pad"
            value={mobileNumber}
            onChangeText={setMobileNumber}
          />
        </View>

        {/* Password */}
        <View style={styles.inputGroup}>
          <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Password (Min. 8 characters) *</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
            placeholder="Create a secure password"
            placeholderTextColor={colors.textMuted}
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
        </View>

        {/* Confirm Password */}
        <View style={styles.inputGroup}>
          <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Confirm Password *</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
            placeholder="Repeat password"
            placeholderTextColor={colors.textMuted}
            secureTextEntry={!showPassword}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
        </View>

        {/* Accept Terms Checkbox */}
        <TouchableOpacity
          style={styles.checkboxRow}
          onPress={() => setAcceptedTerms(!acceptedTerms)}
          activeOpacity={0.8}
        >
          <View
            style={[
              styles.checkbox,
              {
                borderColor: acceptedTerms ? colors.primary : colors.border,
                backgroundColor: acceptedTerms ? colors.primary : 'transparent',
              },
            ]}
          >
            {acceptedTerms && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={[styles.checkboxLabel, { color: colors.textSecondary }]}>
            I agree to the{' '}
            <Text onPress={onNavigateToTerms} style={{ color: colors.primary, fontWeight: '700' }}>
              Terms & Conditions
            </Text>{' '}
            and{' '}
            <Text onPress={onNavigateToPrivacy} style={{ color: colors.primary, fontWeight: '700' }}>
              Privacy Policy
            </Text>
          </Text>
        </TouchableOpacity>

        {/* Submit Button */}
        <TouchableOpacity
          onPress={handleSignUp}
          disabled={isLoading || isGoogleLoading}
          style={[styles.submitButton, { backgroundColor: colors.primary }]}
          activeOpacity={0.85}
        >
          {isLoading ? (
            <ActivityIndicator color="#ffffff" size="small" />
          ) : (
            <Text style={styles.submitButtonText}>Create Account</Text>
          )}
        </TouchableOpacity>

        {/* Back to Login */}
        <View style={styles.switchRow}>
          <Text style={{ color: colors.textMuted, fontSize: 14 }}>Already have an account? </Text>
          <TouchableOpacity onPress={onNavigateToLogin}>
            <Text style={{ color: colors.primary, fontSize: 14, fontWeight: '700' }}>Log In</Text>
          </TouchableOpacity>
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
    paddingTop: 40,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 4,
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
    height: 50,
    borderRadius: 14,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
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
    marginBottom: 18,
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
    marginBottom: 14,
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
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 14,
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
  checkboxLabel: {
    fontSize: 13,
    flex: 1,
    lineHeight: 18,
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
  },
});
