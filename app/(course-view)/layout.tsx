import { useAuthStore } from "@/store/useAuthStore"
import { useProfileStore } from "@/store/useProfileStore"

import PrivateRoute from "@/components/Auth/PrivateRoute"

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
