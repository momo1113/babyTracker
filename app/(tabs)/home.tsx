import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();
  const [timelineData, setTimelineData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTimeline() {
      try {
        const response = await fetch('http://192.168.1.9:3000/logs/today');
        console.log(response)
        if (!response.ok) {
          console.error('Failed to load timeline data');
          setTimelineData([]);
          setLoading(false);
          return;
        }
        const data = await response.json();
        setTimelineData(data);
      } catch (error) {
        console.error('Error fetching timeline:', error);
        setTimelineData([]);
      } finally {
        setLoading(false);
      }
    }

    fetchTimeline();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Profile Section */}
      <View style={styles.profileSection}>
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
        <QuickAction icon="drop.fill" label="Feeding" onPress={() => router.push('/(screens)/feeding')} />
        <QuickAction icon="bandage.fill" label="Diaper" onPress={() => router.push('/(screens)/diapers')} />
        <QuickAction icon="moon.fill" label="Sleeping" onPress={() => router.push('/(screens)/sleeping')} />
      </View>

      {/* Suggestions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Suggestions</Text>
        <Suggestion text="Last feeding was 2.5 hours ago — time to check again?" />
        <Suggestion text="Crying after feeding? Might be gas. Try burping or tummy massage." />
      </View>

      {/* Timeline */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle} accessibilityLabel="Timeline for Today">
          Timeline for Today
        </Text>
        {loading ? (
          <ActivityIndicator size="small" color="#687076" />
        ) : timelineData.length > 0 ? (
          timelineData.map((item, index) => (
            <TimelineItem
              key={index}
              type={item.type}
              time={item.time}
              details={item.details}
            />
          ))
        ) : (
          <Text style={styles.noEventsText}>No events for today</Text>
        )}
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
    <TouchableOpacity
      style={styles.quickAction}
      onPress={onPress}
      accessibilityLabel={`Navigate to ${label} screen`}
    >
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
  const iconMap = {
    Feeding: 'baby-bottle-outline',
    Diaper: 'paper-towel',
    Sleeping: 'bed-outline',
  };

  return (
    <View style={styles.timelineItem}>
      <View style={styles.timelineDot} />
      <View style={styles.timelineContent}>
        <View style={styles.timelineHeaderRow}>
          <View style={styles.timelineTypeContainer}>
            <IconSymbol name={iconMap[type]} size={16} color="#687076" />
            <Text style={[styles.timelineType, { marginLeft: 4 }]}>{type}</Text>
          </View>
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
  container: {
    padding: 24,
    paddingTop: 64,
    backgroundColor: '#F9F9F7', // Warm White
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E1D3C1', // Soft Sand
    marginRight: 12,
  },
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
    backgroundColor: '#F5EDE1', // Beige Cream
    borderRadius: 12,
  },
  quickActionLabel: {
    marginTop: 8,
    fontSize: 15,
    color: '#2D3A2E',
  },

  section: { marginBottom: 16 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#2D3A2E',
  },

  suggestion: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5EDE1', // Beige Cream
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  suggestionText: {
    marginLeft: 8,
    color: '#7A867B',
    fontSize: 14,
  },

  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#D4C5B3', // Warm Taupe
    marginRight: 12,
    marginTop: 6,
  },
  timelineContent: {
    flex: 1,
    backgroundColor: '#FFFFFF', // Card stays white for contrast
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
    alignItems: 'center',
  },
  timelineTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timelineType: {
    fontSize: 13,
    fontWeight: 'bold',
    backgroundColor: '#E8E8E8', // Light Dove Grey
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    color: '#2D3A2E',
  },
  timelineTime: {
    fontSize: 12,
    color: '#7A867B',
  },
  timelineDetail: {
    fontSize: 13,
    color: '#2D3A2E',
    marginTop: 2,
  },
  noEventsText: {
    fontSize: 14,
    color: '#7A867B',
    textAlign: 'center',
  },
});
