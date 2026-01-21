"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Loading from "@/app/loading";
import { useAuthStore } from "@/store/use-auth-store";

export default function PrivateRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { token, loading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // If we are done loading and there is no token, redirect
    if (!(loading || token)) {
      router.replace("/login");
    }
  }, [token, loading, router]);

  // While loading, or if no token exists (while waiting for redirect), show loader
  if (loading || !token) {
    return <Loading />;
  }

  return <>{children}</>;
}
