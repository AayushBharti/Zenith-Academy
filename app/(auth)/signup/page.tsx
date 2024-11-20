"use client"

import { useAuthStore } from "@/store/useAuthStore"

import Template from "@/components/Auth/AuthTemplate"

import OpenRoute from "@/components/Auth/OpenRoute"

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
