import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Card, Text, Button, useTheme } from 'react-native-paper';
import { useCart } from '../context/CartContext';
import { pickles, cookedFood, vegetables } from '../data/products';

const categoryMap = {
  pickles: { title: 'Pickles', data: pickles },
  'cooked-food': { title: 'Cooked Food', data: cookedFood },
  vegetables: { title: 'Vegetables', data: vegetables },
};

export default function CategoryScreen({ route }) {
  const { category } = route.params;
  const { addItem } = useCart();
  const theme = useTheme();

  const categoryData = categoryMap[category];

  if (!categoryData) {
    return (
      <View style={styles.container}>
        <Text>Category not found</Text>
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Cover source={{ uri: item.image }} style={styles.image} />
      <Card.Content>
        <Text variant="titleLarge">{item.name}</Text>
        <Text variant="bodyMedium">{item.description}</Text>
        <Text variant="titleLarge" style={[styles.price, { color: theme.colors.primary }]}>
          ₹{item.price}
        </Text>
      </Card.Content>
      <Card.Actions>
        <Button 
          mode="contained" 
          onPress={() => addItem({
            id: item.id,
            name: item.name,
            price: item.price
          })}
        >
          Add to Cart
        </Button>
      </Card.Actions>
    </Card>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={categoryData.data}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  list: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  image: {
    height: 200,
  },
  price: {
    marginTop: 8,
  },
});