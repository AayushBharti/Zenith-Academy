import { useAuthStore } from "@/store/use-auth-store"
import { useCartStore } from "@/store/use-cart-store"
import { useProfileStore } from "@/store/use-profile-store"
import { toast } from "react-hot-toast"

import { apiConnector } from "../utils/api-connector"
import { endpoints } from "../utils/apis"

const {
  SENDOTP_API,
  SIGNUP_API,
  LOGIN_API,
  RESETPASSTOKEN_API,
  RESETPASSWORD_API,
} = endpoints

export async function sendOtp(email: string, navigate: (path: string) => void) {
  const { setLoading } = useAuthStore.getState()
  setLoading(true)

  try {
    const response = await apiConnector("POST", SENDOTP_API, {
      email,
      checkUserPresent: true,
    })
    console.log("SENDOTP API RESPONSE............", response)
    if (!response.data.success) {
      throw new Error(response.data.message)
    }

    toast.success("OTP Sent Successfully")
    navigate("/verify-email")
  } catch (error) {
    console.log("SENDOTP API ERROR............", error)
    toast.error((error as any)?.response?.data?.message)
  } finally {
    setLoading(false)
  }
}

export async function signUp(
  accountType: string,
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  confirmPassword: string,
  otp: string,
  navigate: (path: string) => void
) {
  const { setLoading } = useAuthStore.getState()

  setLoading(true)
  try {
    const response = await apiConnector("POST", SIGNUP_API, {
      accountType,
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      otp,
    })

    console.log("SIGNUP API RESPONSE............", response)
    if (!response.data.success) {
      throw new Error(response.data.message)
    }
    toast.success("Signup Successful")
    // navigate("/login")
    login(email, password, navigate)
  } catch (error) {
    console.log("SIGNUP API ERROR............", error)
    toast.error("Signup Failed")
    navigate("/signup")
  } finally {
    setLoading(false)
  }
}

export async function login(
  email: string,
  password: string,
  navigate: (path: string) => void
) {
  const { setLoading, setToken } = useAuthStore.getState()
  const { setUser } = useProfileStore.getState()
  // const { resetCart } = useCartStore.getState()

  setLoading(true)
  try {
    const response = await apiConnector("POST", LOGIN_API, { email, password })

    console.log("LOGIN API RESPONSE............", response)
    if (!response.data.success) {
      throw new Error(response.data.message)
    }

    toast.success("Login Successful")
    setToken(response.data.token)

    const userImage = response.data?.user?.image
    // ||`https://api.dicebear.com/5.x/initials/svg?seed=${response.data.user.firstName} ${response.data.user.lastName}`

    setUser({ ...response.data.user, image: userImage })
    localStorage.setItem("user", JSON.stringify(response.data.user))
    localStorage.setItem("token", JSON.stringify(response.data.token))

    navigate("/dashboard/my-profile")
  } catch (error) {
    console.log("LOGIN API ERROR............", error)
    toast.error((error as any).response?.data?.message)
  } finally {
    setLoading(false)
  }
}

export function logout(navigate: (path: string) => void) {
  navigate("/")
  const { setToken } = useAuthStore.getState()
  const { resetCart } = useCartStore.getState()
  const { setUser } = useProfileStore.getState()
  setToken(null)
  setUser(null)
  resetCart()
  localStorage.removeItem("token")
  localStorage.removeItem("user")
  toast.success("Logged Out")
}

export async function getPasswordResetToken(
  email: string,
  setEmailSent: (sent: boolean) => void
) {
  const { setLoading } = useAuthStore.getState()
  setLoading(true)

  try {
    const response = await apiConnector("POST", RESETPASSTOKEN_API, { email })

    console.log("RESETPASSTOKEN RESPONSE............", response)
    if (!response.data.success) {
      throw new Error(response.data.message)
    }
    toast.success("Reset Email Sent")
    setEmailSent(true)
  } catch (error) {
    console.log("RESETPASSTOKEN ERROR............", error)
    toast.error("Failed To Send Reset Email")
  } finally {
    setLoading(false)
  }
}

export async function updatePassword(
  password: string,
  confirmPassword: string,
  token: string,
  setresetComplete: (complete: boolean) => void,
  navigate: (path: string) => void
) {
  const { setLoading } = useAuthStore.getState()
  setLoading(true)

  try {
    const response = await apiConnector("POST", RESETPASSWORD_API, {
      password,
      confirmPassword,
      token,
    })

    console.log("RESETPASSWORD RESPONSE............", response)
    if (!response.data.success) {
      throw new Error(response.data.message)
    }

    toast.success("Password Reset Successfully")
    setresetComplete(true)
    navigate("/login")
  } catch (error) {
    console.log("RESETPASSWORD ERROR............", error)
    toast.error("Failed To Reset Password")
  } finally {
    setLoading(false)
  }
}
