// // import PrivateRoute from "@/components/Auth/PrivateRoute"
// export default function Dashboard() {
//   // const {loading: authLoading} = useSelector( (state) => state.auth );
//   // const {loading: profileLoading} = useSelector( (state) => state.profile );
//   // if(profileLoading || authLoading) {
//   //     return (
//   //         <div className='mt-10'>
//   //             Loading...
//   //         </div>
//   //     )
//   // }
//   return (
//     // <PrivateRoute>
//     <div className="relative flex bg-richblack-400">
//       <Sidebar />
//       <div className=" flex-1 overflow-auto bg-richblack-900">
//         <div className="py-10">
//           <Outlet />
//         </div>
//       </div>
//     </div>
//     //{/* </PrivateRoute> */}
//   )
// }

"use client"

import { useEffect, useState } from "react"
import { useAuthStore } from "@/store/useAuthStore"
import { useProfileStore } from "@/store/useProfileStore"
import { Loader2 } from "lucide-react"

import PrivateRoute from "@/components/Auth/PrivateRoute"
import Sidebar from "@/components/Dashboard/Sidebar"

export default function DashboardLayout({
  children,
}: {
  children?: React.ReactNode
}) {
  const [isLoading, setIsLoading] = useState(false)
  const { loading: authLoading } = useAuthStore()
  const { loading: profileLoading } = useProfileStore()

  useEffect(() => {
    if (!authLoading && !profileLoading) {
      setIsLoading(false)
    }
  }, [authLoading, profileLoading])

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <PrivateRoute>
      <div className="flex max-w-[1500px] bg-background relative h-full max-w-8xl mx-auto antialiased">
        <Sidebar />
        <main className="flex-1 overflow-auto p-8">{children}</main>
      </div>
    </PrivateRoute>
  )
}
