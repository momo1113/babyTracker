import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Alert,
} from 'react-native';
import Modal from 'react-native-modal';
import { Calendar } from 'react-native-calendars';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function EditBabyScreen() {
  const router = useRouter();
  const [dob, setDob] = useState('2025-03-12');
  const [gender, setGender] = useState('Female');
  const [growthData, setGrowthData] = useState([
    { date: '2025-07-01', weight: '14.2', height: '24.5' },
  ]);

  // DOB modal states
  const [dobModalVisible, setDobModalVisible] = useState(false);

  // Growth date modal states
  const [growthDateModalVisible, setGrowthDateModalVisible] = useState(false);
  const [selectedEntryIndex, setSelectedEntryIndex] = useState<number | null>(null);

  // Gender dropdown state
  const [genderDropdownVisible, setGenderDropdownVisible] = useState(false);

  // Temp date for modals
  const [tempDate, setTempDate] = useState('');

  // Gender options with icons
  const genderOptions = [
    { label: 'Female', icon: 'gender-female' },
    { label: 'Male', icon: 'gender-male' },
  ];

  // Handlers for DOB calendar
  const openDobCalendar = () => {
    setTempDate(dob);
    setDobModalVisible(true);
  };

  const onDobSelect = (day) => {
    setDob(day.dateString);
    setDobModalVisible(false);
  };

  // Handlers for growth entry calendar
  const openGrowthCalendar = (index: number) => {
    setSelectedEntryIndex(index);
    setTempDate(growthData[index].date || '');
    setGrowthDateModalVisible(true);
  };

  const onGrowthDateSelect = (day) => {
    if (selectedEntryIndex !== null) {
      const newData = [...growthData];
      newData[selectedEntryIndex].date = day.dateString;
      setGrowthData(newData);
    }
    setGrowthDateModalVisible(false);
    setSelectedEntryIndex(null);
  };

  // Handle selecting gender
  const onSelectGender = (option: string) => {
    setGender(option);
    setGenderDropdownVisible(false);
  };

  // Validate growth entries before adding a new one
  const onAddGrowthEntry = () => {
    for (let i = 0; i < growthData.length; i++) {
      const entry = growthData[i];
      if (!entry.weight || !entry.height) {
        Alert.alert(
          'Validation Error',
          `Please enter weight and height for growth entry ${i + 1} before adding a new one.`
        );
        return;
      }
    }
    setGrowthData([...growthData, { date: '', weight: '', height: '' }]);
  };

  const handleSave = () => {
    // TODO: Save to backend or local storage
    router.back();
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

      <Text style={styles.header}>Edit Baby Profile</Text>

      {/* Date of Birth */}
      <Text style={styles.label}>Date of Birth</Text>
      <TouchableOpacity
        onPress={openDobCalendar}
        activeOpacity={0.7}
        accessibilityLabel="Select Date of Birth"
      >
        <View pointerEvents="none">
          <TextInput
            style={styles.input}
            value={dob}
            editable={false}
            placeholder="YYYY-MM-DD"
          />
        </View>
      </TouchableOpacity>

      {/* Gender */}
      <Text style={styles.label}>Gender</Text>
      <TouchableOpacity
        style={styles.input}
        onPress={() => setGenderDropdownVisible(!genderDropdownVisible)}
        activeOpacity={0.7}
        accessibilityLabel="Select Gender"
      >
        <Text style={{ color: gender ? '#2D3A2E' : '#7A867B', fontSize: 15 }}>
          {gender || 'Select Gender'}
        </Text>
      </TouchableOpacity>

      {genderDropdownVisible && (
        <View style={styles.dropdown}>
          {genderOptions.map(({ label, icon }) => (
            <TouchableOpacity
              key={label}
              style={styles.dropdownItem}
              onPress={() => onSelectGender(label)}
              accessibilityLabel={`Select gender ${label}`}
            >
              <View style={styles.genderOptionRow}>
                <IconSymbol name={icon} size={32} color="#687076" />
                <Text style={styles.dropdownItemText}>{label}</Text>
                {gender === label && (
                  <IconSymbol
                    name="checkmark.circle.fill"
                    size={24}
                    color="#8FB89C"
                    style={{ marginLeft: 'auto' }}
                  />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Growth Entries Section */}
      <Text style={styles.sectionTitle}>Growth Entries</Text>
      <View style={styles.growthEntriesContainer}>
        <FlatList
          data={growthData}
          keyExtractor={(_, index) => index.toString()}
          scrollEnabled={true}
          showsVerticalScrollIndicator={true}
          renderItem={({ item, index }) => (
            <View key={index} style={styles.growthRow}>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => openGrowthCalendar(index)}
                accessibilityLabel={`Select date for growth entry ${index + 1}`}
              >
                <IconSymbol name="calendar" size={16} color="#687076" />
                <Text style={styles.dateButtonText}>
                  {item.date || 'Select Date'}
                </Text>
              </TouchableOpacity>
              <TextInput
                style={styles.growthInput}
                placeholder="Weight (lbs)"
                keyboardType="numeric"
                value={item.weight}
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
                value={item.height}
                onChangeText={(text) => {
                  const newData = [...growthData];
                  newData[index].height = text;
                  setGrowthData(newData);
                }}
                accessibilityLabel={`Growth entry ${index + 1} height`}
              />
            </View>
          )}
        />
      </View>

      {/* Add Growth Entry */}
      <TouchableOpacity
        style={styles.addBtn}
        onPress={onAddGrowthEntry}
        activeOpacity={0.8}
        accessibilityLabel="Add new growth entry"
      >
        <Text style={styles.addBtnText}>+ Add Growth Entry</Text>
      </TouchableOpacity>

      {/* Save Button */}
      <TouchableOpacity
        style={styles.saveBtn}
        onPress={handleSave}
        activeOpacity={0.8}
        accessibilityLabel="Save baby profile"
      >
        <Text style={styles.saveBtnText}>Save</Text>
      </TouchableOpacity>

      {/* DOB Calendar Modal */}
      <Modal
        isVisible={dobModalVisible}
        onBackdropPress={() => setDobModalVisible(false)}
        style={styles.modal}
        animationIn="slideInUp"
        animationOut="slideOutDown"
      >
        <View style={styles.modalContent}>
          <Calendar
            current={tempDate || '2025-07-18'}
            onDayPress={onDobSelect}
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
            onPress={() => setDobModalVisible(false)}
            activeOpacity={0.8}
            accessibilityLabel="Close calendar"
          >
            <Text style={styles.modalButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Growth Date Calendar Modal */}
      <Modal
        isVisible={growthDateModalVisible}
        onBackdropPress={() => setGrowthDateModalVisible(false)}
        style={styles.modal}
        animationIn="slideInUp"
        animationOut="slideOutDown"
      >
        <View style={styles.modalContent}>
          <Calendar
            current={tempDate || '2025-07-18'}
            onDayPress={onGrowthDateSelect}
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
            onPress={() => setGrowthDateModalVisible(false)}
            activeOpacity={0.8}
            accessibilityLabel="Close calendar"
          >
            <Text style={styles.modalButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#F6F7F4',
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
    zIndex: 10,
  },
  backButtonText: {
    fontSize: 14,
    color: '#2D3A2E',
    marginLeft: 4,
    fontWeight: '500',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D3A2E',
    marginTop: 32,
    marginBottom: 16,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    color: '#7A867B',
    marginBottom: 4,
  },
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
    justifyContent: 'center',
  },
  dropdown: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#C5D7BD',
    marginBottom: 16,
    paddingVertical: 4,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  dropdownItemText: {
    fontSize: 15,
    color: '#2D3A2E',
  },
  genderOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3A2E',
    marginVertical: 12,
  },
  growthEntriesContainer: {
    maxHeight: 320, // Fixed height for scroll inside this section
  },
  growthRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
    backgroundColor: '#E9F2EC',
    borderRadius: 10,
    padding: 8,
  },
  dateButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#C5D7BD',
    borderRadius: 12,
    padding: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  dateButtonText: {
    fontSize: 13,
    color: '#2D3A2E',
    marginLeft: 8,
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
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: '#E9F2EC',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    padding: 16,
  },
  modalButton: {
    backgroundColor: '#8FB89C',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  modalButtonText: {
    color: '#2D3A2E',
    fontSize: 14,
    fontWeight: 'bold',
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
  addBtnText: {
    fontSize: 15,
    color: '#2D3A2E',
    fontWeight: '600',
  },
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
  saveBtnText: {
    color: '#2D3A2E',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
