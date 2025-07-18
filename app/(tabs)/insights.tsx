import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';

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
        <View style={styles.lineChart}>
          <LineChart
            data={{
              labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
              datasets: [
                {
                  data: [13.5, 14, 12.5, 14.2, 13.8, 15, 14.5],
                },
              ],
            }}
            width={Dimensions.get('window').width - 64}
            height={200}
            yAxisSuffix="h"
            chartConfig={{
              backgroundColor: '#F7F8F9',
              backgroundGradientFrom: '#F7F8F9',
              backgroundGradientTo: '#F7F8F9',
              decimalPlaces: 1,
              color: () => '#11181C',
              labelColor: () => '#687076',
              style: {
                borderRadius: 12,
              },
              propsForDots: {
                r: '4',
                strokeWidth: '1',
                stroke: '#11181C',
              },
            }}
            bezier
            style={{
              borderRadius: 12,
            }}
          />
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
          <Text style={styles.infoText}>
            Baby usually naps every 2.5 hrs — last nap was 3.5 hrs ago
          </Text>
        </View>
      </View>

      {/* Feeding Frequency */}
      <Text style={styles.sectionTitle}>{"\u{1F4D1}"} Feeding Frequency</Text>
      <View style={styles.card}>
        <View style={styles.barChart}>
          <BarChart
            data={{
              labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
              datasets: [
                {
                  data: [7, 8, 9, 8, 7, 6, 8], // Mock feedings per day
                },
              ],
            }}
            width={Dimensions.get('window').width - 64}
            height={200}
            yAxisSuffix=""
            fromZero
            chartConfig={{
              backgroundColor: '#F7F8F9',
              backgroundGradientFrom: '#F7F8F9',
              backgroundGradientTo: '#F7F8F9',
              decimalPlaces: 0,
              color: () => '#11181C',
              labelColor: () => '#687076',
              style: {
                borderRadius: 12,
              },
              propsForBackgroundLines: {
                stroke: '#ECEDEE',
              },
            }}
            style={{
              borderRadius: 12,
            }}
          />
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
        <View style={styles.pieChart}>
          <PieChart
            data={[
              {
                name: 'Pee',
                count: 5,
                color: '#3B82F6',
                legendFontColor: '#687076',
                legendFontSize: 14,
              },
              {
                name: 'Poop',
                count: 3,
                color: '#8B5CF6',
                legendFontColor: '#687076',
                legendFontSize: 14,
              },
            ]}
            width={Dimensions.get('window').width - 64}
            height={180}
            chartConfig={{
              backgroundColor: '#F7F8F9',
              backgroundGradientFrom: '#F7F8F9',
              backgroundGradientTo: '#F7F8F9',
              color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
              labelColor: () => '#687076',
              style: {
                borderRadius: 12,
              },
            }}
            accessor="count"
            backgroundColor="transparent"
            paddingLeft="20"
            absolute
          />
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
          <Text style={styles.infoText}>
            Only 2 wet diapers today — consider offering more fluids
          </Text>
        </View>
      </View>

      {/* AI Suggestions */}
      <Text style={styles.sectionTitle}>AI Suggestions</Text>
      <View style={styles.card}>
        <View style={styles.suggestionBox}>
          <Text style={styles.suggestionText}>
            Baby usually poops every morning — try tummy time or massage if backed up.
          </Text>
        </View>
        <View style={styles.suggestionBox}>
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
   container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
    justifyContent: 'flex-start',
    paddingHorizontal: 0,
    paddingTop: 72,
    paddingBottom: 76,
  },
  rangeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  rangeText: { fontSize: 15, color: '#687076' },
  rangeBtn: { fontSize: 15, color: '#687076' },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#11181C',
    marginTop: 18,
    marginBottom: 8,
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#F7F8F9',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  lineChart: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  barChart: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  pieChart: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 8,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 6,
  },
  statValue: { fontSize: 16, fontWeight: 'bold', color: '#11181C' },
  statLabel: { fontSize: 13, color: '#687076', marginTop: 2 },
  statSubLabel: { fontSize: 12, color: '#687076', marginTop: 1 },
  infoBox: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    marginTop: 8,
  },
  infoText: { color: '#687076', fontSize: 13 },
  suggestionBox: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  suggestionText: { color: '#687076', fontSize: 13 },
  actionRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 12,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: '#F7F8F9',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginHorizontal: 6,
  },
  actionBtnText: { color: '#11181C', fontSize: 15, fontWeight: 'bold' },
});
