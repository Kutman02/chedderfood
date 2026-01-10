import { createSlice } from '@reduxjs/toolkit';

interface UIState {
  isCartOpen: boolean;
  isReceiptsOpen: boolean;
  isProductModalOpen: boolean;
  isAnyModalOpen: boolean;
}

const initialState: UIState = {
  isCartOpen: false,
  isReceiptsOpen: false,
  isProductModalOpen: false,
  isAnyModalOpen: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openCart: (state) => {
      state.isCartOpen = true;
      state.isAnyModalOpen = true;
    },
    closeCart: (state) => {
      state.isCartOpen = false;
      state.isAnyModalOpen = false;
    },
    openReceipts: (state) => {
      state.isReceiptsOpen = true;
      state.isAnyModalOpen = true;
    },
    closeReceipts: (state) => {
      state.isReceiptsOpen = false;
      state.isAnyModalOpen = false;
    },
    openProductModal: (state) => {
      state.isProductModalOpen = true;
      state.isAnyModalOpen = true;
    },
    closeProductModal: (state) => {
      state.isProductModalOpen = false;
      state.isAnyModalOpen = false;
    },
  },
});

export const {
  openCart,
  closeCart,
  openReceipts,
  closeReceipts,
  openProductModal,
  closeProductModal,
} = uiSlice.actions;

export const uiReducer = uiSlice.reducer;
