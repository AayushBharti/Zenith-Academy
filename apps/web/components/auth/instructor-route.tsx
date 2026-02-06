"use client";

import { notFound, useRouter } from "next/navigation";
import { useEffect } from "react";
import Loading from "@/app/loading";
import { ACCOUNT_TYPE } from "@/data/constants"; // Ensure this is imported
import { useProfileStore } from "@/store/use-profile-store";

export default function InstructorRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useProfileStore();
  const router = useRouter();

  // Calculate permission based on user object for consistency
  const isInstructor = user?.accountType === ACCOUNT_TYPE.INSTRUCTOR;

  useEffect(() => {
    if (!(loading || isInstructor)) {
      // Using router.replace is often smoother than notFound() for auth redirects,
      // but notFound() is valid if you want to hide the route entirely.
      notFound();
    }
  }, [user, loading, isInstructor, router]);

  if (loading || !isInstructor) {
    return <Loading />;
  }

  return <>{children}</>;
}
