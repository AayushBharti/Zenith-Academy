"use client"

import { useAuthStore } from "@/store/use-auth-store"

import Template from "@/components/auth/auth-template"
import OpenRoute from "@/components/auth/open-route"

function Signup() {
  const { loading } = useAuthStore()
  return (
    <OpenRoute>
      {loading ? (
        <div className=" h-[100vh] flex justify-center items-center">
          <div className="custom-loader"></div>
        </div>
      ) : (
        <Template
          title="Join the millions learning to code with ZenithMinds for free"
          description1="Build skills for today, tomorrow, and beyond."
          description2="Education to future-proof your career."
          image="/Images/signup.webp"
          formType="signup"
        />
      )}
    </OpenRoute>
  )
}

export default Signup
