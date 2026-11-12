import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  Switch,
} from 'react-native';
import { useAppTheme, ThemeMode } from '../theme/ThemeContext';
import { useAuth } from '../context/AuthContext';

export const ProfileScreen: React.FC<{
  onNavigateToAbout: () => void;
  onNavigateToEmployerRequest: () => void;
  onNavigateToAdmin: () => void;
}> = ({ onNavigateToAbout, onNavigateToEmployerRequest, onNavigateToAdmin }) => {
  const { colors, isDark, themeMode, setThemeMode } = useAppTheme();
  const { user, updateProfile, deleteAccount, logout } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [headline, setHeadline] = useState(user?.headline || '');
  const [mobileNumber, setMobileNumber] = useState(user?.mobileNumber || '');
  const [city, setCity] = useState(user?.city || 'Bengaluru');
  const [country, setCountry] = useState(user?.country || 'India');
  const [resumeUploaded, setResumeUploaded] = useState(Boolean(user?.resumeFileName));
  const [resumeFileName, setResumeFileName] = useState(user?.resumeFileName || 'Resume_2026.pdf');
  const [saveFeedback, setSaveFeedback] = useState('');

  const handleSaveProfile = async () => {
    const success = await updateProfile({
      fullName,
      headline,
      mobileNumber,
      city,
      country,
      resumeFileName: resumeUploaded ? resumeFileName : undefined,
    });
    if (success) {
      setSaveFeedback('Profile successfully updated.');
      setIsEditing(false);
      setTimeout(() => setSaveFeedback(''), 3000);
    }
  };

  const handleToggleResume = () => {
    if (resumeUploaded) {
      setResumeUploaded(false);
      setResumeFileName('');
    } else {
      setResumeUploaded(true);
      setResumeFileName(`${(fullName || 'User').replace(/\s+/g, '_')}_CV.pdf`);
    }
  };

  const handleDeleteAccountConfirm = () => {
    // In React Native mobile, show confirmation dialog
    if (typeof window !== 'undefined' && window.confirm) {
      if (window.confirm('Are you sure you want to delete your Job Finder Pro account? This action cannot be undone.')) {
        deleteAccount();
      }
    } else {
      Alert.alert(
        'Delete Account',
        'Are you sure you want to permanently delete your account and all saved data?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Delete', style: 'destructive', onPress: () => deleteAccount() },
        ]
      );
    }
  };

  const themeOptions: { label: string; mode: ThemeMode }[] = [
    { label: 'System Default', mode: 'SYSTEM' },
    { label: 'Light', mode: 'LIGHT' },
    { label: 'Dark', mode: 'DARK' },
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Candidate Profile</Text>
        <TouchableOpacity
          onPress={() => (isEditing ? handleSaveProfile() : setIsEditing(true))}
          style={[styles.editBtn, { backgroundColor: colors.primaryContainer }]}
        >
          <Text style={[styles.editBtnText, { color: colors.primary }]}>
            {isEditing ? 'Save Changes' : 'Edit Profile'}
          </Text>
        </TouchableOpacity>
      </View>

      {Boolean(saveFeedback) && (
        <View style={[styles.feedbackBanner, { backgroundColor: '#ecfdf5', borderColor: '#10b981' }]}>
          <Text style={{ color: '#047857', fontSize: 13, fontWeight: '600' }}>✓ {saveFeedback}</Text>
        </View>
      )}

      {/* Profile Card */}
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.userRow}>
          {user?.avatarUrl ? (
            <Image source={{ uri: user.avatarUrl }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatarFallback, { backgroundColor: colors.primary }]}>
              <Text style={styles.avatarLetter}>
                {user?.fullName?.charAt(0) || 'U'}
              </Text>
            </View>
          )}

          <View style={{ flex: 1 }}>
            <Text style={[styles.userName, { color: colors.text }]}>{user?.fullName || 'Job Seeker'}</Text>
            <Text style={[styles.userEmail, { color: colors.textSecondary }]}>{user?.email}</Text>
            <Text style={[styles.userHeadline, { color: colors.textMuted }]}>
              {user?.headline || 'Open to global opportunities'}
            </Text>
          </View>
        </View>

        {isEditing ? (
          <View style={styles.editSection}>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>Full Name</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                value={fullName}
                onChangeText={setFullName}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>Professional Headline</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                placeholder="e.g. Senior Mobile Engineer"
                placeholderTextColor={colors.textMuted}
                value={headline}
                onChangeText={setHeadline}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>Mobile Number</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                value={mobileNumber}
                onChangeText={setMobileNumber}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>City</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                value={city}
                onChangeText={setCity}
              />
            </View>
          </View>
        ) : (
          <View style={[styles.infoGrid, { borderTopColor: colors.border }]}>
            <View style={styles.infoCol}>
              <Text style={[styles.infoLabel, { color: colors.textMuted }]}>Country</Text>
              <Text style={[styles.infoVal, { color: colors.text }]}>{user?.country || 'India'}</Text>
            </View>
            <View style={styles.infoCol}>
              <Text style={[styles.infoLabel, { color: colors.textMuted }]}>Location</Text>
              <Text style={[styles.infoVal, { color: colors.text }]}>{user?.city || 'Bengaluru'}</Text>
            </View>
            <View style={styles.infoCol}>
              <Text style={[styles.infoLabel, { color: colors.textMuted }]}>Target Salary</Text>
              <Text style={[styles.infoVal, { color: colors.text }]}>₹ 18L – 28L / yr</Text>
            </View>
          </View>
        )}
      </View>

      {/* Resume Section */}
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>Resume / Curriculum Vitae</Text>
        <Text style={[styles.cardSub, { color: colors.textMuted }]}>
          Upload or link your latest resume for fast job applications.
        </Text>

        {resumeUploaded ? (
          <View style={[styles.resumeRow, { backgroundColor: isDark ? '#1e293b' : '#f1f5f9' }]}>
            <Text style={{ fontSize: 24, marginRight: 10 }}>📄</Text>
            <View style={{ flex: 1 }}>
              <Text style={[styles.resumeName, { color: colors.text }]}>{resumeFileName}</Text>
              <Text style={[styles.resumeSize, { color: colors.textMuted }]}>PDF • Verified Document</Text>
            </View>
            <TouchableOpacity onPress={handleToggleResume}>
              <Text style={{ color: '#ef4444', fontWeight: '600', fontSize: 13 }}>Remove</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            onPress={handleToggleResume}
            style={[styles.uploadBox, { borderColor: colors.primary }]}
            activeOpacity={0.8}
          >
            <Text style={styles.uploadIcon}>📎</Text>
            <Text style={[styles.uploadTitle, { color: colors.primary }]}>Attach Candidate Resume (PDF)</Text>
            <Text style={[styles.uploadNote, { color: colors.textMuted }]}>Max size 5 MB • Standard format</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Automatic Mobile Dark & Light Theme Section (Section 4) */}
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>Theme & Appearance</Text>
        <Text style={[styles.cardSub, { color: colors.textMuted }]}>
          Automatically follow your Android system theme or customize your preference.
        </Text>

        <View style={styles.themeOptionsGrid}>
          {themeOptions.map((opt) => {
            const isSelected = themeMode === opt.mode;
            return (
              <TouchableOpacity
                key={opt.mode}
                onPress={() => setThemeMode(opt.mode)}
                style={[
                  styles.themeOptionBtn,
                  {
                    backgroundColor: isSelected ? colors.primary : isDark ? '#1e293b' : '#f1f5f9',
                    borderColor: isSelected ? colors.primary : colors.border,
                  },
                ]}
              >
                <Text style={[styles.themeOptionText, { color: isSelected ? '#ffffff' : colors.text }]}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={[styles.currentThemeNote, { color: colors.textMuted }]}>
          Current theme: <Text style={{ fontWeight: '700', color: colors.text }}>{isDark ? 'Dark Mode' : 'Light Mode'}</Text>{' '}
          {themeMode === 'SYSTEM' ? '(Following Android OS)' : '(Manual Override)'}
        </Text>
      </View>

      {/* Employer / Hiring Portal Shortcut (Section 14) */}
      <TouchableOpacity
        onPress={onNavigateToEmployerRequest}
        style={[styles.employerBanner, { backgroundColor: isDark ? '#1e3a8a30' : '#eff6ff', borderColor: colors.primary }]}
        activeOpacity={0.85}
      >
        <View style={{ flex: 1 }}>
          <Text style={[styles.employerBannerTitle, { color: colors.primary }]}>
            Are you an Employer or Recruiter?
          </Text>
          <Text style={[styles.employerBannerSub, { color: colors.textSecondary }]}>
            Contact IAMTECHNI administration to request a job listing.
          </Text>
        </View>
        <Text style={{ fontSize: 20 }}>🏢</Text>
      </TouchableOpacity>

      {/* Admin Login Gateway (Section 13) */}
      <TouchableOpacity
        onPress={onNavigateToAdmin}
        style={[styles.menuRow, { backgroundColor: colors.card, borderColor: colors.border }]}
      >
        <View style={styles.menuLeft}>
          <Text style={styles.menuIcon}>🔒</Text>
          <View>
            <Text style={[styles.menuTitle, { color: colors.text }]}>Admin Panel</Text>
            <Text style={[styles.menuSub, { color: colors.textMuted }]}>Authorized IAMTECHNI Staff Only</Text>
          </View>
        </View>
        <Text style={[styles.menuArrow, { color: colors.textMuted }]}>→</Text>
      </TouchableOpacity>

      {/* About & Disclaimer Shortcut (Section 18) */}
      <TouchableOpacity
        onPress={onNavigateToAbout}
        style={[styles.menuRow, { backgroundColor: colors.card, borderColor: colors.border }]}
      >
        <View style={styles.menuLeft}>
          <Text style={styles.menuIcon}>ℹ️</Text>
          <View>
            <Text style={[styles.menuTitle, { color: colors.text }]}>About & Disclaimer</Text>
            <Text style={[styles.menuSub, { color: colors.textMuted }]}>Job Finder Pro – Powered by IAMTECHNI</Text>
          </View>
        </View>
        <Text style={[styles.menuArrow, { color: colors.textMuted }]}>→</Text>
      </TouchableOpacity>

      {/* Account Actions */}
      <View style={styles.accountActionSection}>
        <TouchableOpacity onPress={logout} style={[styles.logoutBtn, { borderColor: colors.border }]}>
          <Text style={[styles.logoutText, { color: colors.text }]}>Sign Out of Session</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleDeleteAccountConfirm} style={styles.deleteBtn}>
          <Text style={styles.deleteText}>Delete Job Finder Pro Account</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  editBtn: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
  },
  editBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  feedbackBanner: {
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 16,
  },
  card: {
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  cardSub: {
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 14,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 14,
  },
  avatarFallback: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  avatarLetter: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '800',
  },
  userName: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 13,
    marginBottom: 2,
  },
  userHeadline: {
    fontSize: 12,
  },
  infoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    paddingTop: 12,
  },
  infoCol: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 10,
    fontWeight: '600',
    marginBottom: 2,
  },
  infoVal: {
    fontSize: 12,
    fontWeight: '700',
  },
  editSection: {
    marginTop: 10,
  },
  inputGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  input: {
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    fontSize: 14,
  },
  resumeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
  },
  resumeName: {
    fontSize: 13,
    fontWeight: '700',
  },
  resumeSize: {
    fontSize: 11,
  },
  uploadBox: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
  },
  uploadIcon: {
    fontSize: 22,
    marginBottom: 4,
  },
  uploadTitle: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 2,
  },
  uploadNote: {
    fontSize: 11,
  },
  themeOptionsGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  themeOptionBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
  },
  themeOptionText: {
    fontSize: 12,
    fontWeight: '700',
  },
  currentThemeNote: {
    fontSize: 11,
    fontStyle: 'italic',
  },
  employerBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 14,
  },
  employerBannerTitle: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 2,
  },
  employerBannerSub: {
    fontSize: 12,
  },
  menuRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 12,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  menuTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  menuSub: {
    fontSize: 11,
  },
  menuArrow: {
    fontSize: 16,
  },
  accountActionSection: {
    marginTop: 10,
    alignItems: 'center',
    gap: 12,
  },
  logoutBtn: {
    width: '100%',
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 14,
    fontWeight: '700',
  },
  deleteBtn: {
    padding: 10,
  },
  deleteText: {
    color: '#ef4444',
    fontSize: 12,
    fontWeight: '600',
  },
});
