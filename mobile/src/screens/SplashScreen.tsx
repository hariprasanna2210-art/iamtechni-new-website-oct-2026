import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Image } from 'react-native';
import { useAppTheme } from '../theme/ThemeContext';
import { useAuth } from '../context/AuthContext';

export const SplashScreen: React.FC<{ onFinish: () => void }> = ({ onFinish }) => {
  const { colors, isDark } = useAppTheme();
  const { user, isOnboarded } = useAuth();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.92)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 900,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      onFinish();
    }, 2200);

    return () => clearTimeout(timer);
  }, [fadeAnim, scaleAnim, onFinish]);

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#090d16' : '#0f172a' }]}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <View style={styles.logoBadge}>
          <Text style={styles.logoIcon}>💼</Text>
        </View>

        <Text style={styles.appName}>Job Finder Pro</Text>
        
        <View style={styles.poweredContainer}>
          <Text style={styles.poweredLabel}>POWERED BY</Text>
          <Text style={styles.brandName}>IAMTECHNI</Text>
        </View>

        <Text style={styles.tagline}>
          Global Job Aggregator & Verified Employment Portal
        </Text>
      </Animated.View>

      <View style={styles.footer}>
        <Text style={styles.version}>v1.0.0 • Production Ready</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  content: {
    alignItems: 'center',
  },
  logoBadge: {
    width: 88,
    height: 88,
    borderRadius: 24,
    backgroundColor: '#1d4ed8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 18,
    elevation: 8,
  },
  logoIcon: {
    fontSize: 42,
  },
  appName: {
    fontSize: 32,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: -0.5,
    marginBottom: 12,
  },
  poweredContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    marginBottom: 16,
  },
  poweredLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#94a3b8',
    letterSpacing: 1.2,
    marginRight: 6,
  },
  brandName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#60a5fa',
    letterSpacing: 1.5,
  },
  tagline: {
    fontSize: 13,
    color: '#94a3b8',
    textAlign: 'center',
    maxWidth: 280,
    lineHeight: 18,
  },
  footer: {
    position: 'absolute',
    bottom: 32,
  },
  version: {
    fontSize: 11,
    color: '#64748b',
    letterSpacing: 0.5,
  },
});
