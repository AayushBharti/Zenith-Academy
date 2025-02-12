// This will prevent non Instructor users from accessing this route
"use client"

import { useEffect } from "react"
import { notFound, useRouter } from "next/navigation"
import { ACCOUNT_TYPE } from "@/data/constants"
import { useProfileStore } from "@/store/use-profile-store"

import Loading from "@/app/loading"

export default function InstructorRoute({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useProfileStore()
  const isInstructor = user?.accountType === ACCOUNT_TYPE.INSTRUCTOR
  const router = useRouter()

  useEffect(() => {
    if (!isInstructor && !loading) {
      return notFound()
    }
  }, [user?.accountType, loading, router])

  if (isInstructor) return children
  else return <Loading />
}
