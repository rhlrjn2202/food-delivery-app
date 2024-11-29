import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Button,
  Box,
  Divider,
  TextField,
  Paper,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
  Alert,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

const steps = ['Review Cart', 'Delivery Details', 'Payment'];

const MINIMUM_ORDER_VALUE = 200;

export default function Cart() {
  const { items, removeItem, subtotal, deliveryFee, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pincodeError, setPincodeError] = useState('');
  const [isPincodeVerified, setIsPincodeVerified] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: '',
    address: '',
    email: user?.email || '',
    pincode: '',
  });

  if (items.length === 0 && activeStep === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h5" align="center">
          Your cart is empty
        </Typography>
      </Container>
    );
  }

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === 'pincode' && value.length === 6) {
      try {
        setLoading(true);
        setPincodeError('');
        const response = await api.verifyPincode(value);
        setIsPincodeVerified(response.data.available);
        if (!response.data.available) {
          setPincodeError('Delivery is not available in this area');
        }
      } catch (err) {
        setPincodeError('Failed to verify pincode');
        setIsPincodeVerified(false);
      } finally {
        setLoading(false);
      }
    } else if (name === 'pincode') {
      setIsPincodeVerified(false);
      setPincodeError('');
    }
  };

  const handleNext = async () => {
    if (activeStep === steps.length - 1) {
      try {
        setLoading(true);
        setError('');
        
        const orderData = {
          items,
          subtotal,
          deliveryFee,
          total,
          customerDetails: formData,
          paymentMethod,
          orderDate: new Date().toISOString(),
        };

        await api.createOrder(orderData);
        clearCart();
        setActiveStep(activeStep + 1);
      } catch (err) {
        setError('Failed to place order. Please try again.');
      } finally {
        setLoading(false);
      }
    } else {
      setActiveStep(activeStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const isFormValid = () => {
    if (activeStep === 1) {
      return (
        formData.name &&
        formData.phone &&
        formData.address &&
        formData.email &&
        formData.pincode &&
        isPincodeVerified
      );
    }
    return true;
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <>
            <List>
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
                <Typography variant="h6" sx={{ mt: 1 }}>Total: ₹{total}</Typography>
              </Box>
            </List>
          </>
        );
      case 1:
        return (
          <Box sx={{ mt: 2 }}>
            <TextField
              name="name"
              label="Full Name"
              value={formData.name}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              name="phone"
              label="Phone Number"
              value={formData.phone}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              name="email"
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              name="pincode"
              label="Pincode"
              value={formData.pincode}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              required
              error={!!pincodeError}
              helperText={pincodeError || (isPincodeVerified && 'Delivery available in your area')}
              inputProps={{
                maxLength: 6,
                pattern: '[0-9]*',
              }}
            />
            <TextField
              name="address"
              label="Delivery Address"
              value={formData.address}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              multiline
              rows={3}
              required
            />
          </Box>
        );
      case 2:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>
            <Typography>
              Total Items: {items.reduce((sum, item) => sum + item.quantity, 0)}
            </Typography>
            <Typography>Subtotal: ₹{subtotal}</Typography>
            {deliveryFee > 0 && (
              <Typography>Delivery Fee: ₹{deliveryFee}</Typography>
            )}
            <Typography variant="h6" sx={{ mt: 1 }}>
              Total Amount: ₹{total}
            </Typography>

            <FormControl component="fieldset" sx={{ mt: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Payment Method
              </Typography>
              <RadioGroup
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <FormControlLabel 
                  value="cod" 
                  control={<Radio />} 
                  label="Cash on Delivery" 
                />
                <FormControlLabel 
                  value="prepaid" 
                  control={<Radio />} 
                  label="Online Payment" 
                />
              </RadioGroup>
            </FormControl>
          </Box>
        );
      case 3:
        return (
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom color="primary">
              Order Placed Successfully!
            </Typography>
            <Typography>
              Thank you for your order. Our delivery partner will contact you shortly.
            </Typography>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Checkout
        </Typography>
        
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {getStepContent(activeStep)}

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
          {activeStep !== 0 && activeStep !== steps.length && (
            <Button onClick={handleBack} sx={{ mr: 1 }}>
              Back
            </Button>
          )}
          {activeStep !== steps.length && (
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={loading || !isFormValid()}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : activeStep === steps.length - 1 ? (
                'Place Order'
              ) : (
                'Next'
              )}
            </Button>
          )}
        </Box>
      </Paper>
    </Container>
  );
}