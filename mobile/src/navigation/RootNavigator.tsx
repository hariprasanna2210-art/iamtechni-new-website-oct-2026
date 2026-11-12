import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAppTheme } from '../theme/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { MobileJob } from '../context/JobContext';

import { SplashScreen } from '../screens/SplashScreen';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { SignUpScreen } from '../screens/SignUpScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { SearchScreen } from '../screens/SearchScreen';
import { JobDetailScreen } from '../screens/JobDetailScreen';
import { SavedJobsScreen } from '../screens/SavedJobsScreen';
import { JobAlertsScreen } from '../screens/JobAlertsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { EmployerRequestScreen } from '../screens/EmployerRequestScreen';
import { AboutScreen } from '../screens/AboutScreen';
import { AdminPortalScreen } from '../screens/AdminPortalScreen';

export type MainTab = 'HOME' | 'SEARCH' | 'SAVED' | 'ALERTS' | 'PROFILE';

export const RootNavigator: React.FC = () => {
  const { colors, isDark } = useAppTheme();
  const { user, token, isOnboarded, isLoading } = useAuth();

  const [showSplash, setShowSplash] = useState(true);
  const [authScreen, setAuthScreen] = useState<'LOGIN' | 'SIGNUP'>('LOGIN');
  const [activeTab, setActiveTab] = useState<MainTab>('HOME');
  const [selectedJob, setSelectedJob] = useState<MobileJob | null>(null);
  const [activeOverlay, setActiveOverlay] = useState<'NONE' | 'EMPLOYER_REQUEST' | 'ABOUT' | 'ADMIN'>('NONE');

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  // First time onboarding check
  if (!isOnboarded && !user) {
    return <OnboardingScreen onComplete={() => {}} />;
  }

  // Authentication check (Mandatory authentication)
  if (!user && !token) {
    if (authScreen === 'SIGNUP') {
      return (
        <SignUpScreen
          onNavigateToLogin={() => setAuthScreen('LOGIN')}
          onNavigateToTerms={() => setActiveOverlay('ABOUT')}
          onNavigateToPrivacy={() => setActiveOverlay('ABOUT')}
        />
      );
    }
    return (
      <LoginScreen
        onNavigateToSignUp={() => setAuthScreen('SIGNUP')}
        onNavigateToTerms={() => setActiveOverlay('ABOUT')}
        onNavigateToPrivacy={() => setActiveOverlay('ABOUT')}
      />
    );
  }

  // Active Overlays
  if (selectedJob) {
    return <JobDetailScreen job={selectedJob} onBack={() => setSelectedJob(null)} />;
  }

  if (activeOverlay === 'EMPLOYER_REQUEST') {
    return <EmployerRequestScreen onBack={() => setActiveOverlay('NONE')} />;
  }

  if (activeOverlay === 'ABOUT') {
    return <AboutScreen onBack={() => setActiveOverlay('NONE')} />;
  }

  if (activeOverlay === 'ADMIN') {
    return <AdminPortalScreen onBack={() => setActiveOverlay('NONE')} />;
  }

  // Main 5-Tab Navigation Bar
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Tab Screen Content */}
      <View style={styles.screenArea}>
        {activeTab === 'HOME' && (
          <HomeScreen
            onSelectJob={(j) => setSelectedJob(j)}
            onNavigateToSearch={() => setActiveTab('SEARCH')}
            onNavigateToSaved={() => setActiveTab('SAVED')}
            onNavigateToAlerts={() => setActiveTab('ALERTS')}
            onNavigateToEmployerRequest={() => setActiveOverlay('EMPLOYER_REQUEST')}
          />
        )}
        {activeTab === 'SEARCH' && (
          <SearchScreen onSelectJob={(j) => setSelectedJob(j)} />
        )}
        {activeTab === 'SAVED' && (
          <SavedJobsScreen
            onSelectJob={(j) => setSelectedJob(j)}
            onExploreJobs={() => setActiveTab('SEARCH')}
          />
        )}
        {activeTab === 'ALERTS' && <JobAlertsScreen />}
        {activeTab === 'PROFILE' && (
          <ProfileScreen
            onNavigateToAbout={() => setActiveOverlay('ABOUT')}
            onNavigateToEmployerRequest={() => setActiveOverlay('EMPLOYER_REQUEST')}
            onNavigateToAdmin={() => setActiveOverlay('ADMIN')}
          />
        )}
      </View>

      {/* Android Bottom Navigation Bar (Section 6) */}
      <View style={[styles.bottomBar, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
        <TouchableOpacity
          onPress={() => setActiveTab('HOME')}
          style={styles.tabButton}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabIcon, { color: activeTab === 'HOME' ? colors.primary : colors.textMuted }]}>
            🏠
          </Text>
          <Text style={[styles.tabLabel, { color: activeTab === 'HOME' ? colors.primary : colors.textMuted, fontWeight: activeTab === 'HOME' ? '800' : '500' }]}>
            Home
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab('SEARCH')}
          style={styles.tabButton}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabIcon, { color: activeTab === 'SEARCH' ? colors.primary : colors.textMuted }]}>
            🔍
          </Text>
          <Text style={[styles.tabLabel, { color: activeTab === 'SEARCH' ? colors.primary : colors.textMuted, fontWeight: activeTab === 'SEARCH' ? '800' : '500' }]}>
            Search
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab('SAVED')}
          style={styles.tabButton}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabIcon, { color: activeTab === 'SAVED' ? colors.primary : colors.textMuted }]}>
            ⭐
          </Text>
          <Text style={[styles.tabLabel, { color: activeTab === 'SAVED' ? colors.primary : colors.textMuted, fontWeight: activeTab === 'SAVED' ? '800' : '500' }]}>
            Saved
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab('ALERTS')}
          style={styles.tabButton}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabIcon, { color: activeTab === 'ALERTS' ? colors.primary : colors.textMuted }]}>
            🔔
          </Text>
          <Text style={[styles.tabLabel, { color: activeTab === 'ALERTS' ? colors.primary : colors.textMuted, fontWeight: activeTab === 'ALERTS' ? '800' : '500' }]}>
            Alerts
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab('PROFILE')}
          style={styles.tabButton}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabIcon, { color: activeTab === 'PROFILE' ? colors.primary : colors.textMuted }]}>
            👤
          </Text>
          <Text style={[styles.tabLabel, { color: activeTab === 'PROFILE' ? colors.primary : colors.textMuted, fontWeight: activeTab === 'PROFILE' ? '800' : '500' }]}>
            Profile
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  screenArea: {
    flex: 1,
  },
  bottomBar: {
    height: 64,
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingBottom: 4,
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabIcon: {
    fontSize: 20,
    marginBottom: 2,
  },
  tabLabel: {
    fontSize: 11,
  },
});
