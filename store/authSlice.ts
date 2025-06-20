import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  isAuthenticated: boolean;
  user: null | { email: string };
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action: PayloadAction<{ email: string }>) {
      state.isAuthenticated = true;
      state.user = { email: action.payload.email };
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
    },
    signup(state, action: PayloadAction<{ email: string }>) {
      state.isAuthenticated = true;
      state.user = { email: action.payload.email };
    },
  },
});

export const { login, logout, signup } = authSlice.actions;
export default authSlice.reducer;
