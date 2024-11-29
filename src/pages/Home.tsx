import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, CircularProgress, Alert, Button } from '@mui/material';
import { useCart } from '../context/CartContext';
import HeroSlider from '../components/HeroSlider';
import ProductSection from '../components/ProductSection';
import { api } from '../services/api';
import type { Category } from '../services/api/endpoints/categories';
import type { Product } from '../services/api/endpoints/products';

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [categoriesData, productsData] = await Promise.all([
          api.categories.getAll(),
          api.products.getAll()
        ]);

        setCategories(categoriesData);
        setProducts(productsData);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load content';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '60vh' 
      }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert 
          severity="error" 
          sx={{ maxWidth: 600, mx: 'auto' }}
          action={
            <Button color="inherit" size="small" onClick={() => window.location.reload()}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      </Box>
    );
  }

  const getProductsByCategory = (categoryName: string) => {
    return products.filter(product => product.category_name === categoryName);
  };

  return (
    <Box>
      <HeroSlider />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {categories.map(category => (
          <ProductSection
            key={category.id}
            title={category.name}
            products={getProductsByCategory(category.name)}
          />
        ))}
      </Container>
    </Box>
  );
}