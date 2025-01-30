import { useAuthStore } from "@/store/use-auth-store"
import { useProfileStore } from "@/store/use-profile-store"

import PrivateRoute from "@/components/auth/private-route"

import Loading from "../loading"

export default function CourseViewLayout({
  children,
}: {
  children?: React.ReactNode
}) {
  const { loading: authLoading } = useAuthStore.getState()
  const { loading: profileLoading } = useProfileStore.getState()

  if (authLoading || profileLoading) {
    return <Loading />
  }

  return (
    <PrivateRoute>
      <div className="flex max-w-[1500px] bg-background relative h-full max-w-8xl mx-auto antialiased">
        {children}
      </div>
    </PrivateRoute>
  )
}
