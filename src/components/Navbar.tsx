import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Box,
  Container,
  useScrollTrigger,
  Slide,
  Button,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import CartSidebar from './CartSidebar';

interface Props {
  window?: () => Window;
  children: React.ReactElement;
}

function HideOnScroll(props: Props) {
  const { children, window } = props;
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
  });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

export default function Navbar() {
  const { items } = useCart();
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <HideOnScroll>
        <AppBar position="sticky" color="default">
          <Container maxWidth="lg">
            <Toolbar disableGutters>
              <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                <RestaurantIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography
                  variant="h6"
                  component={RouterLink}
                  to="/"
                  sx={{
                    textDecoration: 'none',
                    color: 'text.primary',
                    fontWeight: 600,
                    letterSpacing: '-0.5px',
                    '&:hover': {
                      color: 'primary.main',
                    },
                  }}
                >
                  Food Delivery
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {isAuthenticated ? (
                  <>
                    <Typography variant="body2" color="text.secondary">
                      Hello, {user?.name}
                    </Typography>
                    <Button onClick={handleLogout} color="inherit">
                      Logout
                    </Button>
                  </>
                ) : (
                  <Button
                    component={RouterLink}
                    to="/auth"
                    color="inherit"
                  >
                    Login
                  </Button>
                )}
                <IconButton
                  color="inherit"
                  onClick={() => setIsCartOpen(true)}
                  sx={{
                    '&:hover': {
                      backgroundColor: 'primary.light',
                      '& .MuiSvgIcon-root': {
                        color: 'white',
                      },
                    },
                  }}
                >
                  <Badge
                    badgeContent={itemCount}
                    color="secondary"
                    sx={{
                      '& .MuiBadge-badge': {
                        fontSize: 10,
                        height: 16,
                        minWidth: 16,
                      },
                    }}
                  >
                    <ShoppingCartIcon />
                  </Badge>
                </IconButton>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
      </HideOnScroll>
      <CartSidebar open={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}