import React from 'react';
import { useNavigate } from 'react-router-dom';
import Carousel from 'react-material-ui-carousel';
import { Paper, Button, Typography, Box } from '@mui/material';
import { useCart } from '../context/CartContext';

interface SlideItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

const items: SlideItem[] = [
  {
    id: 'special1',
    name: 'Weekend Special: Family Feast',
    description: 'Get 20% off on family-size portions of our signature dishes',
    price: 999,
    image: '/images/family-feast.jpg'
  },
  {
    id: 'special2',
    name: 'Chef\'s Special Thali',
    description: 'A complete meal with our chef\'s special selection',
    price: 449,
    image: '/images/special-thali.jpg'
  },
  {
    id: 'special3',
    name: 'Premium Dessert Collection',
    description: 'Indulge in our handcrafted dessert selection',
    price: 599,
    image: '/images/dessert-collection.jpg'
  }
];

export default function HeroSlider() {
  const navigate = useNavigate();
  const { addItem } = useCart();

  const handleOrder = (item: SlideItem) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price
    });
    navigate('/cart');
  };

  return (
    <Carousel
      animation="slide"
      interval={5000}
      indicators={true}
      navButtonsAlwaysVisible={true}
      sx={{ minHeight: '400px' }}
    >
      {items.map((item) => (
        <Paper
          key={item.id}
          sx={{
            position: 'relative',
            height: '400px',
            backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${item.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              color: 'white',
              width: '80%',
            }}
          >
            <Typography variant="h3" component="h1" gutterBottom>
              {item.name}
            </Typography>
            <Typography variant="h5" gutterBottom>
              {item.description}
            </Typography>
            <Typography variant="h4" color="primary.main" gutterBottom>
              ₹{item.price}
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => handleOrder(item)}
              sx={{ mt: 2 }}
            >
              Order Now
            </Button>
          </Box>
        </Paper>
      ))}
    </Carousel>
  );
}