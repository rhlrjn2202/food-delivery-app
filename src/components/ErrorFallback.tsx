import React from 'react';
import { Box, Button, Typography, Container } from '@mui/material';
import { FallbackProps } from 'react-error-boundary';

export default function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          textAlign: 'center',
          gap: 2,
        }}
      >
        <Typography variant="h5" color="error" gutterBottom>
          Something went wrong
        </Typography>
        <Typography color="text.secondary" paragraph>
          {error.message}
        </Typography>
        <Button
          variant="contained"
          onClick={resetErrorBoundary}
          sx={{ mt: 2 }}
        >
          Try again
        </Button>
      </Box>
    </Container>
  );
}