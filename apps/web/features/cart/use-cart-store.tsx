import type { CourseResponse as CourseDetails } from "@workspace/shared-types";
import { toast } from "sonner";
import { create } from "zustand";
import { persist } from "zustand/middleware";

// Define types for cart items and the store state
interface CartState {
  cart: CourseDetails[];
  total: number;
  totalItems: number;
  addToCart: (course: CourseDetails) => void;
  removeFromCart: (courseId: string) => void;
  resetCart: () => void;
}

// Create the Zustand store with persistence
export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      cart: [],
      total: 0,
      totalItems: 0,

      // Action to add a course to the cart
      addToCart: (course) =>
        set((state) => {
          if (state.cart.some((item) => item._id === course._id)) {
            toast.error("Course already in cart");
            return state;
          }
          toast.success("Course added to cart");
          return {
            cart: [...state.cart, course],
            total: state.total + course.price,
            totalItems: state.totalItems + 1,
          };
        }),

      // Action to remove a course from the cart
      removeFromCart: (courseId) =>
        set((state) => {
          const itemToRemove = state.cart.find((item) => item._id === courseId);
          if (!itemToRemove) return state;

          toast.success("Course removed from cart");
          return {
            cart: state.cart.filter((item) => item._id !== courseId),
            total: state.total - itemToRemove.price,
            totalItems: state.totalItems - 1,
          };
        }),

      // Action to reset the cart
      resetCart: () => set({ cart: [], total: 0, totalItems: 0 }),
    }),
    {
      name: "cart-storage", // Unique name for the storage item
    }
  )
);
