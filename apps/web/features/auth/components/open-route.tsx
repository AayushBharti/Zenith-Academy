"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Loading from "@/app/loading";
import { useAuthStore } from "@/features/auth/use-auth-store";

/** Redirects authenticated users away from public-only pages (login, signup). */
export default function OpenRoute({ children }: { children: React.ReactNode }) {
  const accessToken = useAuthStore((s) => s.accessToken);
  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated && accessToken) {
      router.replace("/dashboard");
    }
  }, [accessToken, router, isHydrated]);

  if (!isHydrated) {
    return <Loading />;
  }

  if (accessToken) {
    return <Loading />;
  }

  return <>{children}</>;
}
