import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

export default function BabyProfileScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Baby Profile</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Icon */}
      <View style={styles.iconCircle}>
        <Text style={styles.icon}>👶</Text>
      </View>

      {/* Title & Subtitle */}
      <Text style={styles.title}>Create Baby Profile</Text>
      <Text style={styles.subtitle}>Tell us about your little one</Text>

      {/* Baby's Name */}
      <Text style={styles.label}>Baby's Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter baby's name"
        placeholderTextColor="#687076"
        value={name}
        onChangeText={setName}
      />

      {/* Date of Birth */}
      <Text style={styles.label}>Date of Birth</Text>
      <View style={styles.dobRow}>
        <TextInput
          style={styles.input}
          placeholder="mm/dd/yyyy"
          placeholderTextColor="#687076"
          value={dob}
          onChangeText={setDob}
        />
        <TouchableOpacity style={styles.calendarBtn}>
          <Text style={styles.calendarIcon}>📅</Text>
        </TouchableOpacity>
      </View>

      {/* Info Box */}
      <View style={styles.infoBox}>
        <Text style={styles.infoIcon}>ℹ️</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.infoTitle}>Why we need this info</Text>
          <Text style={styles.infoText}>
            We'll use your baby's age to provide personalized suggestions and track developmental milestones.
          </Text>
        </View>
      </View>

      {/* Next Button */}
      <TouchableOpacity style={styles.nextBtn}>
        <Text style={styles.nextBtnText}>Next</Text>
      </TouchableOpacity>

      {/* Progress Dots */}
      <View style={styles.dotsRow}>
        <View style={[styles.dot, styles.dotActive]} />
        <View style={styles.dot} />
        <View style={styles.dot} />
      </View>

      {/* Privacy */}
      <Text style={styles.privacyText}>Your data stays private and secure</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#fff', padding: 24, alignItems: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: 16 },
  backArrow: { fontSize: 22, color: '#687076', width: 24 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#11181C', textAlign: 'center', flex: 1 },
  iconCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#ECEDEE', alignItems: 'center', justifyContent: 'center', marginVertical: 24 },
  icon: { fontSize: 36 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#11181C', textAlign: 'center', marginBottom: 4 },
  subtitle: { fontSize: 15, color: '#687076', textAlign: 'center', marginBottom: 24 },
  label: { fontSize: 15, color: '#11181C', fontWeight: '500', alignSelf: 'flex-start', marginBottom: 6, marginTop: 12 },
  input: { backgroundColor: '#fff', borderColor: '#ECEDEE', borderWidth: 1, borderRadius: 10, padding: 14, fontSize: 16, color: '#11181C', marginBottom: 8, flex: 1 },
  dobRow: { flexDirection: 'row', alignItems: 'center', width: '100%' },
  calendarBtn: { position: 'absolute', right: 12, top: 8, padding: 4 },
  calendarIcon: { fontSize: 20, color: '#687076' },
  infoBox: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: '#F7F8F9', borderRadius: 10, padding: 12, marginTop: 16, marginBottom: 24, width: '100%' },
  infoIcon: { fontSize: 18, color: '#687076', marginRight: 10, marginTop: 2 },
  infoTitle: { fontWeight: 'bold', color: '#11181C', fontSize: 15, marginBottom: 2 },
  infoText: { color: '#687076', fontSize: 14 },
  nextBtn: { width: '100%', backgroundColor: '#11181C', borderRadius: 10, paddingVertical: 16, alignItems: 'center', marginTop: 16, marginBottom: 12 },
  nextBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  dotsRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#ECEDEE', marginHorizontal: 4 },
  dotActive: { backgroundColor: '#11181C' },
  privacyText: { color: '#687076', fontSize: 13, textAlign: 'center', marginTop: 12 },
});