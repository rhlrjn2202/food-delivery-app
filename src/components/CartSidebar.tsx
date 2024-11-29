import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

interface CartSidebarProps {
  open: boolean;
  onClose: () => void;
}

const MINIMUM_ORDER_VALUE = 200;

export default function CartSidebar({ open, onClose }: CartSidebarProps) {
  const { items, removeItem, subtotal, deliveryFee, total } = useCart();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleCheckout = () => {
    onClose();
    navigate('/cart');
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: isMobile ? '100%' : '400px',
          p: 3,
        },
      }}
      SlideProps={{
        timeout: 400,
      }}
    >
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" component="h2" fontWeight="600">
            Your Cart
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        {items.length === 0 ? (
          <Box sx={{ 
            flex: 1, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}>
            <Typography color="text.secondary">Your cart is empty</Typography>
          </Box>
        ) : (
          <>
            <List sx={{ flex: 1, overflow: 'auto' }}>
              {items.map((item) => (
                <React.Fragment key={item.id}>
                  <ListItem
                    secondaryAction={
                      <IconButton edge="end" onClick={() => removeItem(item.id)}>
                        <DeleteIcon />
                      </IconButton>
                    }
                  >
                    <ListItemText
                      primary={item.name}
                      secondary={`Quantity: ${item.quantity}`}
                    />
                    <Typography variant="body1" sx={{ ml: 2 }}>
                      ₹{item.price * item.quantity}
                    </Typography>
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>

            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1">Subtotal: ₹{subtotal}</Typography>
              {deliveryFee > 0 && (
                <>
                  <Typography variant="subtitle1" color="error">
                    Delivery Fee: ₹{deliveryFee}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Add items worth ₹{MINIMUM_ORDER_VALUE - subtotal} more to get free delivery
                  </Typography>
                </>
              )}
              <Typography variant="h6" sx={{ mt: 1, mb: 2 }}>
                Total: ₹{total}
              </Typography>
              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={handleCheckout}
                sx={{
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  '&:hover': {
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                Proceed to Checkout
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Drawer>
  );
}