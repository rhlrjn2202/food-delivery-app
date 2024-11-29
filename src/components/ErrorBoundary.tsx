import React from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import ErrorFallback from './ErrorFallback';

interface Props {
  children: React.ReactNode;
}

export default function ErrorBoundary({ children }: Props) {
  const handleError = (error: Error) => {
    // Log error to your error tracking service
    console.error('Application error:', error);
  };

  return (
    <ReactErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={handleError}
      onReset={() => {
        // Reset application state here if needed
        window.location.reload();
      }}
    >
      {children}
    </ReactErrorBoundary>
  );
}