"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Loading from "@/app/loading";
import { useAuthStore } from "@/store/use-auth-store";

export default function OpenRoute({ children }: { children: React.ReactNode }) {
  const { token, loading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // If we are done loading and token exists, redirect to dashboard
    if (!loading && token) {
      router.replace("/dashboard/my-profile");
    }
  }, [token, loading, router]);

  // While loading, or if token exists (while waiting for redirect), show loader
  if (loading || token) {
    return <Loading />;
  }

  return <>{children}</>;
}
