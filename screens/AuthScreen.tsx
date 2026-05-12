import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import { signInWithEmailPassword, signUpWithEmailPassword } from '../lib/supabase';

interface AuthScreenProps {
  onAuthSuccess: (userId: string) => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onAuthSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'signup' | 'login'>('signup');
  const [loading, setLoading] = useState(false);

  const validateCredentials = () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Missing credentials', 'Please enter both email and password.');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
        Alert.alert('Invalid email', 'Please enter a valid email address.');
        return false;
    }

    if (mode === 'signup' && password.length < 6) {
        Alert.alert('Weak password', 'Password must be at least 6 characters.');
        return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateCredentials()) {
      return;
    }

    setLoading(true);

    try {
      if (mode === 'signup') {
        const { data, error } = await signUpWithEmailPassword(email.trim(), password);
        if (error) throw error;
        const userId = data.user?.id;
        if (!userId) throw new Error('Unable to create account.');

        onAuthSuccess(userId);
        Alert.alert('Account created', 'Your account has been created successfully.');
      } else {
        const { data, error } = await signInWithEmailPassword(email.trim(), password);
        if (error) throw error;
        const userId = data.user?.id;
        if (!userId) throw new Error('Unable to sign in.');

        onAuthSuccess(userId);
      }
    } catch (error) {
        const message = error instanceof Error
        ? error.message
        : '';

        // duplicate accounts
        if (message.toLowerCase().includes('user already registered')) {
            Alert.alert(
            'Account already exists',
            'An account with this email already exists. Would you like to log in instead?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Log In', onPress: () => setMode('login') }, // 👈 switch to login for them
            ]
        );
        } else {
            Alert.alert('Authentication failed', message || 'An unexpected error occurred.');
        }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{mode === 'signup' ? 'Create an Account' : 'Log In'}</Text>
      <Text style={styles.subtitle}>Use your email and password to access the app.</Text>

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="your@email.com"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        autoComplete="email"
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        autoCapitalize="none"
        autoComplete="password"
      />

      <View style={styles.buttonContainer}>
        <Button
          title={loading ? 'Please wait...' : mode === 'signup' ? 'Create Account' : 'Log In'}
          onPress={handleSubmit}
          disabled={loading}
        />
      </View>

      <TouchableOpacity onPress={() => setMode(mode === 'signup' ? 'login' : 'signup')} style={styles.switchRow}>
        <Text style={styles.switchText}>
          {mode === 'signup'
            ? 'Already have an account? Log in'
            : "Don't have an account? Create one"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#111111',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
    color: '#555555',
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    color: '#333333',
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#dddddd',
    borderRadius: 10,
    padding: 14,
    marginBottom: 18,
    backgroundColor: '#fafafa',
  },
  buttonContainer: {
    marginTop: 8,
    marginBottom: 20,
  },
  switchRow: {
    alignItems: 'center',
    marginTop: 16,
  },
  switchText: {
    color: '#007AFF',
    fontWeight: '600',
  },
});

export default AuthScreen;
