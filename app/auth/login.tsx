import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Logo */}
      <View style={styles.logoCircle}>
        {/* Replace with your logo or icon */}
        <Text style={styles.logoIcon}>👶</Text>
      </View>

      <Text style={styles.title}>{isLogin ? 'Welcome Back' : 'Create Account'}</Text>
      <Text style={styles.subtitle}>
        {isLogin
          ? 'Log in to track your baby’s feedings, diapers, and more.'
          : 'Sign up to start tracking your baby’s activities.'}
      </Text>

      {/* Email Input */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#687076"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      {/* Password Input */}
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#687076"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {/* Action Button */}
      <TouchableOpacity style={styles.actionBtn}>
        <Text style={styles.actionBtnText}>{isLogin ? 'Log In' : 'Sign Up'}</Text>
      </TouchableOpacity>

      {/* Switch Auth Mode */}
      <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
        <Text style={styles.switchText}>
          {isLogin
            ? "Don't have an account? Sign up"
            : 'Already have an account? Log in'}
        </Text>
      </TouchableOpacity>

      {/* Divider */}
      <View style={styles.dividerRow}>
        <View style={styles.divider} />
        <Text style={styles.dividerText}>or</Text>
        <View style={styles.divider} />
      </View>

      {/* Social Auth (placeholder) */}
      <TouchableOpacity style={styles.socialBtn}>
        <Text style={styles.socialBtnText}>Continue with Google</Text>
      </TouchableOpacity>

      {/* Privacy */}
      <Text style={styles.privacyText}>
        Your data stays private and secure
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', padding: 24 },
  logoCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#ECEDEE', alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  logoIcon: { fontSize: 40 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#11181C', marginBottom: 8 },
  subtitle: { fontSize: 15, color: '#687076', marginBottom: 24, textAlign: 'center' },
  input: { width: '100%', backgroundColor: '#F7F8F9', borderRadius: 10, padding: 14, fontSize: 16, color: '#11181C', marginBottom: 14 },
  actionBtn: { width: '100%', backgroundColor: '#11181C', borderRadius: 10, paddingVertical: 16, alignItems: 'center', marginBottom: 12 },
  actionBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  switchText: { color: '#687076', fontSize: 15, marginBottom: 18, marginTop: 2 },
  dividerRow: { flexDirection: 'row', alignItems: 'center', width: '100%', marginVertical: 12 },
  divider: { flex: 1, height: 1, backgroundColor: '#ECEDEE' },
  dividerText: { marginHorizontal: 8, color: '#687076', fontSize: 13 },
  socialBtn: { width: '100%', backgroundColor: '#F7F8F9', borderRadius: 10, paddingVertical: 14, alignItems: 'center', marginBottom: 18 },
  socialBtnText: { color: '#11181C', fontSize: 15, fontWeight: 'bold' },
  privacyText: { color: '#687076', fontSize: 13, textAlign: 'center', marginTop: 24 },
});