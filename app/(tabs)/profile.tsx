import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  Linking,
  Modal,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native'; // make sure react-navigation/native is installed
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useRouter } from 'expo-router';

function calculateAge(dobStr: string) {
  if (!dobStr) return '';
  const dob = new Date(dobStr);
  const now = new Date();
  let years = now.getFullYear() - dob.getFullYear();
  let months = now.getMonth() - dob.getMonth();
  let days = now.getDate() - dob.getDate();

  if (days < 0) {
    months--;
    days += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
  }
  if (months < 0) {
    years--;
    months += 12;
  }

  let ageStr = '';
  if (years > 0) ageStr += `${years} year${years > 1 ? 's' : ''}, `;
  if (months > 0) ageStr += `${months} month${months > 1 ? 's' : ''}, `;
  ageStr += `${days} day${days !== 1 ? 's' : ''} old`;
  return ageStr;
}

export default function ProfileScreen() {
  const router = useRouter();
  const [rateModalVisible, setRateModalVisible] = useState(false);
  const [rating, setRating] = useState(0);
  const [babyProfile, setBabyProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchBabyProfile = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://192.168.1.9:3000/baby-profile'); // Replace with your real API
      if (!response.ok) throw new Error('Failed to fetch baby profile');
      const json = await response.json();
      setBabyProfile(json.data);
    } catch (error) {
      alert('Error loading baby profile');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchBabyProfile();
    }, [])
  );

  const openEmail = () => {
    const email = 'support@example.com';
    const subject = 'App Support Request';
    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}`;
    Linking.openURL(mailtoUrl).catch(() => {
      alert('Failed to open email client.');
    });
  };

  const handleLogout = () => {
    router.push('/auth/login');
  };

  const onStarPress = (star: number) => setRating(star);

  const submitRating = () => {
    alert(`Thanks for rating us ${rating} star${rating > 1 ? 's' : ''}!`);
    setRateModalVisible(false);
    setRating(0);
  };

  // Get latest growth data (last item in growthData array)
  const latestGrowth =
    babyProfile?.growthData && babyProfile.growthData.length > 0
      ? babyProfile.growthData[babyProfile.growthData.length - 1]
      : null;

  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Baby Information */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Baby Information</Text>
            <TouchableOpacity
              accessibilityLabel="Edit baby information"
              onPress={() => router.push('/(screens)/edit-baby')}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}
            >
              <IconSymbol name="pencil" size={16} color="#7A867B" />
              <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#3B322C" />
          ) : babyProfile ? (
            <>
              <View style={styles.profileRow}>
                <Image
                  source={{ uri: 'https://randomuser.me/api/portraits/med/baby/1.jpg' }}
                  style={styles.avatar}
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.name}>Baby</Text>
                  <Text style={styles.subText}>{calculateAge(babyProfile.dob)}</Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Date of Birth</Text>
                <Text style={styles.infoValue}>
                  {new Date(babyProfile.dob).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Age</Text>
                <Text style={styles.infoValue}>{calculateAge(babyProfile.dob)}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Gender</Text>
                <Text style={styles.infoValue}>{babyProfile.gender}</Text>
              </View>
            </>
          ) : (
            <Text style={{ color: '#867E76' }}>No baby profile found.</Text>
          )}
        </View>

        {/* Latest Growth Section */}
        <View style={styles.growthSection}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <IconSymbol name="arrow.forward" size={18} color="#2D3A2E" />
            <Text style={styles.growthTitle}>Latest Growth</Text>
          </View>

          {loading ? (
            <ActivityIndicator size="small" color="#3B322C" />
          ) : latestGrowth ? (
            <>
              <View style={styles.growthRow}>
                <Text style={styles.growthLabel}>Weight:</Text>
                <Text style={styles.growthValue}>{latestGrowth.weight} lbs</Text>
              </View>
              <View style={styles.growthRow}>
                <Text style={styles.growthLabel}>Height:</Text>
                <Text style={styles.growthValue}>{latestGrowth.height} in</Text>
              </View>
              <View style={styles.growthRow}>
                <Text style={styles.growthLabel}>Date:</Text>
                <Text style={styles.growthValue}>
                  {new Date(latestGrowth.date).toLocaleDateString()}
                </Text>
              </View>
              <View style={styles.growthBtnRow}>
                <TouchableOpacity
                  style={styles.growthBtnOutline}
                  onPress={() => router.push('/(screens)/growth-chart')}
                  accessibilityLabel="View growth chart"
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <IconSymbol name="chart.bar.fill" size={16} color="#2D3A2E" />
                    <Text style={styles.growthBtnOutlineText}>View Growth Chart</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <Text style={{ color: '#867E76' }}>No growth data found.</Text>
          )}
        </View>

        {/* Support */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <ProfileItem icon="mail" label="Contact Support" onPress={openEmail} />
          <ProfileItem icon="star" label="Rate App" onPress={() => setRateModalVisible(true)} />
        </View>

        {/* Logout */}
        <TouchableOpacity
          style={styles.logoutBtn}
          accessibilityLabel="Logout"
          onPress={handleLogout}
        >
          <Text style={styles.logoutBtnText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Rate App Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={rateModalVisible}
        onRequestClose={() => setRateModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Rate App</Text>
            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                  key={star}
                  onPress={() => onStarPress(star)}
                  accessibilityLabel={`Rate ${star} star${star > 1 ? 's' : ''}`}
                >
                  <IconSymbol
                    name={star <= rating ? 'star' : 'star-outline'}
                    size={32}
                    color="#F2B01E"
                  />
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.modalButtonsRow}>
              <Pressable
                style={[styles.modalButton, styles.modalCancelButton]}
                onPress={() => setRateModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, rating === 0 && styles.modalButtonDisabled]}
                onPress={submitRating}
                disabled={rating === 0}
              >
                <Text style={styles.modalButtonText}>Submit</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

function ProfileItem({
  icon,
  label,
  onPress,
}: {
  icon: string;
  label: string;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity
      style={styles.profileItem}
      accessibilityLabel={`Navigate to ${label}`}
      onPress={onPress}
    >
      <IconSymbol name={icon} size={18} color="#687076" />
      <Text style={styles.profileItemText}>{label}</Text>
      <IconSymbol name="chevron.right" size={18} color="#7A867B" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 0,
    backgroundColor: '#F9F9F7',
    paddingTop: 72,
    paddingBottom: 56,
  },
  section: {
    backgroundColor: '#FAF7F2',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    marginHorizontal: 0,
    borderBottomWidth: 8,
    borderBottomColor: '#E5DDD3',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: { fontSize: 15, fontWeight: 'bold', color: '#3B322C' },
  editText: { color: '#867E76', fontSize: 14 },
  profileRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
    backgroundColor: '#E0DAD3',
  },
  name: { fontSize: 16, fontWeight: 'bold', color: '#3B322C' },
  subText: { fontSize: 13, color: '#867E76', marginTop: 2 },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  infoLabel: { color: '#867E76', fontSize: 14 },
  infoValue: { color: '#3B322C', fontSize: 14, fontWeight: '500' },
  profileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E5DDD3',
    paddingHorizontal: 4,
  },
  profileItemText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    color: '#3B322C',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5EDE1',
    borderRadius: 8,
    paddingVertical: 16,
    justifyContent: 'center',
    margin: 16,
    marginBottom: 32,
  },
  logoutBtnText: {
    color: '#3B322C',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  growthSection: {
    backgroundColor: '#F5EDE1',
    borderRadius: 10,
    padding: 12,
    marginTop: 16,
  },
  growthTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#3B322C',
  },
  growthRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  growthLabel: { color: '#867E76', fontSize: 14 },
  growthValue: { color: '#3B322C', fontSize: 14, fontWeight: '500' },
  growthBtnRow: { flexDirection: 'row', gap: 8, marginTop: 10 },
  growthBtnOutline: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#3B322C',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginLeft: 4,
  },
  growthBtnOutlineText: {
    color: '#3B322C',
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#FAF7F2',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#3B322C',
  },
  starsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 24,
  },
  modalButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    backgroundColor: '#D3BFA4',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalCancelButton: {
    backgroundColor: '#E0DAD3',
  },
  modalButtonText: {
    color: '#3B322C',
    fontWeight: 'bold',
    fontSize: 15,
  },
  modalButtonDisabled: {
    opacity: 0.6,
  },
});
