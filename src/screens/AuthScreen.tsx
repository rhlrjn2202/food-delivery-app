import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Text, Surface, SegmentedButtons } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';

export default function AuthScreen() {
  const [mode, setMode] = useState('login');
  const [error, setError] = useState('');
  const auth = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = async () => {
    try {
      setError('');
      if (mode === 'signup') {
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          return;
        }
        await auth.signup(formData.name, formData.email, formData.password);
      } else {
        await auth.login(formData.email, formData.password);
      }
    } catch (err) {
      setError(mode === 'login' ? 'Invalid credentials' : 'Failed to create account');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Surface style={styles.surface}>
        <SegmentedButtons
          value={mode}
          onValueChange={setMode}
          buttons={[
            { value: 'login', label: 'Login' },
            { value: 'signup', label: 'Sign Up' },
          ]}
          style={styles.segmentedButton}
        />

        {error && (
          <Text style={styles.error}>{error}</Text>
        )}

        {mode === 'signup' && (
          <TextInput
            label="Name"
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
            style={styles.input}
          />
        )}

        <TextInput
          label="Email"
          value={formData.email}
          onChangeText={(text) => setFormData({ ...formData, email: text })}
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />

        <TextInput
          label="Password"
          value={formData.password}
          onChangeText={(text) => setFormData({ ...formData, password: text })}
          secureTextEntry
          style={styles.input}
        />

        {mode === 'signup' && (
          <TextInput
            label="Confirm Password"
            value={formData.confirmPassword}
            onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
            secureTextEntry
            style={styles.input}
          />
        )}

        <Button
          mode="contained"
          onPress={handleSubmit}
          style={styles.button}
        >
          {mode === 'login' ? 'Login' : 'Sign Up'}
        </Button>
      </Surface>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    justifyContent: 'center',
  },
  surface: {
    padding: 16,
    borderRadius: 8,
    elevation: 4,
  },
  segmentedButton: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 12,
  },
  button: {
    marginTop: 8,
  },
  error: {
    color: 'red',
    marginBottom: 16,
    textAlign: 'center',
  },
});