"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Loading from "@/app/loading";
import { useAuthStore } from "@/features/auth/use-auth-store";

/** Redirects unauthenticated users to /login after Zustand hydration. */
export default function PrivateRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const accessToken = useAuthStore((s) => s.accessToken);
  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated && !accessToken) {
      router.replace("/login");
    }
  }, [accessToken, router, isHydrated]);

  if (!(isHydrated && accessToken)) {
    return <Loading />;
  }

  return <>{children}</>;
}
