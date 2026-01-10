import { configureStore } from '@reduxjs/toolkit';
import { api } from './services/api';
import { publicApi } from './services/publicApi';
import { customAuthApi } from './services/customAuth';
import { wooCommerceApi } from './services/wooCommerceApi';
import { authReducer } from './slices/authSlice';
import { cartReducer, cartStorageKey } from './slices/cartSlice';
import { receiptsReducer, receiptsStorageKeys } from './slices/receiptsSlice';
import { uiReducer } from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    [publicApi.reducerPath]: publicApi.reducer,
    [customAuthApi.reducerPath]: customAuthApi.reducer,
    [wooCommerceApi.reducerPath]: wooCommerceApi.reducer,
    auth: authReducer,
    cart: cartReducer,
    receipts: receiptsReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware, publicApi.middleware, customAuthApi.middleware, wooCommerceApi.middleware),
});

let prevAuthToken: string | null | undefined;
let prevAuthUserName: string | null | undefined;
let prevCartSerialized: string | undefined;
let prevReceiptsSerialized: string | undefined;
let prevCustomerDataSerialized: string | undefined;

store.subscribe(() => {
  const state = store.getState();

  const token = state.auth.token;
  const userName = state.auth.userName;

  if (token !== prevAuthToken) {
    prevAuthToken = token;
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  if (userName !== prevAuthUserName) {
    prevAuthUserName = userName;
    if (userName) {
      localStorage.setItem('user_name', userName);
    } else {
      localStorage.removeItem('user_name');
    }
  }

  const cartSerialized = JSON.stringify(state.cart.items);
  if (cartSerialized !== prevCartSerialized) {
    prevCartSerialized = cartSerialized;
    localStorage.setItem(cartStorageKey, cartSerialized);
  }

  const receiptsSerialized = JSON.stringify(state.receipts.receipts);
  if (receiptsSerialized !== prevReceiptsSerialized) {
    prevReceiptsSerialized = receiptsSerialized;
    localStorage.setItem(receiptsStorageKeys.RECEIPTS_KEY, receiptsSerialized);
  }

  const customerDataSerialized = JSON.stringify(state.receipts.customerData);
  if (customerDataSerialized !== prevCustomerDataSerialized) {
    prevCustomerDataSerialized = customerDataSerialized;
    if (state.receipts.customerData) {
      localStorage.setItem(receiptsStorageKeys.CUSTOMER_DATA_KEY, customerDataSerialized);
    } else {
      localStorage.removeItem(receiptsStorageKeys.CUSTOMER_DATA_KEY);
    }
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;