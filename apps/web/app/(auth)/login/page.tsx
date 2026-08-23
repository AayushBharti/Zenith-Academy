import Template from "@/features/auth/components/auth-template";
import OpenRoute from "@/features/auth/components/open-route";

export default function Login() {
  return (
    <OpenRoute>
      <Template
        description="Enter your email below to login to your account"
        formType="login"
        title="Login to your account"
      />
    </OpenRoute>
  );
}
