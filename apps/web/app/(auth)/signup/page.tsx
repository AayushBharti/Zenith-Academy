import Template from "@/features/auth/components/auth-template";
import OpenRoute from "@/features/auth/components/open-route";

export default function Signup() {
  return (
    <OpenRoute>
      <Template
        description="Create your account to start learning"
        formType="signup"
        title="Create an account"
      />
    </OpenRoute>
  );
}
