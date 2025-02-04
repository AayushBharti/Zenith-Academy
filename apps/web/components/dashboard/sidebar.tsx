"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { sidebarLinks } from "@/data/dashboard-links"
import { logout } from "@/services/auth-service"
import { useProfileStore } from "@/store/use-profile-store"
import { LogOut, Settings } from "lucide-react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

export default function Sidebar() {
  const { user } = useProfileStore()
  const router = useRouter()
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false)
  const pathname = usePathname()

  const handleLogout = () => {
    logout(router.push)
    window.location.reload()
  }

  const NavLink = ({
    href,
    icon: Icon,
    name,
  }: {
    href: string
    icon: React.ElementType
    name: string
  }) => (
    <Link
      href={href}
      className={`flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
        pathname === href
          ? "bg-secondary text-secondary-foreground"
          : "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
      }`}
    >
      <Icon className="h-5 w-5" />
      <span>{name}</span>
    </Link>
  )

  const SidebarContent = () => (
    <div className="flex h-[94%] flex-col justify-between py-4">
      <nav className="space-y-2 px-2">
        {sidebarLinks.map((link) =>
          link.type && user?.accountType !== link.type ? null : (
            <NavLink
              key={link.id}
              href={link.path}
              icon={link.icon}
              name={link.name}
            />
          )
        )}
        <NavLink href="/dashboard/settings" icon={Settings} name="Settings" />
      </nav>
      <nav className="space-y-2 px-2">
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={() => setIsLogoutDialogOpen(true)}
        >
          <LogOut className="mr-2 h-5 w-5" />
          Logout
        </Button>
      </nav>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="sticky left-0 top-14 hidden h-screen w-64 flex-col border-r bg-background lg:flex">
        <SidebarContent />
      </div>

      {/* Mobile Bottom Navbar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t bg-background py-2 lg:hidden">
        {sidebarLinks.map((link) =>
          link.type && user?.accountType !== link.type ? null : (
            <Link
              key={link.id}
              href={link.path}
              className={`flex flex-col items-center p-2 ${
                pathname === link.path
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              <link.icon className="h-5 w-5" />
              <span className="text-xs">{link.name}</span>
            </Link>
          )
        )}
        <Link
          href="/dashboard/settings"
          className={`flex flex-col items-center p-2 ${
            pathname === "/dashboard/settings"
              ? "text-primary"
              : "text-muted-foreground"
          }`}
        >
          <Settings className="h-5 w-5" />
          <span className="text-xs">Settings</span>
        </Link>
      </nav>

      {/* Logout Confirmation Dialog */}
      <AlertDialog
        open={isLogoutDialogOpen}
        onOpenChange={setIsLogoutDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to logout?
            </AlertDialogTitle>
            <AlertDialogDescription>
              You will be logged out of your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout}>Logout</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
