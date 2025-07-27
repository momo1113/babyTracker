import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  ActivityIndicator,
  Platform,
} from 'react-native';
import Modal from 'react-native-modal';
import { Calendar } from 'react-native-calendars';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/ui/IconSymbol';

import { getAuth } from 'firebase/auth';
import { storage, ref, uploadBytes, getDownloadURL } from '../../firebaseConfig'; // Adjust path to your firebase config
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig'; // Your Firestore db instance

const GENDERS = [
  { label: 'Female', icon: 'female' },
  { label: 'Male', icon: 'male' },
];

const today = new Date().toISOString().split('T')[0]; // get today's date in 'YYYY-MM-DD' format

export default function EditBabyScreen() {
  const router = useRouter();

  // Baby info states
  const [name, setName] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  const [dob, setDob] = useState(today);
  const [isDobModalVisible, setIsDobModalVisible] = useState(false);

  const [gender, setGender] = useState('Female');
  const [isGenderDropdownOpen, setIsGenderDropdownOpen] = useState(false);

  const [growthData, setGrowthData] = useState([{ date: today, weight: '', height: '' }]);
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const [selectedEntryIndex, setSelectedEntryIndex] = useState(null);
  const today = new Date().toISOString().split('T')[0];
  const [tempDate, setTempDate] = useState(today);

  const [loadingProfile, setLoadingProfile] = useState(true);

  // Load baby profile data by userId on mount
  useEffect(() => {
    const fetchBabyProfile = async () => {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        setLoadingProfile(false);
        return;
      }

      try {
        const docRef = doc(db, 'babyProfiles', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setName(data.name || '');
          setPhotoUrl(data.photoUrl || '');
          setDob(data.dob || today);
          setGender(data.gender || 'Female');
          setGrowthData(data.growthData && data.growthData.length > 0 ? data.growthData : [{ date: today, weight: '', height: '' }]);
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchBabyProfile();
  }, []);

  const deleteGrowthEntries = async (datesToDelete) => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) {
    Alert.alert('Authentication Error', 'Please log in first.');
    router.push('/auth/login');
    return;
  }

  try {
    const token = await user.getIdToken();
    const response = await fetch('http://192.168.1.9:3000/baby-profile', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ dates: datesToDelete }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to delete growth entries.');
    }

    const data = await response.json();
    setGrowthData(data.growthData); // update growthData in state
    Alert.alert('Success', 'Growth entries deleted.');
  } catch (error) {
    Alert.alert('Error', error.message || 'Something went wrong.');
  }
};

  // Open DOB calendar modal
  const openDobCalendar = () => {
  setTempDate(dob || today);
  setIsDobModalVisible(true);
};

  // DOB selected from calendar
  const handleDobSelect = (day) => {
    setDob(day.dateString);
    setIsDobModalVisible(false);
  };

  // Open calendar for growth entry date selection
  const openCalendar = (index) => {
  setSelectedEntryIndex(index);
  setTempDate(growthData[index]?.date || today);
  setIsCalendarVisible(true);
};

  // Growth entry date selected
  const handleDateSelect = (day) => {
    if (selectedEntryIndex !== null) {
      const newData = [...growthData];
      newData[selectedEntryIndex].date = day.dateString;
      setGrowthData(newData);
    }
    setIsCalendarVisible(false);
    setSelectedEntryIndex(null);
    setTempDate('');
  };

  // Add new growth entry with validation
  const addGrowthEntry = () => {
    for (let i = 0; i < growthData.length; i++) {
      const { weight, height } = growthData[i];
      if (!weight || !height) {
        Alert.alert('Validation Error', `Please fill weight and height for entry #${i + 1} before adding a new one.`);
        return;
      }
    }
    setGrowthData([...growthData, { date: today, weight: '', height: '' }]);
  };

  // Upload image to Firebase Storage
  const uploadImageAsync = async (uri, filename) => {
    const response = await fetch(uri);
    const blob = await response.blob();

    const imageRef = ref(storage, `baby-profile-pictures/${filename}`);
    await uploadBytes(imageRef, blob);
    const downloadUrl = await getDownloadURL(imageRef);
    return downloadUrl;
  };

  // Launch image picker & upload selected image
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'Permission to access photo library is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.cancelled) {
      setUploadingImage(true);

      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        Alert.alert('Authentication Error', 'Please log in first.');
        router.push('/auth/login');
        setUploadingImage(false);
        return;
      }

      const filename = `${user.uid}_${Date.now()}.jpg`;

      try {
        const uploadedUrl = await uploadImageAsync(result.uri, filename);
        setPhotoUrl(uploadedUrl);
      } catch (error) {
        Alert.alert('Upload Error', 'Failed to upload image.');
        console.error('Image upload error:', error);
      } finally {
        setUploadingImage(false);
      }
    }
  };

  // Save baby profile to backend with Firebase auth token
  const handleSave = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      Alert.alert('Authentication Error', 'Please log in first.');
      router.push('/auth/login');
      return;
    }

    if (!name.trim()) {
      Alert.alert('Validation Error', 'Please enter the baby name.');
      return;
    }

    for (const [i, entry] of growthData.entries()) {
      if (!entry.weight || !entry.height) {
        Alert.alert('Validation Error', `Please enter weight and height for entry ${i + 1}.`);
        return;
      }
    }

    if (!dob) {
      Alert.alert('Validation Error', 'Please enter Date of Birth.');
      return;
    }

    if (!gender) {
      Alert.alert('Validation Error', 'Please select Gender.');
      return;
    }

    try {
      const token = await user.getIdToken();

      const payload = {
        userId: user.uid,
        name: name.trim(),
        photoUrl: photoUrl.trim(),
        dob,
        gender,
        growthData,
      };
      console.log('Saving baby profile:', payload);
      const BASE_URL = 'http://192.168.1.9:3000';

      const response = await fetch(`${BASE_URL}/baby-profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save baby profile.');
      }

      await response.json();

      Alert.alert('Success', 'Baby profile saved successfully!');
      router.back();
    } catch (error) {
      console.error('❌ Error:', error);
      Alert.alert('Error', error.message || 'Something went wrong');
    }
  };

  if (loadingProfile) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#3B322C" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
        accessibilityLabel="Go back to previous screen"
      >
        <IconSymbol name="chevron.backward" size={22} color="#687076" />
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>

      <Text style={styles.header}>✏️ Edit Baby Profile</Text>

      {/* Name Input */}
      <Text style={styles.label}>Baby Name</Text>
      <TextInput
        style={styles.inputWithIcon}
        placeholder="Enter baby's name"
        value={name}
        onChangeText={setName}
        accessibilityLabel="Baby name input"
      />

      {/* Profile Picture Picker */}
      <Text style={styles.label}>Profile Picture</Text>
      <TouchableOpacity
        style={[styles.addBtn, { marginBottom: 12 }]}
        onPress={pickImage}
        accessibilityLabel="Select profile picture"
      >
        <Text style={styles.addBtnText}>
          {photoUrl ? 'Change Profile Picture' : 'Choose Profile Picture'}
        </Text>
      </TouchableOpacity>

      {uploadingImage ? (
        <ActivityIndicator size="large" color="#3B322C" style={{ marginBottom: 16 }} />
      ) : photoUrl !== '' ? (
        <Image
          source={{ uri: photoUrl }}
          style={{ width: 100, height: 100, borderRadius: 50, alignSelf: 'center', marginBottom: 16 }}
        />
      ) : null}

      {/* DOB Input */}
      <Text style={styles.label}>Date of Birth</Text>
      <TouchableOpacity
        onPress={openDobCalendar}
        activeOpacity={0.7}
        accessibilityLabel="Select date of birth"
      >
        <View style={[styles.inputWithIcon, { justifyContent: 'space-between' }]}>
          {/* ✅ calendar icon aligned right */}
          <Text style={styles.inputText}>{dob}</Text>
          <IconSymbol name="calendar" size={20} color="#687076" />
        </View>
      </TouchableOpacity>

      {/* DOB Calendar Modal */}
      <Modal
        isVisible={isDobModalVisible}
        onBackdropPress={() => setIsDobModalVisible(false)}
        style={styles.modal}
        animationIn="slideInUp"
        animationOut="slideOutDown"
      >
        <View style={styles.modalContent}>
          <Calendar
            current={tempDate} // ✅ default to today
            onDayPress={handleDobSelect}
            markedDates={{
              [tempDate]: { selected: true, selectedColor: '#8FB89C' },
            }}
            theme={{
              backgroundColor: '#E9F2EC',
              calendarBackground: '#E9F2EC',
              textSectionTitleColor: '#2D3A2E',
              selectedDayBackgroundColor: '#8FB89C',
              selectedDayTextColor: '#2D3A2E',
              todayTextColor: '#8FB89C',
              dayTextColor: '#2D3A2E',
              textDisabledColor: '#7A867B',
              arrowColor: '#687076',
              monthTextColor: '#2D3A2E',
              textDayFontSize: 14,
              textMonthFontSize: 16,
              textDayHeaderFontSize: 14,
            }}
            accessibilityLabel="Calendar for selecting date of birth"
          />
          <TouchableOpacity
            style={styles.modalButton}
            onPress={() => setIsDobModalVisible(false)}
            activeOpacity={0.8}
            accessibilityLabel="Close calendar"
          >
            <Text style={styles.modalButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Gender Input */}
      <Text style={styles.label}>Gender</Text>
      <TouchableOpacity
        style={styles.genderInput}
        onPress={() => setIsGenderDropdownOpen(!isGenderDropdownOpen)}
        accessibilityLabel="Select gender"
      >
        <View style={styles.genderSelected}>
          <IconSymbol
            name="gender"
            size={32}
            color="#687076"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.genderText}>{gender}</Text>
        </View>
        <View style={{ flex: 1 }} />
        {isGenderDropdownOpen ? (
          <IconSymbol name="chevron.up" size={20} color="#687076" />
        ) : (
          <IconSymbol name="chevron.down" size={20} color="#687076" />
        )}
      </TouchableOpacity>

      {isGenderDropdownOpen && (
        <View style={styles.genderDropdown}>
          {GENDERS.map(({ label }) => {
            const selected = gender === label;
            return (
              <TouchableOpacity
                key={label}
                style={[
                  styles.genderDropdownItem,
                  selected && styles.genderDropdownItemSelected,
                ]}
                onPress={() => {
                  setGender(label);
                  setIsGenderDropdownOpen(false);
                }}
                accessibilityLabel={`Select gender ${label}`}
              >
                <Text style={styles.genderDropdownText}>{label}</Text>
                {selected && (
                  <IconSymbol
                    name="checkmark.circle"
                    size={24}
                    color="#3CB371"
                    style={{ marginLeft: 'auto' }}
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {/* Growth Entries */}
      <Text style={styles.sectionTitle}>📈 Growth Entries</Text>

      <ScrollView
        style={[styles.growthEntriesContainer, { maxHeight: 400 }]} // ✅ increased max height for better scrolling
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={true}
      >
        {growthData.map((entry, index) => (
          <View key={index} style={styles.growthRow}>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => openCalendar(index)}
              accessibilityLabel={`Select date for growth entry ${index + 1}`}
            >
              <IconSymbol name="calendar" size={16} color="#687076" />
              <Text style={styles.dateButtonText}>
                {entry.date || 'Select Date'}
              </Text>
            </TouchableOpacity>
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

             <TouchableOpacity
                onPress={() => {
                  deleteGrowthEntries([growthData[index].date]);
                }}
                accessibilityLabel={`Delete growth entry ${index + 1}`}
              >
                <IconSymbol name="trash" size={20} color="#D44C4C" />
              </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* Growth Entry Date Picker Modal */}
      <Modal
        isVisible={isCalendarVisible}
        onBackdropPress={() => setIsCalendarVisible(false)}
        style={styles.modal}
        animationIn="slideInUp"
        animationOut="slideOutDown"
      >
        <View style={styles.modalContent}>
          <Calendar
            current={tempDate || today} // ✅ default to today
            onDayPress={handleDateSelect}
            markedDates={{
              [tempDate]: { selected: true, selectedColor: '#8FB89C' },
            }}
            theme={{
              backgroundColor: '#E9F2EC',
              calendarBackground: '#E9F2EC',
              textSectionTitleColor: '#2D3A2E',
              selectedDayBackgroundColor: '#8FB89C',
              selectedDayTextColor: '#2D3A2E',
              todayTextColor: '#8FB89C',
              dayTextColor: '#2D3A2E',
              textDisabledColor: '#7A867B',
              arrowColor: '#687076',
              monthTextColor: '#2D3A2E',
              textDayFontSize: 14,
              textMonthFontSize: 16,
              textDayHeaderFontSize: 14,
            }}
            accessibilityLabel="Calendar for selecting growth entry date"
          />
          <TouchableOpacity
            style={styles.modalButton}
            onPress={() => setIsCalendarVisible(false)}
            activeOpacity={0.8}
            accessibilityLabel="Close calendar"
          >
            <Text style={styles.modalButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Add growth entry button */}
      <TouchableOpacity
        style={styles.addBtn}
        onPress={addGrowthEntry}
        activeOpacity={0.8}
        accessibilityLabel="Add new growth entry"
      >
        <Text style={styles.addBtnText}>+ Add Growth Entry</Text>
      </TouchableOpacity>

      {/* Save button */}
      <TouchableOpacity
        style={styles.saveBtn}
        onPress={handleSave}
        activeOpacity={0.8}
        accessibilityLabel="Save baby profile"
        disabled={uploadingImage}
      >
        <Text style={styles.saveBtnText}>{uploadingImage ? 'Uploading...' : 'Save'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#F9F9F7', // Warm White
    paddingTop: Platform.OS === 'ios' ? 76 : 56,
    paddingBottom: 100,
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    zIndex: 1,
  },
  backButtonText: {
    fontSize: 14,
    color: '#3B322C', // Dark warm taupe-ish color for text
    marginLeft: 4,
    fontWeight: '500',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3B322C',
    marginTop: 32,
    marginBottom: 16,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    color: '#867E76', // Warm Taupe (darker)
    fontWeight: '600',
    marginBottom: 8,
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E8E8E8', // Light Dove Grey border
    borderRadius: 6,
    marginBottom: 16,
    backgroundColor: '#F5EDE1', // Beige Cream background
  },
  inputText: {
    flex: 1,
    fontSize: 16,
    color: '#3B322C',
  },
  genderInput: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E8E8E8', // Light Dove Grey border
    borderRadius: 6,
    marginBottom: 16,
    backgroundColor: '#F5EDE1', // Beige Cream background
  },
  genderSelected: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  genderText: {
    fontSize: 16,
    color: '#3B322C',
  },
  genderDropdown: {
    backgroundColor: '#F5EDE1', // Beige Cream
    borderWidth: 1,
    borderColor: '#E8E8E8', // Light Dove Grey
    borderRadius: 6,
    marginBottom: 16,
  },
  genderDropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  genderDropdownItemSelected: {
    backgroundColor: '#D4C5B3', // Warm Taupe
  },
  genderDropdownText: {
    fontSize: 16,
    color: '#3B322C',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginVertical: 8,
    color: '#3B322C',
  },
  growthEntriesContainer: {
    marginBottom: 20,
  },
  growthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8E8E8', // Light Dove Grey border
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginRight: 8,
    backgroundColor: '#F5EDE1', // Beige Cream background
  },
  dateButtonText: {
    marginLeft: 6,
    color: '#3B322C',
  },
  growthInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E8E8E8', // Light Dove Grey border
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginRight: 8,
    backgroundColor: '#F5EDE1', // Beige Cream background
  },
  addBtn: {
    alignSelf: 'center',
    backgroundColor: '#D4C5B3', // Warm Taupe button
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    marginBottom: 24,
  },
  addBtnText: {
    color: '#3B322C', // Dark text on button
    fontSize: 16,
    fontWeight: '600',
  },
  saveBtn: {
    backgroundColor: '#3B322C', // Dark warm taupe
    paddingVertical: 14,
    borderRadius: 25,
    marginBottom: 40,
  },
  saveBtnText: {
    color: '#F9F9F7', // Warm White text on dark button
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: '#E1D3C1', // Soft Sand background for modal
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: 360,
  },
  modalButton: {
    backgroundColor: '#D4C5B3', // Warm Taupe
    borderRadius: 12,
    paddingVertical: 10,
    marginTop: 10,
  },
  modalButtonText: {
    color: '#3B322C', // Dark text
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
  },
});
