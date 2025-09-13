// This will prevent non Instructor users from accessing this route
"use client"

import { useEffect } from "react"
import { notFound, useRouter } from "next/navigation"
import { useProfileStore } from "@/store/use-profile-store"

import Loading from "@/app/loading"

export default function InstructorRoute({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading, isInstructor } = useProfileStore()
  const router = useRouter()

  useEffect(() => {
    if (!isInstructor && !loading) {
      return notFound()
    }
  }, [user?.accountType, loading, router])

  if (isInstructor) return children
  else return <Loading />
}
