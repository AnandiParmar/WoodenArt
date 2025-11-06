'use client';

import { createSlice } from '@reduxjs/toolkit';
import { CategoryTableData } from '@/components/table-types';
import { listCategories, createCategory, deleteCategory, updateCategory } from './categoryActions';

interface CategoryState {
  items: CategoryTableData[];
  loading: boolean;
  error?: string;
}

const initialState: CategoryState = {
  items: [],
  loading: false,
};

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(listCategories.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(listCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(listCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.items = [action.payload, ...state.items];
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.items = state.items.filter((c) => c.id !== action.payload);
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        const idx = state.items.findIndex((c) => c.id === action.payload.id);
        if (idx !== -1) {
          // Preserve existing productCount since the update response doesn't include it
          const prevCount = state.items[idx].productCount;
          state.items[idx] = { ...action.payload, productCount: prevCount };
        }
      });
  },
});

export default categorySlice.reducer;


