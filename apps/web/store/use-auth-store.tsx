// src/store/useAuthStore.ts
import { create } from "zustand"

// Define the SignupData interface
interface SignupData {
  accountType: string
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
  // otp: string
}

// Define the Auth state interface
interface AuthState {
  token: string | null
  signupData?: SignupData
  loading: boolean
  setToken: (token: string | null) => void
  setSignupData: (data: SignupData) => void
  setLoading: (loading: boolean) => void
}

// Create the store
export const useAuthStore = create<AuthState>((set) => ({
  token:
    typeof window !== "undefined" && localStorage.getItem("token")
      ? JSON.parse(localStorage.getItem("token") as string)
      : null,
  signupData: undefined,
  loading: false,

  setToken: (token) => set({ token }),
  setSignupData: (data) => set({ signupData: data }),
  setLoading: (loading) => set({ loading }),
}))
