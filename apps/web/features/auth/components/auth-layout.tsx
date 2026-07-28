"use client";

import Link from "next/link";

import { AuthImagePanel } from "./auth-image-panel";

interface AuthLayoutProps {
  children: React.ReactNode;
}

/** Shared layout for secondary auth pages (verify-email, forgot-password, update-password). */
export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left — Content side */}
      <div className="relative flex flex-col bg-background">
        <div className="absolute top-8 left-8 z-10">
          <Link className="flex items-center gap-2" href="/">
            <img alt="" aria-hidden="true" className="size-9" src="/icon.svg" />
            <span className="font-semibold text-sm">Nextdemy</span>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center px-6 py-24 sm:px-12">
          <div className="w-full max-w-sm">{children}</div>
        </div>
      </div>

      {/* Right — Random abstract image */}
      <AuthImagePanel />
    </div>
  );
}
