import { create } from "zustand"

import { ACCOUNT_TYPE } from "../data/constants"

// Combined state interface
interface ProfileState {
  user: User | null
  loading: boolean
  isStudent: boolean
  isInstructor: boolean
  isAdmin: boolean
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  setRoles: (accountType: string | undefined) => void
  resetRoles: () => void
}

// Create the store with Zustand
export const useProfileStore = create<ProfileState>((set) => ({
  user:
    typeof window !== "undefined" && localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user") as string)
      : null,
  loading: false,
  isStudent: false,
  isInstructor: false,
  isAdmin: false,

  // Set user and roles together
  setUser: (user) => {
    set({ user })
    if (user) {
      localStorage.setItem("user", JSON.stringify(user))
      set({
        isStudent: user.accountType === ACCOUNT_TYPE.STUDENT,
        isInstructor: user.accountType === ACCOUNT_TYPE.INSTRUCTOR,
        isAdmin: user.accountType === ACCOUNT_TYPE.ADMIN,
      })
    } else {
      localStorage.removeItem("user")
      set({
        isStudent: false,
        isInstructor: false,
        isAdmin: false,
      })
    }
  },

  setLoading: (loading) => set({ loading }),

  // These can be exposed if needed, but are also handled inside setUser
  setRoles: (accountType) => {
    set({
      isStudent: accountType === ACCOUNT_TYPE.STUDENT,
      isInstructor: accountType === ACCOUNT_TYPE.INSTRUCTOR,
      isAdmin: accountType === ACCOUNT_TYPE.ADMIN,
    })
  },

  resetRoles: () => {
    set({
      isStudent: false,
      isInstructor: false,
      isAdmin: false,
    })
  },
}))
