// This will prevent Unauthenticated users from accessing this route
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/useAuthStore"

interface PrivateRouteProps {
  children: React.ReactNode
}

export default function PrivateRoute({ children }: PrivateRouteProps) {
  const { token, loading } = useAuthStore()
  const router = useRouter()
  const [isRedirecting, setIsRedirecting] = useState(false)

  useEffect(() => {
    if (!token && !loading) {
      setIsRedirecting(true)
      router.replace("/login")
    }
  }, [token, loading, router])

  if (loading || isRedirecting) {
    return (
      <div className="size-full flex justify-center items-center">
        Loading...
      </div>
    )
  }

  return children
}
