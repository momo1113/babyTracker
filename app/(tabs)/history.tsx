import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';

const TABS = ['All', 'Feeding', 'Diaper', 'Sleep'];

const DATA = [
  {
    type: 'Feeding',
    icon: 'drop.fill',
    time: '2:30 PM',
    details: 'Bottle • 4 oz',
  },
  {
    type: 'Diaper',
    icon: 'diaper-outline',
    time: '1:45 PM',
    details: 'Pee • Yellow',
  },
  {
    type: 'Sleep',
    icon: 'moon.fill',
    time: '12:00 PM',
    details: 'Nap • 1h 30m',
  },
  {
    type: 'Feeding',
    icon: 'drop.fill',
    time: '10:30 AM',
    details: 'Breast • Left • 15 min',
  },
  {
    type: 'Diaper',
    icon: 'circle.dotted',
    time: '9:45 AM',
    details: 'Poop • Brown • Soft',
  },
];

export default function HistoryScreen() {
  const [selectedTab, setSelectedTab] = useState('All');

  const filteredData =
    selectedTab === 'All'
      ? DATA
      : DATA.filter(item => item.type === selectedTab);

  return (
    <ScrollView style={styles.container}>
      {/* Date Navigation */}
      <View style={styles.dateNav}>
        <TouchableOpacity>
          <IconSymbol name="chevron.left" size={20} color="#687076" />
        </TouchableOpacity>
        <Text style={styles.dateText}>Today  Jan 17, 2025</Text>
        <TouchableOpacity>
          <IconSymbol name="chevron.right" size={20} color="#687076" />
        </TouchableOpacity>
      </View>

      {/* Summary Row */}
      <View style={styles.summaryRow}>
        <SummaryItem icon="drop.fill" label="Feeding" count={6} />
        <SummaryItem icon="baby" label="Diaper" count={8} />
        <SummaryItem icon="moon.fill" label="Sleep" count={4} />
      </View>

      {/* Filter Tabs */}
      <View style={styles.tabsRow}>
        {TABS.map(tab => (
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
        {filteredData.map((item, idx) => (
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
        ))}
      </View>

      {/* Floating Add Button */}
      <TouchableOpacity style={styles.fab}>
        <IconSymbol name="plus" size={28} color="#fff" />
      </TouchableOpacity>
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
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 0 },
  dateNav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 8, marginTop: 72 },
  dateText: { fontSize: 16, color: '#11181C', marginHorizontal: 12 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 12, backgroundColor: '#F7F8F9' },
  summaryItem: { alignItems: 'center', flex: 1 },
  summaryLabel: { fontSize: 13, color: '#687076', marginTop: 4 },
  summaryCount: { fontSize: 15, fontWeight: 'bold', color: '#11181C', marginTop: 2 },
  tabsRow: { flexDirection: 'row', padding: 12, gap: 8 },
  tabBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, backgroundColor: '#F7F8F9', marginRight: 8 },
  tabBtnActive: { backgroundColor: '#11181C' },
  tabBtnText: { color: '#687076', fontSize: 15 },
  tabBtnTextActive: { color: '#fff', fontWeight: 'bold' },
  listSection: { paddingHorizontal: 8, paddingBottom: 80 },
  card: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#F7F8F9', borderRadius: 12, padding: 16, marginBottom: 12 },
  cardLeft: { flexDirection: 'row', alignItems: 'center' },
  cardType: { fontSize: 15, fontWeight: 'bold', color: '#11181C' },
  cardDetails: { fontSize: 13, color: '#687076', marginTop: 2 },
  cardTime: { fontSize: 15, color: '#687076', fontWeight: 'bold' },
  fab: { position: 'absolute', right: 24, bottom: 32, backgroundColor: '#11181C', borderRadius: 28, width: 56, height: 56, alignItems: 'center', justifyContent: 'center', elevation: 4 },
});