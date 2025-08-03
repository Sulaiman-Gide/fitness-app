import { RootState } from "@/store";
import { TypedUseSelectorHook, useSelector } from "react-redux";

// Use the RootState type from the store
export const useAuth = () => {
  const authState = useSelector((state: RootState) => state.auth);
  return { 
    user: authState.user,
    profile: authState.profile,
    isAuthenticated: authState.isAuthenticated,
    loading: authState.loading,
    profileComplete: authState.profileComplete
  };
};
