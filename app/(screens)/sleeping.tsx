import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Platform, Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function SleepLogScreen() {
  const router = useRouter();
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [type, setType] = useState('Nap');
  const [location, setLocation] = useState('');
  const [quality, setQuality] = useState('');
  const [notes, setNotes] = useState('');

  const [pickerVisible, setPickerVisible] = useState(false);
  const [pickerMode, setPickerMode] = useState<'time' | 'date'>('time');
  const [pickerTarget, setPickerTarget] = useState<'start' | 'end'>('start');

  const showPicker = (target: 'start' | 'end', mode: 'time' | 'date') => {
    setPickerTarget(target);
    setPickerMode(mode);
    setPickerVisible(true);
  };

  const handlePickerChange = (_event: any, selectedDate: Date | undefined) => {
    if (!selectedDate) return setPickerVisible(false);

    if (pickerTarget === 'start') {
      setStartTime(prev => {
        const newDate = new Date(prev);
        if (pickerMode === 'time') {
          newDate.setHours(selectedDate.getHours());
          newDate.setMinutes(selectedDate.getMinutes());
        } else {
          newDate.setFullYear(selectedDate.getFullYear());
          newDate.setMonth(selectedDate.getMonth());
          newDate.setDate(selectedDate.getDate());
        }
        return newDate;
      });
    } else {
      setEndTime(prev => {
        const newDate = new Date(prev);
        if (pickerMode === 'time') {
          newDate.setHours(selectedDate.getHours());
          newDate.setMinutes(selectedDate.getMinutes());
        } else {
          newDate.setFullYear(selectedDate.getFullYear());
          newDate.setMonth(selectedDate.getMonth());
          newDate.setDate(selectedDate.getDate());
        }
        return newDate;
      });
    }
    setPickerVisible(false);
  };

  const formatTime = (date: Date) =>
    date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const formatDate = (date: Date) =>
    date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    });

  const handleSave = async () => {
    if (!type || !location || !quality || !startTime || !endTime) {
      Alert.alert('Validation Error', 'All fields are required.');
      return;
    }

    if (startTime >= endTime) {
      Alert.alert('Validation Error', 'End time must be after start time.');
      return;
    }

    const payload = {
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      type,
      location,
      quality,
      timestamp: new Date().toISOString(),
      notes,
    };

    try {
      const response = await fetch('http://192.168.1.9:3000/sleeping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save sleep log');
      }

      Alert.alert('Success', 'Sleep log saved successfully.');
      router.back();
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <IconSymbol name="arrow.left" size={22} color="#687076" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sleeping Log</Text>
        <View style={{ width: 22 }} />
      </View>

      {/* Start Time */}
      <Text style={styles.label}>Start Time</Text>
      <View style={styles.timeRow}>
        <TouchableOpacity style={styles.timeInput} onPress={() => showPicker('start', 'time')}>
          <Text style={styles.inputText}>{formatTime(startTime)}</Text>
        </TouchableOpacity>
        <IconSymbol name="clock" size={18} color="#687076" />
        <TouchableOpacity style={styles.dateInput} onPress={() => showPicker('start', 'date')}>
          <Text style={styles.inputText}>{formatDate(startTime)}</Text>
        </TouchableOpacity>
        <IconSymbol name="calendar" size={18} color="#687076" />
      </View>

      {/* End Time */}
      <Text style={styles.label}>End Time</Text>
      <View style={styles.timeRow}>
        <TouchableOpacity style={styles.timeInput} onPress={() => showPicker('end', 'time')}>
          <Text style={styles.inputText}>{formatTime(endTime)}</Text>
        </TouchableOpacity>
        <IconSymbol name="clock" size={18} color="#687076" />
        <TouchableOpacity style={styles.dateInput} onPress={() => showPicker('end', 'date')}>
          <Text style={styles.inputText}>{formatDate(endTime)}</Text>
        </TouchableOpacity>
        <IconSymbol name="calendar" size={18} color="#687076" />
      </View>

      {/* Shared Picker (hidden offscreen if not visible) */}
      <View style={{ height: pickerVisible ? 220 : 0, overflow: 'hidden' }}>
        {pickerVisible && (
          <DateTimePicker
            value={pickerTarget === 'start' ? startTime : endTime}
            mode={pickerMode}
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handlePickerChange}
          />
        )}
      </View>

      {/* Type */}
      <Text style={styles.label}>Type of Sleep</Text>
      <View style={styles.row}>
        {['Nap', 'Night Sleep'].map(t => (
          <TouchableOpacity
            key={t}
            style={[styles.selectBtn, type === t && styles.selectBtnActive]}
            onPress={() => setType(t)}
          >
            <Text style={[styles.selectBtnText, type === t && styles.selectBtnTextActive]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Location */}
      <Text style={styles.label}>Sleep Location</Text>
      <View style={styles.gridRow}>
        {['Crib', 'Stroller', 'Arms', 'Car Seat'].map(loc => (
          <TouchableOpacity
            key={loc}
            style={[styles.gridBtn, location === loc && styles.gridBtnActive]}
            onPress={() => setLocation(loc)}
          >
            <Text style={[styles.gridBtnText, location === loc && styles.gridBtnTextActive]}>{loc}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Quality */}
      <Text style={styles.label}>Sleep Quality</Text>
      <View style={styles.row}>
        {['Good', 'Interrupted', 'Fussy'].map(q => (
          <TouchableOpacity
            key={q}
            style={[styles.selectBtn, quality === q && styles.selectBtnActive]}
            onPress={() => setQuality(q)}
          >
            <Text style={[styles.selectBtnText, quality === q && styles.selectBtnTextActive]}>{q}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Notes */}
      <Text style={styles.label}>Notes (Optional)</Text>
      <TextInput
        style={styles.notesInput}
        value={notes}
        onChangeText={setNotes}
        placeholder="Add any notes about this sleep..."
        multiline
      />

      {/* Save */}
      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveBtnText}>Save</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff', flexGrow: 1 },
  header: {
    flexDirection: 'row',
    paddingTop: 44,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#11181C' },
  label: { fontSize: 15, fontWeight: '500', marginTop: 18, marginBottom: 8, color: '#11181C' },

  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  timeInput: {
    width: 100,
    backgroundColor: '#F7F8F9',
    borderRadius: 8,
    padding: 12,
  },
  dateInput: {
    width: 110,
    backgroundColor: '#F7F8F9',
    borderRadius: 8,
    padding: 12,
  },
  inputText: { fontSize: 15, color: '#11181C' },
  row: { flexDirection: 'row', gap: 12 },
  selectBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#F7F8F9',
    alignItems: 'center',
  },
  selectBtnActive: { backgroundColor: '#11181C' },
  selectBtnText: { fontSize: 15, color: '#687076' },
  selectBtnTextActive: { color: '#fff', fontWeight: 'bold' },

  gridRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
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
    marginTop: 24,
  },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
