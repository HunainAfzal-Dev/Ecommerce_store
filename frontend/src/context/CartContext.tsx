import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { CartItem } from '../types';
import { cartApi } from '../api/client';
import { useAuth } from './AuthContext';

interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  cartTotal: number;
  loading: boolean;
  fetchCart: () => Promise<void>;
  addToCart: (productId: string, quantity: number) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, token } = useAuth();

  const fetchCart = async () => {
    if (!isAuthenticated) {
      setCartItems([]);
      return;
    }
    setLoading(true);
    try {
      const response = await cartApi.get();
      setCartItems(response.data.data.cart_items || []);
    } catch (err) {
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch cart when auth state changes
  useEffect(() => {
    fetchCart();
  }, [isAuthenticated, token]);

  const addToCart = async (productId: string, quantity: number) => {
    await cartApi.add({ product_id: productId, quantity });
    await fetchCart();
  };

  const updateQuantity = async (id: string, quantity: number) => {
    await cartApi.update(id, quantity);
    await fetchCart();
  };

  const removeFromCart = async (id: string) => {
    await cartApi.remove(id);
    await fetchCart();
  };

  const clearCart = async () => {
    await cartApi.clear();
    setCartItems([]);
  };

  // Derived values
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.products.price * item.quantity,
    0
  );

  const value = {
    cartItems,
    cartCount,
    cartTotal,
    loading,
    fetchCart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

