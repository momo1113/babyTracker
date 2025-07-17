import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function DiaperLogScreen() {
  const router = useRouter();
  const [type, setType] = useState('Pee');
  const [time, setTime] = useState('12:30 PM');
  const [date, setDate] = useState('01/15/2025');
  const [consistency, setConsistency] = useState('');
  const [color, setColor] = useState('');
  const [notes, setNotes] = useState('');

  const handleSave = async () => {
    const payload = {
      type,
      time,
      date,
      consistency: type !== 'Pee' ? consistency : null,
      color: type !== 'Pee' ? color : null,
      notes,
      timestamp: new Date().toISOString(),
    };

    console.log('Mock saving:', payload); // Replace with real API call
    router.back();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <IconSymbol name="arrow.left" size={22} color="#687076" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Diaper Log</Text>
        <View style={{ width: 22 }} /> {/* For spacing to balance back button */}
      </View>

      {/* Diaper Type */}
      <Text style={styles.label}>Diaper Type</Text>
      <View style={styles.row}>
        {['Pee', 'Poop', 'Both'].map(t => (
          <TouchableOpacity
            key={t}
            style={[styles.selectBtn, type === t && styles.selectBtnActive]}
            onPress={() => setType(t)}
          >
            <IconSymbol
              name={
                t === 'Pee'
                  ? 'drop.fill'
                  : t === 'Poop'
                  ? 'leaf.fill'
                  : 'circle.fill'
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

      {/* Time */}
      <Text style={styles.label}>Time</Text>
      <View style={styles.timeRow}>
        <TextInput style={styles.timeInput} value={time} onChangeText={setTime} />
        <IconSymbol name="clock" size={18} color="#687076" />
        <TextInput style={styles.dateInput} value={date} onChangeText={setDate} />
        <IconSymbol name="calendar" size={18} color="#687076" />
      </View>

      {/* Consistency */}
      <Text style={styles.label}>Consistency (Poop)</Text>
      <View style={styles.gridRow}>
        {['Soft', 'Firm', 'Loose', 'Watery'].map(c => (
          <TouchableOpacity
            key={c}
            style={[styles.gridBtn, consistency === c && styles.gridBtnActive]}
            onPress={() => setConsistency(c)}
          >
            <Text style={[styles.gridBtnText, consistency === c && styles.gridBtnTextActive]}>
              {c}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Color */}
      <Text style={styles.label}>Color (Poop)</Text>
      <View style={styles.gridRow}>
        {['Yellow', 'Brown', 'Green'].map(col => (
          <TouchableOpacity
            key={col}
            style={[styles.gridBtn, color === col && styles.gridBtnActive]}
            onPress={() => setColor(col)}
          >
            <Text style={[styles.gridBtnText, color === col && styles.gridBtnTextActive]}>
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
