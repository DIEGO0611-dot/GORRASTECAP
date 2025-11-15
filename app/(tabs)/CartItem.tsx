import React from 'react';
import { View, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';


export default function CartItem() {
  const { cartItems } = useCart();

  if (cartItems.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 18, color: '#999' }}>El carrito está vacío</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      {cartItems.map((item) => (
        <ProductCard key={item.id} product={item} />
      ))}
    </ScrollView>
  );
}
