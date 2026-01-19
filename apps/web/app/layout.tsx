import "./globals.css";

import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import Navbar from "@/components/common/navbar/navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import BackendListener from "../components/common/backend-listner";

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
    default: "Zentih Minds",
    template: "%s | Zentih Minds",
  },
  description:
    "Zentih Minds is a platform for learning and exploring the world of AI and technology.",
  icons: {
    icon: "/favicon.ico",
  },
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
          <BackendListener />
          <Toaster position="top-center" />
          <Navbar />
          {children}
          {/* <Footer /> */}
        </ThemeProvider>
      </body>
    </html>
  );
}
