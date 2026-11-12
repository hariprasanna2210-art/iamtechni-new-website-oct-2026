import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Linking,
  Modal,
} from 'react-native';
import { useAppTheme } from '../theme/ThemeContext';
import { useJobs, MobileJob } from '../context/JobContext';

export const JobDetailScreen: React.FC<{
  job: MobileJob;
  onBack: () => void;
}> = ({ job, onBack }) => {
  const { colors, isDark } = useAppTheme();
  const { toggleSaveJob, isJobSaved, trackApplyClick } = useJobs();

  const [isApplyNoticeVisible, setIsApplyNoticeVisible] = useState(false);
  const saved = isJobSaved(job.id);

  const salaryDisplay = job.isSalaryDisclosed && job.salaryMin
    ? `${job.salaryCurrency} ${job.salaryMin.toLocaleString()}${job.salaryMax ? ` – ${job.salaryMax.toLocaleString()}` : ''} / ${job.salaryPeriod}`
    : 'Competitive Salary Disclosed upon Interview';

  const handleApplyPress = () => {
    setIsApplyNoticeVisible(true);
  };

  const handleConfirmExternalApply = async () => {
    setIsApplyNoticeVisible(false);
    await trackApplyClick(job.id);
    if (job.applicationUrl) {
      Linking.openURL(job.applicationUrl).catch((err) => {
        console.warn('Could not open external URL:', err);
      });
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Top Header Bar */}
      <View style={[styles.headerBar, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={[styles.backIcon, { color: colors.text }]}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]} numberOfLines={1}>
          Job Details
        </Text>
        <TouchableOpacity
          onPress={() => toggleSaveJob(job)}
          style={[styles.saveHeaderBtn, { backgroundColor: saved ? colors.primaryContainer : colors.card }]}
        >
          <Text style={{ fontSize: 18 }}>{saved ? '★' : '☆'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Company & Role Card */}
        <View style={[styles.mainCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.companyRow}>
            {job.companyLogo ? (
              <Image source={{ uri: job.companyLogo }} style={styles.companyLogo} />
            ) : (
              <View style={[styles.logoFallback, { backgroundColor: colors.primaryContainer }]}>
                <Text style={{ color: colors.primary, fontWeight: '800', fontSize: 18 }}>
                  {job.companyName.charAt(0)}
                </Text>
              </View>
            )}
            <View style={{ flex: 1 }}>
              <Text style={[styles.title, { color: colors.text }]}>{job.title}</Text>
              <Text style={[styles.companyName, { color: colors.textSecondary }]}>
                {job.companyName}
              </Text>
            </View>
          </View>

          {/* Quick Attribute Badges */}
          <View style={styles.badgeGrid}>
            <View style={[styles.badge, { backgroundColor: isDark ? '#1e293b' : '#f1f5f9' }]}>
              <Text style={[styles.badgeLabel, { color: colors.textMuted }]}>Location</Text>
              <Text style={[styles.badgeValue, { color: colors.text }]}>
                📍 {job.city}, {job.country}
              </Text>
            </View>
            <View style={[styles.badge, { backgroundColor: isDark ? '#1e293b' : '#f1f5f9' }]}>
              <Text style={[styles.badgeLabel, { color: colors.textMuted }]}>Work Setup</Text>
              <Text style={[styles.badgeValue, { color: colors.text }]}>
                {job.workLocationType === 'REMOTE' ? '🏠 Remote' : job.workLocationType === 'HYBRID' ? '🏢 Hybrid' : '📍 On-site'}
              </Text>
            </View>
            <View style={[styles.badge, { backgroundColor: isDark ? '#1e293b' : '#f1f5f9' }]}>
              <Text style={[styles.badgeLabel, { color: colors.textMuted }]}>Employment</Text>
              <Text style={[styles.badgeValue, { color: colors.text }]}>
                💼 {job.employmentType.replace('_', ' ')}
              </Text>
            </View>
            <View style={[styles.badge, { backgroundColor: isDark ? '#1e293b' : '#f1f5f9' }]}>
              <Text style={[styles.badgeLabel, { color: colors.textMuted }]}>Experience</Text>
              <Text style={[styles.badgeValue, { color: colors.text }]}>
                ⏳ {job.experienceRequirement}
              </Text>
            </View>
          </View>

          {/* Salary Highlight */}
          <View style={[styles.salaryBanner, { backgroundColor: isDark ? '#1e3a8a30' : '#eff6ff', borderColor: colors.primary }]}>
            <Text style={[styles.salaryLabel, { color: colors.primary }]}>COMPENSATION</Text>
            <Text style={[styles.salaryValue, { color: colors.text }]}>{salaryDisplay}</Text>
          </View>

          {/* Source Verification Badge */}
          <View style={styles.sourceBox}>
            <Text style={[styles.sourceText, { color: colors.textMuted }]}>
              Verified Source: <Text style={{ color: colors.text, fontWeight: '700' }}>{job.sourceName}</Text>
              {job.adminPosted && ' (Direct IAMTECHNI Administrator Verified)'}
            </Text>
          </View>
        </View>

        {/* Required Skills */}
        {job.requiredSkills && job.requiredSkills.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Required Skills</Text>
            <View style={styles.skillsRow}>
              {job.requiredSkills.map((skill, index) => (
                <View
                  key={index}
                  style={[styles.skillChip, { backgroundColor: isDark ? '#1e293b' : '#f1f5f9', borderColor: colors.border }]}
                >
                  <Text style={[styles.skillText, { color: colors.textSecondary }]}>{skill}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Job Description */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Job Description</Text>
          <Text style={[styles.bodyText, { color: colors.textSecondary }]}>{job.description}</Text>
        </View>

        {/* Key Responsibilities */}
        {job.responsibilities && job.responsibilities.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Key Responsibilities</Text>
            {job.responsibilities.map((resp, i) => (
              <View key={i} style={styles.bulletRow}>
                <Text style={[styles.bulletDot, { color: colors.primary }]}>•</Text>
                <Text style={[styles.bulletText, { color: colors.textSecondary }]}>{resp}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Qualifications */}
        {job.qualifications && job.qualifications.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Qualifications & Requirements</Text>
            {job.qualifications.map((qual, i) => (
              <View key={i} style={styles.bulletRow}>
                <Text style={[styles.bulletDot, { color: colors.primary }]}>✓</Text>
                <Text style={[styles.bulletText, { color: colors.textSecondary }]}>{qual}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Additional Candidate Information */}
        <View style={[styles.infoCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.infoCardTitle, { color: colors.text }]}>Candidate Details</Text>
          <View style={styles.infoRow}>
            <Text style={[styles.infoKey, { color: colors.textMuted }]}>Education Requirement:</Text>
            <Text style={[styles.infoVal, { color: colors.text }]}>{job.educationRequirement}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.infoKey, { color: colors.textMuted }]}>Visa Sponsorship:</Text>
            <Text style={[styles.infoVal, { color: colors.text }]}>{job.visaSponsorship ? 'Available' : 'Not Provided'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.infoKey, { color: colors.textMuted }]}>Relocation Assistance:</Text>
            <Text style={[styles.infoVal, { color: colors.text }]}>{job.relocationAssistance ? 'Yes' : 'No'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.infoKey, { color: colors.textMuted }]}>Immediate Joining:</Text>
            <Text style={[styles.infoVal, { color: colors.text }]}>{job.immediateJoining ? 'Preferred' : 'Standard notice accepted'}</Text>
          </View>
        </View>

        {/* About Company */}
        {Boolean(job.companyDescription) && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>About {job.companyName}</Text>
            <Text style={[styles.bodyText, { color: colors.textSecondary }]}>{job.companyDescription}</Text>
          </View>
        )}

        {/* Platform Legal Disclaimer */}
        <View style={[styles.disclaimerCard, { backgroundColor: isDark ? '#1e293b50' : '#f8fafc', borderColor: colors.border }]}>
          <Text style={[styles.disclaimerTitle, { color: colors.textMuted }]}>PLATFORM VERIFICATION NOTICE</Text>
          <Text style={[styles.disclaimerText, { color: colors.textMuted }]}>
            Job Finder Pro powered by IAMTECHNI aggregates and verifies genuine employment postings from official channels. 
            All applications are completed directly with the respective employer or provider.
          </Text>
        </View>
      </ScrollView>

      {/* Floating Bottom Apply Bar */}
      <View style={[styles.bottomBar, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
        <TouchableOpacity
          onPress={() => toggleSaveJob(job)}
          style={[styles.saveBottomBtn, { borderColor: colors.border }]}
        >
          <Text style={{ fontSize: 20 }}>{saved ? '★' : '☆'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleApplyPress}
          style={[styles.applyButton, { backgroundColor: colors.primary }]}
          activeOpacity={0.85}
        >
          <Text style={styles.applyButtonText}>Apply for Job ↗</Text>
        </TouchableOpacity>
      </View>

      {/* External Application Notice Modal */}
      <Modal visible={isApplyNoticeVisible} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: colors.surface }]}>
            <Text style={styles.modalIcon}>🌐</Text>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Applying on External Employer Site
            </Text>
            <Text style={[styles.modalBody, { color: colors.textSecondary }]}>
              You are being directed to the official recruitment portal for{' '}
              <Text style={{ fontWeight: '700', color: colors.text }}>{job.companyName}</Text>:
            </Text>
            <Text style={[styles.urlPreview, { color: colors.primary }]} numberOfLines={2}>
              {job.applicationUrl}
            </Text>
            <Text style={[styles.modalSub, { color: colors.textMuted }]}>
              Job Finder Pro never charges application fees or stores third-party login credentials.
            </Text>

            <View style={styles.modalActions}>
              <TouchableOpacity
                onPress={() => setIsApplyNoticeVisible(false)}
                style={[styles.modalCancelBtn, { borderColor: colors.border }]}
              >
                <Text style={{ color: colors.textSecondary, fontWeight: '600' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleConfirmExternalApply}
                style={[styles.modalConfirmBtn, { backgroundColor: colors.primary }]}
              >
                <Text style={{ color: '#ffffff', fontWeight: '700' }}>Continue to Site</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  backButton: {
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
    maxWidth: 200,
  },
  saveHeaderBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 100,
  },
  mainCard: {
    padding: 18,
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: 20,
  },
  companyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  companyLogo: {
    width: 52,
    height: 52,
    borderRadius: 12,
    marginRight: 14,
  },
  logoFallback: {
    width: 52,
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    lineHeight: 24,
    marginBottom: 4,
  },
  companyName: {
    fontSize: 14,
    fontWeight: '600',
  },
  badgeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  badge: {
    width: '48%',
    padding: 10,
    borderRadius: 10,
  },
  badgeLabel: {
    fontSize: 10,
    fontWeight: '600',
    marginBottom: 2,
  },
  badgeValue: {
    fontSize: 12,
    fontWeight: '700',
  },
  salaryBanner: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  salaryLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 2,
  },
  salaryValue: {
    fontSize: 15,
    fontWeight: '800',
  },
  sourceBox: {
    paddingTop: 6,
  },
  sourceText: {
    fontSize: 11,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 10,
  },
  bodyText: {
    fontSize: 14,
    lineHeight: 22,
  },
  skillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  skillText: {
    fontSize: 12,
    fontWeight: '600',
  },
  bulletRow: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingRight: 12,
  },
  bulletDot: {
    fontSize: 14,
    fontWeight: '900',
    marginRight: 8,
    marginTop: 1,
  },
  bulletText: {
    fontSize: 13,
    lineHeight: 20,
    flex: 1,
  },
  infoCard: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 20,
  },
  infoCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(150, 150, 150, 0.1)',
  },
  infoKey: {
    fontSize: 12,
  },
  infoVal: {
    fontSize: 12,
    fontWeight: '600',
  },
  disclaimerCard: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 20,
  },
  disclaimerTitle: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  disclaimerText: {
    fontSize: 11,
    lineHeight: 16,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 76,
    borderTopWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 12,
  },
  saveBottomBtn: {
    width: 48,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  applyButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
  },
  modalIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 10,
  },
  modalBody: {
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 18,
  },
  urlPreview: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 12,
  },
  modalSub: {
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 16,
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  modalCancelBtn: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalConfirmBtn: {
    flex: 2,
    height: 46,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
