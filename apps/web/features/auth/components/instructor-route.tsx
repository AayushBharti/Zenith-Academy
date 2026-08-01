"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import Loading from "@/app/loading";
import { ACCOUNT_TYPE } from "@/data/constants";
import { useProfileStore } from "@/features/profile/use-profile-store";

/** Blocks non-instructor users from accessing instructor-only pages. */
export default function InstructorRoute({
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

  if (user?.accountType !== ACCOUNT_TYPE.INSTRUCTOR) {
    return notFound();
  }

  return <>{children}</>;
}
