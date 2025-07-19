import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ScrollView } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function GrowthChartScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <IconSymbol name="chevron.left" size={22} color="#11181C" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Title */}
        <Text style={styles.title}>📈 Growth Chart Comparison</Text>
        <Text style={styles.subtitle}>Your Baby vs. WHO & CDC Standards</Text>

        {/* Baby Summary */}
        <View style={styles.summaryBox}>
          <Text style={styles.summaryTitle}>🍼 Growth Summary</Text>
          <Text style={styles.summaryText}>- Age: 4 months, 5 days</Text>
          <Text style={styles.summaryText}>- Weight: 14.2 lbs</Text>
          <Text style={styles.summaryText}>- Height: 24.5 in</Text>
          <Text style={styles.summaryText}>- Weight Percentile (WHO): ~60%</Text>
          <Text style={styles.summaryText}>- Weight Percentile (CDC): ~55%</Text>
        </View>

        {/* WHO Chart */}
        <Text style={styles.chartLabel}>WHO Standard (Girls)</Text>
        <LineChart
          data={{
            labels: ['0m', '2m', '4m', '6m', '8m'],
            datasets: [
              {
                data: [7.5, 11, 14.2],
                color: () => '#8B5CF6', // Baby
                strokeWidth: 2,
              },
              {
                data: [7.5, 10.5, 13, 15.2, 17],
                color: () => '#94A3B8', // WHO
                strokeWidth: 1,
              },
            ],
            legend: ['Your Baby', 'WHO Standard'],
          }}
          width={Dimensions.get('window').width - 32}
          height={260}
          yAxisSuffix="lbs"
          chartConfig={{
            backgroundColor: '#fff',
            backgroundGradientFrom: '#fff',
            backgroundGradientTo: '#fff',
            decimalPlaces: 1,
            color: () => '#11181C',
            labelColor: () => '#64748B',
            propsForDots: {
              r: '4',
              strokeWidth: '1',
              stroke: '#8B5CF6',
            },
          }}
          bezier
          style={styles.chart}
        />

        {/* CDC Chart */}
        <Text style={styles.chartLabel}>CDC Standard (Girls)</Text>
        <LineChart
          data={{
            labels: ['0m', '2m', '4m', '6m', '8m'],
            datasets: [
              {
                data: [7.5, 11, 14.2],
                color: () => '#8B5CF6', // Baby
                strokeWidth: 2,
              },
              {
                data: [7.5, 10.2, 12.5, 14.7, 16.5], // CDC values
                color: () => '#F59E0B', // CDC
                strokeWidth: 1,
              },
            ],
            legend: ['Your Baby', 'CDC Standard'],
          }}
          width={Dimensions.get('window').width - 32}
          height={260}
          yAxisSuffix="lbs"
          chartConfig={{
            backgroundColor: '#fff',
            backgroundGradientFrom: '#fff',
            backgroundGradientTo: '#fff',
            decimalPlaces: 1,
            color: () => '#11181C',
            labelColor: () => '#64748B',
            propsForDots: {
              r: '4',
              strokeWidth: '1',
              stroke: '#8B5CF6',
            },
          }}
          bezier
          style={styles.chart}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 76,
    paddingHorizontal: 16,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10,
  },
  backText: {
    fontSize: 15,
    color: '#11181C',
    marginLeft: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#11181C',
    textAlign: 'center',
    marginTop: 16,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 12,
  },
  summaryBox: {
    backgroundColor: '#F7F8F9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#11181C',
  },
  summaryText: {
    fontSize: 14,
    color: '#687076',
    marginBottom: 4,
  },
  chartLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#11181C',
    marginBottom: 4,
    marginTop: 8,
  },
  chart: {
    borderRadius: 12,
    marginBottom: 24,
  },
});
