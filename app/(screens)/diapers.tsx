import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, ScrollView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function DiaperLogScreen() {
  const router = useRouter();

  const [type, setType] = useState('Pee');
  const [time, setTime] = useState('12:30 PM');
  const [date, setDate] = useState('01/15/2025');
  const [consistency, setConsistency] = useState('');
  const [color, setColor] = useState('');
  const [notes, setNotes] = useState('');
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSave = async () => {
    const payload = {
      type,
      time,
      date,
      notes,
      timestamp: new Date().toISOString(),
    };

    // Only include consistency and color if type is Poop or Both
    if (type !== 'Pee') {
      payload.consistency = consistency;
      payload.color = color;
    }
    const BASE_URL = 'http://192.168.1.9:3000'; // replace with your actual computer IP

    try {
      const response = await fetch(`${BASE_URL}/diaper`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Save failed:', errorData);
        alert(`Error: ${errorData.error || 'Save failed'}`);
        return;
      }

      const data = await response.json();
      console.log('Save successful:', data);
      router.back();
    } catch (error) {
      console.error('Network error:', error);
      alert('Network error, please try again.');
    }
  };

  const onSelectType = (t) => {
    setType(t);
    if (t === 'Pee') {
      setConsistency('');
      setColor('');
    }
  };

  const formatTime = (selectedDate) => {
    const hours = selectedDate.getHours();
    const minutes = selectedDate.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedTime = `${((hours + 11) % 12 + 1)}:${String(minutes).padStart(2, '0')} ${ampm}`;
    return formattedTime;
  };

  const formatDate = (selectedDate) => {
    const month = selectedDate.getMonth() + 1;
    const day = selectedDate.getDate();
    const year = selectedDate.getFullYear();
    return `${String(month).padStart(2, '0')}/${String(day).padStart(2, '0')}/${year}`;
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <IconSymbol name="chevron.backward" size={22} color="#687076" />
        </TouchableOpacity>
          <View style={styles.headerTitleRow}>
            <IconSymbol name="bandage.fill" size={22} color="#687076" />
            <Text style={styles.headerTitle}>Diaper Log</Text>
          </View>
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
              name={
                t === 'Pee' ? 'drop.fill' : t === 'Poop' ? 'leaf.fill' : 'circle'
              }
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
        <TouchableOpacity
          onPress={() => {
            setShowTimePicker(true);
            setShowDatePicker(false);
          }}
          style={styles.timeInput}
        >
          <Text style={{ color: '#11181C' }}>{time || 'Select time'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setShowTimePicker(true);
            setShowDatePicker(false);
          }}
        >
          <IconSymbol name="clock" size={18} color="#687076" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            setShowDatePicker(true);
            setShowTimePicker(false);
          }}
          style={styles.dateInput}
        >
          <Text style={{ color: '#11181C' }}>{date || 'Select date'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setShowDatePicker(true);
            setShowTimePicker(false);
          }}
        >
          <IconSymbol name="calendar" size={18} color="#687076" />
        </TouchableOpacity>
      </View>

      {showTimePicker && (
        <DateTimePicker
          value={new Date()}
          mode="time"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, selectedDate) => {
            setShowTimePicker(false);
            if (selectedDate) setTime(formatTime(selectedDate));
          }}
          style={{ marginTop: 8 }}
        />
      )}

      {showDatePicker && (
        <DateTimePicker
          value={new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) setDate(formatDate(selectedDate));
          }}
          style={{ marginTop: 8 }}
        />
      )}

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

const styles = StyleSheet.create({
   container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
    justifyContent: 'flex-start',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 44,
    marginBottom: 16,
  },
  headerTitleRow: { flexDirection: 'row', alignItems: 'center' },
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
