import type { UserSummary as User } from "@workspace/shared-types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

/** Profile state — loading is owned by TanStack Query, not this store. */
interface ProfileState {
  user: User | null;
  setUser: (user: User | null) => void;
}

// Create the store with Zustand and persistence
export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
    }),
    {
      name: "profile-storage", // Unique name for the storage item
      partialize: (state) => ({ user: state.user }), // Persist only the 'user' field
    }
  )
);
