import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useAppTheme } from '../theme/ThemeContext';
import { useJobs } from '../context/JobContext';

const API_BASE = 'https://iamtechni.com/api/job-finder';

export const AdminPortalScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { colors, isDark } = useAppTheme();
  const { fetchJobs } = useJobs();

  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [adminUser, setAdminUser] = useState<any>(null);
  const [email, setEmail] = useState('admin@iamtechni.com');
  const [password, setPassword] = useState('IAMTECHNI2026!Admin');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Dashboard state
  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'POST_JOB' | 'REQUESTS'>('DASHBOARD');
  const [stats, setStats] = useState<any>(null);
  const [employerRequests, setEmployerRequests] = useState<any[]>([]);
  const [isFetchingData, setIsFetchingData] = useState(false);
  const [aggregationNotice, setAggregationNotice] = useState('');
  const [isAggregating, setIsAggregating] = useState(false);

  // Manual Job Posting Form state (all 28 required fields)
  const [title, setTitle] = useState('');
  const [companyName, setCompanyName] = useState('IAMTECHNI Cloud Systems');
  const [companyLogo, setCompanyLogo] = useState('/iamtechni-symbol.svg');
  const [companyWebsite, setCompanyWebsite] = useState('https://iamtechni.com');
  const [companyEmail, setCompanyEmail] = useState('careers@iamtechni.com');
  const [categoryName, setCategoryName] = useState('Software Engineering');
  const [description, setDescription] = useState('');
  const [responsibilitiesText, setResponsibilitiesText] = useState('Architect core features\nLead code reviews\nOptimize performance');
  const [qualificationsText, setQualificationsText] = useState('3+ years experience\nProficiency in TypeScript\nSolid database design skills');
  const [requiredSkillsText, setRequiredSkillsText] = useState('React Native, TypeScript, Node.js, SQL');
  const [experienceRequirement, setExperienceRequirement] = useState('3–5 years');
  const [educationRequirement, setEducationRequirement] = useState("Bachelor's Degree in CS or equivalent");
  const [salaryMin, setSalaryMin] = useState('1800000');
  const [salaryMax, setSalaryMax] = useState('2800000');
  const [salaryCurrency, setSalaryCurrency] = useState('INR');
  const [salaryPeriod, setSalaryPeriod] = useState<'yearly' | 'monthly'>('yearly');
  const [employmentType, setEmploymentType] = useState('FULL_TIME');
  const [workLocationType, setWorkLocationType] = useState<'REMOTE' | 'HYBRID' | 'ONSITE'>('HYBRID');
  const [country, setCountry] = useState('India');
  const [state, setState] = useState('Karnataka');
  const [city, setCity] = useState('Bengaluru');
  const [visaSponsorship, setVisaSponsorship] = useState(false);
  const [relocationAssistance, setRelocationAssistance] = useState(true);
  const [immediateJoining, setImmediateJoining] = useState(true);
  const [applicationUrl, setApplicationUrl] = useState('https://iamtechni.com/careers');
  const [isFeatured, setIsFeatured] = useState(true);
  const [jobStatus, setJobStatus] = useState('PUBLISHED');
  const [postingFeedback, setPostingFeedback] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  const handleAdminLogin = async () => {
    setLoginError('');
    setIsLoggingIn(true);
    try {
      const res = await fetch(`${API_BASE}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAdminToken(data.token);
        setAdminUser(data.admin);
        loadAdminData(data.token);
      } else {
        setLoginError(data.error || 'Authentication rejected.');
      }
    } catch (e: any) {
      setLoginError(e.message || 'Network error reaching admin service.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const loadAdminData = async (token: string) => {
    setIsFetchingData(true);
    try {
      const [statsRes, reqsRes] = await Promise.all([
        fetch(`${API_BASE}/admin/stats`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_BASE}/employer-requests`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData.stats);
      }
      if (reqsRes.ok) {
        const reqsData = await reqsRes.json();
        setEmployerRequests(reqsData.requests || []);
      }
    } catch (err) {
      console.warn('Error fetching admin data:', err);
    } finally {
      setIsFetchingData(false);
    }
  };

  const handleRunAggregator = async () => {
    setIsAggregating(true);
    setAggregationNotice('');
    try {
      const res = await fetch(`${API_BASE}/jobs/aggregate`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setAggregationNotice('Aggregator finished: Permitted public feeds ingested and verified.');
        if (adminToken) loadAdminData(adminToken);
        fetchJobs();
      } else {
        setAggregationNotice(`Aggregation error: ${data.error}`);
      }
    } catch (e: any) {
      setAggregationNotice(`Failed to connect to aggregator: ${e.message}`);
    } finally {
      setIsAggregating(false);
    }
  };

  const handleCreateManualJob = async () => {
    setPostingFeedback('');
    if (!title.trim() || !companyName.trim() || !description.trim() || !city.trim() || !applicationUrl.trim()) {
      setPostingFeedback('Error: Title, Company Name, Description, City, and Application URL are required.');
      return;
    }

    setIsPosting(true);
    try {
      const payload = {
        title: title.trim(),
        companyName: companyName.trim(),
        companyLogo: companyLogo.trim(),
        companyWebsite: companyWebsite.trim(),
        companyEmail: companyEmail.trim(),
        categoryName,
        description: description.trim(),
        responsibilities: responsibilitiesText.split('\n').filter(Boolean),
        qualifications: qualificationsText.split('\n').filter(Boolean),
        requiredSkills: requiredSkillsText.split(',').map((s) => s.trim()).filter(Boolean),
        experienceRequirement,
        educationRequirement,
        salaryMin: parseInt(salaryMin, 10) || undefined,
        salaryMax: parseInt(salaryMax, 10) || undefined,
        salaryCurrency,
        salaryPeriod,
        employmentType,
        workLocationType,
        country,
        state,
        city,
        visaSponsorship,
        relocationAssistance,
        immediateJoining,
        applicationUrl: applicationUrl.trim(),
        isFeatured,
        status: jobStatus,
      };

      const res = await fetch(`${API_BASE}/admin/jobs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setPostingFeedback('Job successfully validated and published to the live platform!');
        setTitle('');
        setDescription('');
        fetchJobs();
        if (adminToken) loadAdminData(adminToken);
      } else {
        setPostingFeedback(`Error: ${data.error || 'Failed to post job'}`);
      }
    } catch (e: any) {
      setPostingFeedback(`Submission error: ${e.message}`);
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Top Header */}
      <View style={[styles.headerBar, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={[styles.backIcon, { color: colors.text }]}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          IAMTECHNI Admin Portal
        </Text>
        <View style={{ width: 36 }} />
      </View>

      {!adminToken ? (
        /* Login Form */
        <ScrollView contentContainerStyle={styles.loginScroll}>
          <View style={[styles.loginCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.lockBadge}>
              <Text style={{ fontSize: 32 }}>🔐</Text>
            </View>
            <Text style={[styles.loginTitle, { color: colors.text }]}>Administrator Access</Text>
            <Text style={[styles.loginSub, { color: colors.textMuted }]}>
              Protected portal for manual job publishing, employer request auditing, and aggregation controls.
            </Text>

            {Boolean(loginError) && (
              <View style={[styles.errorBox, { borderColor: '#ef4444' }]}>
                <Text style={{ color: '#ef4444', fontSize: 13 }}>{loginError}</Text>
              </View>
            )}

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>Admin Email</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>Admin Password</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <TouchableOpacity
              onPress={handleAdminLogin}
              disabled={isLoggingIn}
              style={[styles.primaryBtn, { backgroundColor: colors.primary }]}
            >
              {isLoggingIn ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : (
                <Text style={styles.primaryBtnText}>Authenticate Administrator</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      ) : (
        /* Authenticated Admin Dashboard */
        <View style={{ flex: 1 }}>
          {/* Admin Navigation Tabs */}
          <View style={[styles.adminTabBar, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
            <TouchableOpacity
              onPress={() => setActiveTab('DASHBOARD')}
              style={[styles.adminTab, activeTab === 'DASHBOARD' && { borderBottomColor: colors.primary, borderBottomWidth: 2 }]}
            >
              <Text style={[styles.adminTabText, { color: activeTab === 'DASHBOARD' ? colors.primary : colors.textMuted }]}>
                Dashboard
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setActiveTab('POST_JOB')}
              style={[styles.adminTab, activeTab === 'POST_JOB' && { borderBottomColor: colors.primary, borderBottomWidth: 2 }]}
            >
              <Text style={[styles.adminTabText, { color: activeTab === 'POST_JOB' ? colors.primary : colors.textMuted }]}>
                + Manual Job
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setActiveTab('REQUESTS')}
              style={[styles.adminTab, activeTab === 'REQUESTS' && { borderBottomColor: colors.primary, borderBottomWidth: 2 }]}
            >
              <Text style={[styles.adminTabText, { color: activeTab === 'REQUESTS' ? colors.primary : colors.textMuted }]}>
                Requests ({employerRequests.length})
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {activeTab === 'DASHBOARD' && (
              <>
                {/* Stats Overview */}
                <View style={styles.statsGrid}>
                  <View style={[styles.statBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <Text style={[styles.statNum, { color: colors.primary }]}>{stats?.totalJobs || 0}</Text>
                    <Text style={[styles.statLabel, { color: colors.textMuted }]}>Total Jobs</Text>
                  </View>
                  <View style={[styles.statBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <Text style={[styles.statNum, { color: colors.success }]}>{stats?.activeJobs || 0}</Text>
                    <Text style={[styles.statLabel, { color: colors.textMuted }]}>Active Published</Text>
                  </View>
                  <View style={[styles.statBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <Text style={[styles.statNum, { color: colors.text }]}>{stats?.manuallyPostedJobs || 0}</Text>
                    <Text style={[styles.statLabel, { color: colors.textMuted }]}>Manual Admin</Text>
                  </View>
                  <View style={[styles.statBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <Text style={[styles.statNum, { color: colors.accent }]}>{stats?.aggregatedJobs || 0}</Text>
                    <Text style={[styles.statLabel, { color: colors.textMuted }]}>Aggregated Feeds</Text>
                  </View>
                </View>

                {/* Aggregation Control Card */}
                <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <Text style={[styles.cardTitle, { color: colors.text }]}>Automated Feed Aggregator</Text>
                  <Text style={[styles.cardSub, { color: colors.textMuted }]}>
                    Triggers background polling across permitted public employer feeds (RemoteOK, Arbeitnow) with deduplication and salary normalization.
                  </Text>

                  {Boolean(aggregationNotice) && (
                    <View style={[styles.noticeBox, { backgroundColor: '#eff6ff', borderColor: colors.primary }]}>
                      <Text style={{ color: colors.primary, fontSize: 12 }}>{aggregationNotice}</Text>
                    </View>
                  )}

                  <TouchableOpacity
                    onPress={handleRunAggregator}
                    disabled={isAggregating}
                    style={[styles.primaryBtn, { backgroundColor: colors.primary }]}
                  >
                    {isAggregating ? (
                      <ActivityIndicator color="#ffffff" size="small" />
                    ) : (
                      <Text style={styles.primaryBtnText}>Run Permitted Feed Aggregator Now ⚡</Text>
                    )}
                  </TouchableOpacity>
                </View>

                {/* Quick Logout */}
                <TouchableOpacity onPress={() => setAdminToken(null)} style={styles.logoutBtn}>
                  <Text style={{ color: colors.textMuted, fontSize: 13 }}>Exit Admin Session</Text>
                </TouchableOpacity>
              </>
            )}

            {activeTab === 'POST_JOB' && (
              /* Manual Job Posting Form (Section 13) */
              <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Text style={[styles.cardTitle, { color: colors.text }]}>Manual Job Posting Form</Text>
                <Text style={[styles.cardSub, { color: colors.textMuted }]}>
                  All 28 required fields for immediate publication by authorized administrators.
                </Text>

                {Boolean(postingFeedback) && (
                  <View style={[styles.noticeBox, { backgroundColor: postingFeedback.includes('Error') ? '#fef2f2' : '#ecfdf5', borderColor: postingFeedback.includes('Error') ? '#ef4444' : '#10b981' }]}>
                    <Text style={{ color: postingFeedback.includes('Error') ? '#ef4444' : '#047857', fontSize: 13, fontWeight: '600' }}>
                      {postingFeedback}
                    </Text>
                  </View>
                )}

                <View style={styles.inputGroup}>
                  <Text style={[styles.label, { color: colors.textSecondary }]}>Job Title *</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                    placeholder="e.g. Senior Principal Mobile Architect"
                    placeholderTextColor={colors.textMuted}
                    value={title}
                    onChangeText={setTitle}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[styles.label, { color: colors.textSecondary }]}>Company Name *</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                    value={companyName}
                    onChangeText={setCompanyName}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[styles.label, { color: colors.textSecondary }]}>Company Logo URL</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                    value={companyLogo}
                    onChangeText={setCompanyLogo}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[styles.label, { color: colors.textSecondary }]}>Job Category</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                    value={categoryName}
                    onChangeText={setCategoryName}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[styles.label, { color: colors.textSecondary }]}>Job Description *</Text>
                  <TextInput
                    style={[styles.textArea, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                    placeholder="Detailed position overview..."
                    placeholderTextColor={colors.textMuted}
                    multiline
                    numberOfLines={4}
                    value={description}
                    onChangeText={setDescription}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[styles.label, { color: colors.textSecondary }]}>Key Responsibilities (One per line)</Text>
                  <TextInput
                    style={[styles.textArea, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                    multiline
                    numberOfLines={3}
                    value={responsibilitiesText}
                    onChangeText={setResponsibilitiesText}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[styles.label, { color: colors.textSecondary }]}>Qualifications (One per line)</Text>
                  <TextInput
                    style={[styles.textArea, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                    multiline
                    numberOfLines={3}
                    value={qualificationsText}
                    onChangeText={setQualificationsText}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[styles.label, { color: colors.textSecondary }]}>Required Skills (Comma separated)</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                    value={requiredSkillsText}
                    onChangeText={setRequiredSkillsText}
                  />
                </View>

                <View style={styles.row}>
                  <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                    <Text style={[styles.label, { color: colors.textSecondary }]}>Min Salary</Text>
                    <TextInput
                      style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                      keyboardType="number-pad"
                      value={salaryMin}
                      onChangeText={setSalaryMin}
                    />
                  </View>
                  <View style={[styles.inputGroup, { flex: 1 }]}>
                    <Text style={[styles.label, { color: colors.textSecondary }]}>Max Salary</Text>
                    <TextInput
                      style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                      keyboardType="number-pad"
                      value={salaryMax}
                      onChangeText={setSalaryMax}
                    />
                  </View>
                </View>

                <View style={styles.row}>
                  <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                    <Text style={[styles.label, { color: colors.textSecondary }]}>Currency</Text>
                    <TextInput
                      style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                      value={salaryCurrency}
                      onChangeText={setSalaryCurrency}
                    />
                  </View>
                  <View style={[styles.inputGroup, { flex: 1 }]}>
                    <Text style={[styles.label, { color: colors.textSecondary }]}>City *</Text>
                    <TextInput
                      style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                      value={city}
                      onChangeText={setCity}
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[styles.label, { color: colors.textSecondary }]}>Genuine Application URL *</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                    value={applicationUrl}
                    onChangeText={setApplicationUrl}
                  />
                </View>

                <TouchableOpacity
                  onPress={handleCreateManualJob}
                  disabled={isPosting}
                  style={[styles.primaryBtn, { backgroundColor: colors.primary, marginTop: 12 }]}
                >
                  {isPosting ? (
                    <ActivityIndicator color="#ffffff" size="small" />
                  ) : (
                    <Text style={styles.primaryBtnText}>Publish Job Immediately ✓</Text>
                  )}
                </TouchableOpacity>
              </View>
            )}

            {activeTab === 'REQUESTS' && (
              /* Review Inbound Employer Requests */
              <View>
                <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 12 }]}>
                  Inbound Employer Job Requests
                </Text>
                {employerRequests.length === 0 ? (
                  <Text style={{ color: colors.textMuted }}>No employer requests submitted yet.</Text>
                ) : (
                  employerRequests.map((req) => (
                    <View
                      key={req.id}
                      style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, marginBottom: 12 }]}
                    >
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                        <Text style={{ fontSize: 12, fontWeight: '800', color: colors.primary }}>
                          {req.referenceId}
                        </Text>
                        <Text style={{ fontSize: 11, fontWeight: '700', color: req.status === 'APPROVED' ? colors.success : '#f59e0b' }}>
                          {req.status}
                        </Text>
                      </View>
                      <Text style={[styles.reqTitle, { color: colors.text }]}>{req.jobTitle}</Text>
                      <Text style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 6 }}>
                        {req.companyName} • {req.contactPerson} ({req.companyEmail})
                      </Text>
                      <Text style={{ fontSize: 12, color: colors.textMuted, lineHeight: 16 }}>
                        {req.shortJobDescription}
                      </Text>
                    </View>
                  ))
                )}
              </View>
            )}
          </ScrollView>
        </View>
      )}
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
    fontWeight: '800',
  },
  loginScroll: {
    padding: 24,
    justifyContent: 'center',
  },
  loginCard: {
    padding: 24,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
  },
  lockBadge: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: '#1e3a8a30',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  loginTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 6,
  },
  loginSub: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  errorBox: {
    width: '100%',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 14,
  },
  inputGroup: {
    width: '100%',
    marginBottom: 12,
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
    height: 72,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingTop: 8,
    fontSize: 14,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    width: '100%',
  },
  primaryBtn: {
    width: '100%',
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  adminTabBar: {
    flexDirection: 'row',
    height: 48,
    borderBottomWidth: 1,
  },
  adminTab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  adminTabText: {
    fontSize: 13,
    fontWeight: '700',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 60,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  statBox: {
    width: '48%',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
  },
  statNum: {
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  card: {
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4,
  },
  cardSub: {
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 14,
  },
  noticeBox: {
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  reqTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  logoutBtn: {
    padding: 14,
    alignItems: 'center',
  },
});
