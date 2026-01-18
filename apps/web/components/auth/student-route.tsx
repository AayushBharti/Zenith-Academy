"use client";

import { notFound, useRouter } from "next/navigation";
import { useEffect } from "react";
import Loading from "@/app/loading";
import { ACCOUNT_TYPE } from "@/data/constants";
import { useProfileStore } from "@/store/use-profile-store";

export default function StudentRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useProfileStore();
  const router = useRouter();

  const isStudent = user?.accountType === ACCOUNT_TYPE.STUDENT;

  useEffect(() => {
    if (!(loading || isStudent)) {
      notFound();
    }
  }, [user, loading, isStudent, router]);

  if (loading || !isStudent) {
    return <Loading />;
  }

  return <>{children}</>;
}
