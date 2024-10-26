import { toast } from "react-hot-toast"
import { create } from "zustand"

// Define types for cart items and the store state
interface Course {
  _id: string
  title: string
  price: number
}

interface CartState {
  cart: Course[]
  total: number
  totalItems: number
  addToCart: (course: Course) => void
  removeFromCart: (courseId: string) => void
  resetCart: () => void
}

// Create the Zustand store
export const useCartStore = create<CartState>((set) => ({
  cart:
    typeof window !== "undefined" && localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart")!)
      : [],
  total:
    typeof window !== "undefined" && localStorage.getItem("total")
      ? JSON.parse(localStorage.getItem("total")!)
      : 0,
  totalItems:
    typeof window !== "undefined" && localStorage.getItem("totalItems")
      ? JSON.parse(localStorage.getItem("totalItems")!)
      : 0,

  // Action to add a course to the cart
  addToCart: (course) =>
    set((state) => {
      const index = state.cart.findIndex((item) => item._id === course._id)

      if (index >= 0) {
        // If the course is already in the cart, show an error toast
        toast.error("Course already in cart")
        return state // Return unchanged state
      }

      // If the course is not in the cart, add it to the cart
      // const newCart = [...state.cart, course]
      state.cart.push(course)

      // Update the total quantity and price
      state.totalItems++
      state.total += course.price

      // Update to localstorage
      localStorage.setItem("cart", JSON.stringify(state.cart))
      localStorage.setItem("total", JSON.stringify(state.total))
      localStorage.setItem("totalItems", JSON.stringify(state.totalItems))

      // Show success toast
      toast.success("Course added to cart")
      return state
    }),

  // Action to remove a course from the cart
  removeFromCart: (courseId) =>
    set((state) => {
      const index = state.cart.findIndex((item) => item._id === courseId)

      if (index >= 0) {
        // If the course is found in the cart, remove it
        state.totalItems--
        state.total -= state.cart[index].price
        state.cart.splice(index, 1)
        // Update to localstorage
        localStorage.setItem("cart", JSON.stringify(state.cart))
        localStorage.setItem("total", JSON.stringify(state.total))
        localStorage.setItem("totalItems", JSON.stringify(state.totalItems))
        // show toast
        toast.success("Course removed from cart")

        return state
      }

      return state // Return unchanged state if course not found
    }),

  // Action to reset the cart
  resetCart: () => {
    set((state) => {
      state.cart = []
      state.total = 0
      state.totalItems = 0
      // Update to localstorage
      localStorage.removeItem("cart")
      localStorage.removeItem("total")
      localStorage.removeItem("totalItems")
      return state
    })
  },
}))
