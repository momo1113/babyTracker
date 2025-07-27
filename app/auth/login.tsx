import { useRouter } from 'expo-router';
import React, {useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebaseConfig'; // adjust path if different
import { useBanner } from '@/context/BannerContext';

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const {setMessage: setBannerMessage } = useBanner();
  const router = useRouter();

  const handlePress = async () => {

  if (!email || !password) {
    alert('Please enter email and password');
    return;
  }

    setLoading(true);

  try {
    if (isLogin) {
      // Login
      await signInWithEmailAndPassword(auth, email, password);

      // After login, check if baby profile exists
      const user = auth.currentUser;
      if (!user) throw new Error('User not authenticated');

      const token = await user.getIdToken();
      const response = await fetch('http://192.168.1.9:3000/baby-profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        // Profile not found or error
        // Show banner and redirect to signup page
        setBannerMessage("You haven't completed signup yet. Please finish your profile.");
        router.replace('/auth/signup');
        return;
      }

      const data = await response.json();

      if (!data || !data.name || !data.dob) {
        // Profile incomplete
        setBannerMessage("You haven't completed signup yet. Please finish your profile.");
        router.replace('/auth/signup');
        return;
      }

      // Profile complete, go to home page
      router.replace('/(tabs)/home');
    } else {
      // Sign up
      await createUserWithEmailAndPassword(auth, email, password);
      router.replace('/auth/signup'); // redirect to baby info form
    }
  } catch (error: any) {
    alert(error.message);
  }
   finally {
    setLoading(false);
  }
};

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.logoCircle}>
        <Text style={styles.logoIcon}>👶</Text>
      </View>

      <Text style={styles.title}>{isLogin ? 'Welcome Back' : 'Create Account'}</Text>
      <Text style={styles.subtitle}>
        {isLogin
          ? 'Log in to track your baby’s feedings, diapers, and more.'
          : 'Sign up to start tracking your baby’s activities.'}
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#687076"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#687076"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.actionBtn} onPress={handlePress} disabled={loading}>
        <Text style={styles.actionBtnText}>
          {loading ? 'Please wait...' : isLogin ? 'Log In' : 'Sign Up'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
        <Text style={styles.switchText}>
          {isLogin
            ? "Don't have an account? Sign up"
            : 'Already have an account? Log in'}
        </Text>
      </TouchableOpacity>

      <View style={styles.dividerRow}>
        <View style={styles.divider} />
        <Text style={styles.dividerText}>or</Text>
        <View style={styles.divider} />
      </View>

      <TouchableOpacity style={styles.socialBtn}>
        <Text style={styles.socialBtnText}>Continue with Google</Text>
      </TouchableOpacity>

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