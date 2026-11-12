import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useAppTheme } from '../theme/ThemeContext';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    icon: '🌐',
    title: 'Worldwide Job Search',
    subtitle: 'Discover verified jobs across India, United States, Europe, UAE, Singapore, and worldwide remote companies in one unified place.',
  },
  {
    icon: '🛡️',
    title: 'Permitted & Verified Sources',
    subtitle: 'Direct genuine application links to employer sites. Zero fake job forms, zero spam, and automated background feed updates.',
  },
  {
    icon: '🔔',
    title: 'Instant Job Alerts',
    subtitle: 'Receive tailored notifications the moment new matching roles open in your field, salary preference, or desired city.',
  },
];

export const OnboardingScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const { colors, isDark } = useAppTheme();
  const { completeOnboarding } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = async () => {
    if (currentIndex < SLIDES.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      await completeOnboarding();
      onComplete();
    }
  };

  const handleSkip = async () => {
    await completeOnboarding();
    onComplete();
  };

  const slide = SLIDES[currentIndex];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.topBar}>
        <View style={styles.brandRow}>
          <Text style={[styles.brandPrefix, { color: colors.textMuted }]}>Powered by</Text>
          <Text style={[styles.brandHighlight, { color: colors.primary }]}> IAMTECHNI</Text>
        </View>
        <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
          <Text style={[styles.skipText, { color: colors.textMuted }]}>Skip</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.body}>
        <View style={[styles.iconCircle, { backgroundColor: isDark ? '#1e293b' : '#eff6ff' }]}>
          <Text style={styles.icon}>{slide.icon}</Text>
        </View>

        <Text style={[styles.title, { color: colors.text }]}>{slide.title}</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{slide.subtitle}</Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                {
                  backgroundColor: i === currentIndex ? colors.primary : isDark ? '#334155' : '#cbd5e1',
                  width: i === currentIndex ? 24 : 8,
                },
              ]}
            />
          ))}
        </View>

        <TouchableOpacity
          onPress={handleNext}
          style={[styles.actionButton, { backgroundColor: colors.primary }]}
          activeOpacity={0.85}
        >
          <Text style={styles.actionButtonText}>
            {currentIndex === SLIDES.length - 1 ? 'Get Started' : 'Continue'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 56,
    paddingBottom: 40,
    justifyContent: 'space-between',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandPrefix: {
    fontSize: 12,
    fontWeight: '600',
  },
  brandHighlight: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  skipButton: {
    padding: 8,
  },
  skipText: {
    fontSize: 14,
    fontWeight: '600',
  },
  body: {
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  iconCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  icon: {
    fontSize: 50,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: width * 0.85,
  },
  footer: {
    gap: 24,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  actionButton: {
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#1d4ed8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});
