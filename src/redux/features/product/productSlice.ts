'use client';

import { createSlice } from '@reduxjs/toolkit';
import { ProductTableData } from '@/components/table-types';
import { listProducts, createProduct, deleteProduct, updateProduct } from './productActions';

interface ProductState {
  items: ProductTableData[];
  loading: boolean;
  error?: string;
}

const initialState: ProductState = {
  items: [],
  loading: false,
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(listProducts.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(listProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(listProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.items = [action.payload, ...state.items];
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter((p) => p.id !== action.payload);
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const idx = state.items.findIndex((p) => p.id === action.payload.id);
        if (idx >= 0) {
          state.items[idx] = action.payload;
        }
      });
  },
});

export default productSlice.reducer;


