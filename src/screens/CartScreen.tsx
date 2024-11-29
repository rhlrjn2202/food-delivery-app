import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Text, Button, TextInput, HelperText, useTheme } from 'react-native-paper';
import { useCart } from '../context/CartContext';
import { verifyPincode } from '../services/orderService';

const MINIMUM_ORDER_VALUE = 200;

export default function CartScreen() {
  const { items, removeItem, subtotal, deliveryFee, total } = useCart();
  const [pincode, setPincode] = useState('');
  const [pincodeError, setPincodeError] = useState('');
  const [isPincodeVerified, setIsPincodeVerified] = useState(false);
  const theme = useTheme();

  const handlePincodeChange = async (value: string) => {
    setPincode(value);
    if (value.length === 6) {
      try {
        const isAvailable = await verifyPincode(value);
        setIsPincodeVerified(isAvailable);
        setPincodeError(isAvailable ? '' : 'Delivery not available in this area');
      } catch (err) {
        setPincodeError('Failed to verify pincode');
        setIsPincodeVerified(false);
      }
    } else {
      setIsPincodeVerified(false);
      setPincodeError('');
    }
  };

  if (items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text>Your cart is empty</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {items.map(item => (
        <Card key={item.id} style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium">{item.name}</Text>
            <View style={styles.itemDetails}>
              <Text>Quantity: {item.quantity}</Text>
              <Text>₹{item.price * item.quantity}</Text>
            </View>
          </Card.Content>
          <Card.Actions>
            <Button onPress={() => removeItem(item.id)}>Remove</Button>
          </Card.Actions>
        </Card>
      ))}

      <Card style={styles.summaryCard}>
        <Card.Content>
          <Text variant="titleMedium">Order Summary</Text>
          <View style={styles.summaryItem}>
            <Text>Subtotal:</Text>
            <Text>₹{subtotal}</Text>
          </View>
          {deliveryFee > 0 && (
            <>
              <View style={styles.summaryItem}>
                <Text>Delivery Fee:</Text>
                <Text style={{ color: theme.colors.error }}>₹{deliveryFee}</Text>
              </View>
              <Text style={styles.minOrderText}>
                Add items worth ₹{MINIMUM_ORDER_VALUE - subtotal} more for free delivery
              </Text>
            </>
          )}
          <View style={[styles.summaryItem, styles.totalRow]}>
            <Text variant="titleMedium">Total:</Text>
            <Text variant="titleMedium">₹{total}</Text>
          </View>

          <TextInput
            label="Pincode"
            value={pincode}
            onChangeText={handlePincodeChange}
            keyboardType="number-pad"
            maxLength={6}
            style={styles.input}
          />
          {pincodeError ? (
            <HelperText type="error">{pincodeError}</HelperText>
          ) : isPincodeVerified && (
            <HelperText type="info">Delivery available in your area</HelperText>
          )}

          <Button
            mode="contained"
            onPress={() => {}}
            disabled={!isPincodeVerified}
            style={styles.checkoutButton}
          >
            Proceed to Checkout
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    marginBottom: 8,
  },
  itemDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  summaryCard: {
    marginTop: 16,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e1e1e1',
  },
  minOrderText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  input: {
    marginTop: 16,
  },
  checkoutButton: {
    marginTop: 16,
  },
});