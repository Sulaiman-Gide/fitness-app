import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  id: string;
  email: string;
  name?: string;
}

interface Profile {
  height: number;
  weight: number;
  age: number;
  gender: string;
}

interface AuthState {
  user: User | null;
  profile: Profile | null;
  isAuthenticated: boolean;
  loading: boolean;
  initialized: boolean;
  profileComplete: boolean;
}

const initialState: AuthState = {
  user: null,
  profile: null,
  isAuthenticated: false,
  loading: false,
  initialized: false,
  profileComplete: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    login: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
    },
    logout: (state) => {
      state.user = null;
      state.profile = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.profileComplete = false;
    },
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      if (!action.payload) {
        state.profile = null;
        state.profileComplete = false;
      }
    },
    setProfile: (state, action: PayloadAction<Profile>) => {
      state.profile = action.payload;
      state.profileComplete = true;
    },
    setProfileComplete: (state, action: PayloadAction<boolean>) => {
      state.profileComplete = action.payload;
    },
    setInitialized: (state, action: PayloadAction<boolean>) => {
      state.initialized = action.payload;
    },
    clearProfile: (state) => {
      state.profile = null;
      state.profileComplete = false;
    },
  },
});

export const {
  login,
  logout,
  setLoading,
  setUser,
  setProfile,
  setProfileComplete,
  setInitialized,
  clearProfile,
} = authSlice.actions;

export default authSlice.reducer;
