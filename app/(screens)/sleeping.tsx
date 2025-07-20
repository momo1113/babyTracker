import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function SleepLogScreen() {
  const router = useRouter();
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const [type, setType] = useState('Nap');
  const [location, setLocation] = useState('');
  const [quality, setQuality] = useState('');

  const formatTime = (date) => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const handleSave = async () => {
    if (!startTime || !endTime || !type || !location || !quality) {
      Alert.alert('Validation Error', 'Please fill all required fields.');
      return;
    }

    const payload = {
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      type,
      location,
      quality,
      timestamp: new Date().toISOString(),
    };

    const BASE_URL = 'http://192.168.1.9:3000';

    try {
      const response = await fetch(`${BASE_URL}/sleep`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to save sleep log');
      }

      const data = await response.json();
      console.log('✅ Sleep log saved:', data);
      router.back();
    } catch (error) {
      console.error('❌ Error:', error);
      Alert.alert('Error', error.message || 'Something went wrong');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <IconSymbol name="arrow.left" size={22} color="#687076" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sleeping Log</Text>
        <View style={{ width: 22 }} />
      </View>

      <Text style={styles.label}>Start Time</Text>
      <View style={styles.inputRow}>
        <TouchableOpacity style={styles.timeInput} onPress={() => setShowStartPicker(true)}>
          <Text style={styles.inputText}>{formatTime(startTime)}</Text>
        </TouchableOpacity>
        <IconSymbol name="clock" size={20} color="#687076" />
      </View>

      {showStartPicker && (
        <DateTimePicker
          value={startTime}
          mode="time"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(e, selectedDate) => {
            setShowStartPicker(false);
            if (selectedDate) setStartTime(selectedDate);
          }}
        />
      )}

      <Text style={styles.label}>End Time</Text>
      <View style={styles.inputRow}>
        <TouchableOpacity style={styles.timeInput} onPress={() => setShowEndPicker(true)}>
          <Text style={styles.inputText}>{formatTime(endTime)}</Text>
        </TouchableOpacity>
        <IconSymbol name="clock" size={20} color="#687076" />
      </View>

      {showEndPicker && (
        <DateTimePicker
          value={endTime}
          mode="time"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(e, selectedDate) => {
            setShowEndPicker(false);
            if (selectedDate) setEndTime(selectedDate);
          }}
        />
      )}

      <Text style={styles.label}>Type of Sleep</Text>
      <View style={styles.row}>
        {['Nap', 'Night Sleep'].map((item) => (
          <TouchableOpacity
            key={item}
            style={[styles.selectBtn, type === item && styles.selectBtnActive]}
            onPress={() => setType(item)}
          >
            <Text style={[styles.selectBtnText, type === item && styles.selectBtnTextActive]}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Sleep Location</Text>
      <View style={styles.gridRow}>
        {['Crib', 'Stroller', 'Arms', 'Car Seat'].map((loc) => (
          <TouchableOpacity
            key={loc}
            style={[styles.gridBtn, location === loc && styles.gridBtnActive]}
            onPress={() => setLocation(loc)}
          >
            <Text style={[styles.gridBtnText, location === loc && styles.gridBtnTextActive]}>{loc}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Sleep Quality</Text>
      <View style={styles.row}>
        {['Good', 'Interrupted', 'Fussy'].map((q) => (
          <TouchableOpacity
            key={q}
            style={[styles.selectBtn, quality === q && styles.selectBtnActive]}
            onPress={() => setQuality(q)}
          >
            <Text style={[styles.selectBtnText, quality === q && styles.selectBtnTextActive]}>{q}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveBtnText}>Save</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff', flexGrow: 1 },
  header: { flexDirection: 'row', paddingTop: 44, alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#11181C' },
  label: { fontSize: 15, fontWeight: '500', marginTop: 18, marginBottom: 8, color: '#11181C' },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  timeInput: { flex: 1, backgroundColor: '#F7F8F9', borderRadius: 8, padding: 12 },
  inputText: { fontSize: 15, color: '#11181C' },
  row: { flexDirection: 'row', gap: 12, marginBottom: 8 },
  selectBtn: { flex: 1, alignItems: 'center', backgroundColor: '#F7F8F9', borderRadius: 10, paddingVertical: 14 },
  selectBtnActive: { backgroundColor: '#11181C' },
  selectBtnText: { fontSize: 15, color: '#687076' },
  selectBtnTextActive: { color: '#fff', fontWeight: 'bold' },
  gridRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  gridBtn: { minWidth: 90, alignItems: 'center', backgroundColor: '#F7F8F9', borderRadius: 8, paddingVertical: 12, flex: 1 },
  gridBtnActive: { backgroundColor: '#11181C' },
  gridBtnText: { fontSize: 15, color: '#687076' },
  gridBtnTextActive: { color: '#fff', fontWeight: 'bold' },
  saveBtn: { backgroundColor: '#11181C', borderRadius: 10, paddingVertical: 14, alignItems: 'center', marginTop: 24 },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
