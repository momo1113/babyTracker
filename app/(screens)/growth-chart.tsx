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
      <TouchableOpacity
        onPress={() => router.back()}
        style={styles.backButton}
        accessibilityLabel="Go back to previous screen"
      >
        <IconSymbol name="chevron.backward" size={22} color="#687076" />
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
                color: () => '#8FB89C', // Baby
                strokeWidth: 3,
              },
              {
                data: [7.5, 10.5, 13, 15.2, 17],
                color: () => '#C5D7BD', // WHO
                strokeWidth: 1,
              },
            ],
            legend: ['Your Baby', 'WHO Standard'],
          }}
          width={Dimensions.get('window').width - 32}
          height={260}
          yAxisSuffix="lbs"
          chartConfig={{
            backgroundColor: '#E9F2EC',
            backgroundGradientFrom: '#E9F2EC',
            backgroundGradientTo: '#E9F2EC',
            backgroundGradientFromOpacity: 0.2,
            backgroundGradientToOpacity: 0,
            decimalPlaces: 1,
            color: () => '#7A867B',
            labelColor: () => '#7A867B',
            propsForDots: {
              r: '6',
              strokeWidth: '2',
              stroke: '#2D3A2E',
            },
            propsForBackgroundLines: {
              stroke: '#C5D7BD',
              strokeDasharray: '',
            },
            propsForLabels: {
              fontSize: 12,
              fontWeight: '500',
            },
          }}
          bezier
          style={styles.chart}
          accessibilityLabel="WHO Growth Chart comparing your baby's weight to WHO standards"
        />

        {/* CDC Chart */}
        <Text style={styles.chartLabel}>CDC Standard (Girls)</Text>
        <LineChart
          data={{
            labels: ['0m', '2m', '4m', '6m', '8m'],
            datasets: [
              {
                data: [7.5, 11, 14.2],
                color: () => '#8FB89C', // Baby
                strokeWidth: 3,
              },
              {
                data: [7.5, 10.2, 12.5, 14.7, 16.5],
                color: () => '#7A867B', // CDC
                strokeWidth: 1,
              },
            ],
            legend: ['Your Baby', 'CDC Standard'],
          }}
          width={Dimensions.get('window').width - 32}
          height={260}
          yAxisSuffix="lbs"
          chartConfig={{
            backgroundColor: '#E9F2EC',
            backgroundGradientFrom: '#E9F2EC',
            backgroundGradientTo: '#E9F2EC',
            backgroundGradientFromOpacity: 0.2,
            backgroundGradientToOpacity: 0,
            decimalPlaces: 1,
            color: () => '#7A867B',
            labelColor: () => '#7A867B',
            propsForDots: {
              r: '6',
              strokeWidth: '2',
              stroke: '#2D3A2E',
            },
            propsForBackgroundLines: {
              stroke: '#C5D7BD',
              strokeDasharray: '',
            },
            propsForLabels: {
              fontSize: 12,
              fontWeight: '500',
            },
          }}
          bezier
          style={styles.chart}
          accessibilityLabel="CDC Growth Chart comparing your baby's weight to CDC standards"
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F7F4',
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
    color: '#2D3A2E',
    marginLeft: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3A2E',
    textAlign: 'center',
    marginTop: 16,
  },
  subtitle: {
    fontSize: 14,
    color: '#7A867B',
    textAlign: 'center',
    marginBottom: 12,
  },
  summaryBox: {
    backgroundColor: '#E9F2EC',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#2D3A2E',
  },
  summaryText: {
    fontSize: 14,
    color: '#7A867B',
    marginBottom: 4,
  },
  chartLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2D3A2E',
    marginBottom: 4,
    marginTop: 8,
  },
  chart: {
    borderRadius: 16,
    marginBottom: 24,
    padding: 8,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
});