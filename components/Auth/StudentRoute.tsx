// This will prevent non Student users from accessing this route
"use client"

import { useEffect } from "react"
import { notFound, useRouter } from "next/navigation"
import { ACCOUNT_TYPE } from "@/data/constants"
import { useProfileStore } from "@/store/useProfileStore"

import Loading from "@/app/loading"

export default function StudentRoute({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useProfileStore()
  const isStudent = user?.accountType === ACCOUNT_TYPE.STUDENT
  const router = useRouter()

  useEffect(() => {
    if (!isStudent && !loading) {
      return notFound()
    }
  }, [user?.accountType, loading, router])

  if (isStudent) return children
  else return <Loading />
}
