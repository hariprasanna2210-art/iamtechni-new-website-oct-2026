import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useAppTheme } from '../theme/ThemeContext';
import { useJobs } from '../context/JobContext';

export const EmployerRequestScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { colors, isDark } = useAppTheme();
  const { submitEmployerRequest } = useJobs();

  const [employerName, setEmployerName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companyEmail, setCompanyEmail] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [vacanciesCount, setVacanciesCount] = useState('1');
  const [jobLocation, setJobLocation] = useState('Bengaluru / Remote');
  const [employmentType, setEmploymentType] = useState('Full-time');
  const [shortJobDescription, setShortJobDescription] = useState('');
  const [companyWebsite, setCompanyWebsite] = useState('');
  const [additionalMessage, setAdditionalMessage] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [submittedRefId, setSubmittedRefId] = useState<string | null>(null);

  const handleSubmit = async () => {
    setErrorMessage('');

    if (
      !employerName.trim() ||
      !companyName.trim() ||
      !companyEmail.trim() ||
      !contactPerson.trim() ||
      !jobTitle.trim() ||
      !jobLocation.trim() ||
      !shortJobDescription.trim()
    ) {
      setErrorMessage('Please fill in all mandatory fields marked with an asterisk (*).');
      return;
    }

    if (!companyEmail.includes('@') || !companyEmail.includes('.')) {
      setErrorMessage('Please provide a valid company email address.');
      return;
    }

    setIsLoading(true);
    const result = await submitEmployerRequest({
      employerName,
      companyName,
      companyEmail,
      contactPerson,
      mobileNumber: mobileNumber || undefined,
      jobTitle,
      vacanciesCount: parseInt(vacanciesCount, 10) || 1,
      jobLocation,
      employmentType,
      shortJobDescription,
      companyWebsite: companyWebsite || undefined,
      additionalMessage: additionalMessage || undefined,
    });
    setIsLoading(false);

    if (result.success && result.referenceId) {
      setSubmittedRefId(result.referenceId);
    } else {
      setErrorMessage(result.error || 'Failed to submit request. Please try again.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.headerBar, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={[styles.backIcon, { color: colors.text }]}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Post a Job – Contact Admin</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {submittedRefId ? (
          /* Submission Success State */
          <View style={[styles.successCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.successIconCircle}>
              <Text style={{ fontSize: 32 }}>✓</Text>
            </View>
            <Text style={[styles.successTitle, { color: colors.text }]}>
              Job Posting Request Submitted
            </Text>
            <Text style={[styles.successSub, { color: colors.textSecondary }]}>
              Thank you for choosing Job Finder Pro. Your request has been securely recorded and dispatched to the IAMTECHNI administration team.
            </Text>

            <View style={[styles.refBox, { backgroundColor: isDark ? '#1e3a8a30' : '#eff6ff', borderColor: colors.primary }]}>
              <Text style={[styles.refLabel, { color: colors.primary }]}>YOUR REFERENCE ID</Text>
              <Text style={[styles.refValue, { color: colors.text }]}>{submittedRefId}</Text>
            </View>

            <View style={[styles.workflowNotice, { backgroundColor: isDark ? '#1e293b' : '#f8fafc', borderColor: colors.border }]}>
              <Text style={[styles.workflowTitle, { color: colors.text }]}>What happens next?</Text>
              <Text style={[styles.workflowStep, { color: colors.textSecondary }]}>
                1. A confirmation email has been dispatched to <Text style={{ fontWeight: '700' }}>{companyEmail}</Text>.
              </Text>
              <Text style={[styles.workflowStep, { color: colors.textSecondary }]}>
                2. Our administration team verifies company credentials and job authenticity.
              </Text>
              <Text style={[styles.workflowStep, { color: colors.textSecondary }]}>
                3. Once approved, the listing is published directly to the Job Finder Pro app.
              </Text>
            </View>

            <TouchableOpacity
              onPress={onBack}
              style={[styles.primaryBtn, { backgroundColor: colors.primary }]}
            >
              <Text style={styles.primaryBtnText}>Return to Home</Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* Form State */
          <>
            {/* Introductory Policy Card */}
            <View style={[styles.introCard, { backgroundColor: isDark ? '#1e3a8a25' : '#eff6ff', borderColor: colors.primary }]}>
              <Text style={[styles.introHeading, { color: colors.primary }]}>
                Hiring Partner Inquiry
              </Text>
              <Text style={[styles.introBody, { color: colors.textSecondary }]}>
                Are you an employer looking to hire? Contact our administration team to request a job listing. Our team will review your details and publish approved jobs.
              </Text>
            </View>

            {Boolean(errorMessage) && (
              <View style={[styles.alertBox, { backgroundColor: isDark ? '#450a0a' : '#fef2f2', borderColor: '#ef4444' }]}>
                <Text style={{ color: '#ef4444', fontSize: 13, fontWeight: '500' }}>{errorMessage}</Text>
              </View>
            )}

            {/* Employer Contact Form */}
            <View style={[styles.formCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Employer Information</Text>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>Employer / Representative Name *</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                  placeholder="e.g. Vikram Malhotra"
                  placeholderTextColor={colors.textMuted}
                  value={employerName}
                  onChangeText={setEmployerName}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>Company Name *</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                  placeholder="e.g. AcroPulse Technologies Pvt Ltd"
                  placeholderTextColor={colors.textMuted}
                  value={companyName}
                  onChangeText={setCompanyName}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>Company Email Address *</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                  placeholder="hr@acropulse.io"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={companyEmail}
                  onChangeText={setCompanyEmail}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>Contact Person & Designation *</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                  placeholder="e.g. Vikram Malhotra (VP Talent)"
                  placeholderTextColor={colors.textMuted}
                  value={contactPerson}
                  onChangeText={setContactPerson}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>Mobile Number (Optional)</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                  placeholder="+91 98765 43210"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="phone-pad"
                  value={mobileNumber}
                  onChangeText={setMobileNumber}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>Company Website (Optional)</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                  placeholder="https://acropulse.io"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="url"
                  autoCapitalize="none"
                  value={companyWebsite}
                  onChangeText={setCompanyWebsite}
                />
              </View>

              <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 16 }]}>Job Opportunity Details</Text>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>Job Title *</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                  placeholder="e.g. Senior Cloud Security Architect"
                  placeholderTextColor={colors.textMuted}
                  value={jobTitle}
                  onChangeText={setJobTitle}
                />
              </View>

              <View style={styles.row}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                  <Text style={[styles.label, { color: colors.textSecondary }]}>Vacancies *</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                    placeholder="1"
                    placeholderTextColor={colors.textMuted}
                    keyboardType="number-pad"
                    value={vacanciesCount}
                    onChangeText={setVacanciesCount}
                  />
                </View>
                <View style={[styles.inputGroup, { flex: 2 }]}>
                  <Text style={[styles.label, { color: colors.textSecondary }]}>Employment Type *</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                    placeholder="Full-time / Contract"
                    placeholderTextColor={colors.textMuted}
                    value={employmentType}
                    onChangeText={setEmploymentType}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>Job Location (City / Remote) *</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                  placeholder="Bengaluru / Remote / Hybrid"
                  placeholderTextColor={colors.textMuted}
                  value={jobLocation}
                  onChangeText={setJobLocation}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>Short Job Description *</Text>
                <TextInput
                  style={[styles.textArea, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                  placeholder="Describe key responsibilities, requirements, and tech stack..."
                  placeholderTextColor={colors.textMuted}
                  multiline
                  numberOfLines={4}
                  value={shortJobDescription}
                  onChangeText={setShortJobDescription}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>Additional Message to Admin (Optional)</Text>
                <TextInput
                  style={[styles.textArea, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                  placeholder="Target joining timeline, salary budget, or special requirements..."
                  placeholderTextColor={colors.textMuted}
                  multiline
                  numberOfLines={3}
                  value={additionalMessage}
                  onChangeText={setAdditionalMessage}
                />
              </View>

              <TouchableOpacity
                onPress={handleSubmit}
                disabled={isLoading}
                style={[styles.primaryBtn, { backgroundColor: colors.primary }]}
                activeOpacity={0.85}
              >
                {isLoading ? (
                  <ActivityIndicator color="#ffffff" size="small" />
                ) : (
                  <Text style={styles.primaryBtnText}>Send Job Posting Request ✉️</Text>
                )}
              </TouchableOpacity>
            </View>
          </>
        )}
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
  introCard: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 16,
  },
  introHeading: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 4,
  },
  introBody: {
    fontSize: 13,
    lineHeight: 18,
  },
  alertBox: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 16,
  },
  formCard: {
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 12,
  },
  inputGroup: {
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  input: {
    height: 46,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    fontSize: 14,
  },
  textArea: {
    height: 84,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingTop: 10,
    fontSize: 14,
    textAlignVertical: 'top',
  },
  primaryBtn: {
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  primaryBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  successCard: {
    padding: 24,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
  },
  successIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#10b981',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
  },
  successSub: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 18,
  },
  refBox: {
    width: '100%',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: 18,
  },
  refLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 4,
  },
  refValue: {
    fontSize: 18,
    fontWeight: '900',
  },
  workflowNotice: {
    width: '100%',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 20,
  },
  workflowTitle: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
  },
  workflowStep: {
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 6,
  },
});
