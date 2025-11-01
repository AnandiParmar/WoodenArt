'use client';

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AuthStepState {
  step: number;
  email: string | null;
}

const initialState: AuthStepState = {
  step: 1,
  email: null,
};

export const authStepSlice = createSlice({
  name: 'authStep',
  initialState,
  reducers: {
    setStep: (state, action: PayloadAction<number>) => {
      state.step = action.payload;
    },
    setEmail: (state, action: PayloadAction<string | null>) => {
      state.email = action.payload;
    },
    reset: () => initialState,
  },
});

export const { setStep, setEmail, reset } = authStepSlice.actions;
export default authStepSlice.reducer;

