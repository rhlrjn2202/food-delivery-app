import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Button, 
  Box,
  Fade,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { useCart } from '../context/CartContext';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
}

interface ProductSectionProps {
  title: string;
  products: Product[];
}

const categoryUrlMap: { [key: string]: string } = {
  'Pickles': 'pickles',
  'Cooked Food': 'cooked-food',
  'Vegetables': 'vegetables'
};

export default function ProductSection({ title, products }: ProductSectionProps) {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const displayProducts = products.slice(0, 3);

  const handleViewMore = () => {
    const categoryUrl = categoryUrlMap[title];
    if (categoryUrl) {
      navigate(`/category/${categoryUrl}`);
    }
  };

  return (
    <Box sx={{ mb: 8 }}>
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 4,
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? 2 : 0,
        }}
      >
        <Typography 
          variant="h4" 
          component="h2"
          sx={{
            fontWeight: 600,
            background: `linear-gradient(120deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
          }}
        >
          {title}
        </Typography>
        {products.length > 3 && (
          <Button 
            variant="outlined" 
            onClick={handleViewMore}
            sx={{
              minWidth: isMobile ? '100%' : 'auto',
            }}
          >
            View More
          </Button>
        )}
      </Box>
      
      <Grid container spacing={3}>
        {displayProducts.map((product, index) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <Fade in={true} timeout={500 + index * 100}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={product.image}
                  alt={product.name}
                  sx={{
                    backgroundColor: 'grey.100',
                    objectFit: 'cover',
                  }}
                />
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Typography 
                    gutterBottom 
                    variant="h5" 
                    component="h2"
                    sx={{ 
                      fontWeight: 600,
                      mb: 1,
                    }}
                  >
                    {product.name}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ mb: 2, flexGrow: 1 }}
                  >
                    {product.description}
                  </Typography>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    mt: 'auto',
                  }}>
                    <Typography 
                      variant="h6" 
                      color="primary"
                      sx={{ fontWeight: 600 }}
                    >
                      ₹{product.price}
                    </Typography>
                    <Button 
                      variant="contained" 
                      startIcon={<AddShoppingCartIcon />}
                      onClick={() => {
                        addItem({
                          id: product.id,
                          name: product.name,
                          price: product.price
                        });
                      }}
                      sx={{
                        '&:hover': {
                          transform: 'scale(1.05)',
                        },
                      }}
                    >
                      Add to Cart
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Fade>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}