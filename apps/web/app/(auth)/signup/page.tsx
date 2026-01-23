"use client";

import Template from "@/components/auth/auth-template";
import OpenRoute from "@/components/auth/open-route";
import { useAuthStore } from "@/store/use-auth-store";

function Signup() {
  const { loading } = useAuthStore();
  return (
    <OpenRoute>
      {loading ? (
        <div className="flex h-screen items-center justify-center">
          <div className="custom-loader" />
        </div>
      ) : (
        <Template
          description1="Build skills for today, tomorrow, and beyond."
          description2="Education to future-proof your career."
          formType="signup"
          image="/assets/signup.webp"
          title="Join the millions learning to code with ZenithAcademy for free"
        />
      )}
    </OpenRoute>
  );
}

export default Signup;
