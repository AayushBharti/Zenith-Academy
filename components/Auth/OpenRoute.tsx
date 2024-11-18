// This will prevent authenticated users from accessing this route
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/useAuthStore"

interface OpenRouteProps {
  children: React.ReactNode
}

export default function OpenRoute({ children }: OpenRouteProps) {
  const { token, loading } = useAuthStore()
  const router = useRouter()
  const [isRedirecting, setIsRedirecting] = useState(false)

  useEffect(() => {
    if (token && !loading) {
      setIsRedirecting(true)
      router.replace("/dashboard/my-profile")
    }
  }, [token, loading, router])

  if (loading || isRedirecting) {
    return (
      <div className="size-full flex justify-center items-center">
        <p>Loading...</p>
      </div>
    )
  }

  return children
}
