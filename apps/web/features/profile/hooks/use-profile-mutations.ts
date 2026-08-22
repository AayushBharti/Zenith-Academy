"use client";

import { useMutation } from "@tanstack/react-query";
import type { UpdateProfileResponse as UpdateProfileData } from "@workspace/shared-types";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { apiCall } from "@/lib/api-call";
import { settingsEndpoints } from "@/lib/apis";
import { useAuthStore } from "../../auth/use-auth-store";
import { useCartStore } from "../../cart/use-cart-store";
import { useProfileStore } from "../use-profile-store";

interface UpdateProfileDetails {
  gender: string;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth?: string;
  contactNumber?: string;
  about?: string;
}

interface ChangePasswordParams {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

/** Upload a new profile picture and update the store. */
export function useUpdatePfp() {
  const setUser = useProfileStore((s) => s.setUser);
  const user = useProfileStore((s) => s.user);

  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("pfp", file);
      const result = await apiCall<{ image: string }>(
        "POST",
        settingsEndpoints.UPDATE_DISPLAY_PICTURE_API,
        formData
      );
      if (!result.ok) throw new Error(result.error);
      return result.data;
    },
    onSuccess: (data) => {
      if (user) {
        setUser({ ...user, image: data.image });
      }
      toast.success("Profile picture updated");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

/** Update the user's profile details and sync the store. */
export function useUpdateProfile() {
  const setUser = useProfileStore((s) => s.setUser);

  return useMutation({
    mutationFn: async (details: UpdateProfileDetails) => {
      const { firstName, lastName, dateOfBirth, gender, contactNumber, about } =
        details;
      const result = await apiCall<UpdateProfileData>(
        "PUT",
        settingsEndpoints.UPDATE_PROFILE_API,
        { firstName, lastName, dateOfBirth, gender, contactNumber, about }
      );
      if (!result.ok) throw new Error(result.error);
      return result.data;
    },
    onSuccess: (data) => {
      setUser(data.userDetails);
      toast.success("Profile updated");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

/** Change the authenticated user's password. */
export function useChangePassword() {
  return useMutation({
    mutationFn: async (params: ChangePasswordParams) => {
      const {
        currentPassword: oldPassword,
        newPassword,
        confirmPassword: confirmNewPassword,
      } = params;
      const result = await apiCall<void>(
        "POST",
        settingsEndpoints.CHANGE_PASSWORD_API,
        { oldPassword, newPassword, confirmNewPassword }
      );
      if (!result.ok) throw new Error(result.error);
    },
    onSuccess: () => {
      toast.success("Password changed");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

/** Delete the authenticated user's account and clear all state. */
export function useDeleteAccount() {
  const router = useRouter();
  const setAccessToken = useAuthStore((s) => s.setAccessToken);
  const setUser = useProfileStore((s) => s.setUser);
  const resetCart = useCartStore((s) => s.resetCart);

  return useMutation({
    mutationFn: async () => {
      const result = await apiCall<void>(
        "DELETE",
        settingsEndpoints.DELETE_PROFILE_API
      );
      if (!result.ok) throw new Error(result.error);
    },
    onSuccess: () => {
      setAccessToken(null);
      setUser(null);
      resetCart();
      toast.success("Account deleted");
      router.push("/");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}
