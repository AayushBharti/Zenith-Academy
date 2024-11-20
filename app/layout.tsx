import "./globals.css"

import type { Metadata, Viewport } from "next"
import localFont from "next/font/local"
import { Toaster } from "react-hot-toast"

import { cn } from "@/lib/utils"

import Footer from "../components/Common/Footer"
import Navbar from "../components/Common/Navbar/Navbar"
import { ThemeProvider } from "../components/ThemeProviders"

const geistSans = localFont({
  src: "../public/fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
})
const geistMono = localFont({
  src: "../public/fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
})

export const metadata: Metadata = {
  title: {
    default: "Zentih Minds",
    template: `%s | Zentih Minds`,
  },
  description:
    "Zentih Minds is a platform for learning and exploring the world of AI and technology.",
  icons: {
    icon: "/favicon.ico",
  },
}

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: [{ media: "(prefers-color-scheme: dark)", color: "black" }],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "relative h-full antialiased max-w-[1500px] mx-auto",
          geistSans.variable,
          geistMono.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Toaster />
          <Navbar />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
