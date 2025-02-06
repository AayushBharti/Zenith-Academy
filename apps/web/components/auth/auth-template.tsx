"use client"

import React from "react"
import Image from "next/image"

import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

import LoginForm from "./login-form"
import SignupForm from "./signup-form"

interface TemplateProps {
  title: string
  description1: string
  description2: string
  image: string
  formType?: "login" | "signup"
}

export default function AuthTemplate({
  title,
  description1,
  description2,
  image,
  formType,
}: TemplateProps) {
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="container mx-auto flex min-h-screen items-center justify-center px-4 py-16">
      <Card className="w-full max-w-4xl overflow-hidden rounded-2xl shadow-xl">
        <div className="grid md:grid-cols-2">
          <div className="relative hidden md:block">
            {isLoading ? (
              <Skeleton className="absolute inset-0" />
            ) : (
              <Image
                src={image}
                alt="Auth background"
                layout="fill"
                objectFit="cover"
                className="absolute inset-0"
              />
            )}
          </div>
          <CardContent className="p-8 md:p-12">
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-[300px] w-full" />
              </div>
            ) : (
              <>
                <h1 className="mb-2 text-3xl font-bold tracking-tight">
                  {title}
                </h1>
                <p className="mb-6 text-muted-foreground">
                  {description1}{" "}
                  <span className="font-medium text-primary">
                    {description2}
                  </span>
                </p>
                {formType === "signup" ? <SignupForm /> : <LoginForm />}
              </>
            )}
          </CardContent>
        </div>
      </Card>
    </div>
  )
}
