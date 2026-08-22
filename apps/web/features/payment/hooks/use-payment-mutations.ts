"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  CapturePaymentResponse as CapturePaymentData,
  SendPaymentSuccessEmailInput,
  VerifySignatureInput,
} from "@workspace/shared-types";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCartStore } from "@/features/cart/use-cart-store";
import { useProfileStore } from "@/features/profile/use-profile-store";
import { apiCall } from "@/lib/api-call";
import { studentEndpoints } from "@/lib/apis";
import { queryKeys } from "@/lib/query-keys";

interface RazorpayPaymentResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

/** Load the Razorpay checkout script into the DOM. Returns true on success. */
function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

/** Orchestrate the full Razorpay payment flow: capture -> modal -> verify -> email. */
export function useBuyCourse() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (
      courseIds: string[]
    ): Promise<RazorpayPaymentResponse> => {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error("Failed to load Razorpay");
      }

      const captureResult = await apiCall<CapturePaymentData>(
        "POST",
        studentEndpoints.COURSE_PAYMENT_API,
        { courses: courseIds }
      );
      if (!captureResult.ok) {
        throw new Error(captureResult.error);
      }

      const paymentResponse = await new Promise<RazorpayPaymentResponse>(
        (resolve, reject) => {
          const profileUser = useProfileStore.getState().user;

          const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
            currency: captureResult.data.currency,
            amount: String(captureResult.data.amount),
            order_id: captureResult.data.orderId,
            name: "Nextdemy",
            description: "Course Purchase",
            prefill: {
              name: profileUser?.firstName ?? "",
              email: profileUser?.email ?? "",
            },
            handler: (response: RazorpayPaymentResponse) => resolve(response),
            theme: { color: "#422FAF" },
          };

          const rzp = new window.Razorpay(options);
          rzp.on("payment.failed", () => reject(new Error("Payment failed")));
          rzp.open();
        }
      );

      const verifyResult = await apiCall<void>(
        "POST",
        studentEndpoints.COURSE_VERIFY_API,
        {
          razorpay_order_id: paymentResponse.razorpay_order_id,
          razorpay_payment_id: paymentResponse.razorpay_payment_id,
          razorpay_signature: paymentResponse.razorpay_signature,
          courses: courseIds,
        } satisfies VerifySignatureInput
      );
      if (!verifyResult.ok) {
        throw new Error(verifyResult.error);
      }

      // Fire-and-forget confirmation email
      apiCall<void>("POST", studentEndpoints.SEND_PAYMENT_SUCCESS_EMAIL_API, {
        orderId: paymentResponse.razorpay_order_id,
        paymentId: paymentResponse.razorpay_payment_id,
        amount: captureResult.data.amount,
      } satisfies SendPaymentSuccessEmailInput);

      return paymentResponse;
    },
    onSuccess: () => {
      toast.success("Payment successful!");
      useCartStore.getState().resetCart();
      queryClient.invalidateQueries({
        queryKey: queryKeys.profile.enrolledCourses(),
      });
      router.push("/dashboard/enrolled-courses");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Payment failed");
    },
  });
}
