import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { CustomerData, ReceiptData } from '@/types';
import { STORAGE_KEYS } from "@/shared/constants/storage"

type ReceiptsState = {
  receipts: ReceiptData[];
  customerData: CustomerData | null;
};

const CHECKOUT_FORM_KEY = STORAGE_KEYS.CHECKOUT_FORM

const loadCustomerData = (): CustomerData | null => {
  try {
    const raw = localStorage.getItem(CHECKOUT_FORM_KEY);

    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<CustomerData>;

    return {
      first_name: parsed.first_name ?? "",
      address: parsed.address ?? "",
      phone: parsed.phone ?? "",
    };
  } catch {
    return null;
  }
};

const initialState: ReceiptsState = {
  receipts: [],
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
