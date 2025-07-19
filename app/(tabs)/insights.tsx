import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { IconSymbol } from '@/components/ui/IconSymbol';
import Modal from 'react-native-modal';
import { Calendar } from 'react-native-calendars';
import { useRouter } from 'expo-router';

export default function InsightsScreen() {
  const router = useRouter();
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [isCustomRangeVisible, setCustomRangeVisible] = useState(false);
  const [rangeType, setRangeType] = useState('7days'); // Default: Last 7 days
  const [customStartDate, setCustomStartDate] = useState(null);
  const [customEndDate, setCustomEndDate] = useState('2025-07-18'); // Default to today
  const [tempStartDate, setTempStartDate] = useState(null);
  const [tempEndDate, setTempEndDate] = useState('2025-07-18');

  const toggleDropdown = () => {
    setDropdownVisible(!isDropdownVisible);
  };

  const toggleCustomRange = () => {
    setTempStartDate(customStartDate);
    setTempEndDate(customEndDate);
    setCustomRangeVisible(!isCustomRangeVisible);
    setDropdownVisible(false);
  };

  const handleRangeSelect = (type) => {
    setRangeType(type);
    setCustomStartDate(null);
    setCustomEndDate('2025-07-18');
    toggleDropdown();
  };

  const handleCustomDateSelect = (day) => {
    if (!tempStartDate || (tempStartDate && tempEndDate)) {
      setTempStartDate(day.dateString);
      setTempEndDate(null);
    } else if (tempStartDate && !tempEndDate && day.dateString >= tempStartDate) {
      setTempEndDate(day.dateString);
    }
  };

  const confirmCustomRange = () => {
    if (tempStartDate && tempEndDate) {
      setCustomStartDate(tempStartDate);
      setCustomEndDate(tempEndDate);
      setRangeType('custom');
      setCustomRangeVisible(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getRangeLabel = () => {
    if (rangeType === 'custom') {
      return `${formatDate(customStartDate)} - ${formatDate(customEndDate)}`;
    }
    return `Last ${rangeType === '7days' ? '7' : rangeType === '14days' ? '14' : '30'} days`;
  };

  // Mock chart data based on range
  const getChartData = () => {
    const labels7 = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const labels14 = ['7/5', '7/6', '7/7', '7/8', '7/9', '7/10', '7/11', '7/12', '7/13', '7/14', '7/15', '7/16', '7/17', '7/18'];
    const labels30 = ['6/19', '6/24', '6/29', '7/4', '7/9', '7/14', '7/18'];

    const sleepData = {
      '7days': { labels: labels7, data: [13.5, 14, 12.5, 14.2, 13.8, 15, 14.5] },
      '14days': { labels: labels14, data: [13, 14, 12, 14.5, 13.5, 14, 12.5, 14.2, 13.8, 15, 14, 13.5, 14, 14.5] },
      '30days': { labels: labels30, data: [13, 13.5, 14, 14.5, 13.8, 14.2, 14.5] },
      'custom': { labels: labels7, data: [13.5, 14, 12.5, 14.2, 13.8, 15, 14.5] }, // Placeholder for custom
    };

    const feedingData = {
      '7days': { labels: labels7, data: [7, 8, 9, 8, 7, 6, 8] },
      '14days': { labels: labels14, data: [7, 8, 9, 8, 7, 6, 8, 7, 8, 9, 8, 7, 6, 8] },
      '30days': { labels: labels30, data: [8, 7, 9, 8, 7, 8, 8] },
      'custom': { labels: labels7, data: [7, 8, 9, 8, 7, 6, 8] }, // Placeholder for custom
    };

    const diaperData = {
      '7days': [
        { name: 'Pee', count: 5, color: '#8FB89C', legendFontColor: '#7A867B', legendFontSize: 14 },
        { name: 'Poop', count: 3, color: '#C5D7BD', legendFontColor: '#7A867B', legendFontSize: 14 },
      ],
      '14days': [
        { name: 'Pee', count: 10, color: '#8FB89C', legendFontColor: '#7A867B', legendFontSize: 14 },
        { name: 'Poop', count: 6, color: '#C5D7BD', legendFontColor: '#7A867B', legendFontSize: 14 },
      ],
      '30days': [
        { name: 'Pee', count: 22, color: '#8FB89C', legendFontColor: '#7A867B', legendFontSize: 14 },
        { name: 'Poop', count: 14, color: '#C5D7BD', legendFontColor: '#7A867B', legendFontSize: 14 },
      ],
      'custom': [
        { name: 'Pee', count: 5, color: '#8FB89C', legendFontColor: '#7A867B', legendFontSize: 14 },
        { name: 'Poop', count: 3, color: '#C5D7BD', legendFontColor: '#7A867B', legendFontSize: 14 },
      ],
    };

    return { sleep: sleepData[rangeType], feeding: feedingData[rangeType], diaper: diaperData[rangeType] };
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
    propsForLabels: { fontSize: 12, fontWeight: '500' },
    barPercentage: 0.8,
  };

  return (
    <View style={styles.containerWrapper}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Insights</Text>
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
            <View style={styles.chartContainer}>
              <LineChart
                data={{
                  labels: chartData.sleep.labels,
                  datasets: [{ data: chartData.sleep.data }],
                }}
                width={Dimensions.get('window').width - 80}
                height={220}
                yAxisSuffix="h"
                chartConfig={chartConfig}
                bezier
                style={styles.chart}
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
        </View>

        {/* Feeding Frequency */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <IconSymbol name="baby-bottle-outline" size={20} color="#687076" /> Feeding Frequency
          </Text>
          <View style={styles.card}>
            <View style={styles.chartContainer}>
              <BarChart
                data={{
                  labels: chartData.feeding.labels,
                  datasets: [{ data: chartData.feeding.data }],
                }}
                width={Dimensions.get('window').width - 80}
                height={220}
                yAxisSuffix=""
                fromZero
                chartConfig={{ ...chartConfig, decimalPlaces: 0 }}
                style={styles.chart}
              />
            </View>
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
                width={Dimensions.get('window').width - 80}
                height={200}
                chartConfig={chartConfig}
                accessor="count"
                backgroundColor="transparent"
                paddingLeft="30"
                absolute
                style={styles.chart}
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
        <View style={styles.actionRow}>
          <Pressable
            onPress={() => console.log('Export PDF')}
            style={({ pressed }) => [styles.actionBtn, pressed && styles.pressed]}
            accessibilityLabel="Export insights as PDF"
          >
            <Text style={styles.actionBtnText}>Export PDF</Text>
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
          {['7days', '14days', '30days', 'custom'].map((type) => (
            <Pressable
              key={type}
              onPress={() => (type === 'custom' ? toggleCustomRange() : handleRangeSelect(type))}
              style={({ pressed }) => [styles.dropdownItem, pressed && styles.pressed]}
              accessibilityLabel={`Select ${type === 'custom' ? 'custom range' : `last ${type.replace('days', '')} days`}`}
            >
              <Text style={styles.dropdownItemText}>
                {type === 'custom' ? 'Custom Range' : `Last ${type.replace('days', '')} days`}
              </Text>
            </Pressable>
          ))}
        </View>
      </Modal>

      {/* Custom Range Modal */}
      <Modal
        isVisible={isCustomRangeVisible}
        onBackdropPress={toggleCustomRange}
        style={styles.modal}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Select Custom Range</Text>
          <Text style={styles.modalPreview}>
            {tempStartDate ? `${formatDate(tempStartDate)} - ${tempEndDate ? formatDate(tempEndDate) : 'Select end date'}` : 'Select start date'}
          </Text>
          <Calendar
            onDayPress={handleCustomDateSelect}
            markedDates={{
              [tempStartDate]: { selected: true, selectedColor: '#8FB89C' },
              [tempEndDate]: { selected: true, selectedColor: '#8FB89C' },
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
          <View style={styles.modalButtons}>
            <Pressable
              onPress={toggleCustomRange}
              style={({ pressed }) => [styles.modalButton, pressed && styles.pressed]}
              accessibilityLabel="Cancel custom range"
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </Pressable>
            <Pressable
              onPress={confirmCustomRange}
              style={({ pressed }) => [
                styles.modalButton,
                styles.selectButton,
                tempStartDate && tempEndDate ? {} : styles.disabledButton,
                pressed && styles.pressed,
              ]}
              disabled={!tempStartDate || !tempEndDate}
              accessibilityLabel="Confirm custom range"
            >
              <Text style={styles.modalButtonText}>Select</Text>
            </Pressable>
          </View>
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
    justifyContent: 'center',
    marginVertical: 12,
    flexWrap: 'wrap',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 8,
    minWidth: 80,
  },
  statValue: { fontSize: 18, fontWeight: 'bold', color: '#2D3A2E' },
  statLabel: { fontSize: 14, color: '#7A867B', marginTop: 4 },
  statSubLabel: { fontSize: 12, color: '#7A867B', marginTop: 2 },
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
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    marginHorizontal: 24,
    alignItems: 'center',
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#2D3A2E', marginBottom: 12 },
  modalPreview: { fontSize: 16, color: '#7A867B', marginBottom: 16 },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 16,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#E9F2EC',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  selectButton: { backgroundColor: '#8FB89C' },
  disabledButton: { backgroundColor: '#C5D7BD', opacity: 0.5 },
  modalButtonText: { fontSize: 16, fontWeight: '600', color: '#2D3A2E' },
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