import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ScrollView } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { getAuth } from 'firebase/auth';
import dayjs from 'dayjs';

export default function GrowthChartScreen() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
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
        if (!response.ok) throw new Error(data.error || 'Failed to fetch');

        setProfile(data);
      } catch (err) {
        console.error('Error fetching baby profile:', err);
      }
    };

    fetchProfile();
  }, []);

  const getAgeLabel = (dob, date) => {
    const birthDate = dayjs(dob);
    const entryDate = dayjs(date);
    const months = entryDate.diff(birthDate, 'month');
    return `${months}m`;
  };

  const getChartLabels = () =>
    profile?.growthData?.sort((a, b) => new Date(a.date) - new Date(b.date)).map(entry => getAgeLabel(profile.dob, entry.date)) || [];

  const getWeightData = () =>
    profile?.growthData?.sort((a, b) => new Date(a.date) - new Date(b.date)).map(entry => entry.weight).filter(Boolean) || [];

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <IconSymbol name="chevron.backward" size={22} color="#7A867B" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>📈 Growth Chart Comparison</Text>
        <Text style={styles.subtitle}>Your Baby vs. WHO & CDC Standards</Text>

        {profile && (
          <View style={styles.summaryBox}>
            <Text style={styles.summaryTitle}>🍼 Growth Summary</Text>
            <Text style={styles.summaryText}>- Age: {profile?.age || 'N/A'}</Text>

            {profile?.growthData?.length > 0 ? (
              <>
                <Text style={styles.summaryText}>
                  - Weight: {profile.growthData.at(-1)?.weight || 'N/A'} lbs
                </Text>
                <Text style={styles.summaryText}>
                  - Height: {profile.growthData.at(-1)?.height || 'N/A'} in
                </Text>
              </>
            ) : (
              <Text style={styles.summaryText}>No growth data available</Text>
            )}

            <Text style={styles.summaryText}>
              - Weight Percentile (WHO): {profile?.weightPercentile ? `${profile.weightPercentile}%` : 'N/A'}
            </Text>
            <Text style={styles.summaryText}>
              - Height Percentile (WHO): {profile?.heightPercentile ? `${profile.heightPercentile}%` : 'N/A'}
            </Text>
          </View>
        )}

        <Text style={styles.chartLabel}>WHO Standard ({profile?.gender === 'male' ? 'Boys' : 'Girls'})</Text>
        <LineChart
          data={{
            labels: getChartLabels(),
            datasets: [
              {
                data: getWeightData(),
                color: () => '#D4C5B3',
                strokeWidth: 3,
              },
              {
                data: profile?.gender === 'male'
                  ? [7.5, 11.5, 14.8, 17.5, 19.2]
                  : [7.3, 11.0, 13.4, 15.4, 17.2],
                color: () => '#E8E8E8',
                strokeWidth: 1,
              },
            ],
            legend: ['Your Baby', 'WHO Standard'],
          }}
          width={Dimensions.get('window').width - 32}
          height={260}
          yAxisSuffix="lbs"
          chartConfig={{
            backgroundColor: '#E1D3C1',
            backgroundGradientFrom: '#F5EDE1',
            backgroundGradientTo: '#F5EDE1',
            backgroundGradientFromOpacity: 0.3,
            backgroundGradientToOpacity: 0,
            decimalPlaces: 1,
            color: () => '#7A867B',
            labelColor: () => '#7A867B',
            propsForDots: {
              r: '6',
              strokeWidth: '2',
              stroke: '#D4C5B3',
            },
            propsForBackgroundLines: {
              stroke: '#E8E8E8',
              strokeDasharray: '',
            },
            propsForLabels: {
              fontSize: 12,
              fontWeight: '500',
            },
          }}
          bezier
          style={styles.chart}
        />

        <Text style={styles.chartLabel}>CDC Standard ({profile?.gender === 'male' ? 'Boys' : 'Girls'})</Text>
        <LineChart
          data={{
            labels: getChartLabels(),
            datasets: [
              {
                data: getWeightData(),
                color: () => '#D4C5B3',
                strokeWidth: 3,
              },
              {
                data: profile?.gender === 'male'
                  ? [7.5, 11.2, 13.5, 15.5, 17.1]
                  : [7.5, 11.0, 13.2, 15.0, 16.8],
                color: () => '#7A867B',
                strokeWidth: 1,
              },
            ],
            legend: ['Your Baby', 'CDC Standard'],
          }}
          width={Dimensions.get('window').width - 32}
          height={260}
          yAxisSuffix="lbs"
          chartConfig={{
            backgroundColor: '#E1D3C1',
            backgroundGradientFrom: '#F5EDE1',
            backgroundGradientTo: '#F5EDE1',
            backgroundGradientFromOpacity: 0.3,
            backgroundGradientToOpacity: 0,
            decimalPlaces: 1,
            color: () => '#7A867B',
            labelColor: () => '#7A867B',
            propsForDots: {
              r: '6',
              strokeWidth: '2',
              stroke: '#D4C5B3',
            },
            propsForBackgroundLines: {
              stroke: '#E8E8E8',
              strokeDasharray: '',
            },
            propsForLabels: {
              fontSize: 12,
              fontWeight: '500',
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
    backgroundColor: '#F9F9F7',
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
    color: '#7A867B',
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
    backgroundColor: '#F5EDE1',
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
    backgroundColor: '#F5EDE1',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
});
