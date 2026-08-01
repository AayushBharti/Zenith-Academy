"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import Loading from "@/app/loading";
import { ACCOUNT_TYPE } from "@/data/constants";
import { useProfileStore } from "@/features/profile/use-profile-store";

/** Blocks non-student users from accessing student-only pages. */
export default function StudentRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useProfileStore((s) => s.user);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return <Loading />;
  }

  if (user?.accountType !== ACCOUNT_TYPE.STUDENT) {
    return notFound();
  }

  return <>{children}</>;
}
