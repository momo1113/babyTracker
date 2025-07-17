import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function InsightsScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Range Selector */}
      <View style={styles.rangeRow}>
        <Text style={styles.rangeText}>Last 7 days</Text>
        <TouchableOpacity>
          <Text style={styles.rangeBtn}>Change Range ▼</Text>
        </TouchableOpacity>
      </View>

      {/* Sleep Trends */}
      <Text style={styles.sectionTitle}>{"\u{1F319}"} Sleep Trends</Text>
      <View style={styles.card}>
        <View style={styles.chartPlaceholder}>
          <Text style={styles.chartText}>Sleep Hours Chart</Text>
        </View>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>2.5h</Text>
            <Text style={styles.statLabel}>Avg Nap</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>3.2h</Text>
            <Text style={styles.statLabel}>Longest Nap</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>14h</Text>
            <Text style={styles.statLabel}>Total Sleep</Text>
          </View>
        </View>
        <View style={styles.infoBox}>
          <IconSymbol name="exclamationmark.triangle" size={16} color="#F5A623" />
          <Text style={styles.infoText}>
            Baby usually naps every 2.5 hrs — last nap was 3.5 hrs ago
          </Text>
        </View>
      </View>

      {/* Feeding Frequency */}
      <Text style={styles.sectionTitle}>{"\u{1F4D1}"} Feeding Frequency</Text>
      <View style={styles.card}>
        <View style={styles.row}>
          <View style={styles.cardBox}>
            <Text style={styles.cardBoxTitle}>Daily Feedings</Text>
          </View>
          <View style={styles.cardBox}>
            <Text style={styles.cardBoxTitle}>Method Breakdown</Text>
          </View>
        </View>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>8</Text>
            <Text style={styles.statLabel}>Feedings Today</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>15min</Text>
            <Text style={styles.statLabel}>Avg Duration</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>3h</Text>
            <Text style={styles.statLabel}>Between Feeds</Text>
          </View>
        </View>
      </View>

      {/* Diaper Analysis */}
      <Text style={styles.sectionTitle}>{"\u{1F6BC}"} Diaper Analysis</Text>
      <View style={styles.card}>
        <View style={styles.chartPlaceholder}>
          <Text style={styles.chartText}>7-Day Diaper Changes</Text>
        </View>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>8 Changes</Text>
            <Text style={styles.statLabel}>Today's Count</Text>
            <Text style={styles.statSubLabel}>3 Poops, 5 Pees</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>7.2/day</Text>
            <Text style={styles.statLabel}>Weekly Avg</Text>
            <Text style={styles.statSubLabel}>Within normal range</Text>
          </View>
        </View>
        <View style={styles.infoBox}>
          <IconSymbol name="info.circle" size={16} color="#687076" />
          <Text style={styles.infoText}>
            Only 2 wet diapers today — consider offering more fluids
          </Text>
        </View>
      </View>

      {/* AI Suggestions */}
      <Text style={styles.sectionTitle}>AI Suggestions</Text>
      <View style={styles.card}>
        <View style={styles.suggestionBox}>
          <IconSymbol name="info.circle" size={16} color="#687076" />
          <Text style={styles.suggestionText}>
            Baby usually poops every morning — try tummy time or massage if backed up.
          </Text>
        </View>
        <View style={styles.suggestionBox}>
          <IconSymbol name="info.circle" size={16} color="#687076" />
          <Text style={styles.suggestionText}>
            Sleep patterns are consistent. Great job maintaining routine!
          </Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.actionBtn}>
          <Text style={styles.actionBtnText}>Refresh</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn}>
          <Text style={styles.actionBtnText}>New Tips</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.actionBtn}>
          <Text style={styles.actionBtnText}>Export PDF</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn}>
          <Text style={styles.actionBtnText}>Date Range</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#fff', paddingHorizontal: 0, paddingTop: 72, paddingBottom: 56 },
  rangeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 8 },
  rangeText: { fontSize: 15, color: '#687076' },
  rangeBtn: { fontSize: 15, color: '#687076' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#11181C', marginTop: 18, marginBottom: 8, paddingHorizontal: 20 },
  card: { backgroundColor: '#F7F8F9', borderRadius: 12, padding: 16, marginHorizontal: 16, marginBottom: 16 },
  chartPlaceholder: { backgroundColor: '#ECEDEE', borderRadius: 8, height: 60, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  chartText: { color: '#687076', fontSize: 15 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8, marginBottom: 8 },
  statItem: { flex: 1, alignItems: 'center', marginHorizontal: 2 },
  statValue: { fontSize: 16, fontWeight: 'bold', color: '#11181C' },
  statLabel: { fontSize: 13, color: '#687076', marginTop: 2 },
  statSubLabel: { fontSize: 12, color: '#687076', marginTop: 1 },
  infoBox: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: '#fff', borderRadius: 8, padding: 10, marginTop: 8 },
  infoText: { color: '#687076', fontSize: 13, marginLeft: 8, flex: 1 },
  row: { flexDirection: 'row', gap: 12, marginBottom: 8 },
  cardBox: { flex: 1, backgroundColor: '#ECEDEE', borderRadius: 8, padding: 12, alignItems: 'center', margin: 2 },
  cardBoxTitle: { color: '#687076', fontSize: 14, fontWeight: 'bold' },
  suggestionBox: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: '#fff', borderRadius: 8, padding: 10, marginBottom: 8 },
  suggestionText: { color: '#687076', fontSize: 13, marginLeft: 8, flex: 1 },
  actionRow: { flexDirection: 'row', gap: 12, marginHorizontal: 16, marginBottom: 12 },
  actionBtn: { flex: 1, backgroundColor: '#F7F8F9', borderRadius: 10, paddingVertical: 14, alignItems: 'center' },
  actionBtnText: { color: '#11181C', fontSize: 15, fontWeight: 'bold' },
});