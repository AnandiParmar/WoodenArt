'use client';

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CartItem {
  id?: number;
  productId: string | number; // MongoDB ObjectId string or legacy number
  productName: string;
  productImage?: string;
  price: number;
  discount?: number;
  quantity: number;
  stock: number;
}

interface CartState {
  items: CartItem[];
  loading: boolean;
  error?: string;
}

const initialState: CartState = {
  items: [],
  loading: false,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCartItems: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
    },
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find(item => item.productId === action.payload.productId);
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
    },
    updateCartItemQuantity: (state, action: PayloadAction<{ productId: string | number; quantity: number }>) => {
      const item = state.items.find(item => String(item.productId) === String(action.payload.productId));
      if (item) {
        item.quantity = action.payload.quantity;
      }
    },
    removeFromCart: (state, action: PayloadAction<string | number>) => {
      state.items = state.items.filter(item => String(item.productId) !== String(action.payload));
    },
    clearCart: (state) => {
      state.items = [];
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | undefined>) => {
      state.error = action.payload;
    },
  },
});

export const { setCartItems, addToCart, updateCartItemQuantity, removeFromCart, clearCart, setLoading, setError } = cartSlice.actions;
export default cartSlice.reducer;



