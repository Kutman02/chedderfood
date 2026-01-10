import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type AuthState = {
  token: string | null;
  userName: string | null;
};

const initialState: AuthState = {
  token: localStorage.getItem('token'),
  userName: localStorage.getItem('user_name'),
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ token: string; userName?: string | null }>) => {
      state.token = action.payload.token;
      state.userName = action.payload.userName ?? null;
    },
    logout: (state) => {
      state.token = null;
      state.userName = null;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export const authReducer = authSlice.reducer;
