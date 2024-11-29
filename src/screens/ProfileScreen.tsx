import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Avatar, Button, Card, Text } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content style={styles.content}>
          <Avatar.Text 
            size={80} 
            label={user?.name?.charAt(0) || 'U'} 
            style={styles.avatar}
          />
          <Text variant="headlineSmall" style={styles.name}>
            {user?.name}
          </Text>
          <Text variant="bodyLarge" style={styles.email}>
            {user?.email}
          </Text>
        </Card.Content>
      </Card>

      <Button 
        mode="contained" 
        onPress={logout}
        style={styles.logoutButton}
      >
        Logout
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f6fa',
  },
  card: {
    marginBottom: 16,
  },
  content: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  avatar: {
    marginBottom: 16,
  },
  name: {
    marginBottom: 4,
  },
  email: {
    color: '#666',
  },
  logoutButton: {
    marginTop: 'auto',
  },
});