"use client";

import { useMutation } from "@tanstack/react-query";
import type { LoginResponse as LoginData } from "@workspace/shared-types";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { apiCall } from "@/lib/api-call";
import { endpoints } from "@/lib/apis";
import { useCartStore } from "../../cart/use-cart-store";
import { useProfileStore } from "../../profile/use-profile-store";
import { useAuthStore } from "../use-auth-store";

interface SignUpParams {
  accountType: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  otp: string;
}

interface ResetPasswordParams {
  password: string;
  confirmPassword: string;
  token: string;
}

/** Send an OTP to the given email for verification. */
export function useSendOtp() {
  return useMutation({
    mutationFn: async (email: string) => {
      const result = await apiCall<void>("POST", endpoints.SENDOTP_API, {
        email,
        checkUserPresent: true,
      });
      if (!result.ok) throw new Error(result.error);
    },
    onSuccess: () => {
      toast.success("OTP sent");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

/** Register a new user account. */
export function useSignUp() {
  return useMutation({
    mutationFn: async (params: SignUpParams) => {
      const result = await apiCall<void>("POST", endpoints.SIGNUP_API, params);
      if (!result.ok) throw new Error(result.error);
    },
    onSuccess: () => {
      toast.success("Signed up");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

/** Authenticate a user and store the access token + user data. */
export function useLogin() {
  const router = useRouter();
  const setAccessToken = useAuthStore((s) => s.setAccessToken);
  const setUser = useProfileStore((s) => s.setUser);

  return useMutation({
    mutationFn: async (params: { email: string; password: string }) => {
      const result = await apiCall<LoginData>(
        "POST",
        endpoints.LOGIN_API,
        params
      );
      if (!result.ok) throw new Error(result.error);
      return result.data;
    },
    onSuccess: (data) => {
      setAccessToken(data.accessToken);
      setUser(data.user);
      toast.success("Logged in");
      router.push("/dashboard");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

/** End the current session and clear all client-side state. */
export function useLogout() {
  const router = useRouter();
  const setAccessToken = useAuthStore((s) => s.setAccessToken);
  const setUser = useProfileStore((s) => s.setUser);
  const resetCart = useCartStore((s) => s.resetCart);

  return useMutation({
    mutationFn: async () => {
      const result = await apiCall<void>("POST", endpoints.LOGOUT_API);
      if (!result.ok) throw new Error(result.error);
    },
    onSettled: () => {
      setAccessToken(null);
      setUser(null);
      resetCart();
      toast.success("Logged out");
      router.push("/");
    },
  });
}

/** Request a password-reset email for the given address. */
export function useGetPasswordResetToken() {
  return useMutation({
    mutationFn: async (email: string) => {
      const result = await apiCall<void>("POST", endpoints.RESETPASSTOKEN_API, {
        email,
      });
      if (!result.ok) throw new Error(result.error);
    },
    onSuccess: () => {
      toast.success("Reset email sent");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

/** Reset the user's password using a token from the reset email. */
export function useResetPassword() {
  return useMutation({
    mutationFn: async (params: ResetPasswordParams) => {
      const result = await apiCall<void>(
        "POST",
        endpoints.RESETPASSWORD_API,
        params
      );
      if (!result.ok) throw new Error(result.error);
    },
    onSuccess: () => {
      toast.success("Password reset");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}
