// This will prevent Unauthenticated users from accessing this route
"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/use-auth-store"

import Loading from "@/app/loading"

export default function PrivateRoute({
  children,
}: {
  children: React.ReactNode
}) {
  const { token, loading } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (!token && !loading) {
      router.replace("/login")
    }
  }, [token, loading, router])

  if (token) return children
  else return <Loading />
}
