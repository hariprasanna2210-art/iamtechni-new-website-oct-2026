import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import { useAppTheme } from '../theme/ThemeContext';
import { useJobs, MobileJob } from '../context/JobContext';

export const SavedJobsScreen: React.FC<{
  onSelectJob: (job: MobileJob) => void;
  onExploreJobs: () => void;
}> = ({ onSelectJob, onExploreJobs }) => {
  const { colors, isDark } = useAppTheme();
  const { savedJobs, toggleSaveJob } = useJobs();
  const [searchFilter, setSearchFilter] = useState('');

  const filtered = savedJobs.filter((j) => {
    if (!searchFilter.trim()) return true;
    const q = searchFilter.toLowerCase();
    return (
      j.title.toLowerCase().includes(q) ||
      j.companyName.toLowerCase().includes(q) ||
      j.city.toLowerCase().includes(q)
    );
  });

  const renderItem = ({ item }: { item: MobileJob }) => {
    return (
      <TouchableOpacity
        style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
        onPress={() => onSelectJob(item)}
        activeOpacity={0.85}
      >
        <View style={styles.cardHeader}>
          {item.companyLogo ? (
            <Image source={{ uri: item.companyLogo }} style={styles.logo} />
          ) : (
            <View style={[styles.logoFallback, { backgroundColor: colors.primaryContainer }]}>
              <Text style={{ color: colors.primary, fontWeight: '700' }}>{item.companyName.charAt(0)}</Text>
            </View>
          )}

          <View style={{ flex: 1 }}>
            <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={[styles.company, { color: colors.textSecondary }]}>
              {item.companyName} • {item.city}, {item.country}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => toggleSaveJob(item)}
            style={styles.removeBtn}
          >
            <Text style={{ color: '#ef4444', fontSize: 18 }}>★</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.cardFooter}>
          <Text style={[styles.salary, { color: colors.primary }]}>
            {item.isSalaryDisclosed && item.salaryMin
              ? `${item.salaryCurrency} ${item.salaryMin.toLocaleString()} / ${item.salaryPeriod}`
              : 'Competitive'}
          </Text>
          <Text style={[styles.type, { color: colors.textMuted }]}>
            {item.workLocationType} • {item.employmentType.replace('_', ' ')}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Saved Jobs</Text>
        <Text style={[styles.headerCount, { color: colors.textMuted }]}>
          {savedJobs.length} bookmarked
        </Text>
      </View>

      {savedJobs.length > 0 && (
        <View style={[styles.searchBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder="Filter saved roles..."
            placeholderTextColor={colors.textMuted}
            value={searchFilter}
            onChangeText={setSearchFilter}
          />
        </View>
      )}

      {savedJobs.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>⭐</Text>
          <Text style={[styles.emptyTitle, { color: colors.text }]}>No saved jobs yet</Text>
          <Text style={[styles.emptyText, { color: colors.textMuted }]}>
            Tap the star icon on any job card to save it for quick reference and offline access.
          </Text>
          <TouchableOpacity
            onPress={onExploreJobs}
            style={[styles.exploreBtn, { backgroundColor: colors.primary }]}
          >
            <Text style={styles.exploreBtnText}>Browse Available Jobs</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  headerCount: {
    fontSize: 13,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 46,
    borderRadius: 12,
    borderWidth: 1,
    marginHorizontal: 20,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  searchIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  card: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginRight: 12,
  },
  logoFallback: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  company: {
    fontSize: 12,
  },
  removeBtn: {
    padding: 6,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(150, 150, 150, 0.1)',
    paddingTop: 8,
  },
  salary: {
    fontSize: 13,
    fontWeight: '700',
  },
  type: {
    fontSize: 11,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 6,
  },
  emptyText: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  exploreBtn: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  exploreBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
});
