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
  ToastAndroid,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function FeedingLogScreen() {
  const router = useRouter();
  const [feedingType, setFeedingType] = useState('Breast');
  const [side, setSide] = useState('Left');
  const [amount, setAmount] = useState('');
  const [unit, setUnit] = useState('oz');
  const [duration, setDuration] = useState('15');
  const [notes, setNotes] = useState('');
  const [dateTime, setDateTime] = useState(new Date());

  const [pickerVisible, setPickerVisible] = useState(false);
  const [pickerMode, setPickerMode] = useState<'date' | 'time'>('time');

  const formatTime = (date: Date) =>
    date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const formatDate = (date: Date) =>
    date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    });

  const showPicker = (mode: 'time' | 'date') => {
    setPickerMode(mode);
    setPickerVisible(true);
  };

  const handlePickerChange = (_event: any, selectedDate: Date | undefined) => {
    if (selectedDate) {
      const newDate = new Date(dateTime);
      if (pickerMode === 'time') {
        newDate.setHours(selectedDate.getHours());
        newDate.setMinutes(selectedDate.getMinutes());
      } else {
        newDate.setFullYear(selectedDate.getFullYear());
        newDate.setMonth(selectedDate.getMonth());
        newDate.setDate(selectedDate.getDate());
      }
      setDateTime(newDate);
    }
    setPickerVisible(false);
  };

  const handleSave = async () => {
    if ((feedingType === 'Bottle' || feedingType === 'Formula') && !amount) {
      Alert.alert('Validation Error', 'Please enter an amount for Bottle or Formula feeding.');
      return;
    }

    if (!duration || isNaN(Number(duration)) || Number(duration) <= 0) {
      Alert.alert('Validation Error', 'Please enter a valid feeding duration in minutes.');
      return;
    }

    const payload = {
      feedingType,
      side: feedingType === 'Breast' ? side : null,
      amount: feedingType !== 'Breast' ? amount : null,
      unit: feedingType !== 'Breast' ? unit : null,
      duration,
      notes,
      timestamp: dateTime.toISOString(),
    };

    const BASE_URL = 'http://192.168.1.9:3000';

    try {
      const response = await fetch(`${BASE_URL}/feeding`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save feeding log');
      }

      await response.json();

      if (Platform.OS === 'android') {
        ToastAndroid.show('Feeding log saved successfully!', ToastAndroid.SHORT);
      } else {
        Alert.alert('Success', 'Feeding log saved successfully!');
      }

      router.push('/home');
    } catch (error: any) {
      console.error('❌ Error:', error);
      Alert.alert('Error', error.message || 'Something went wrong');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <IconSymbol name="arrow.left" size={22} color="#687076" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Feeding Log</Text>
        <View style={{ width: 22 }} />
      </View>

      {/* Feeding Type */}
      <Text style={styles.label}>Feeding Type</Text>
      <View style={styles.row}>
        {['Breast', 'Bottle', 'Formula'].map(type => (
          <TouchableOpacity
            key={type}
            style={[styles.selectBtn, feedingType === type && styles.selectBtnActive]}
            onPress={() => setFeedingType(type)}
          >
            <IconSymbol
              name={
                type === 'Breast' ? 'heart.fill' : type === 'Bottle' ? 'drop.fill' : 'testtube.2'
              }
              size={18}
              color={feedingType === type ? '#fff' : '#687076'}
            />
            <Text style={[styles.selectBtnText, feedingType === type && styles.selectBtnTextActive]}>
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Breast Side */}
      {feedingType === 'Breast' && (
        <>
          <Text style={styles.label}>Side (Breast)</Text>
          <View style={styles.row}>
            {['Left', 'Right', 'Both'].map(s => (
              <TouchableOpacity
                key={s}
                style={[styles.selectBtn, side === s && styles.selectBtnActive]}
                onPress={() => setSide(s)}
              >
                <Text style={[styles.selectBtnText, side === s && styles.selectBtnTextActive]}>
                  {s}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}

      {/* Amount */}
      {(feedingType === 'Bottle' || feedingType === 'Formula') && (
        <>
          <Text style={styles.label}>Amount</Text>
          <View style={styles.row}>
            <TextInput
              style={styles.amountInput}
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              placeholder="0"
            />
            <TouchableOpacity
              style={styles.unitBtn}
              onPress={() => setUnit(unit === 'oz' ? 'ml' : 'oz')}
            >
              <Text style={styles.unitText}>{unit}</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      {/* Time + Date Picker */}
      <Text style={styles.label}>Time</Text>
      <View style={styles.timeRow}>
        <TouchableOpacity style={styles.timeInput} onPress={() => showPicker('time')}>
          <Text style={styles.inputText}>{formatTime(dateTime)}</Text>
        </TouchableOpacity>
        <IconSymbol name="clock" size={18} color="#687076" />
        <TouchableOpacity style={styles.dateInput} onPress={() => showPicker('date')}>
          <Text style={styles.inputText}>{formatDate(dateTime)}</Text>
        </TouchableOpacity>
        <IconSymbol name="calendar" size={18} color="#687076" />
      </View>

      {/* Shared DateTime Picker (fixed height to avoid flicker) */}
      <View style={{ height: pickerVisible ? 220 : 0, overflow: 'hidden' }}>
        {pickerVisible && (
          <DateTimePicker
            value={dateTime}
            mode={pickerMode}
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handlePickerChange}
          />
        )}
      </View>

      {/* Duration */}
      <Text style={styles.label}>Duration</Text>
      <View style={styles.row}>
        <TextInput
          style={styles.durationInput}
          value={duration}
          onChangeText={setDuration}
          keyboardType="numeric"
          placeholder="e.g. 15"
        />
        <Text style={styles.durationText}>minutes</Text>
      </View>

      {/* Notes */}
      <Text style={styles.label}>Notes (Optional)</Text>
      <TextInput
        style={styles.notesInput}
        value={notes}
        onChangeText={setNotes}
        placeholder="Add any notes about this feeding..."
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
  },
  header: {
    paddingTop: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#11181C',
  },
  label: { fontSize: 15, fontWeight: '500', marginTop: 18, marginBottom: 8, color: '#11181C' },

  row: { flexDirection: 'row', gap: 8, marginBottom: 8, alignItems: 'center' },
  timeRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
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

  amountInput: {
    flex: 1,
    backgroundColor: '#F7F8F9',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
  },
  unitBtn: {
    backgroundColor: '#F7F8F9',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  unitText: { fontSize: 15, color: '#687076' },

  durationInput: {
    width: 60,
    backgroundColor: '#F7F8F9',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
  },
  durationText: { fontSize: 15, color: '#687076' },

  notesInput: {
    backgroundColor: '#F7F8F9',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
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
