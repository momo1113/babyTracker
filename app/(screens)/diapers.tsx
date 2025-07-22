import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, ScrollView, Platform, Alert, ToastAndroid } from 'react-native';
import { useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { getAuth } from 'firebase/auth';

export default function DiaperLogScreen() {
  const router = useRouter();

  const [type, setType] = useState('Pee');
  const [time, setTime] = useState(formatTime(new Date()));
  const [date, setDate] = useState(formatDate(new Date()));
  const [consistency, setConsistency] = useState('');
  const [color, setColor] = useState('');
  const [notes, setNotes] = useState('');

  const [pickerMode, setPickerMode] = useState<'time' | 'date' | null>(null);

const handleSave = async () => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    Alert.alert('Authentication Error', 'Please log in first.');
    router.push('/auth/login');
    return;
  }

  const token = await user.getIdToken();

  // Use local time here by creating Date and calling toISOString()
  const localTimestamp = new Date(); // local time JS Date object

  const payload = {
    userId: user.uid,
    type, // from your form state
    consistency: type !== 'Pee' ? consistency : null,
    color: type !== 'Pee' ? color : null,
    notes: notes || '',
    timestamp: localTimestamp.toISOString(), // ISO string with local time offset
  };

  try {
    const response = await fetch('http://192.168.1.9:3000/diaper', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      Alert.alert('Error', errorData.error || 'Save failed');
      return;
    }

    if (Platform.OS === 'android') {
      ToastAndroid.show('Diaper log saved successfully!', ToastAndroid.SHORT);
    } else {
      Alert.alert('Success', 'Diaper log saved successfully!');
    }

    router.back(); // or your navigation back
  } catch (error) {
    Alert.alert('Network Error', 'Please try again.');
  }
};


  const onSelectType = (t) => {
    setType(t);
    if (t === 'Pee') {
      setConsistency('');
      setColor('');
    }
  };

  const handlePickerChange = (event, selectedDate) => {
    if (!selectedDate) {
      setPickerMode(null);
      return;
    }

    if (pickerMode === 'time') {
      setTime(formatTime(selectedDate));
    } else {
      setDate(formatDate(selectedDate));
    }
    setPickerMode(null);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <IconSymbol name="chevron.backward" size={22} color="#687076" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Diaper Log</Text>
        <View style={{ width: 22 }} />
      </View>

      {/* Type Picker */}
      <Text style={styles.label}>Diaper Type</Text>
      <View style={styles.row}>
        {['Pee', 'Poop', 'Both'].map(t => (
          <TouchableOpacity
            key={t}
            style={[styles.selectBtn, type === t && styles.selectBtnActive]}
            onPress={() => onSelectType(t)}
          >
            <IconSymbol
              name={t === 'Pee' ? 'water.waves' : t === 'Poop' ? 'leaf.fill' : 'circle'}
              size={18}
              color={type === t ? '#fff' : '#687076'}
            />
            <Text style={[styles.selectBtnText, type === t && styles.selectBtnTextActive]}>
              {t}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Time + Date Picker */}
      <Text style={styles.label}>Time</Text>
      <View style={styles.timeRow}>
        <TouchableOpacity onPress={() => setPickerMode('time')} style={styles.timeInput}>
          <Text style={{ color: '#11181C' }}>{time}</Text>
        </TouchableOpacity>
        <IconSymbol name="clock" size={18} color="#687076" />
        <TouchableOpacity onPress={() => setPickerMode('date')} style={styles.dateInput}>
          <Text style={{ color: '#11181C' }}>{date}</Text>
        </TouchableOpacity>
        <IconSymbol name="calendar" size={18} color="#687076" />
      </View>

      {/* Picker below inputs */}
      <View style={{ minHeight: pickerMode ? 200 : 0 }}>
        {pickerMode && (
          <DateTimePicker
            value={new Date()}
            mode={pickerMode}
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handlePickerChange}
            style={{ flex: 1 }}
          />
        )}
      </View>

      {/* Consistency (Poop only) */}
      <Text style={styles.label}>Consistency (Poop)</Text>
      <View style={styles.gridRow}>
        {['Soft', 'Firm', 'Loose', 'Watery'].map(c => (
          <TouchableOpacity
            key={c}
            style={[
              styles.gridBtn,
              consistency === c && styles.gridBtnActive,
              type === 'Pee' && { opacity: 0.5 },
            ]}
            onPress={() => type !== 'Pee' && setConsistency(c)}
            disabled={type === 'Pee'}
          >
            <Text
              style={[
                styles.gridBtnText,
                consistency === c && styles.gridBtnTextActive,
                type === 'Pee' && { color: '#ccc' },
              ]}
            >
              {c}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Color (Poop only) */}
      <Text style={styles.label}>Color (Poop)</Text>
      <View style={styles.gridRow}>
        {['Yellow', 'Brown', 'Green'].map(col => (
          <TouchableOpacity
            key={col}
            style={[
              styles.gridBtn,
              color === col && styles.gridBtnActive,
              type === 'Pee' && { opacity: 0.5 },
            ]}
            onPress={() => type !== 'Pee' && setColor(col)}
            disabled={type === 'Pee'}
          >
            <Text
              style={[
                styles.gridBtnText,
                color === col && styles.gridBtnTextActive,
                type === 'Pee' && { color: '#ccc' },
              ]}
            >
              {col}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Notes */}
      <Text style={styles.label}>Notes (Optional)</Text>
      <TextInput
        style={styles.notesInput}
        value={notes}
        onChangeText={setNotes}
        placeholder="Add any notes about this diaper change..."
        multiline
      />

      {/* Save Button */}
      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveBtnText}>Save</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function formatTime(date) {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  return `${((hours + 11) % 12 + 1)}:${String(minutes).padStart(2, '0')} ${ampm}`;
}

function formatDate(date) {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const year = date.getFullYear();
  return `${String(month).padStart(2, '0')}/${String(day).padStart(2, '0')}/${year}`;
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 44,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#11181C',
    textAlign: 'center',
  },
  label: { fontSize: 15, fontWeight: '500', marginTop: 18, marginBottom: 8, color: '#11181C' },
  row: { flexDirection: 'row', gap: 12 },
  selectBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F7F8F9',
    borderRadius: 10,
    paddingVertical: 14,
    gap: 6,
  },
  selectBtnActive: { backgroundColor: '#11181C' },
  selectBtnText: { fontSize: 15, color: '#687076' },
  selectBtnTextActive: { color: '#fff', fontWeight: 'bold' },
  timeRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  timeInput: {
    width: 100,
    backgroundColor: '#F7F8F9',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    color: '#11181C',
  },
  dateInput: {
    width: 110,
    backgroundColor: '#F7F8F9',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    color: '#11181C',
  },
  gridRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  gridBtn: {
    flex: 1,
    minWidth: 90,
    alignItems: 'center',
    backgroundColor: '#F7F8F9',
    borderRadius: 8,
    paddingVertical: 12,
  },
  gridBtnActive: { backgroundColor: '#11181C' },
  gridBtnText: { fontSize: 15, color: '#687076' },
  gridBtnTextActive: { color: '#fff', fontWeight: 'bold' },
  notesInput: {
    backgroundColor: '#F7F8F9',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    color: '#11181C',
    minHeight: 60,
    marginBottom: 8,
  },
  saveBtn: {
    backgroundColor: '#11181C',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
