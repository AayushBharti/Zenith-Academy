import "./globals.css";

import { Toaster } from "@workspace/ui/components/sonner";
import { ThemeProvider } from "@workspace/ui/components/theme-provider";
import { cn } from "@workspace/ui/lib/utils";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import BackendListener from "@/features/app-shell/components/backend-listener";
import { FooterWrapper } from "@/features/layout/components/footer-wrapper";
import Navbar from "@/features/navigation/components/navbar";
import { QueryProvider } from "@/lib/query-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const geistMono = localFont({
  src: "../public/fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: {
    default: "Nextdemy",
    template: "%s | Nextdemy",
  },
  description:
    "Nextdemy is a platform for learning and exploring the world of AI and technology.",
};

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: [{ media: "(prefers-color-scheme: dark)", color: "black" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className="dark" lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "relative mx-auto h-full font-inter antialiased selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black",
          inter.variable,
          geistMono.variable
        )}
      >
        <ThemeProvider>
          <QueryProvider>
            <BackendListener />
            <Toaster position="top-center" />
            <Navbar />
            {children}
            <FooterWrapper />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
