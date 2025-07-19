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
      <TextInput
        style={styles.input}
        value={dob}
        onChangeText={setDob}
        placeholder="YYYY-MM-DD"
        accessibilityLabel="Date of Birth"
      />

      <Text style={styles.label}>Gender</Text>
      <TextInput
        style={styles.input}
        value={gender}
        onChangeText={setGender}
        accessibilityLabel="Gender"
      />

      <Text style={styles.sectionTitle}>📈 Growth Entries</Text>
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
            accessibilityLabel={`Growth entry ${index + 1} date`}
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
            accessibilityLabel={`Growth entry ${index + 1} weight`}
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
            accessibilityLabel={`Growth entry ${index + 1} height`}
          />
        </View>
      ))}

      <TouchableOpacity
        style={styles.addBtn}
        onPress={() =>
          setGrowthData([...growthData, { date: '', weight: '', height: '' }])
        }
        activeOpacity={0.8}
        accessibilityLabel="Add new growth entry"
      >
        <Text style={styles.addBtnText}>+ Add Growth Entry</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.saveBtn}
        onPress={handleSave}
        activeOpacity={0.8}
        accessibilityLabel="Save baby profile"
      >
        <Text style={styles.saveBtnText}>Save</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#F6F7F4', paddingTop: 72, paddingBottom: 100 },
  header: { fontSize: 20, fontWeight: 'bold', color: '#2D3A2E', marginBottom: 16 },
  label: { fontSize: 14, color: '#7A867B', marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: '#C5D7BD',
    borderRadius: 12,
    padding: 10,
    marginBottom: 16,
    fontSize: 15,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#2D3A2E', marginVertical: 12 },
  growthRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
    backgroundColor: '#E9F2EC',
    borderRadius: 10,
    padding: 8,
  },
  growthInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#C5D7BD',
    borderRadius: 12,
    padding: 10,
    fontSize: 13,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  addBtn: {
    alignItems: 'center',
    backgroundColor: '#E9F2EC',
    borderRadius: 12,
    paddingVertical: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  addBtnText: { fontSize: 15, color: '#2D3A2E', fontWeight: '600' },
  saveBtn: {
    backgroundColor: '#8FB89C',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  saveBtnText: { color: '#2D3A2E', fontSize: 16, fontWeight: 'bold' },
});