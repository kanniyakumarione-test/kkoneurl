import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import './index.css';
import App from './App.jsx';

import { PayPalScriptProvider } from '@paypal/react-paypal-js';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <PayPalScriptProvider options={{
            "client-id": "AZLSdlP2kcF_ddZy4H0KD-tpZ9QHux51eIcC6aRK1O6n5eit401-NURWxfGvLMxcsCkA85JfhQGdP1-_",
            vault: true, // Required for subscriptions
            intent: "subscription"
          }}>
            <App />
          </PayPalScriptProvider>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);

