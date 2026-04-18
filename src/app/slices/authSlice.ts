import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { User } from "@/types"
import { authStorage } from "@/shared/lib/storage"

type AuthState = {
  token: string | null
  user: User | null
}

const initialState: AuthState = {
  token: authStorage.getToken(),
  user: authStorage.getUser(),
}

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ token: string; user: User }>
    ) => {
      state.token = action.payload.token
      state.user = action.payload.user

      authStorage.setSession(action.payload.token, action.payload.user)
    },

    logout: (state) => {
      state.token = null
      state.user = null

      authStorage.clearSession()
    },
  },
})

export const { setCredentials, logout } = authSlice.actions
export const authReducer = authSlice.reducer