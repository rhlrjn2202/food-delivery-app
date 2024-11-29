import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Badge, IconButton } from 'react-native-paper';
import { useCart } from '../context/CartContext';

export default function CartBadge() {
  const { items } = useCart();
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <View>
      <IconButton icon="cart" onPress={() => {}} />
      {itemCount > 0 && (
        <Badge style={styles.badge}>{itemCount}</Badge>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: 5,
    right: 5,
  },
});