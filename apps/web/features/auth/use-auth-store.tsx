import { create } from "zustand";
import { persist } from "zustand/middleware";

// Define the SignupData interface
interface SignupData {
  accountType: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword?: string;
  // otp: string
}

/** Auth state — loading is owned by TanStack Query, not this store. */
interface AuthState {
  accessToken: string | null;
  signupData?: SignupData;
  setAccessToken: (token: string | null) => void;
  setSignupData: (data: SignupData) => void;
}

// Create the store with persistence
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      signupData: undefined,

      setAccessToken: (token) => set({ accessToken: token }),
      setSignupData: (data) => set({ signupData: data }),
    }),
    {
      name: "auth-storage", // name of the item in the storage (must be unique)
      partialize: (state) => ({ accessToken: state.accessToken }), // only persist the accessToken
    }
  )
);
