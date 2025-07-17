import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useRouter } from 'expo-router';

const timelineData = [
  {
    type: 'Feeding',
    time: '9:30 AM',
    details: [
      { label: 'Type', value: 'Breast (Left)' },
      { label: 'Duration', value: '15 minutes' },
    ],
  },
  {
    type: 'Diaper',
    time: '10:15 AM',
    details: [
      { label: 'Type', value: 'Poop' },
      { label: 'Notes', value: 'Normal consistency' },
    ],
  },
  {
    type: 'Sleeping',
    time: '12:00 PM',
    details: [
      { label: 'Duration', value: '1 hour' },
      { label: 'Quality', value: 'Peaceful' },
      { label: 'Notes', value: 'Slept well after crying' },
    ],
  },
];


export default function HomeScreen() {
  const router = useRouter();
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Profile Section */}
      <View style={styles.profileSection}>
        {/* Avatar */}
        <View style={styles.avatar} />
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>Emma</Text>
          <Text style={styles.profileAge}>2 months, 3 weeks</Text>
        </View>
        <View style={styles.lastSeen}>
          <IconSymbol name="clock.fill" size={16} color="#687076" />
          <Text style={styles.lastSeenText}>Last: 45m ago</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <QuickAction icon="drop.fill" label="Feeding" onPress={() => router.push('/feeding')}/>
        <QuickAction icon="baby" label="Diaper" onPress={() => router.push('/diapers')}/>
        <QuickAction icon="moon.fill" label="Sleeping" onPress={() => router.push('/sleeping')}/>
      </View>

      {/* Suggestions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Suggestions</Text>
        <Suggestion text="Last feeding was 2.5 hours ago — time to check again?" />
        <Suggestion text="Crying after feeding? Might be gas. Try burping or tummy massage." />
      </View>

      {/* Timeline */}
      <View style={styles.section}>
        <View style={styles.timelineHeader}>
          <Text style={styles.sectionTitle}>Today's Timeline</Text>
          <TouchableOpacity style={styles.calendarBtn}>
            <Text style={styles.calendarText}>View Calendar</Text>
            <IconSymbol name="calendar" size={16} color="#687076" />
          </TouchableOpacity>
        </View>
        {timelineData.map((item, index) => (
          <TimelineItem
            key={index}
            type={item.type}
            time={item.time}
            details={item.details}
          />
        ))}
      </View>
    </ScrollView>
  );
}

// Quick Action Button
function QuickAction({
  icon,
  label,
  onPress,
}: {
  icon: string;
  label: string;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity style={styles.quickAction} onPress={onPress}>
      <IconSymbol name={icon} size={32} color="#687076" />
      <Text style={styles.quickActionLabel}>{label}</Text>
    </TouchableOpacity>
  );
}
// Suggestion Card
function Suggestion({ text }: { text: string }) {
  return (
    <View style={styles.suggestion}>
      <IconSymbol name="lightbulb.fill" size={16} color="#687076" />
      <Text style={styles.suggestionText}>{text}</Text>
    </View>
  );
}

// Timeline Item
function TimelineItem({
  type,
  time,
  details,
}: {
  type: string;
  time: string;
  details: { label: string; value: string }[];
}) {
  return (
    <View style={styles.timelineItem}>
      <View style={styles.timelineDot} />
      <View style={styles.timelineContent}>
        <View style={styles.timelineHeaderRow}>
          <Text style={styles.timelineType}>{type}</Text>
          <Text style={styles.timelineTime}>{time}</Text>
        </View>
        {details.map((d, i) => (
          <Text key={i} style={styles.timelineDetail}>
            {d.label}: {d.value}
          </Text>
        ))}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { padding: 24, paddingTop: 64, backgroundColor: '#F6F7F4' },

  profileSection: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#C5D7BD', marginRight: 12 },
  profileInfo: { flex: 1 },
  profileName: { fontSize: 16, fontWeight: 'bold', color: '#2D3A2E' },
  profileAge: { fontSize: 14, color: '#7A867B' },
  lastSeen: { flexDirection: 'row', alignItems: 'center' },
  lastSeenText: { marginLeft: 4, fontSize: 12, color: '#7A867B' },

  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  quickAction: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    padding: 12,
    backgroundColor: '#E9F2EC',
    borderRadius: 12,
  },
  quickActionLabel: { marginTop: 8, fontSize: 15, color: '#2D3A2E' },

  section: { marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 8, color: '#2D3A2E' },

  suggestion: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E9F2EC',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  suggestionText: { marginLeft: 8, color: '#7A867B', fontSize: 14 },

  timelineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  calendarBtn: { flexDirection: 'row', alignItems: 'center' },
  calendarText: { marginRight: 4, color: '#7A867B', fontSize: 13 },

  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#8FB89C',
    marginRight: 12,
    marginTop: 6,
  },
  timelineContent: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  timelineHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  timelineType: {
    fontSize: 13,
    fontWeight: 'bold',
    backgroundColor: '#C5D7BD',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    color: '#2D3A2E',
  },
  timelineTime: { fontSize: 12, color: '#7A867B' },
  timelineDetail: { fontSize: 13, color: '#2D3A2E', marginTop: 2 },
});
