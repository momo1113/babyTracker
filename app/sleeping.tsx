import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function SleepLogScreen() {
  const router = useRouter();
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [type, setType] = useState('Nap');
  const [location, setLocation] = useState('');
  const [quality, setQuality] = useState('');

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <IconSymbol name="arrow.left" size={22} color="#687076" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sleep Log</Text>
        <View style={{ width: 22 }} />
      </View>

      {/* Icon and Title */}
      <View style={styles.centered}>
        <View style={styles.sleepIconCircle}>
          <IconSymbol name="moon.fill" size={36} color="#687076" />
        </View>
        <Text style={styles.logSleepTitle}>Log Sleep</Text>
        <Text style={styles.logSleepDesc}>Track your baby's sleep patterns</Text>
      </View>

      {/* Start Time */}
      <Text style={styles.label}>Start Time</Text>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.timeInput}
          value={startTime}
          onChangeText={setStartTime}
          placeholder="--:-- --"
        />
        <TouchableOpacity>
          <IconSymbol name="clock" size={20} color="#687076" />
        </TouchableOpacity>
      </View>

      {/* End Time */}
      <Text style={styles.label}>End Time</Text>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.timeInput}
          value={endTime}
          onChangeText={setEndTime}
          placeholder="--:-- --"
        />
        <TouchableOpacity>
          <IconSymbol name="clock" size={20} color="#687076" />
        </TouchableOpacity>
      </View>

      {/* Type of Sleep */}
      <Text style={styles.label}>Type of Sleep</Text>
      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.selectBtn, type === 'Nap' && styles.selectBtnActive]}
          onPress={() => setType('Nap')}
        >
          <IconSymbol name="gearshape" size={18} color={type === 'Nap' ? '#fff' : '#687076'} />
          <Text style={[styles.selectBtnText, type === 'Nap' && styles.selectBtnTextActive]}>Nap</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.selectBtn, type === 'Night Sleep' && styles.selectBtnActive]}
          onPress={() => setType('Night Sleep')}
        >
          <IconSymbol name="moon.fill" size={18} color={type === 'Night Sleep' ? '#fff' : '#687076'} />
          <Text style={[styles.selectBtnText, type === 'Night Sleep' && styles.selectBtnTextActive]}>Night Sleep</Text>
        </TouchableOpacity>
      </View>

      {/* Sleep Location */}
      <Text style={styles.label}>Sleep Location</Text>
      <View style={styles.gridRow}>
        {['Crib', 'Stroller', 'Arms', 'Car Seat'].map(loc => (
          <TouchableOpacity
            key={loc}
            style={[styles.gridBtn, location === loc && styles.gridBtnActive]}
            onPress={() => setLocation(loc)}
          >
            <IconSymbol
              name={
                loc === 'Crib'
                  ? 'bed.double.fill'
                  : loc === 'Stroller'
                  ? 'figure.walk'
                  : loc === 'Arms'
                  ? 'hand.raised.fill'
                  : 'car.fill'
              }
              size={16}
              color={location === loc ? '#fff' : '#687076'}
            />
            <Text style={[styles.gridBtnText, location === loc && styles.gridBtnTextActive]}>
              {loc}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Sleep Quality */}
      <Text style={styles.label}>Sleep Quality</Text>
      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.selectBtn, quality === 'Good' && styles.selectBtnActive]}
          onPress={() => setQuality('Good')}
        >
          <IconSymbol name="face.smiling" size={18} color={quality === 'Good' ? '#fff' : '#687076'} />
          <Text style={[styles.selectBtnText, quality === 'Good' && styles.selectBtnTextActive]}>Good</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.selectBtn, quality === 'Interrupted' && styles.selectBtnActive]}
          onPress={() => setQuality('Interrupted')}
        >
          <IconSymbol name="pause.circle.fill" size={18} color={quality === 'Interrupted' ? '#fff' : '#687076'} />
          <Text style={[styles.selectBtnText, quality === 'Interrupted' && styles.selectBtnTextActive]}>Interrupted</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.selectBtn, quality === 'Fussy' && styles.selectBtnActive]}
          onPress={() => setQuality('Fussy')}
        >
          <IconSymbol name="face.dashed" size={18} color={quality === 'Fussy' ? '#fff' : '#687076'} />
          <Text style={[styles.selectBtnText, quality === 'Fussy' && styles.selectBtnTextActive]}>Fussy</Text>
        </TouchableOpacity>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionRow}>

        <TouchableOpacity style={styles.saveBtn}>
          <Text style={styles.saveBtnText}>Save</Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <Text style={styles.footerText}>Sleep patterns help predict your baby's needs</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff' },
  header: { flexDirection: 'row', paddingTop: 44, alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#11181C' },
  centered: { alignItems: 'center', marginBottom: 16 },
  sleepIconCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#ECEDEE', alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  logSleepTitle: { fontSize: 20, fontWeight: 'bold', color: '#11181C', marginBottom: 2 },
  logSleepDesc: { fontSize: 14, color: '#687076', marginBottom: 12 },
  label: { fontSize: 15, fontWeight: '500', marginTop: 18, marginBottom: 8, color: '#11181C' },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  timeInput: { flex: 1, backgroundColor: '#F7F8F9', borderRadius: 8, padding: 12, fontSize: 15, color: '#11181C' },
  row: { flexDirection: 'row', gap: 12, marginBottom: 8 },
  selectBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F7F8F9', borderRadius: 10, paddingVertical: 14, gap: 6 },
  selectBtnActive: { backgroundColor: '#11181C' },
  selectBtnText: { fontSize: 15, color: '#687076' },
  selectBtnTextActive: { color: '#fff', fontWeight: 'bold' },
  gridRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  gridBtn: { flex: 1, minWidth: 90, alignItems: 'center', backgroundColor: '#F7F8F9', borderRadius: 8, paddingVertical: 12, marginBottom: 8, flexDirection: 'row', justifyContent: 'center', gap: 6 },
  gridBtnActive: { backgroundColor: '#11181C' },
  gridBtnText: { fontSize: 15, color: '#687076' },
  gridBtnTextActive: { color: '#fff', fontWeight: 'bold' },
  actionRow: { flexDirection: 'row', gap: 12, marginTop: 24, marginBottom: 8 },
  cancelBtn: { flex: 1, backgroundColor: '#F7F8F9', borderRadius: 10, paddingVertical: 14, alignItems: 'center' },
  cancelBtnText: { color: '#11181C', fontSize: 16, fontWeight: 'bold' },
  saveBtn: { flex: 1, backgroundColor: '#11181C', borderRadius: 10, paddingVertical: 14, alignItems: 'center' },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  footerText: { textAlign: 'center', color: '#687076', fontSize: 13, marginTop: 12, marginBottom: 24},
});