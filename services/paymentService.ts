import { useCartStore } from "@/store/useCartStore"
import { toast } from "react-hot-toast"

import rzplogo from "../../assets/Images/rzp.png"
import { apiConnector } from "../utils/apiConnector"
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
  courses: Course[] | { courses: Course[] },
  userDetails: UserDetails,
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
      key: process.env.REACT_APP_RAZORPAY_KEY_ID,
      currency: orderResponse.data.currency,
      amount: orderResponse.data.amount.toString(),
      order_id: orderResponse.data.orderId,
      name: "Zenith Academy",
      description: "Thank you for purchasing the course",
      image: rzplogo,
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
