import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  ScrollView,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useAppTheme } from '../theme/ThemeContext';
import { useJobs, MobileJob, JobFilters } from '../context/JobContext';

const COUNTRIES = [
  'Worldwide',
  'India',
  'United States',
  'United Kingdom',
  'Canada',
  'Australia',
  'Germany',
  'United Arab Emirates',
  'Singapore',
];

const EXPERIENCE_LEVELS = [
  { id: 'ALL', label: 'All Levels' },
  { id: 'FRESHER', label: 'Fresher (0–1 yr)' },
  { id: 'INTERNSHIP', label: 'Internship' },
  { id: 'ENTRY_LEVEL', label: 'Entry Level (1–2 yrs)' },
  { id: 'THREE_TO_FIVE_YEARS', label: 'Mid-Level (3–5 yrs)' },
  { id: 'FIVE_TO_TEN_YEARS', label: 'Senior (5–10 yrs)' },
  { id: 'TEN_PLUS_YEARS', label: 'Lead / Principal (10+ yrs)' },
];

const EMPLOYMENT_TYPES = [
  { id: 'ALL', label: 'Any Type' },
  { id: 'FULL_TIME', label: 'Full-time' },
  { id: 'PART_TIME', label: 'Part-time' },
  { id: 'INTERNSHIP', label: 'Internship' },
  { id: 'CONTRACT', label: 'Contract' },
  { id: 'FREELANCE', label: 'Freelance' },
];

const WORK_LOCATIONS = [
  { id: 'ALL', label: 'Any Setup' },
  { id: 'REMOTE', label: 'Remote' },
  { id: 'HYBRID', label: 'Hybrid' },
  { id: 'ONSITE', label: 'On-site' },
];

export const SearchScreen: React.FC<{
  onSelectJob: (job: MobileJob) => void;
}> = ({ onSelectJob }) => {
  const { colors, isDark } = useAppTheme();
  const { jobs, isLoading, filters, setFilters, resetFilters, toggleSaveJob, isJobSaved } = useJobs();

  const [query, setQuery] = useState(filters.q || '');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [tempFilters, setTempFilters] = useState<JobFilters>(filters);

  const handleSearchSubmit = () => {
    setFilters({ ...filters, q: query.trim() || undefined });
  };

  const openFilterModal = () => {
    setTempFilters({ ...filters });
    setIsFilterModalOpen(true);
  };

  const applyFilters = () => {
    setFilters(tempFilters);
    setIsFilterModalOpen(false);
  };

  const clearAllFilters = () => {
    resetFilters();
    setQuery('');
    setTempFilters({ country: 'Worldwide', sortBy: 'latest' });
    setIsFilterModalOpen(false);
  };

  const renderJobItem = ({ item }: { item: MobileJob }) => {
    const saved = isJobSaved(item.id);
    const salaryText = item.isSalaryDisclosed && item.salaryMin
      ? `${item.salaryCurrency} ${item.salaryMin.toLocaleString()}${item.salaryMax ? ` - ${item.salaryMax.toLocaleString()}` : ''}`
      : 'Competitive';

    return (
      <TouchableOpacity
        style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
        onPress={() => onSelectJob(item)}
        activeOpacity={0.85}
      >
        <View style={styles.cardTop}>
          {item.companyLogo ? (
            <Image source={{ uri: item.companyLogo }} style={styles.companyLogo} />
          ) : (
            <View style={[styles.companyLogoFallback, { backgroundColor: colors.primaryContainer }]}>
              <Text style={{ color: colors.primary, fontWeight: '700' }}>{item.companyName.charAt(0)}</Text>
            </View>
          )}
          <View style={styles.titleArea}>
            <Text style={[styles.jobTitle, { color: colors.text }]} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={[styles.companyName, { color: colors.textSecondary }]}>
              {item.companyName} • {item.city}, {item.country}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => toggleSaveJob(item)}
            style={[styles.saveBtn, { backgroundColor: saved ? colors.primaryContainer : isDark ? '#1e293b' : '#f1f5f9' }]}
          >
            <Text style={{ fontSize: 16 }}>{saved ? '★' : '☆'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.pillRow}>
          <View style={[styles.pill, { backgroundColor: isDark ? '#1e293b' : '#f1f5f9' }]}>
            <Text style={[styles.pillText, { color: colors.textSecondary }]}>
              {item.workLocationType}
            </Text>
          </View>
          <View style={[styles.pill, { backgroundColor: isDark ? '#1e293b' : '#f1f5f9' }]}>
            <Text style={[styles.pillText, { color: colors.textSecondary }]}>
              {item.experienceRequirement}
            </Text>
          </View>
          {item.visaSponsorship && (
            <View style={[styles.pill, { backgroundColor: '#ecfdf5' }]}>
              <Text style={[styles.pillText, { color: '#047857' }]}>🛂 Visa Sponsored</Text>
            </View>
          )}
          {item.immediateJoining && (
            <View style={[styles.pill, { backgroundColor: '#eff6ff' }]}>
              <Text style={[styles.pillText, { color: '#1d4ed8' }]}>⚡ Immediate</Text>
            </View>
          )}
        </View>

        <View style={styles.cardBottom}>
          <Text style={[styles.salaryText, { color: colors.primary }]}>{salaryText}</Text>
          <Text style={[styles.postedText, { color: colors.textMuted }]}>
            {item.sourceName}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Top Search Input & Filter Button */}
      <View style={styles.headerArea}>
        <View style={[styles.searchBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder="Search job title, skill, company..."
            placeholderTextColor={colors.textMuted}
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={handleSearchSubmit}
            returnKeyType="search"
          />
          {Boolean(query) && (
            <TouchableOpacity onPress={() => { setQuery(''); setFilters({ ...filters, q: undefined }); }}>
              <Text style={{ color: colors.textMuted, paddingHorizontal: 6 }}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          onPress={openFilterModal}
          style={[styles.filterButton, { backgroundColor: colors.primary }]}
          activeOpacity={0.8}
        >
          <Text style={styles.filterButtonText}>⚙ Filters</Text>
        </TouchableOpacity>
      </View>

      {/* Active Filter Indicators */}
      <View style={styles.activeBar}>
        <Text style={[styles.resultsCount, { color: colors.textSecondary }]}>
          Showing <Text style={{ fontWeight: '700', color: colors.text }}>{jobs.length}</Text> jobs in{' '}
          <Text style={{ fontWeight: '700', color: colors.primary }}>{filters.country || 'Worldwide'}</Text>
        </Text>
        <TouchableOpacity onPress={clearAllFilters}>
          <Text style={[styles.resetText, { color: colors.primary }]}>Reset</Text>
        </TouchableOpacity>
      </View>

      {/* Job List */}
      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingNotice, { color: colors.textMuted }]}>Searching matching positions...</Text>
        </View>
      ) : jobs.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>🔎</Text>
          <Text style={[styles.emptyTitle, { color: colors.text }]}>No jobs match your search</Text>
          <Text style={[styles.emptyDesc, { color: colors.textMuted }]}>
            Try widening your location to Worldwide or resetting active filters.
          </Text>
          <TouchableOpacity
            onPress={clearAllFilters}
            style={[styles.clearBtnLarge, { backgroundColor: colors.primary }]}
          >
            <Text style={styles.clearBtnLargeText}>Reset All Filters</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={jobs}
          keyExtractor={(item) => item.id}
          renderItem={renderJobItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Advanced Filter Modal */}
      <Modal visible={isFilterModalOpen} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalSheet, { backgroundColor: colors.surface }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Advanced Job Filters</Text>
              <TouchableOpacity onPress={() => setIsFilterModalOpen(false)}>
                <Text style={[styles.modalClose, { color: colors.textMuted }]}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={styles.modalBody}>
              {/* Country / Worldwide */}
              <Text style={[styles.filterGroupTitle, { color: colors.text }]}>Location / Country</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
                {COUNTRIES.map((c) => {
                  const isSel = (tempFilters.country || 'Worldwide') === c;
                  return (
                    <TouchableOpacity
                      key={c}
                      onPress={() => setTempFilters({ ...tempFilters, country: c === 'Worldwide' ? undefined : c })}
                      style={[
                        styles.modalChip,
                        {
                          backgroundColor: isSel ? colors.primary : colors.card,
                          borderColor: isSel ? colors.primary : colors.border,
                        },
                      ]}
                    >
                      <Text style={{ color: isSel ? '#ffffff' : colors.text, fontSize: 13, fontWeight: '600' }}>
                        {c}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              {/* Work Location Setup */}
              <Text style={[styles.filterGroupTitle, { color: colors.text }]}>Work Location Setup</Text>
              <View style={styles.modalChipGrid}>
                {WORK_LOCATIONS.map((loc) => {
                  const isSel = (tempFilters.workLocationType || 'ALL') === loc.id;
                  return (
                    <TouchableOpacity
                      key={loc.id}
                      onPress={() => setTempFilters({ ...tempFilters, workLocationType: loc.id === 'ALL' ? undefined : loc.id })}
                      style={[
                        styles.modalChip,
                        {
                          backgroundColor: isSel ? colors.primary : colors.card,
                          borderColor: isSel ? colors.primary : colors.border,
                        },
                      ]}
                    >
                      <Text style={{ color: isSel ? '#ffffff' : colors.text, fontSize: 13, fontWeight: '600' }}>
                        {loc.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Experience Level */}
              <Text style={[styles.filterGroupTitle, { color: colors.text }]}>Experience Level</Text>
              <View style={styles.modalChipGrid}>
                {EXPERIENCE_LEVELS.map((exp) => {
                  const isSel = (tempFilters.experienceLevel || 'ALL') === exp.id;
                  return (
                    <TouchableOpacity
                      key={exp.id}
                      onPress={() => setTempFilters({ ...tempFilters, experienceLevel: exp.id === 'ALL' ? undefined : exp.id })}
                      style={[
                        styles.modalChip,
                        {
                          backgroundColor: isSel ? colors.primary : colors.card,
                          borderColor: isSel ? colors.primary : colors.border,
                        },
                      ]}
                    >
                      <Text style={{ color: isSel ? '#ffffff' : colors.text, fontSize: 13, fontWeight: '600' }}>
                        {exp.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Employment Type */}
              <Text style={[styles.filterGroupTitle, { color: colors.text }]}>Employment Type</Text>
              <View style={styles.modalChipGrid}>
                {EMPLOYMENT_TYPES.map((emp) => {
                  const isSel = (tempFilters.employmentType || 'ALL') === emp.id;
                  return (
                    <TouchableOpacity
                      key={emp.id}
                      onPress={() => setTempFilters({ ...tempFilters, employmentType: emp.id === 'ALL' ? undefined : emp.id })}
                      style={[
                        styles.modalChip,
                        {
                          backgroundColor: isSel ? colors.primary : colors.card,
                          borderColor: isSel ? colors.primary : colors.border,
                        },
                      ]}
                    >
                      <Text style={{ color: isSel ? '#ffffff' : colors.text, fontSize: 13, fontWeight: '600' }}>
                        {emp.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Perks / Criteria Switches */}
              <Text style={[styles.filterGroupTitle, { color: colors.text }]}>Special Requirements</Text>
              <TouchableOpacity
                onPress={() => setTempFilters({ ...tempFilters, visaSponsorship: !tempFilters.visaSponsorship })}
                style={[styles.toggleRow, { borderColor: colors.border }]}
              >
                <Text style={{ color: colors.text, fontSize: 14 }}>🛂 Visa Sponsorship Available</Text>
                <Text style={{ color: tempFilters.visaSponsorship ? colors.primary : colors.textMuted, fontWeight: '700' }}>
                  {tempFilters.visaSponsorship ? 'YES' : 'NO'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setTempFilters({ ...tempFilters, immediateJoining: !tempFilters.immediateJoining })}
                style={[styles.toggleRow, { borderColor: colors.border }]}
              >
                <Text style={{ color: colors.text, fontSize: 14 }}>⚡ Immediate Joining / Urgent</Text>
                <Text style={{ color: tempFilters.immediateJoining ? colors.primary : colors.textMuted, fontWeight: '700' }}>
                  {tempFilters.immediateJoining ? 'YES' : 'NO'}
                </Text>
              </TouchableOpacity>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                onPress={() => setTempFilters({ country: 'Worldwide', sortBy: 'latest' })}
                style={[styles.modalBtnSec, { borderColor: colors.border }]}
              >
                <Text style={{ color: colors.textSecondary, fontWeight: '600' }}>Clear</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={applyFilters}
                style={[styles.modalBtnPrim, { backgroundColor: colors.primary }]}
              >
                <Text style={{ color: '#ffffff', fontWeight: '700' }}>Apply Filters</Text>
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
    paddingTop: 50,
  },
  headerArea: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 12,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
  },
  filterButton: {
    height: 48,
    paddingHorizontal: 14,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  activeBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  resultsCount: {
    fontSize: 12,
  },
  resetText: {
    fontSize: 12,
    fontWeight: '700',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  card: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  companyLogo: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginRight: 12,
  },
  companyLogoFallback: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  titleArea: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  companyName: {
    fontSize: 12,
  },
  saveBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 10,
  },
  pill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  pillText: {
    fontSize: 11,
    fontWeight: '500',
  },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(150, 150, 150, 0.1)',
    paddingTop: 8,
  },
  salaryText: {
    fontSize: 13,
    fontWeight: '700',
  },
  postedText: {
    fontSize: 11,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingNotice: {
    fontSize: 13,
    marginTop: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyEmoji: {
    fontSize: 44,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  emptyDesc: {
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 18,
  },
  clearBtnLarge: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  clearBtnLargeText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    maxHeight: '85%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  modalClose: {
    fontSize: 18,
    fontWeight: '700',
    padding: 4,
  },
  modalBody: {
    marginBottom: 16,
  },
  filterGroupTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
  },
  modalChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
    borderWidth: 1,
    marginRight: 6,
    marginBottom: 8,
  },
  modalChipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 12,
  },
  modalBtnSec: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBtnPrim: {
    flex: 2,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
