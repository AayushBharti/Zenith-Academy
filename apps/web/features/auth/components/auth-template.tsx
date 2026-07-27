"use client";

import Link from "next/link";

import { AuthImagePanel } from "./auth-image-panel";
import LoginForm from "./login-form";
import SignupForm from "./signup-form";

interface TemplateProps {
  title: string;
  description: string;
  formType: "login" | "signup";
}

export default function AuthTemplate({
  title,
  description,
  formType,
}: TemplateProps) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left — Form side */}
      <div className="relative flex flex-col bg-background">
        {/* Branding */}
        <div className="absolute top-8 left-8 z-10">
          <Link className="flex items-center gap-2" href="/">
            <img alt="" aria-hidden="true" className="size-9" src="/icon.svg" />
            <span className="font-semibold text-sm">Nextdemy</span>
          </Link>
        </div>

        {/* Centered form */}
        <div className="flex flex-1 items-center justify-center px-6 py-24 sm:px-12">
          <div className="w-full max-w-sm space-y-8">
            <div className="space-y-2">
              <h1 className="font-bold text-2xl tracking-tight">{title}</h1>
              <p className="text-muted-foreground text-sm">{description}</p>
            </div>

            {formType === "signup" ? <SignupForm /> : <LoginForm />}

            <p className="text-center text-muted-foreground text-sm">
              {formType === "login" ? (
                <>
                  Don&apos;t have an account?{" "}
                  <Link
                    className="font-medium text-foreground underline underline-offset-4 hover:text-primary"
                    href="/signup"
                  >
                    Sign up
                  </Link>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <Link
                    className="font-medium text-foreground underline underline-offset-4 hover:text-primary"
                    href="/login"
                  >
                    Log in
                  </Link>
                </>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Right — Random abstract image */}
      <AuthImagePanel />
    </div>
  );
}
