import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useFocusEffect, useRouter } from 'expo-router';
import { getAuth } from 'firebase/auth';
import relativeTime from 'dayjs/plugin/relativeTime';
import duration from 'dayjs/plugin/duration';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

dayjs.extend(relativeTime);
dayjs.extend(duration);

export default function HomeScreen() {
  const router = useRouter();
  const [timelineData, setTimelineData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(dayjs());

  const [profileName, setProfileName] = useState('');
  const [profileAge, setProfileAge] = useState('');

 const fetchTimeline = useCallback(async () => {
  try {
    setLoading(true);
    const user = getAuth().currentUser;
    if (!user) throw new Error('User not authenticated');

    const token = await user.getIdToken();

    const response = await fetch('http://192.168.1.9:3000/logs/today', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error('Failed to load timeline data');

    const data = await response.json();

    // If data is empty array, just setTimelineData without error
    if (Array.isArray(data) && data.length === 0) {
      setTimelineData([]);
    } else {
      setTimelineData(data);
    }

    setLastUpdated(dayjs());
  } catch (error) {
    // Only log real errors like network issues or server errors
    if (error.message !== 'Failed to load timeline data') {
      console.error('Error fetching timeline:', error);
    }
    setTimelineData([]);
  } finally {
    setLoading(false);
    setRefreshing(false);
  }
}, []);

  const fetchBabyProfile = useCallback(async () => {
    try {
      const user = getAuth().currentUser;
      if (!user) return;

      const token = await user.getIdToken();
      const response = await fetch('http://192.168.1.9:3000/baby-profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to fetch profile');

      setProfileName(data.name);
      const dob = dayjs(data.dob, ['YYYY-MM-DD', 'MM/DD/YYYY'], true);

      if (!dob.isValid()) {
        console.error('Invalid DOB format:', data.dob);
        setProfileAge('Invalid DOB');
        return;
      }
      
      setProfileAge(data.age);
      console.log('Profile fetched:', data.name, data.age);
    } catch (err) {
      console.error('Failed to load baby profile:', err);
      setProfileName('N/A');
      setProfileAge('N/A');
    }
  }, []);

  useEffect(() => {
    fetchTimeline();
    fetchBabyProfile();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchTimeline();
    fetchBabyProfile();
  };

  // Inside your component:
useFocusEffect(
  useCallback(() => {
    fetchTimeline();
    fetchBabyProfile();
  }, [fetchTimeline, fetchBabyProfile])
);

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Profile Section */}
      <View style={styles.profileSection}>
        <View style={styles.avatar} />
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{profileName}</Text>
          <Text style={styles.profileAge}>{profileAge}</Text>
        </View>
        <View style={styles.lastSeen}>
          <IconSymbol name="clock.fill" size={16} color="#687076" />
          <Text style={styles.lastSeenText}>Last: {dayjs(lastUpdated).fromNow()}</Text>
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
        <Text style={styles.sectionTitle}>Timeline for Today</Text>
        {loading ? (
          <ActivityIndicator size="small" color="#687076" />
        ) : timelineData.length > 0 ? (
          <ScrollView style={{ maxHeight: 350 }}>
            {timelineData.map((item, index) => (
              <TimelineItem
                key={index}
                type={item.type}
                time={item.time}
                details={item.details}
              />
            ))}
          </ScrollView>
        ) : (
          <Text style={styles.noEventsText}>No events for today</Text>
        )}
      </View>
    </ScrollView>
  );
}

function QuickAction({ icon, label, onPress }) {
  return (
    <TouchableOpacity style={styles.quickAction} onPress={onPress}>
      <IconSymbol name={icon} size={32} color="#687076" />
      <Text style={styles.quickActionLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

function Suggestion({ text }) {
  return (
    <View style={styles.suggestion}>
      <IconSymbol name="lightbulb.fill" size={16} color="#687076" />
      <Text style={styles.suggestionText}>{text}</Text>
    </View>
  );
}

function TimelineItem({ type, time, details }) {
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
    backgroundColor: '#F9F9F7',
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
    backgroundColor: '#E1D3C1',
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
    backgroundColor: '#F5EDE1',
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
    backgroundColor: '#F5EDE1',
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
    backgroundColor: '#D4C5B3',
    marginRight: 12,
    marginTop: 6,
  },
  timelineContent: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
    backgroundColor: '#E8E8E8',
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
