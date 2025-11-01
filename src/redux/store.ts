'use client';

import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import productReducer from './features/product/productSlice';
import categoryReducer from './features/category/categorySlice';
import userReducer from './features/user/userSlice';
import authStepReducer from './features/auth/authStepSlice';

const authStepPersistConfig = {
  key: 'authStep',
  storage,
};

const persistedAuthStepReducer = persistReducer(authStepPersistConfig, authStepReducer);

export const store = configureStore({
  reducer: {
    product: productReducer,
    category: categoryReducer,
    user: userReducer,
    authStep: persistedAuthStepReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;


