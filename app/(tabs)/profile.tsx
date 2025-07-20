import React, { useState } from 'react';
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
} from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const router = useRouter();
  const [rateModalVisible, setRateModalVisible] = useState(false);
  const [rating, setRating] = useState(0);

  // Open default email app with predefined email address
  const openEmail = () => {
    const email = 'support@example.com';
    const subject = 'App Support Request';
    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}`;
    Linking.openURL(mailtoUrl).catch(() => {
      alert('Failed to open email client.');
    });
  };

  // Handle logout: navigate to login page
  const handleLogout = () => {
    // You can clear auth tokens here if any
    router.push('/auth/login'); // Replace current screen with login screen
  };

  // Handle rating star press
  const onStarPress = (star: number) => setRating(star);

  // Submit rating (can extend to send to backend)
  const submitRating = () => {
    alert(`Thanks for rating us ${rating} star${rating > 1 ? 's' : ''}!`);
    setRateModalVisible(false);
    setRating(0);
  };

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
          <View style={styles.profileRow}>
            <Image
              source={{ uri: 'https://randomuser.me/api/portraits/med/baby/1.jpg' }}
              style={styles.avatar}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>Emma</Text>
              <Text style={styles.subText}>4 months, 5 days old</Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Date of Birth</Text>
            <Text style={styles.infoValue}>March 12, 2025</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Age</Text>
            <Text style={styles.infoValue}>4 months, 5 days</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Gender</Text>
            <Text style={styles.infoValue}>Female</Text>
          </View>
        </View>

        {/* Latest Growth Section */}
        <View style={styles.growthSection}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <IconSymbol name="arrow.forward" size={18} color="#2D3A2E" />
            <Text style={styles.growthTitle}>Latest Growth</Text>
          </View>
          <View style={styles.growthRow}>
            <Text style={styles.growthLabel}>Weight:</Text>
            <Text style={styles.growthValue}>14.2 lbs</Text>
          </View>
          <View style={styles.growthRow}>
            <Text style={styles.growthLabel}>Height:</Text>
            <Text style={styles.growthValue}>24.5 in</Text>
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
        </View>

        {/* Support */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          {/* Removed Help Center */}
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
    backgroundColor: '#F6F7F4',
    paddingTop: 72,
    paddingBottom: 56,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    marginHorizontal: 0,
    borderBottomWidth: 8,
    borderBottomColor: '#E9F2EC',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: { fontSize: 15, fontWeight: 'bold', color: '#2D3A2E' },
  editText: { color: '#7A867B', fontSize: 14 },
  profileRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
    backgroundColor: '#C5D7BD',
  },
  name: { fontSize: 16, fontWeight: 'bold', color: '#2D3A2E' },
  subText: { fontSize: 13, color: '#7A867B', marginTop: 2 },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  infoLabel: { color: '#7A867B', fontSize: 14 },
  infoValue: { color: '#2D3A2E', fontSize: 14, fontWeight: '500' },
  profileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E9F2EC',
    paddingHorizontal: 4,
  },
  profileItemText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    color: '#2D3A2E',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E9F2EC',
    borderRadius: 8,
    paddingVertical: 16,
    justifyContent: 'center',
    margin: 16,
    marginBottom: 32,
  },
  logoutBtnText: {
    color: '#2D3A2E',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  growthSection: {
    backgroundColor: '#E9F2EC',
    borderRadius: 10,
    padding: 12,
    marginTop: 16,
  },
  growthTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#2D3A2E',
  },
  growthRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  growthLabel: { color: '#7A867B', fontSize: 14 },
  growthValue: { color: '#2D3A2E', fontSize: 14, fontWeight: '500' },
  growthBtnRow: { flexDirection: 'row', gap: 8, marginTop: 10 },
  growthBtnOutline: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#2D3A2E',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginLeft: 4,
  },
  growthBtnOutlineText: {
    color: '#2D3A2E',
    fontSize: 14,
    fontWeight: 'bold',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#2D3A2E',
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
    backgroundColor: '#8FB89C',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalCancelButton: {
    backgroundColor: '#D0D6CD',
  },
  modalButtonText: {
    color: '#2D3A2E',
    fontWeight: 'bold',
    fontSize: 15,
  },
  modalButtonDisabled: {
    opacity: 0.6,
  },
});
