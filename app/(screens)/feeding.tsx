import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, ScrollView } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useRouter } from 'expo-router';

export default function FeedingLogScreen() {
  const [feedingType, setFeedingType] = useState('Breast');
  const [side, setSide] = useState('Left');
  const [amount, setAmount] = useState('');
  const [unit, setUnit] = useState('oz');
  const [time, setTime] = useState('12:30 PM');
  const [date, setDate] = useState('01/15/2025');
  const [duration, setDuration] = useState('15');
  const [notes, setNotes] = useState('');
  const router = useRouter();

const handleSave = async () => {
  const payload = {
    feedingType,
    side: feedingType === 'Breast' ? side : null,
    amount: feedingType !== 'Breast' ? amount : null,
    unit: feedingType !== 'Breast' ? unit : null,
    duration,
    notes,
    timestamp: new Date().toISOString(),
  };

  try {
    // Use your backend server address here
    const response = await fetch('http://localhost:3000/feeding/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error('Failed to save feeding log');
    }

    const data = await response.json();
    console.log('Feeding log saved:', data);

    // Navigate back or show success message
    router.back();
  } catch (error) {
    console.error('Error saving feeding log:', error);
    // Show alert or user feedback if needed
  }
};


  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <IconSymbol name="arrow.left" size={22} color="#687076" />
        </TouchableOpacity>
        <View style={styles.headerTitleRow}>
          <IconSymbol name="drop.fill" size={22} color="#687076" />
          <Text style={styles.headerTitle}>Feeding Log</Text>
        </View>
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
      {/* Time */}
      <Text style={styles.label}>Time</Text>
      <View style={styles.timeRow}>
        <TextInput style={styles.timeInput} value={time} onChangeText={setTime} />
        <IconSymbol name="clock" size={18} color="#687076" />
        <TextInput style={styles.dateInput} value={date} onChangeText={setDate} />
        <IconSymbol name="calendar" size={18} color="#687076" />
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
    justifyContent: 'flex-start',
  },
  header: {
    paddingTop: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerTitleRow: { flexDirection: 'row', alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', marginLeft: 8, color: '#11181C' },

  label: { fontSize: 15, fontWeight: '500', marginTop: 18, marginBottom: 8, color: '#11181C' },

  row: { flexDirection: 'row', gap: 8, marginBottom: 8, alignItems: 'center' },

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
    color: '#11181C',
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
    color: '#11181C',
  },
  durationText: { fontSize: 15, color: '#687076' },

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
