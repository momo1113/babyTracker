// app/tabs/edit-baby.tsx

import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

export default function EditBabyScreen() {
  const router = useRouter();
  const [dob, setDob] = useState('2025-03-12');
  const [gender, setGender] = useState('Female');
  const [growthData, setGrowthData] = useState([
    { date: '2025-07-01', weight: '14.2', height: '24.5' },
  ]);

  const handleSave = () => {
    // TODO: save to backend or local storage
    router.back();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>✏️ Edit Baby Profile</Text>

      <Text style={styles.label}>Date of Birth</Text>
      <TextInput style={styles.input} value={dob} onChangeText={setDob} placeholder="YYYY-MM-DD" />

      <Text style={styles.label}>Gender</Text>
      <TextInput style={styles.input} value={gender} onChangeText={setGender} />

      <Text style={styles.sectionTitle}>📊 Growth Entries</Text>
      {growthData.map((entry, index) => (
        <View key={index} style={styles.growthRow}>
          <TextInput
            style={styles.growthInput}
            placeholder="Date"
            value={entry.date}
            onChangeText={(text) => {
              const newData = [...growthData];
              newData[index].date = text;
              setGrowthData(newData);
            }}
          />
          <TextInput
            style={styles.growthInput}
            placeholder="Weight (lbs)"
            keyboardType="numeric"
            value={entry.weight}
            onChangeText={(text) => {
              const newData = [...growthData];
              newData[index].weight = text;
              setGrowthData(newData);
            }}
          />
          <TextInput
            style={styles.growthInput}
            placeholder="Height (in)"
            keyboardType="numeric"
            value={entry.height}
            onChangeText={(text) => {
              const newData = [...growthData];
              newData[index].height = text;
              setGrowthData(newData);
            }}
          />
        </View>
      ))}

      <TouchableOpacity
        style={styles.addBtn}
        onPress={() =>
          setGrowthData([...growthData, { date: '', weight: '', height: '' }])
        }
      >
        <Text style={styles.addBtnText}>+ Add Growth Entry</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveBtnText}>💾 Save</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#fff', paddingTop: 72, paddingBottom: 100 },
  header: { fontSize: 20, fontWeight: 'bold', color: '#11181C', marginBottom: 16 },
  label: { fontSize: 14, color: '#687076', marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: '#ECEDEE',
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
    fontSize: 15,
  },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#11181C', marginVertical: 12 },
  growthRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  growthInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ECEDEE',
    borderRadius: 8,
    padding: 10,
    fontSize: 13,
  },
  addBtn: {
    alignItems: 'center',
    backgroundColor: '#F7F8F9',
    borderRadius: 8,
    paddingVertical: 10,
    marginBottom: 20,
  },
  addBtnText: { fontSize: 14, color: '#11181C' },
  saveBtn: {
    backgroundColor: '#11181C',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
