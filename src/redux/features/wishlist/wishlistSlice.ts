'use client';

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface WishlistItem {
  id?: number;
  productId: string ; // MongoDB ObjectId string or legacy number
  productName: string;
  productImage?: string;
  price: number;
  discount?: number;
  stock?: number;
}

interface WishlistState {
  items: WishlistItem[];
  loading: boolean;
  error?: string;
}

const initialState: WishlistState = {
  items: [],
  loading: false,
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    setWishlistItems: (state, action: PayloadAction<WishlistItem[]>) => {
      state.items = action.payload;
    },
    addToWishlist: (state, action: PayloadAction<WishlistItem>) => {
      const exists = state.items.some(item => item.productId === action.payload.productId);
      if (!exists) {
        state.items.push(action.payload);
      }
    },
    removeFromWishlist: (state, action: PayloadAction<string | number>) => {
      state.items = state.items.filter(item => String(item.productId) !== String(action.payload));
    },
    clearWishlist: (state) => {
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

export const { setWishlistItems, addToWishlist, removeFromWishlist, clearWishlist, setLoading: setWishlistLoading, setError: setWishlistError } = wishlistSlice.actions;
export default wishlistSlice.reducer;



