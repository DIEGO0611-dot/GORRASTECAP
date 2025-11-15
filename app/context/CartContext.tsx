import React, { createContext, useContext, useState } from 'react';

type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
};

type CartContextType = {
  cartItems: Product[];
  addToCart: (item: Product) => void;
  removeFromCart: (id: number) => void;
};

const CartContext = createContext<CartContextType>({
  cartItems: [],
  addToCart: () => {},
  removeFromCart: () => {},
});

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<Product[]>([]);

  const addToCart = (item: Product) => {
    setCartItems((prev) => [...prev, item]);
  };

  const removeFromCart = (id: number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
