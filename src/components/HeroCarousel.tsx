import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Card, Text, Button } from 'react-native-paper';
import Carousel from 'react-native-snap-carousel';

const { width: screenWidth } = Dimensions.get('window');

const carouselItems = [
  {
    id: 'special1',
    title: 'Weekend Special: Family Feast',
    description: 'Get 20% off on family-size portions',
    price: 999,
    image: require('../../assets/images/family-feast.jpg'),
  },
  // Add more items...
];

export default function HeroCarousel() {
  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Cover source={item.image} style={styles.image} />
      <Card.Content>
        <Text variant="titleLarge">{item.title}</Text>
        <Text variant="bodyMedium">{item.description}</Text>
        <Text variant="titleLarge" style={styles.price}>₹{item.price}</Text>
      </Card.Content>
      <Card.Actions>
        <Button mode="contained">Order Now</Button>
      </Card.Actions>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Carousel
        data={carouselItems}
        renderItem={renderItem}
        sliderWidth={screenWidth}
        itemWidth={screenWidth - 48}
        autoplay
        loop
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  card: {
    margin: 8,
  },
  image: {
    height: 200,
  },
  price: {
    marginTop: 8,
    color: '#2ecc71',
  },
});