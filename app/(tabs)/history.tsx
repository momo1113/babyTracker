import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import Modal from 'react-native-modal';
import { Calendar } from 'react-native-calendars';

const TABS = ['All', 'Feeding', 'Diaper', 'Sleep'];

const DATA = [
  {
    date: '2025-07-18',
    type: 'Feeding',
    icon: 'baby-bottle-outline',
    time: '2:30 PM',
    details: 'Bottle • 4 oz',
  },
  {
    date: '2025-07-18',
    type: 'Diaper',
    icon: 'paper-towel',
    time: '1:45 PM',
    details: 'Pee • Yellow',
  },
  {
    date: '2025-07-18',
    type: 'Sleep',
    icon: 'bed-outline',
    time: '12:00 PM',
    details: 'Nap • 1h 30m',
  },
  {
    date: '2025-07-18',
    type: 'Feeding',
    icon: 'baby-bottle-outline',
    time: '10:30 AM',
    details: 'Breast • Left • 15 min',
  },
  {
    date: '2025-07-17',
    type: 'Diaper',
    icon: 'paper-towel',
    time: '9:45 AM',
    details: 'Poop • Brown • Soft',
  },
];

export default function HistoryScreen() {
  const [selectedTab, setSelectedTab] = useState('All');
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState('2025-07-18'); // Default to today

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleDateSelect = (day) => {
    setSelectedDate(day.dateString);
    console.log('Selected date:', day.dateString);
    toggleModal();
  };

  // Filter DATA by date and tab
  const filteredData = DATA.filter(
    (item) =>
      item.date === selectedDate &&
      (selectedTab === 'All' || item.type === selectedTab)
  );

  // Format date for display (e.g., "July 18, 2025")
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <ScrollView style={styles.container}>
      {/* Date Navigation */}
      <View style={styles.dateNav}>
        <TouchableOpacity onPress={toggleModal}>
          <Text style={styles.dateText}>{formatDate(selectedDate)}</Text>
        </TouchableOpacity>
      </View>

      {/* Summary Row */}
      <View style={styles.summaryRow}>
        <SummaryItem icon="drop.fill" label="Feeding" count={6} />
        <SummaryItem icon="bandage.fill" label="Diapers" count={8} />
        <SummaryItem icon="moon.fill" label="Sleeping" count={4} />
      </View>

      {/* Filter Tabs */}
      <View style={styles.tabsRow}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tabBtn,
              selectedTab === tab && styles.tabBtnActive,
            ]}
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

      {/* History List */}
      <View style={styles.listSection}>
        {filteredData.length > 0 ? (
          filteredData.map((item, idx) => (
            <View key={idx} style={styles.card}>
              <View style={styles.cardLeft}>
                <IconSymbol name={item.icon} size={24} color="#687076" />
                <View style={{ marginLeft: 10 }}>
                  <Text style={styles.cardType}>{item.type}</Text>
                  <Text style={styles.cardDetails}>{item.details}</Text>
                </View>
              </View>
              <Text style={styles.cardTime}>{item.time}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.noEventsText}>No events for this date</Text>
        )}
      </View>

      {/* Calendar Modal */}
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

      {/* Floating Add Button */}
      {/* <TouchableOpacity style={styles.fab}>
        <IconSymbol name="plus" size={28} color="#fff" />
      </TouchableOpacity> */}
    </ScrollView>
  );
}

function SummaryItem({ icon, label, count }: { icon: string; label: string; count: number }) {
  return (
    <View style={styles.summaryItem}>
      <IconSymbol name={icon} size={24} color="#687076" />
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={styles.summaryCount}>{count}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9F9F7', paddingHorizontal: 0 }, // Warm White
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
    backgroundColor: '#F5EDE1', // Beige Cream
  },
  summaryItem: { alignItems: 'center', flex: 1 },
  summaryLabel: { fontSize: 13, color: '#7A867B', marginTop: 4 },
  summaryCount: { fontSize: 15, fontWeight: 'bold', color: '#2D3A2E', marginTop: 2 },

  tabsRow: { flexDirection: 'row', padding: 12, gap: 8 },
  tabBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F5EDE1', // Beige Cream
    marginRight: 8,
  },
  tabBtnActive: { backgroundColor: '#E1D3C1' }, // Soft Sand
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
  cardTime: { fontSize: 15, color: '#7A867B', fontWeight: 'bold' },

  fab: {
    position: 'absolute',
    right: 24,
    bottom: 32,
    backgroundColor: '#2D3A2E',
    borderRadius: 28,
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },

  modal: {
    justifyContent: 'center',
    margin: 0,
  },
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
    backgroundColor: '#F5EDE1', // Beige Cream
    borderRadius: 8,
  },
  closeButtonText: {
    color: '#2D3A2E',
    fontSize: 16,
    fontWeight: '500',
  },
  noEventsText: { fontSize: 14, color: '#7A867B', textAlign: 'center' },
});
