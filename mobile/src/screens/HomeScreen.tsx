import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Image,
  RefreshControl,
} from 'react-native';
import { useAppTheme } from '../theme/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useJobs, MobileJob } from '../context/JobContext';

const QUICK_CATEGORIES = [
  { id: 'ALL', label: 'All Jobs', icon: '⚡' },
  { id: 'cat-mobile', label: 'Mobile Apps', icon: '📱' },
  { id: 'cat-software', label: 'Software Eng', icon: '💻' },
  { id: 'cat-cloud', label: 'Cloud & DevOps', icon: '☁️' },
  { id: 'cat-ai', label: 'AI & Data', icon: '🧠' },
  { id: 'cat-design', label: 'UI / UX Design', icon: '🎨' },
];

const LOCATION_PRESETS = [
  { id: 'India', label: '🇮🇳 India' },
  { id: 'Worldwide', label: '🌐 Worldwide' },
  { id: 'Remote', label: '🏠 Remote Only' },
  { id: 'United States', label: '🇺🇸 United States' },
  { id: 'Germany', label: '🇩🇪 Germany' },
  { id: 'United Arab Emirates', label: '🇦🇪 UAE' },
];

export const HomeScreen: React.FC<{
  onSelectJob: (job: MobileJob) => void;
  onNavigateToSearch: () => void;
  onNavigateToSaved: () => void;
  onNavigateToAlerts: () => void;
  onNavigateToEmployerRequest: () => void;
}> = ({
  onSelectJob,
  onNavigateToSearch,
  onNavigateToSaved,
  onNavigateToAlerts,
  onNavigateToEmployerRequest,
}) => {
  const { colors, isDark } = useAppTheme();
  const { user } = useAuth();
  const { jobs, isLoading, isRefreshing, fetchJobs, filters, setFilters, toggleSaveJob, isJobSaved } = useJobs();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedLocation, setSelectedLocation] = useState(filters.country || 'India');

  const handleCategoryPress = (catId: string) => {
    setSelectedCategory(catId);
    setFilters({ ...filters, category: catId === 'ALL' ? undefined : catId });
  };

  const handleLocationPreset = (loc: string) => {
    setSelectedLocation(loc);
    if (loc === 'Remote') {
      setFilters({ ...filters, isRemoteOnly: true, country: undefined });
    } else {
      setFilters({ ...filters, isRemoteOnly: false, country: loc });
    }
  };

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      setFilters({ ...filters, q: searchQuery.trim() });
      onNavigateToSearch();
    }
  };

  const featuredJobs = jobs.filter((j) => j.isFeatured).slice(0, 4);
  const latestJobs = jobs.slice(0, 10);

  const renderJobCard = (item: MobileJob) => {
    const saved = isJobSaved(item.id);
    const salaryText = item.isSalaryDisclosed && item.salaryMin
      ? `${item.salaryCurrency} ${item.salaryMin.toLocaleString()}${item.salaryMax ? ` - ${item.salaryMax.toLocaleString()}` : ''} / ${item.salaryPeriod}`
      : 'Competitive Salary';

    return (
      <TouchableOpacity
        key={item.id}
        style={[styles.jobCard, { backgroundColor: colors.card, borderColor: colors.border }]}
        onPress={() => onSelectJob(item)}
        activeOpacity={0.85}
      >
        <View style={styles.cardHeader}>
          <View style={styles.companyRow}>
            {item.companyLogo ? (
              <Image source={{ uri: item.companyLogo }} style={styles.companyLogo} />
            ) : (
              <View style={[styles.companyLogoFallback, { backgroundColor: colors.primaryContainer }]}>
                <Text style={{ color: colors.primary, fontWeight: '700', fontSize: 14 }}>
                  {item.companyName.charAt(0)}
                </Text>
              </View>
            )}
            <View style={styles.companyInfo}>
              <Text style={[styles.jobTitle, { color: colors.text }]} numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={[styles.companyName, { color: colors.textSecondary }]}>
                {item.companyName}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => toggleSaveJob(item)}
            style={[styles.saveButton, { backgroundColor: saved ? colors.primaryContainer : isDark ? '#1e293b' : '#f1f5f9' }]}
          >
            <Text style={{ fontSize: 16 }}>{saved ? '★' : '☆'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tagRow}>
          <View style={[styles.chip, { backgroundColor: isDark ? '#1e293b' : '#f1f5f9' }]}>
            <Text style={[styles.chipText, { color: colors.textSecondary }]}>📍 {item.city}, {item.country}</Text>
          </View>
          <View style={[styles.chip, { backgroundColor: isDark ? '#1e293b' : '#f1f5f9' }]}>
            <Text style={[styles.chipText, { color: colors.textSecondary }]}>
              {item.workLocationType === 'REMOTE' ? '🏠 Remote' : item.workLocationType === 'HYBRID' ? '🏢 Hybrid' : '📍 On-site'}
            </Text>
          </View>
          <View style={[styles.chip, { backgroundColor: isDark ? '#1e293b' : '#f1f5f9' }]}>
            <Text style={[styles.chipText, { color: colors.textSecondary }]}>⏳ {item.experienceRequirement}</Text>
          </View>
        </View>

        <View style={styles.cardFooter}>
          <Text style={[styles.salary, { color: colors.primary }]}>{salaryText}</Text>
          <View style={styles.sourceBadge}>
            {item.adminPosted && (
              <Text style={[styles.adminBadgeText, { color: '#10b981' }]}>✓ Verified</Text>
            )}
            <Text style={[styles.postedAgo, { color: colors.textMuted }]}>
              {item.sourceName.split(' ')[0]}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
      refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={() => fetchJobs()} />}
      showsVerticalScrollIndicator={false}
    >
      {/* Top Bar with Greeting & Branding */}
      <View style={styles.topBar}>
        <View>
          <Text style={[styles.greeting, { color: colors.textSecondary }]}>
            Hello, {user?.fullName?.split(' ')[0] || 'Job Seeker'} 👋
          </Text>
          <Text style={[styles.heading, { color: colors.text }]}>
            Find Your Dream Job
          </Text>
        </View>
        <View style={styles.brandTag}>
          <Text style={{ fontSize: 10, color: colors.textMuted, fontWeight: '700' }}>POWERED BY</Text>
          <Text style={{ fontSize: 12, color: colors.primary, fontWeight: '900', letterSpacing: 0.5 }}>IAMTECHNI</Text>
        </View>
      </View>

      {/* Search Input Bar */}
      <View style={[styles.searchBar, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Job title, skill, company, or keyword..."
          placeholderTextColor={colors.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearchSubmit}
          returnKeyType="search"
        />
        {Boolean(searchQuery) && (
          <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearBtn}>
            <Text style={{ color: colors.textMuted, fontSize: 14 }}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Location Presets */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
        {LOCATION_PRESETS.map((loc) => {
          const isSelected = selectedLocation === loc.id;
          return (
            <TouchableOpacity
              key={loc.id}
              onPress={() => handleLocationPreset(loc.id)}
              style={[
                styles.locationChip,
                {
                  backgroundColor: isSelected ? colors.primary : colors.card,
                  borderColor: isSelected ? colors.primary : colors.border,
                },
              ]}
            >
              <Text style={[styles.locationChipText, { color: isSelected ? '#ffffff' : colors.text }]}>
                {loc.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Quick Action Shortcuts Banner */}
      <View style={[styles.shortcutsBanner, { backgroundColor: isDark ? '#161f30' : '#eff6ff', borderColor: colors.border }]}>
        <TouchableOpacity style={styles.shortcutItem} onPress={onNavigateToSaved}>
          <Text style={styles.shortcutIcon}>⭐</Text>
          <Text style={[styles.shortcutText, { color: colors.text }]}>Saved Jobs</Text>
        </TouchableOpacity>
        <View style={[styles.shortcutDivider, { backgroundColor: colors.border }]} />
        <TouchableOpacity style={styles.shortcutItem} onPress={onNavigateToAlerts}>
          <Text style={styles.shortcutIcon}>🔔</Text>
          <Text style={[styles.shortcutText, { color: colors.text }]}>Job Alerts</Text>
        </TouchableOpacity>
        <View style={[styles.shortcutDivider, { backgroundColor: colors.border }]} />
        <TouchableOpacity style={styles.shortcutItem} onPress={onNavigateToEmployerRequest}>
          <Text style={styles.shortcutIcon}>🏢</Text>
          <Text style={[styles.shortcutText, { color: colors.primary, fontWeight: '700' }]}>Post a Job</Text>
        </TouchableOpacity>
      </View>

      {/* Category Pills */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Popular Job Categories</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
        {QUICK_CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <TouchableOpacity
              key={cat.id}
              onPress={() => handleCategoryPress(cat.id)}
              style={[
                styles.categoryChip,
                {
                  backgroundColor: isSelected ? colors.primary : colors.card,
                  borderColor: isSelected ? colors.primary : colors.border,
                },
              ]}
            >
              <Text style={{ marginRight: 6 }}>{cat.icon}</Text>
              <Text style={[styles.categoryChipText, { color: isSelected ? '#ffffff' : colors.text }]}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Featured / Recommended Jobs */}
      {featuredJobs.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.featuredBadgeRow}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Recommended Roles</Text>
              <View style={[styles.featuredTag, { backgroundColor: '#fef3c7' }]}>
                <Text style={{ color: '#b45309', fontSize: 11, fontWeight: '700' }}>FEATURED</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onNavigateToSearch}>
              <Text style={[styles.seeAllText, { color: colors.primary }]}>Explore All</Text>
            </TouchableOpacity>
          </View>
          {featuredJobs.map(renderJobCard)}
        </View>
      )}

      {/* Latest Aggregated Jobs */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Latest Verified Jobs</Text>
          <Text style={[styles.jobCount, { color: colors.textMuted }]}>{jobs.length} open roles</Text>
        </View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[styles.loadingText, { color: colors.textMuted }]}>
              Aggregating verified job feeds...
            </Text>
          </View>
        ) : latestJobs.length === 0 ? (
          <View style={[styles.emptyBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No jobs found</Text>
            <Text style={[styles.emptySubtitle, { color: colors.textMuted }]}>
              Try selecting Worldwide or changing your category filter.
            </Text>
          </View>
        ) : (
          latestJobs.map(renderJobCard)
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 48,
    paddingBottom: 40,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  greeting: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
  },
  heading: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  brandTag: {
    alignItems: 'flex-end',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(37, 99, 235, 0.08)',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    marginBottom: 16,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
  },
  clearBtn: {
    padding: 6,
  },
  horizontalScroll: {
    marginBottom: 18,
  },
  locationChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  locationChipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    marginRight: 8,
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  shortcutsBanner: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 20,
  },
  shortcutItem: {
    alignItems: 'center',
    flex: 1,
  },
  shortcutIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  shortcutText: {
    fontSize: 12,
    fontWeight: '600',
  },
  shortcutDivider: {
    width: 1,
    height: 28,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  featuredBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featuredTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '700',
  },
  jobCount: {
    fontSize: 12,
    fontWeight: '500',
  },
  jobCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  companyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  companyLogo: {
    width: 44,
    height: 44,
    borderRadius: 10,
    marginRight: 12,
  },
  companyLogoFallback: {
    width: 44,
    height: 44,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  companyInfo: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 3,
  },
  companyName: {
    fontSize: 13,
    fontWeight: '500',
  },
  saveButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  chip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  chipText: {
    fontSize: 11,
    fontWeight: '500',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(150, 150, 150, 0.1)',
    paddingTop: 10,
  },
  salary: {
    fontSize: 13,
    fontWeight: '700',
  },
  sourceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  adminBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  postedAgo: {
    fontSize: 11,
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 13,
    marginTop: 10,
  },
  emptyBox: {
    padding: 32,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 36,
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 13,
    textAlign: 'center',
  },
});
