import React from 'react';
import { Stack } from 'expo-router';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { CartProvider } from './context/CartContext';
import Toast from 'react-native-toast-message';
import { AuthProvider } from './context/AuthContext';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <PaperProvider>
          <CartProvider>
            <Stack screenOptions={{ headerShown: false }} />
            <Toast />
          </CartProvider>
        </PaperProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
