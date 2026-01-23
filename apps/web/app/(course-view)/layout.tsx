import PrivateRoute from "@/components/auth/private-route";
import { useAuthStore } from "@/store/use-auth-store";
import { useProfileStore } from "@/store/use-profile-store";

import Loading from "../loading";

export default function CourseViewLayout({
  children,
}: {
  children?: React.ReactNode;
}) {
  const { loading: authLoading } = useAuthStore.getState();
  const { loading: profileLoading } = useProfileStore.getState();

  if (authLoading || profileLoading) {
    return <Loading />;
  }

  return <PrivateRoute>{children}</PrivateRoute>;
}
