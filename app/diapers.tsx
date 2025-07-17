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

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <IconSymbol name="arrow.left" size={22} color="#687076" />
        </TouchableOpacity>
        <View style={styles.headerTitleRow}>
          <IconSymbol name="circle.dotted" size={22} color="#687076" />
          <Text style={styles.headerTitle}>Diaper Log</Text>
        </View>
        <TouchableOpacity>
          <IconSymbol name="arrow.counterclockwise" size={22} color="#687076" />
        </TouchableOpacity>
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
                  : 'circle.dotted'
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
        <TextInput
          style={styles.timeInput}
          value={time}
          onChangeText={setTime}
        />
        <TouchableOpacity>
          <IconSymbol name="clock" size={18} color="#687076" />
        </TouchableOpacity>
        <TextInput
          style={styles.dateInput}
          value={date}
          onChangeText={setDate}
        />
        <TouchableOpacity>
          <IconSymbol name="calendar" size={18} color="#687076" />
        </TouchableOpacity>
      </View>

      {/* Consistency (Poop) */}
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

      {/* Color (Poop) */}
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

      {/* Recent Diaper Changes */}
      <View style={styles.recentSection}>
        <Text style={styles.recentTitle}>Recent Diaper Changes</Text>
        <View style={styles.recentItem}>
          <IconSymbol name="drop.fill" size={16} color="#687076" />
          <Text style={styles.recentText}>Pee</Text>
          <Text style={styles.recentTime}>1 hour ago</Text>
        </View>
        <View style={styles.recentItem}>
          <IconSymbol name="circle.dotted" size={16} color="#687076" />
          <Text style={styles.recentText}>Both - Soft, Yellow</Text>
          <Text style={styles.recentTime}>3 hours ago</Text>
        </View>
        <View style={styles.recentItem}>
          <IconSymbol name="leaf.fill" size={16} color="#687076" />
          <Text style={styles.recentText}>Poop - Firm, Brown</Text>
          <Text style={styles.recentTime}>6 hours ago</Text>
        </View>
      </View>

      {/* Save Button */}
      <TouchableOpacity style={styles.saveBtn}>
        <Text style={styles.saveBtnText}>Save</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff' },
  header: { flexDirection: 'row', paddingTop: 44, alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  headerTitleRow: { flexDirection: 'row', alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', marginLeft: 8, color: '#11181C' },
  label: { fontSize: 15, fontWeight: '500', marginTop: 18, marginBottom: 8, color: '#11181C' },
  row: { flexDirection: 'row', gap: 12, marginBottom: 8 },
  selectBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F7F8F9', borderRadius: 10, paddingVertical: 14, gap: 6 },
  selectBtnActive: { backgroundColor: '#11181C' },
  selectBtnText: { fontSize: 15, color: '#687076' },
  selectBtnTextActive: { color: '#fff', fontWeight: 'bold' },
  timeRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  timeInput: { width: 100, backgroundColor: '#F7F8F9', borderRadius: 8, padding: 12, fontSize: 15, color: '#11181C' },
  dateInput: { width: 110, backgroundColor: '#F7F8F9', borderRadius: 8, padding: 12, fontSize: 15, color: '#11181C' },
  gridRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  gridBtn: { flex: 1, minWidth: 90, alignItems: 'center', backgroundColor: '#F7F8F9', borderRadius: 8, paddingVertical: 12, marginBottom: 8 },
  gridBtnActive: { backgroundColor: '#11181C' },
  gridBtnText: { fontSize: 15, color: '#687076' },
  gridBtnTextActive: { color: '#fff', fontWeight: 'bold' },
  notesInput: { backgroundColor: '#F7F8F9', borderRadius: 8, padding: 12, fontSize: 15, color: '#11181C', minHeight: 60, marginBottom: 8 },
  recentSection: { backgroundColor: '#F7F8F9', borderRadius: 12, padding: 12, marginTop: 18, marginBottom: 16 },
  recentTitle: { fontSize: 15, fontWeight: 'bold', marginBottom: 8, color: '#11181C' },
  recentItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  recentText: { marginLeft: 8, fontSize: 15, color: '#11181C', flex: 1 },
  recentTime: { fontSize: 13, color: '#687076' },
  saveBtn: { backgroundColor: '#11181C', borderRadius: 10, paddingVertical: 14, alignItems: 'center', marginTop: 8, marginBottom: 24 },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  });