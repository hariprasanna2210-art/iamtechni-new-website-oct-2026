import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { useAppTheme } from '../theme/ThemeContext';

export const AboutScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { colors, isDark } = useAppTheme();

  const handleOpenLink = (url: string) => {
    Linking.openURL(url).catch((err) => console.warn('Could not open link:', err));
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.headerBar, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={[styles.backIcon, { color: colors.text }]}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>About Job Finder Pro</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Brand Card */}
        <View style={[styles.brandCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.logoBadge}>
            <Text style={{ fontSize: 36 }}>💼</Text>
          </View>
          <Text style={[styles.appName, { color: colors.text }]}>Job Finder Pro</Text>
          <View style={[styles.poweredPill, { backgroundColor: isDark ? '#1e293b' : '#eff6ff' }]}>
            <Text style={[styles.poweredText, { color: colors.primary }]}>
              POWERED BY IAMTECHNI
            </Text>
          </View>
          <Text style={[styles.versionTag, { color: colors.textMuted }]}>
            Version 1.0.0 (Production Release)
          </Text>
          <Text style={[styles.packageId, { color: colors.textMuted }]}>
            Package ID: in.iamtechni.jobfinderpro
          </Text>
        </View>

        {/* Mandatory Legal Disclaimer (Section 18) */}
        <View style={[styles.disclaimerCard, { backgroundColor: isDark ? '#161f30' : '#f8fafc', borderColor: colors.border }]}>
          <View style={styles.disclaimerHeader}>
            <Text style={{ fontSize: 18, marginRight: 8 }}>⚖️</Text>
            <Text style={[styles.disclaimerHeading, { color: colors.text }]}>Platform Legal Disclaimer</Text>
          </View>
          <Text style={[styles.disclaimerBody, { color: colors.textSecondary }]}>
            Job Finder Pro is a job information aggregation platform. We collect and display job information from permitted sources and administrator-published listings. We are not an employer, recruitment agency, or hiring authority. Job Finder Pro does not guarantee employment, job availability, salary accuracy, or recruitment outcomes. Users must verify job information directly with the employer before applying. External applications are handled by the respective employer or job provider.
          </Text>
        </View>

        {/* About IAMTECHNI */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>About IAMTECHNI</Text>
          <Text style={[styles.cardBody, { color: colors.textSecondary }]}>
            IAMTECHNI is a global technology and digital engineering solutions firm specializing in cloud architectures, AI systems, mobile development, cybersecurity, and enterprise digital transformation.
          </Text>
          <TouchableOpacity
            onPress={() => handleOpenLink('https://iamtechni.com')}
            style={[styles.linkBtn, { borderColor: colors.border }]}
          >
            <Text style={[styles.linkBtnText, { color: colors.primary }]}>Visit iamtechni.com ↗</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Links */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Compliance & Support</Text>

          <TouchableOpacity
            onPress={() => handleOpenLink('https://iamtechni.com/privacy-policy')}
            style={[styles.linkRow, { borderBottomColor: colors.border }]}
          >
            <Text style={[styles.linkTitle, { color: colors.text }]}>Privacy Policy</Text>
            <Text style={[styles.linkArrow, { color: colors.textMuted }]}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleOpenLink('https://iamtechni.com/terms')}
            style={[styles.linkRow, { borderBottomColor: colors.border }]}
          >
            <Text style={[styles.linkTitle, { color: colors.text }]}>Terms & Conditions</Text>
            <Text style={[styles.linkArrow, { color: colors.textMuted }]}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleOpenLink('mailto:support@iamtechni.com')}
            style={styles.linkRow}
          >
            <Text style={[styles.linkTitle, { color: colors.text }]}>Contact Support (support@iamtechni.com)</Text>
            <Text style={[styles.linkArrow, { color: colors.textMuted }]}>→</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.copyright, { color: colors.textMuted }]}>
            © {new Date().getFullYear()} IAMTECHNI. All rights reserved.
          </Text>
          <Text style={[styles.copyrightSub, { color: colors.textMuted }]}>
            Built with React Native, Expo, and TypeScript for Android.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 44,
  },
  headerBar: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  backBtn: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 22,
    fontWeight: '700',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 60,
  },
  brandCard: {
    padding: 24,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: 16,
  },
  logoBadge: {
    width: 68,
    height: 68,
    borderRadius: 20,
    backgroundColor: '#1d4ed8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  appName: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 6,
  },
  poweredPill: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    marginBottom: 8,
  },
  poweredText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  versionTag: {
    fontSize: 12,
    marginBottom: 2,
  },
  packageId: {
    fontSize: 11,
    fontFamily: 'monospace',
  },
  disclaimerCard: {
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  disclaimerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  disclaimerHeading: {
    fontSize: 14,
    fontWeight: '800',
  },
  disclaimerBody: {
    fontSize: 13,
    lineHeight: 20,
  },
  card: {
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 8,
  },
  cardBody: {
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 14,
  },
  linkBtn: {
    height: 42,
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  linkBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
  linkRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  linkTitle: {
    fontSize: 13,
    fontWeight: '600',
  },
  linkArrow: {
    fontSize: 14,
  },
  footer: {
    alignItems: 'center',
    paddingTop: 10,
  },
  copyright: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  copyrightSub: {
    fontSize: 11,
  },
});
