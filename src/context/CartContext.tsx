import React, { createContext, useContext, useState, useCallback } from 'react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  subtotal: number;
  deliveryFee: number;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const MINIMUM_ORDER_VALUE = 200;
const DELIVERY_FEE = 30;

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const saveCart = useCallback((cartItems: CartItem[]) => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, []);

  const addItem = useCallback((newItem: Omit<CartItem, 'quantity'>) => {
    setItems(currentItems => {
      const existingItem = currentItems.find(item => item.id === newItem.id);
      const updatedItems = existingItem
        ? currentItems.map(item =>
            item.id === newItem.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        : [...currentItems, { ...newItem, quantity: 1 }];
      saveCart(updatedItems);
      return updatedItems;
    });
  }, [saveCart]);

  const removeItem = useCallback((id: string) => {
    setItems(currentItems => {
      const updatedItems = currentItems.filter(item => item.id !== id);
      saveCart(updatedItems);
      return updatedItems;
    });
  }, [saveCart]);

  const clearCart = useCallback(() => {
    setItems([]);
    localStorage.removeItem('cart');
  }, []);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = subtotal < MINIMUM_ORDER_VALUE ? DELIVERY_FEE : 0;
  const total = subtotal + deliveryFee;

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      clearCart,
      subtotal,
      deliveryFee,
      total
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}