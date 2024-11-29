import React from 'react';
import { Alert, Snackbar } from '@mui/material';
import { useNetworkStatus } from '../hooks/useNetworkStatus';

export default function NetworkStatus() {
  const isOnline = useNetworkStatus();

  return (
    <Snackbar
      open={!isOnline}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert severity="warning" sx={{ width: '100%' }}>
        You are currently offline. Please check your internet connection.
      </Alert>
    </Snackbar>
  );
}