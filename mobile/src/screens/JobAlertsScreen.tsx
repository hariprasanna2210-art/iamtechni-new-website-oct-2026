import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Switch,
  ScrollView,
} from 'react-native';
import { useAppTheme } from '../theme/ThemeContext';
import { useJobs, MobileJobAlert } from '../context/JobContext';

export const JobAlertsScreen: React.FC = () => {
  const { colors, isDark } = useAppTheme();
  const { alerts, createAlert, toggleAlertActive, deleteAlert } = useJobs();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [alertName, setAlertName] = useState('');
  const [skillsInput, setSkillsInput] = useState('');
  const [country, setCountry] = useState('India');
  const [city, setCity] = useState('');
  const [isRemoteOnly, setIsRemoteOnly] = useState(false);
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);

  const handleCreate = async () => {
    if (!alertName.trim()) return;

    const skills = skillsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    await createAlert({
      name: alertName.trim(),
      skills,
      country: country || 'India',
      city: city.trim() || undefined,
      isRemoteOnly,
      pushNotificationEnabled: pushEnabled,
      emailNotificationEnabled: emailEnabled,
    });

    setAlertName('');
    setSkillsInput('');
    setCity('');
    setIsRemoteOnly(false);
    setIsModalOpen(false);
  };

  const renderItem = ({ item }: { item: MobileJobAlert }) => {
    return (
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.cardTop}>
          <View style={{ flex: 1 }}>
            <View style={styles.statusRow}>
              <View style={[styles.statusDot, { backgroundColor: item.isActive ? colors.success : colors.textMuted }]} />
              <Text style={[styles.statusText, { color: item.isActive ? colors.success : colors.textMuted }]}>
                {item.isActive ? 'ACTIVE ALERT' : 'PAUSED'}
              </Text>
            </View>
            <Text style={[styles.alertTitle, { color: colors.text }]}>{item.name}</Text>
          </View>

          <Switch
            value={item.isActive}
            onValueChange={() => toggleAlertActive(item.id)}
            trackColor={{ false: colors.border, true: colors.primary }}
          />
        </View>

        <View style={styles.specRow}>
          <Text style={[styles.specText, { color: colors.textSecondary }]}>
            📍 {item.city ? `${item.city}, ` : ''}{item.country || 'Worldwide'}
            {item.isRemoteOnly ? ' • Remote' : ''}
          </Text>
        </View>

        {item.skills && item.skills.length > 0 && (
          <View style={styles.skillsWrap}>
            {item.skills.map((s, idx) => (
              <View key={idx} style={[styles.skillBadge, { backgroundColor: isDark ? '#1e293b' : '#f1f5f9' }]}>
                <Text style={[styles.skillBadgeText, { color: colors.textSecondary }]}>{s}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={[styles.cardBottom, { borderTopColor: colors.border }]}>
          <View style={styles.channelRow}>
            {item.pushNotificationEnabled && <Text style={styles.channelIcon} title="Push notifications active">📲 Push</Text>}
            {item.emailNotificationEnabled && <Text style={styles.channelIcon} title="Email dispatch active">✉️ Email</Text>}
            <Text style={[styles.matchBadge, { color: colors.primary }]}>
              {item.matchCount} new matches
            </Text>
          </View>

          <TouchableOpacity onPress={() => deleteAlert(item.id)}>
            <Text style={{ color: '#ef4444', fontSize: 13, fontWeight: '600' }}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Job Alerts</Text>
          <Text style={[styles.headerSub, { color: colors.textMuted }]}>
            Get notified instantly when matching jobs appear
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => setIsModalOpen(true)}
          style={[styles.createBtn, { backgroundColor: colors.primary }]}
        >
          <Text style={styles.createBtnText}>+ New Alert</Text>
        </TouchableOpacity>
      </View>

      {alerts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🔔</Text>
          <Text style={[styles.emptyTitle, { color: colors.text }]}>No job alerts set up</Text>
          <Text style={[styles.emptySub, { color: colors.textMuted }]}>
            Create your first custom alert with your preferred skills, location, and salary to never miss a verified vacancy.
          </Text>
          <TouchableOpacity
            onPress={() => setIsModalOpen(true)}
            style={[styles.emptyActionBtn, { backgroundColor: colors.primary }]}
          >
            <Text style={styles.emptyActionText}>Create Job Alert</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={alerts}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Create Alert Modal */}
      <Modal visible={isModalOpen} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>New Job Alert</Text>
              <TouchableOpacity onPress={() => setIsModalOpen(false)}>
                <Text style={{ fontSize: 18, color: colors.textMuted }}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>Alert Title *</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
                  placeholder="e.g. Senior React Native Engineer"
                  placeholderTextColor={colors.textMuted}
                  value={alertName}
                  onChangeText={setAlertName}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>Keywords / Skills (Comma-separated)</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
                  placeholder="React Native, TypeScript, Android, Node.js"
                  placeholderTextColor={colors.textMuted}
                  value={skillsInput}
                  onChangeText={setSkillsInput}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>Target Country</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
                  placeholder="India, United States, Worldwide"
                  placeholderTextColor={colors.textMuted}
                  value={country}
                  onChangeText={setCountry}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>Target City (Optional)</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
                  placeholder="Bengaluru, Hyderabad, Pune, London..."
                  placeholderTextColor={colors.textMuted}
                  value={city}
                  onChangeText={setCity}
                />
              </View>

              <View style={[styles.switchRow, { borderBottomColor: colors.border }]}>
                <Text style={{ color: colors.text, fontSize: 14 }}>Remote Only Roles</Text>
                <Switch
                  value={isRemoteOnly}
                  onValueChange={setIsRemoteOnly}
                  trackColor={{ false: colors.border, true: colors.primary }}
                />
              </View>

              <View style={[styles.switchRow, { borderBottomColor: colors.border }]}>
                <Text style={{ color: colors.text, fontSize: 14 }}>Push Notifications</Text>
                <Switch
                  value={pushEnabled}
                  onValueChange={setPushEnabled}
                  trackColor={{ false: colors.border, true: colors.primary }}
                />
              </View>

              <View style={[styles.switchRow, { borderBottomColor: colors.border }]}>
                <Text style={{ color: colors.text, fontSize: 14 }}>Email Notifications</Text>
                <Switch
                  value={emailEnabled}
                  onValueChange={setEmailEnabled}
                  trackColor={{ false: colors.border, true: colors.primary }}
                />
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity
                onPress={() => setIsModalOpen(false)}
                style={[styles.modalBtnCancel, { borderColor: colors.border }]}
              >
                <Text style={{ color: colors.textSecondary, fontWeight: '600' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleCreate}
                style={[styles.modalBtnCreate, { backgroundColor: colors.primary }]}
              >
                <Text style={{ color: '#ffffff', fontWeight: '700' }}>Save Alert</Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  headerSub: {
    fontSize: 12,
    marginTop: 2,
    maxWidth: 220,
  },
  createBtn: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 12,
  },
  createBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  card: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 14,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  specRow: {
    marginBottom: 8,
  },
  specText: {
    fontSize: 13,
  },
  skillsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  skillBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  skillBadgeText: {
    fontSize: 11,
    fontWeight: '500',
  },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    paddingTop: 10,
  },
  channelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  channelIcon: {
    fontSize: 12,
  },
  matchBadge: {
    fontSize: 12,
    fontWeight: '700',
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
  emptySub: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  emptyActionBtn: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  emptyActionText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    maxHeight: '85%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  inputGroup: {
    marginBottom: 14,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
  },
  input: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    fontSize: 14,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 18,
  },
  modalBtnCancel: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBtnCreate: {
    flex: 2,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
