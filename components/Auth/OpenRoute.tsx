// This will prevent authenticated users from accessing this route
"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/useAuthStore"

import Loading from "@/app/loading"

export default function OpenRoute({ children }: { children: React.ReactNode }) {
  const { token, loading } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (token && !loading) {
      router.replace("/dashboard/my-profile")
    }
  }, [token, loading, router])

  if (!token) return children
  else return <Loading />
}
