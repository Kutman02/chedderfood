import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { CustomerData, ReceiptData } from '../../types/types';

type ReceiptsState = {
  receipts: ReceiptData[];
  customerData: CustomerData | null;
};

const RECEIPTS_KEY = 'chedderfood_receipts';
const CUSTOMER_DATA_KEY = 'chedderfood_customer_data';

const loadReceipts = (): ReceiptData[] => {
  try {
    const raw = localStorage.getItem(RECEIPTS_KEY);
    return raw ? (JSON.parse(raw) as ReceiptData[]) : [];
  } catch {
    return [];
  }
};

const loadCustomerData = (): CustomerData | null => {
  try {
    const raw = localStorage.getItem(CUSTOMER_DATA_KEY);
    return raw ? (JSON.parse(raw) as CustomerData) : null;
  } catch {
    return null;
  }
};

const initialState: ReceiptsState = {
  receipts: loadReceipts(),
  customerData: loadCustomerData(),
};

export const receiptsSlice = createSlice({
  name: 'receipts',
  initialState,
  reducers: {
    addReceipt: (state, action: PayloadAction<ReceiptData>) => {
      const receipt = action.payload;
      state.receipts = [receipt, ...state.receipts.filter(r => r.id !== receipt.id)].slice(0, 50);
    },
    deleteReceipt: (state, action: PayloadAction<number>) => {
      state.receipts = state.receipts.filter(r => r.id !== action.payload);
    },
    clearReceipts: (state) => {
      state.receipts = [];
    },
    setCustomerData: (state, action: PayloadAction<CustomerData>) => {
      state.customerData = action.payload;
    },
    clearCustomerData: (state) => {
      state.customerData = null;
    },
  },
});

export const {
  addReceipt,
  deleteReceipt,
  clearReceipts,
  setCustomerData,
  clearCustomerData,
} = receiptsSlice.actions;

export const receiptsReducer = receiptsSlice.reducer;
export const receiptsStorageKeys = { RECEIPTS_KEY, CUSTOMER_DATA_KEY };
