'use client';

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserState {
  id: string | null;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  role: 'USER' | 'ADMIN' | null;
}

const initialState: UserState = {
  id: null,
  email: null,
  firstName: null,
  lastName: null,
  role: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      return { ...state, ...action.payload };
    },
    clearUser: () => initialState,
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;


