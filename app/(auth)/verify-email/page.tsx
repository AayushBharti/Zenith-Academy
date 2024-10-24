"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/useAuthStore"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"

import { signUp } from "../../../services/authService"

const otpSchema = z.object({
  otp: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
})

export default function VerifyEmail() {
  const router = useRouter()
  const { signupData } = useAuthStore()
  const [countdown, setCountdown] = useState(30)
  const [error, setError] = useState<string | null>(null)

  console.log(error)
  // TODO: Add error toast

  useEffect(() => {
    if (!signupData) {
      router.push("/signup")
    }
  }, [signupData, router])

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prevCountdown) =>
        prevCountdown > 0 ? prevCountdown - 1 : 0
      )
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const form = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  })

  async function onSubmit(data: z.infer<typeof otpSchema>) {
    setError(null)
    if (signupData) {
      const {
        email,
        accountType,
        confirmPassword,
        password,
        lastName,
        firstName,
      } = signupData

      try {
        await signUp(
          accountType,
          firstName,
          lastName,
          email,
          password,
          confirmPassword,
          data.otp,
          router.push
        )
      } catch (error) {
        setError("Invalid OTP. Please try again.")
      }
    } else {
      setError("Signup data is not available")
    }
  }

  const handleResendOTP = () => {
    // TODO: Implement resend OTP logic here
    setCountdown(30)
  }

  if (!signupData) {
    return null
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Verify Your Email
          </CardTitle>
          <CardDescription>
            We&apos;ve sent a 6-digit code to {signupData.email}. Enter it below
            to verify your email address.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>One-Time Password</FormLabel>
                    <FormControl>
                      <InputOTP maxLength={6} {...field}>
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                        </InputOTPGroup>
                        <InputOTPSeparator />
                        <InputOTPGroup>
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormDescription>
                      Please enter the one-time password sent to your email.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-between items-center">
                <Button type="submit" className="w-full">
                  Verify Email
                </Button>
              </div>
            </form>
          </Form>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500">
              Didn&apos;t receive the code?
              {countdown > 0 ? (
                <span className="ml-1">Resend in {countdown}s</span>
              ) : (
                <Button
                  variant="link"
                  className="p-0 h-auto font-normal"
                  onClick={handleResendOTP}
                >
                  Resend OTP
                </Button>
              )}
            </p>
          </div>

          <div className="mt-6">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push("/signup")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Sign Up
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
