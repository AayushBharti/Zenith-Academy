"use client"

import React, { useState } from "react"
import { CornerDownRight, Lightbulb } from "lucide-react"

import Template from "@/components/Auth/AuthTemplate"
import OpenRoute from "@/components/Auth/OpenRoute"

const Login: React.FC = () => {
  const [showDemo, setShowDemo] = useState<boolean>(true)
  // const dispatch = useDispatch();
  // const router = useRouter();

  return (
    <OpenRoute>
      {/* Demo Login ID */}
      <div
        className={`${
          showDemo ? "" : "hidden"
        } justify-center items-center absolute bg-richblack-400 top-52 md:top-32 md:right-[50%] right-[10%] p-6 -rotate-[20deg] z-20`}
      >
        <div className="flex flex-col gap-2 relative">
          <div
            onClick={() => {
              setShowDemo(false)
            }}
            className="absolute top-[-30px] right-[-20px] text-5xl text-richblack-900 rounded-full w-[40px] h-[40px] flex justify-center items-center cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 100 100"
              width="20"
              height="20"
            >
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="#888888"
                stroke="#000000"
                strokeWidth="2"
              />
              <circle cx="50" cy="50" r="20" fill="#ffffff" />
            </svg>
          </div>
          <div className="gap-y-2 flex flex-col">
            <p className="text-2xl font-extrabold text-richblack-5 flex items-center">
              Take a Demo &nbsp; <Lightbulb size={20} />
            </p>
            <div>
              <button
                // onClick={() => {
                //   dispatch(
                //     login("demoAccount@gmail.com", "12345", router.push)
                //   );
                // }}
                className="bg-yellow-100 font-semibold mt-4 mb-1 text-richblack-900 px-4 py-2 rounded-md flex"
              >
                <CornerDownRight className="text-2xl text-richblack-900 hidden md:block" />
                Click here for Instructor Demo
              </button>
            </div>
            <div>
              <button
                // onClick={() => {
                //   dispatch(login("1234@gmail.com", "12345", router.push));
                // }}
                className="bg-yellow-100 font-semibold text-richblack-900 px-4 py-2 rounded-md flex"
              >
                <CornerDownRight className="text-2xl text-richblack-900 md:block hidden" />
                Click here for Student Demo
              </button>
            </div>
          </div>
        </div>
      </div>
      <Template
        title="Welcome Back"
        description1="Build skills for today, tomorrow, and beyond."
        description2="Education to future-proof your career."
        image="/Images/login.webp"
        formType="login"
      />
    </OpenRoute>
  )
}

export default Login
