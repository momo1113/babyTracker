import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { IconSymbol } from '@/components/ui/IconSymbol';
import Modal from 'react-native-modal';
import { useRouter } from 'expo-router';

export default function InsightsScreen() {
  const router = useRouter();
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [rangeType, setRangeType] = useState('7days'); // Default: Last 7 days

  const toggleDropdown = () => {
    setDropdownVisible(!isDropdownVisible);
  };

  const handleRangeSelect = (type) => {
    setRangeType(type);
    toggleDropdown();
  };

  const getRangeLabel = () => {
    return `Last ${rangeType === '7days' ? '7' : rangeType === '14days' ? '14' : '30'} days`;
  };

  // Helper to generate date labels (e.g., ["7/12", "7/13", ..., "7/18"] for 7 days)
  const generateDateLabels = (days) => {
    const labels = [];
    const today = new Date('2025-07-18');
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      labels.push(`${date.getMonth() + 1}/${date.getDate()}`);
    }
    return labels;
  };

  // Mock chart data based on range
  const getChartData = () => {
    const days = rangeType === '7days' ? 7 : rangeType === '14days' ? 14 : 30;
    const labels = generateDateLabels(days);

    // Generate mock sleep data (hours)
    const sleepData = Array(days).fill(0).map(() => 12 + Math.random() * 3); // Random 12-15h
    // Generate mock feeding data (count)
    const feedingData = Array(days).fill(0).map(() => Math.floor(6 + Math.random() * 4)); // Random 6-9
    // Generate mock diaper data
    const diaperData = [
      { name: 'Pee', count: Math.floor(days * 0.7), color: '#8FB89C', legendFontColor: '#7A867B', legendFontSize: 14 },
      { name: 'Poop', count: Math.floor(days * 0.4), color: '#C5D7BD', legendFontColor: '#7A867B', legendFontSize: 14 },
    ];

    return {
      sleep: { labels, data: sleepData },
      feeding: { labels, data: feedingData },
      diaper: diaperData,
    };
  };

  const chartData = getChartData();

  const chartConfig = {
    backgroundGradientFrom: '#E9F2EC',
    backgroundGradientTo: '#E9F2EC',
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(143, 184, 156, ${opacity})`, // #8FB89C
    labelColor: () => '#7A867B',
    style: { borderRadius: 12 },
    propsForDots: { r: '5', strokeWidth: '2', stroke: '#2D3A2E' },
    propsForBackgroundLines: { stroke: '#C5D7BD' },
    propsForLabels: { fontSize: 12, fontWeight: '500', paddingRight: 10 },
    barPercentage: 0.7,
  };

  // Calculate chart width based on range (wider for more days)
  const chartWidth = rangeType === '7days' ? Dimensions.get('window').width - 60 : (rangeType === '14days' ? Dimensions.get('window').width * 1.6 : Dimensions.get('window').width * 2.2);

  return (
    <View style={styles.containerWrapper}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Date Range</Text>
        <Pressable
          onPress={toggleDropdown}
          style={({ pressed }) => [styles.dropdownButton, pressed && styles.pressed]}
          accessibilityLabel={`Select date range, current: ${getRangeLabel()}`}
        >
          <IconSymbol name="chevron.down" size={20} color="#687076" />
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Sleep Trends */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <IconSymbol name="bed-outline" size={20} color="#687076" /> Sleep Trends
          </Text>
          <View style={styles.card}>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={true} style={styles.chartScroll}>
              <LineChart
                data={{
                  labels: chartData.sleep.labels,
                  datasets: [{ data: chartData.sleep.data }],
                }}
                width={chartWidth}
                height={220}
                yAxisSuffix="h"
                chartConfig={chartConfig}
                bezier
                style={styles.chart}
                horizontalScroll={true}
                verticalScroll={true}
                accessibilityLabel={`Sleep trends for ${getRangeLabel()}`}
              />
            </ScrollView>
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
        </View>

        {/* Feeding Frequency */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <IconSymbol name="baby-bottle-outline" size={20} color="#687076" /> Feeding Frequency
          </Text>
          <View style={styles.card}>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={true} style={styles.chartScroll}>
              <BarChart
                data={{
                  labels: chartData.feeding.labels,
                  datasets: [{ data: chartData.feeding.data }],
                }}
                width={chartWidth + 20}
                height={220}
                yAxisSuffix=""
                fromZero
                chartConfig={{ ...chartConfig, decimalPlaces: 0 }}
                style={styles.chart}
                horizontalScroll={true}
                verticalScroll={true}
                accessibilityLabel={`Feeding frequency for ${getRangeLabel()}, ${chartData.feeding.data.length} days shown`}
              />
            </ScrollView>
            <View style={styles.statsRowCentered}>
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
        </View>

        {/* Diaper Analysis */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <IconSymbol name="paper-towel" size={20} color="#687076" /> Diaper Analysis
          </Text>
          <View style={styles.card}>
            <View style={styles.chartContainer}>
              <PieChart
                data={chartData.diaper}
                width={Dimensions.get('window').width - 60}
                height={200}
                chartConfig={chartConfig}
                accessor="count"
                backgroundColor="transparent"
                paddingLeft="30"
                absolute
                style={styles.chart}
                accessibilityLabel={`Diaper analysis for ${getRangeLabel()}`}
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
        </View>

        {/* AI Suggestions */}
        <View style={styles.section}>
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
        </View>

        {/* Action Buttons */}
        <View style={styles.actionRow}>
          <Pressable
            onPress={() => console.log('Refresh')}
            style={({ pressed }) => [styles.actionBtn, pressed && styles.pressed]}
            accessibilityLabel="Refresh insights"
          >
            <Text style={styles.actionBtnText}>Refresh</Text>
          </Pressable>
          <Pressable
            onPress={() => console.log('New Tips')}
            style={({ pressed }) => [styles.actionBtn, pressed && styles.pressed]}
            accessibilityLabel="Get new tips"
          >
            <Text style={styles.actionBtnText}>New Tips</Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Dropdown Modal */}
      <Modal
        isVisible={isDropdownVisible}
        onBackdropPress={toggleDropdown}
        style={styles.modal}
      >
        <View style={styles.dropdownContent}>
          <Text style={styles.modalTitle}>Select Range</Text>
          {['7days', '14days', '30days'].map((type) => (
            <Pressable
              key={type}
              onPress={() => handleRangeSelect(type)}
              style={({ pressed }) => [styles.dropdownItem, pressed && styles.pressed]}
              accessibilityLabel={`Select last ${type.replace('days', '')} days`}
            >
              <Text style={styles.dropdownItemText}>
                Last ${type.replace('days', '')} days
              </Text>
            </Pressable>
          ))}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  containerWrapper: { flex: 1, backgroundColor: '#F6F7F4' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    paddingTop: 64,
    backgroundColor: '#F6F7F4',
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#2D3A2E' },
  dropdownButton: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#E9F2EC',
  },
  container: {
    padding: 24,
    backgroundColor: '#F6F7F4',
    flexGrow: 1,
    paddingTop: 0,
    paddingBottom: 80,
  },
  section: { marginBottom: 24 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3A2E',
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  chartScroll: {
    marginBottom: 16,
    paddingHorizontal: 10,
  },
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  chart: {
    borderRadius: 12,
    padding: 8,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 12,
  },
  statsRowCentered: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 12,
    flexWrap: 'wrap',
  },
  statItem: {
    width: 100,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3A2E',
    textAlign: 'center',
  },
  statLabel: {
    fontSize: 14,
    color: '#7A867B',
    marginTop: 4,
    textAlign: 'center',
  },
  statSubLabel: {
    fontSize: 12,
    color: '#7A867B',
    marginTop: 2,
    textAlign: 'center',
  },
  infoBox: {
    backgroundColor: '#E9F2EC',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  infoText: { fontSize: 14, color: '#7A867B' },
  suggestionBox: {
    backgroundColor: '#E9F2EC',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  suggestionText: { fontSize: 14, color: '#7A867B' },
  actionRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: '#E9F2EC',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  actionBtnText: { fontSize: 16, fontWeight: '600', color: '#2D3A2E' },
  modal: { justifyContent: 'center', margin: 0 },
  dropdownContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 24,
    alignItems: 'center',
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#2D3A2E', marginBottom: 12 },
  dropdownItem: {
    padding: 12,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginVertical: 4,
    backgroundColor: '#E9F2EC',
  },
  dropdownItemText: { fontSize: 16, color: '#2D3A2E', fontWeight: '500' },
  pressed: { opacity: 0.7 },
});