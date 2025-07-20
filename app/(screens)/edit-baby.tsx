import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import Modal from 'react-native-modal';
import { Calendar } from 'react-native-calendars';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/ui/IconSymbol';

const GENDERS = [
  { label: 'Female', icon: 'female' },
  { label: 'Male', icon: 'male' },
];

export default function EditBabyScreen() {
  const router = useRouter();
  const [dob, setDob] = useState('2025-03-12');
  const [isDobModalVisible, setIsDobModalVisible] = useState(false);

  const [gender, setGender] = useState('Female');
  const [isGenderDropdownOpen, setIsGenderDropdownOpen] = useState(false);

  const [growthData, setGrowthData] = useState([
    { date: '2025-07-01', weight: '14.2', height: '24.5' },
  ]);
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const [selectedEntryIndex, setSelectedEntryIndex] = useState<number | null>(null);
  const [tempDate, setTempDate] = useState('');

  // Open calendar to pick DOB
  const openDobCalendar = () => {
    setTempDate(dob);
    setIsDobModalVisible(true);
  };

  // On DOB picked
  const handleDobSelect = (day) => {
    setDob(day.dateString);
    setIsDobModalVisible(false);
  };

  // Open calendar for growth entry date
  const openCalendar = (index) => {
    setSelectedEntryIndex(index);
    setTempDate(growthData[index].date || '');
    setIsCalendarVisible(true);
  };

  // On growth date selected
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

  // Add growth entry with validation
  const addGrowthEntry = () => {
    // Validate all existing entries have weight and height filled
    for (let i = 0; i < growthData.length; i++) {
      const { weight, height } = growthData[i];
      if (!weight || !height) {
        Alert.alert(
          'Validation Error',
          `Please fill weight and height for entry #${i + 1} before adding a new one.`
        );
        return;
      }
    }
    setGrowthData([...growthData, { date: '', weight: '', height: '' }]);
  };

  const handleSave = async () => {
  // Validation: make sure all growth entries have weight & height
  for (const [i, entry] of growthData.entries()) {
    if (!entry.weight || !entry.height) {
      Alert.alert('Validation Error', `Please enter weight and height for growth entry ${i + 1}.`);
      return;
    }
  }

  // Basic DOB and Gender validation
  if (!dob) {
    Alert.alert('Validation Error', 'Please enter Date of Birth.');
    return;
  }
  if (!gender) {
    Alert.alert('Validation Error', 'Please select Gender.');
    return;
  }

  const payload = { dob, gender, growthData };

  const BASE_URL = 'http://192.168.1.9:3000';

  try {
    const response = await fetch(`${BASE_URL}/baby-profile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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


  return (
    <ScrollView contentContainerStyle={styles.container}>
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

      <Text style={styles.label}>Date of Birth</Text>
      <TouchableOpacity onPress={openDobCalendar} activeOpacity={0.7}>
        <View style={styles.inputWithIcon}>
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
            current={tempDate || '2025-07-18'}
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
              {/* Removed icon here */}
              <Text style={styles.genderDropdownText}>{label}</Text>
              {selected && (
                <IconSymbol
                  name="checkmark.circle"
                  size={24}
                  color="#3CB371" // mediumseagreen
                  style={{ marginLeft: 'auto' }}
                />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    )}

      <Text style={styles.sectionTitle}>📈 Growth Entries</Text>

      <ScrollView
        style={styles.growthEntriesContainer}
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
            current={tempDate || '2025-07-18'}
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

      <TouchableOpacity
        style={styles.addBtn}
        onPress={addGrowthEntry}
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
  container: {
    padding: 16,
    backgroundColor: '#F9F9F7', // Warm White
    paddingTop: 76,
    paddingBottom: 100,
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    zIndex: 1,
  },
  backButtonText: {
    fontSize: 14,
    color: '#3B322C', // Warm Taupe (darker)
    marginLeft: 4,
    fontWeight: '500',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3B322C', // Warm Taupe
    marginTop: 32,
    marginBottom: 16,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    color: '#867E76', // softer taupe shade
    marginBottom: 4,
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D4C5B3', // Warm Taupe
    borderRadius: 12,
    padding: 10,
    marginBottom: 16,
    backgroundColor: '#F5EDE1', // Beige Cream
    justifyContent: 'space-between',
  },
  inputText: {
    fontSize: 15,
    color: '#3B322C', // Warm Taupe
  },
  genderInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D4C5B3', // Warm Taupe
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
    backgroundColor: '#F5EDE1', // Beige Cream
  },
  genderSelected: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  genderText: {
    fontSize: 16,
    color: '#3B322C', // Warm Taupe
  },
  genderDropdown: {
    backgroundColor: '#F5EDE1', // Beige Cream
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D4C5B3', // Warm Taupe
    marginBottom: 16,
  },
  genderDropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8', // Light Dove Grey
  },
  genderDropdownText: {
    fontSize: 16,
    color: '#3B322C', // Warm Taupe
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3B322C', // Warm Taupe
    marginVertical: 12,
  },
  growthEntriesContainer: {
    maxHeight: 320,
    marginBottom: 20,
  },
  growthRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
    backgroundColor: '#E1D3C1', // Soft Sand
    borderRadius: 10,
    padding: 8,
  },
  dateButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D4C5B3', // Warm Taupe
    borderRadius: 12,
    padding: 10,
    backgroundColor: '#F5EDE1', // Beige Cream
  },
  dateButtonText: {
    fontSize: 13,
    color: '#3B322C', // Warm Taupe
    marginLeft: 8,
  },
  growthInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D4C5B3', // Warm Taupe
    borderRadius: 12,
    padding: 10,
    fontSize: 13,
    backgroundColor: '#F5EDE1', // Beige Cream
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: '#E8E8E8', // Light Dove Grey
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    padding: 16,
  },
  modalButton: {
    backgroundColor: '#D4C5B3', // Warm Taupe
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 12,
  },
  modalButtonText: {
    color: '#3B322C', // Warm Taupe
    fontSize: 14,
    fontWeight: 'bold',
  },
  addBtn: {
    alignItems: 'center',
    backgroundColor: '#E8E8E8', // Light Dove Grey
    borderRadius: 12,
    paddingVertical: 10,
    marginBottom: 20,
  },
  addBtnText: {
    fontSize: 15,
    color: '#3B322C', // Warm Taupe
    fontWeight: '600',
  },
  saveBtn: {
    backgroundColor: '#D4C5B3', // Warm Taupe
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveBtnText: {
    color: '#3B322C', // Warm Taupe
    fontSize: 16,
    fontWeight: 'bold',
  },
  genderDropdownItemSelected: {
    backgroundColor: '#F5EDE1', // Beige Cream for selected
  },
});
