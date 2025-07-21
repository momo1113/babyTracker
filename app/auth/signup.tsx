import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/ui/IconSymbol'; // Make sure this exists and is working

export default function BabyProfileScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');

  const handlePress = () => {
    router.replace('/(tabs)/home');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Back Button */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <IconSymbol name="chevron-left" size={20} color="#7A867B" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

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
        placeholderTextColor="#7A867B"
        value={name}
        onChangeText={setName}
      />

      {/* Date of Birth */}
      <Text style={styles.label}>Date of Birth</Text>
      <View style={styles.dobRow}>
        <TextInput
          style={styles.input}
          placeholder="mm/dd/yyyy"
          placeholderTextColor="#7A867B"
          value={dob}
          onChangeText={setDob}
        />
        <TouchableOpacity style={styles.calendarBtn}>
          <IconSymbol name="calendar" size={18} color="#687076" />
        </TouchableOpacity>
      </View>

      {/* Gender Selection */}
      <Text style={styles.label}>Gender</Text>
      <View style={styles.genderRow}>
        {['Male', 'Female', 'Prefer not to say'].map((option) => (
          <TouchableOpacity
            key={option}
            style={styles.genderOption}
            onPress={() => setGender(option)}
          >
            <View
              style={[
                styles.radioCircle,
                gender === option && styles.radioSelected,
              ]}
            />
            <Text style={styles.genderText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Info Box */}
      <View style={styles.infoBox}>
        <IconSymbol name="info" size={18} color="#D4C5B3" style={styles.infoIcon} />
        <View style={{ flex: 1 }}>
          <Text style={styles.infoTitle}>Why we need this info</Text>
          <Text style={styles.infoText}>
            We'll use your baby's age to provide personalized suggestions and track developmental milestones.
          </Text>
        </View>
      </View>

      {/* Next Button */}
      <TouchableOpacity style={styles.nextBtn} onPress={handlePress}>
        <Text style={styles.nextBtnText}>Next</Text>
      </TouchableOpacity>

      {/* Link to Login */}
      <TouchableOpacity onPress={() => router.push('/auth/login')}>
        <Text style={styles.loginLink}>
          Already have an account?{' '}
          <Text style={styles.loginLinkBold}>Log in</Text>
        </Text>
      </TouchableOpacity>

      {/* Privacy */}
      <Text style={styles.privacyText}>Your data stays private and secure</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F9F9F7',
    padding: 24,
    paddingTop: 76,
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 44,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    marginLeft: 6,
    color: '#7A867B',
    fontSize: 15,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E1D3C1',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  icon: {
    fontSize: 36,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2D3A2E',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: '#7A867B',
    textAlign: 'center',
    marginBottom: 24,
  },
  label: {
    fontSize: 15,
    color: '#2D3A2E',
    fontWeight: '500',
    alignSelf: 'flex-start',
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E8E8E8',
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    fontSize: 15,
    color: '#2D3A2E',
    marginBottom: 8,
    width: '100%',
  },
  dobRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  calendarBtn: {
    position: 'absolute',
    right: 12,
    top: 12,
    padding: 4,
  },
  genderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 4,
  },
  genderOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioCircle: {
    height: 16,
    width: 16,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#7A867B',
    marginRight: 6,
  },
  radioSelected: {
    backgroundColor: '#D4C5B3',
    borderColor: '#D4C5B3',
  },
  genderText: {
    fontSize: 14,
    color: '#2D3A2E',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F5EDE1',
    borderRadius: 10,
    padding: 12,
    marginTop: 16,
    marginBottom: 24,
    width: '100%',
  },
  infoIcon: {
    marginRight: 10,
    marginTop: 2,
  },
  infoTitle: {
    fontWeight: 'bold',
    color: '#2D3A2E',
    fontSize: 15,
    marginBottom: 2,
  },
  infoText: {
    color: '#7A867B',
    fontSize: 14,
  },
  nextBtn: {
    width: '100%',
    backgroundColor: '#D4C5B3',
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 12,
  },
  nextBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginLink: {
    color: '#7A867B',
    fontSize: 14,
    marginTop: 16,
    textAlign: 'center',
  },
  loginLinkBold: {
    fontWeight: 'bold',
    color: '#2D3A2E',
  },
  privacyText: {
    color: '#7A867B',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 12,
  },
});
