import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Image } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function ProfileScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Baby Information */}
      <View style={styles.section}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Baby Information</Text>
          <TouchableOpacity>
            <Text style={styles.editText}>✎ Edit</Text>
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

      {/* Caregiver Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Caregiver Information</Text>
        <View style={styles.profileRow}>
          <Image
            source={{ uri: 'https://randomuser.me/api/portraits/med/baby/1.jpg' }}
            style={styles.avatar}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>Sarah Johnson</Text>
            <Text style={styles.subText}>Primary Caregiver</Text>
          </View>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Email</Text>
          <Text style={styles.infoValue}>sarah.johnson@email.com</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Member Since</Text>
          <Text style={styles.infoValue}>January 2025</Text>
        </View>
        <TouchableOpacity style={styles.editProfileBtn}>
          <IconSymbol name="person.crop.circle" size={18} color="#687076" />
          <Text style={styles.editProfileBtnText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      {/* App Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App Settings</Text>
        <ProfileItem icon="bell" label="Notifications" />
        <ProfileItem icon="arrow.down.to.line" label="Export Data" />
        <ProfileItem icon="shield" label="Privacy & Security" />
      </View>

      {/* Support */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
        <ProfileItem icon="questionmark.circle" label="Help Center" />
        <ProfileItem icon="envelope" label="Contact Support" />
        <ProfileItem icon="star" label="Rate App" />
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutBtn}>
        <IconSymbol name="arrow.right.square" size={20} color="#687076" />
        <Text style={styles.logoutBtnText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function ProfileItem({ icon, label }: { icon: string; label: string }) {
  return (
    <TouchableOpacity style={styles.profileItem}>
      <IconSymbol name={icon} size={18} color="#687076" />
      <Text style={styles.profileItemText}>{label}</Text>
      <IconSymbol name="chevron.right" size={18} color="#D1D5DB" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { padding: 0, backgroundColor: '#fff', paddingTop: 72, paddingBottom: 56  },
  section: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 16, marginHorizontal: 0, borderBottomWidth: 8, borderBottomColor: '#F7F8F9' },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  sectionTitle: { fontSize: 15, fontWeight: 'bold', color: '#11181C' },
  editText: { color: '#687076', fontSize: 14 },
  profileRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  avatar: { width: 48, height: 48, borderRadius: 24, marginRight: 12, backgroundColor: '#ECEDEE' },
  name: { fontSize: 16, fontWeight: 'bold', color: '#11181C' },
  subText: { fontSize: 13, color: '#687076', marginTop: 2 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  infoLabel: { color: '#687076', fontSize: 14 },
  infoValue: { color: '#11181C', fontSize: 14, fontWeight: '500' },
  editProfileBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F7F8F9', borderRadius: 8, paddingVertical: 10, justifyContent: 'center', marginTop: 12 },
  editProfileBtnText: { color: '#687076', fontSize: 15, fontWeight: 'bold', marginLeft: 6 },
  profileItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F1F1F1', paddingHorizontal: 4 },
  profileItemText: { flex: 1, marginLeft: 12, fontSize: 15, color: '#11181C' },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F7F8F9', borderRadius: 8, paddingVertical: 16, justifyContent: 'center', margin: 16, marginBottom: 32 },
  logoutBtnText: { color: '#687076', fontSize: 16, fontWeight: 'bold', marginLeft: 8 },
});