import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
  Image
} from 'react-native';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/ui/IconSymbol';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getAuth } from 'firebase/auth';
import * as ImagePicker from 'expo-image-picker';
import { useBanner } from '../../context/BannerContext';

export default function BabyProfileScreen() {
  const router = useRouter();
  const auth = getAuth();
    const { message, clearMessage } = useBanner(); // 👈 Add this

  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [photoUri, setPhotoUri] = useState(null);

  const isValid = name.trim() && dob.trim() && gender.trim();

  const handleDateChange = (event, date) => {
    setShowPicker(false);
    if (date) {
      setSelectedDate(date);
      const formattedDate = `${(date.getMonth() + 1)
        .toString()
        .padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}/${date.getFullYear()}`;
      setDob(formattedDate);
    }
  };

const handleImageUpload = async () => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert('Permission required', 'Please allow photo access.');
    return;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    quality: 0.7,
  });

  if (!result.canceled) {
    const uri = result.assets[0].uri;
    setPhotoUri(uri);
  }
};

const saveBabyProfile = async () => {
  if (!isValid) {
    Alert.alert('Validation', 'Please fill in all required fields.');
    return;
  }

  const user = auth.currentUser;
  if (!user) {
    Alert.alert('Authentication', 'Please login first.');
    router.push('/auth/login');
    return;
  }

  try {
    const token = await user.getIdToken();

    const formData = new FormData();

    formData.append('name', name);
    formData.append('dob', dob);
    formData.append('gender', gender);
    formData.append('growthData', JSON.stringify([])); // as string
    formData.append('userId', user.uid); // optional if backend uses token UID

    // Attach photo if selected
    if (photoUri) {
        const fileName = photoUri.split('/').pop();
        const fileType = 'image/jpeg'; // or infer from extension

      formData.append('photo', {
        uri: photoUri,
        name: fileName,
        type: fileType,
      });
    }

    const response = await fetch('http://192.168.1.9:3000/baby-profile', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        // Don't set 'Content-Type' here — let fetch handle it for FormData
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      Alert.alert('Error', data.error || 'Failed to save baby profile');
      return;
    }

    Alert.alert('Success', 'Baby profile saved successfully!', [
      {
        text: 'OK',
        onPress: () => router.replace('/(tabs)/home'),
      },
    ]);
  } catch (error) {
    console.error('Save baby profile error', error);
    Alert.alert('Error', 'Network error, please try again.');
  }
};


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={() => router.push('/auth/login')} style={styles.backButton}>
        <IconSymbol name="chevron.backward" size={20} color="#7A867B" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      {message ? (
        <View style={styles.banner}>
          <Text style={styles.bannerText}>{message}</Text>
          <TouchableOpacity onPress={clearMessage}>
            <Text style={styles.bannerClose}>✕</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      <View style={styles.iconCircle}>
        <TouchableOpacity onPress={handleImageUpload} style={styles.iconCircle}>
            {photoUri ? (
              <Image source={{ uri: photoUri }} style={styles.profileImage} />
              ) : (
                <IconSymbol name="camera" size={28} color="#7A867B" />
              )}
            </TouchableOpacity>
      </View>

      <Text style={styles.title}>Create Baby Profile</Text>
      <Text style={styles.subtitle}>Tell us about your little one</Text>

      <Text style={styles.label}>Baby's Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter baby's name"
        placeholderTextColor="#7A867B"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Date of Birth</Text>
      <View style={styles.inputWithIcon}>
        <TouchableOpacity
          style={styles.inputTouchable}
          onPress={() => setShowPicker(true)}
        >
          <Text style={[styles.inputText, !dob && { color: '#7A867B' }]}>
            {dob || 'Select Date of Birth'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShowPicker(true)}>
          <IconSymbol name="calendar" size={20} color="#687076" />
        </TouchableOpacity>
      </View>

      {showPicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
          maximumDate={new Date()}
        />
      )}

      <Text style={styles.label}>Gender</Text>
      <View style={styles.genderRow}>
        {['Male', 'Female'].map((option) => (
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

      <View style={styles.infoBox}>
        <IconSymbol name="info" size={18} color="#D4C5B3" style={styles.infoIcon} />
        <View style={{ flex: 1 }}>
          <Text style={styles.infoTitle}>Why we need this info</Text>
          <Text style={styles.infoText}>
            We'll use your baby's age to provide personalized suggestions and track developmental milestones.
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.nextBtn, !isValid && styles.nextBtnDisabled]}
        onPress={saveBabyProfile}
        disabled={!isValid}
      >
        <Text style={styles.nextBtnText}>Next</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/auth/login')}>
        <Text style={styles.loginLink}>
          Already have an account?{' '}
          <Text style={styles.loginLinkBold}>Log in</Text>
        </Text>
      </TouchableOpacity>

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
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: '#E1D3C1',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden', // ensures image is clipped into the circle
  },
  profileImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
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
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#E8E8E8',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 8,
    width: '100%',
    justifyContent: 'space-between',
  },
  inputTouchable: {
    flex: 1,
  },
  inputText: {
    fontSize: 15,
    color: '#2D3A2E',
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
  nextBtnDisabled: {
    backgroundColor: '#ccc',
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
  banner: {
  backgroundColor: '#FFE5D2',
  borderRadius: 10,
  padding: 12,
  marginBottom: 16,
  width: '100%',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
},
bannerText: {
  color: '#8B3A0D',
  fontSize: 14,
  flex: 1,
},
bannerClose: {
  fontSize: 18,
  color: '#8B3A0D',
  marginLeft: 12,
  fontWeight: 'bold',
},

});
