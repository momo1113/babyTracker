import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import Modal from 'react-native-modal';
import { Calendar } from 'react-native-calendars';
import { formatDistanceToNow, parseISO } from 'date-fns';

const TABS = ['All', 'Feeding', 'Diaper', 'Sleep'];

export default function HistoryScreen() {
  const [selectedTab, setSelectedTab] = useState('All');
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState('2025-07-18'); // default date
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleDateSelect = (day) => {
    setSelectedDate(day.dateString);
    toggleModal();
  };

  const fetchLogs = async (date) => {
    setLoading(true);
    try {
      const response = await fetch(`http://192.168.1.9:3000/history/${date}`);
      if (!response.ok) throw new Error('Failed to fetch logs');
      const data = await response.json();
      setLogs(data);
    } catch (error) {
      console.error(error);
      setLogs([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLogs(selectedDate);
  }, [selectedDate]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchLogs(selectedDate);
  };

  // Filter logs by selected tab
  const filteredData = logs.filter(
    (log) => selectedTab === 'All' || log.type === selectedTab
  );

  // Calculate summary counts dynamically based on all logs of selected date
  const counts = { Feeding: 0, Diaper: 0, Sleep: 0 };
  logs.forEach((log) => {
    if (counts[log.type] !== undefined) counts[log.type]++;
  });

  // Format date for header title
  const formatDate = (dateString) => {
  const parts = dateString.split('-');
  const date = new Date(parts[0], parts[1] - 1, parts[2]); // local midnight
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};


  // Format relative time like "45 minutes ago"
  const formatRelativeTime = (timeString) => {
    try {
      return formatDistanceToNow(parseISO(timeString), { addSuffix: true });
    } catch {
      return timeString;
    }
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.dateNav}>
        <TouchableOpacity onPress={toggleModal}>
          <Text style={styles.dateText}>{formatDate(selectedDate)}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.summaryRow}>
        <SummaryItem icon="drop.fill" label="Feeding" count={counts.Feeding} />
        <SummaryItem icon="bandage.fill" label="Diapers" count={counts.Diaper} />
        <SummaryItem icon="moon.fill" label="Sleeping" count={counts.Sleep} />
      </View>

      <View style={styles.tabsRow}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabBtn, selectedTab === tab && styles.tabBtnActive]}
            onPress={() => setSelectedTab(tab)}
          >
            <Text
              style={[
                styles.tabBtnText,
                selectedTab === tab && styles.tabBtnTextActive,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.listSection}>
        {loading ? (
          <ActivityIndicator size="small" color="#687076" />
        ) : filteredData.length > 0 ? (
          filteredData.map((item, idx) => (
            <View key={idx} style={styles.card}>
              <View style={styles.cardLeft}>
                <IconSymbol name={item.icon} size={24} color="#687076" />
                <View style={{ marginLeft: 10 }}>
                  <Text style={styles.cardType}>{item.type}</Text>
                  <Text style={styles.cardDetails}>{item.details}</Text>
                </View>
              </View>
              <Text style={styles.cardTime}>
                {formatRelativeTime(item.time)}
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.noEventsText}>No events for this date</Text>
        )}
      </View>

      <Modal
        isVisible={isModalVisible}
        onBackdropPress={toggleModal}
        style={styles.modal}
      >
        <View style={styles.modalContent}>
          <Calendar
            onDayPress={handleDateSelect}
            markedDates={{
              [selectedDate]: { selected: true, selectedColor: '#8FB89C' },
            }}
            theme={{
              selectedDayBackgroundColor: '#8FB89C',
              todayTextColor: '#2D3A2E',
              arrowColor: '#687076',
              monthTextColor: '#2D3A2E',
              textDayFontWeight: '400',
              textMonthFontWeight: 'bold',
            }}
          />
          <TouchableOpacity style={styles.closeButton} onPress={toggleModal}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </ScrollView>
  );
}

function SummaryItem({ icon, label, count }) {
  return (
    <View style={styles.summaryItem}>
      <IconSymbol name={icon} size={24} color="#687076" />
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={styles.summaryCount}>{count}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9F9F7', paddingHorizontal: 0 },
  dateNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    marginTop: 72,
  },
  dateText: { fontSize: 16, fontWeight: 'bold', color: '#2D3A2E' },

  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    backgroundColor: '#F5EDE1',
  },
  summaryItem: { alignItems: 'center', flex: 1 },
  summaryLabel: { fontSize: 13, color: '#7A867B', marginTop: 4 },
  summaryCount: { fontSize: 15, fontWeight: 'bold', color: '#2D3A2E', marginTop: 2 },

  tabsRow: { flexDirection: 'row', padding: 12, gap: 8 },
  tabBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F5EDE1',
    marginRight: 8,
  },
  tabBtnActive: { backgroundColor: '#E1D3C1' },
  tabBtnText: { color: '#7A867B', fontSize: 15 },
  tabBtnTextActive: { color: '#2D3A2E', fontWeight: 'bold' },

  listSection: { paddingHorizontal: 8, paddingBottom: 80 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  cardLeft: { flexDirection: 'row', alignItems: 'center' },
  cardType: { fontSize: 15, fontWeight: 'bold', color: '#2D3A2E' },
  cardDetails: { fontSize: 13, color: '#7A867B', marginTop: 2 },
  cardTime: { fontSize: 13, color: '#7A867B', fontWeight: '600' },

  modal: { justifyContent: 'center', margin: 0 },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 20,
    alignItems: 'center',
  },
  closeButton: {
    marginTop: 16,
    padding: 10,
    backgroundColor: '#F5EDE1',
    borderRadius: 8,
  },
  closeButtonText: {
    color: '#2D3A2E',
    fontSize: 16,
    fontWeight: '500',
  },
  noEventsText: { fontSize: 14, color: '#7A867B', textAlign: 'center' },
});
