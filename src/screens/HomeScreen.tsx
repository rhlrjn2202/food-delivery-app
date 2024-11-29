import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { Text, Card, Button, useTheme } from 'react-native-paper';
import { useCart } from '../context/CartContext';
import HeroCarousel from '../components/HeroCarousel';
import CategoryList from '../components/CategoryList';
import ProductList from '../components/ProductList';

export default function HomeScreen({ navigation }) {
  const theme = useTheme();
  const { addItem } = useCart();

  return (
    <ScrollView style={styles.container}>
      <HeroCarousel />
      
      <View style={styles.section}>
        <Text variant="headlineMedium" style={styles.sectionTitle}>
          Categories
        </Text>
        <CategoryList onPress={(category) => navigation.navigate('Category', { category })} />
      </View>

      <View style={styles.section}>
        <Text variant="headlineMedium" style={styles.sectionTitle}>
          Featured Items
        </Text>
        <ProductList 
          products={featuredItems}
          onAddToCart={addItem}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    marginBottom: 16,
    fontWeight: 'bold',
  },
});