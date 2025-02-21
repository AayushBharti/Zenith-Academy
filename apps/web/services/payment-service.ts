"use client"

// import rzplogo from "@/public/Logo/rzp.png"
import { useCartStore } from "@/store/use-cart-store"
import { toast } from "react-hot-toast"

import { apiConnector } from "../utils/api-connector"
import { studentEndpoints } from "../utils/apis"

const {
  COURSE_PAYMENT_API,
  COURSE_VERIFY_API,
  SEND_PAYMENT_SUCCESS_EMAIL_API,
} = studentEndpoints

interface UserDetails {
  firstName: string
  lastName: string
  email: string
}

interface Course {
  id: string
  name: string
  price: number
  [key: string]: any
}

interface RazorpayResponse {
  razorpay_payment_id: string
  razorpay_order_id: string
  razorpay_signature: string
  amount: number
}

function loadScript(src: string): Promise<boolean> {
  return new Promise((resolve) => {
    const script = document.createElement("script")
    script.src = src
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

export async function buyCourse(
  token: string,
  courses: any[] | { courses: any[] },
  userDetails: any,
  navigate: (path: string) => void
): Promise<void> {
  const toastId = toast.loading(
    "Please wait while we redirect you to payment gateway",
    {
      position: "bottom-center",
      // autoClose: false,
    }
  )

  try {
    const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js")
    if (!res) {
      toast.error("Razorpay SDK failed to load. Are you online?")
      return
    }

    const orderResponse = await apiConnector(
      "POST",
      COURSE_PAYMENT_API,
      { courses },
      {
        Authorisation: `Bearer ${token}`,
      }
    )

    if (!orderResponse.data?.success) {
      toast.error(orderResponse.data?.message || "An error occurred.")
      toast.dismiss(toastId)
      return
    }

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      currency: orderResponse.data.currency,
      amount: orderResponse.data.amount.toString(),
      order_id: orderResponse.data.orderId,
      name: "Zenith Academy",
      description: "Thank you for purchasing the course",
      prefill: {
        name: userDetails.firstName + " " + userDetails.lastName,
        email: userDetails.email,
      },
      handler: async (response: RazorpayResponse) => {
        sendPaymentSuccessEmail(response, orderResponse.data.amount, token)
        verifypament(response, courses, token, navigate)
      },
      theme: {
        color: "#686CFD",
      },
    }

    const paymentObject = new window.Razorpay(options)
    paymentObject.open()
    paymentObject.on("payment.failed", () => {
      toast.error("Payment Failed")
    })

    toast.dismiss(toastId)
  } catch (error) {
    toast.dismiss(toastId)
    toast.error("Something went wrong")
    console.log("buyCourse -> error", error)
  }
}

async function sendPaymentSuccessEmail(
  response: RazorpayResponse,
  amount: number,
  token: string
): Promise<void> {
  const res = await apiConnector(
    "POST",
    SEND_PAYMENT_SUCCESS_EMAIL_API,
    {
      amount,
      paymentId: response.razorpay_payment_id,
      orderId: response.razorpay_order_id,
    },
    {
      Authorisation: `Bearer ${token}`,
    }
  )

  if (!res.data.success) {
    console.log(res.data.message)
    toast.error(res.data.message || "An error occurred")
  }
}

async function verifypament(
  response: RazorpayResponse,
  courses: Course[] | { courses: any[] },
  token: string,
  navigate: (path: string) => void
): Promise<void> {
  const { resetCart } = useCartStore.getState()

  const toastId = toast.loading("Please wait while we verify your payment")

  try {
    const res = await apiConnector(
      "POST",
      COURSE_VERIFY_API,
      {
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_order_id: response.razorpay_order_id,
        razorpay_signature: response.razorpay_signature,
        courses: Array.isArray(courses) ? courses : courses.courses,
      },
      {
        Authorisation: `Bearer ${token}`,
      }
    )

    if (!res.data.success) {
      toast.error(res.data.message || "Verification failed")
      return
    }

    toast.success("Payment Successful")
    navigate("/dashboard/enrolled-courses")
    resetCart()
  } catch (err) {
    toast.error("Payment Failed")
    console.log(err)
  }

  toast.dismiss(toastId)
}
