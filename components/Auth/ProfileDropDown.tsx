"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { ACCOUNT_TYPE } from "@/data/constants"
import { logout } from "@/services/authService"
import { useProfileStore } from "@/store/useProfileStore"
import {
  BookOpen,
  Calendar,
  Github,
  GraduationCap,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Settings,
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function ProfileDropdown() {
  const { user } = useProfileStore()
  const router = useRouter()

  if (!user) {
    console.log("no user")
    localStorage.setItem("token", "")
    return null
  }

  const handleLogout = () => {
    logout(router.push)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="h-8 w-8 cursor-pointer">
          <AvatarImage src={user.image} alt={`${user.firstName}'s profile`} />
          <AvatarFallback>{user.firstName.charAt(0)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/dashboard/my-profile">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              <span>Dashboard</span>
            </Link>
          </DropdownMenuItem>
          {user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
            <DropdownMenuItem asChild>
              <Link href="/dashboard/my-courses">
                <BookOpen className="mr-2 h-4 w-4" />
                <span>My Courses</span>
              </Link>
            </DropdownMenuItem>
          )}
          {user?.accountType === ACCOUNT_TYPE.STUDENT && (
            <DropdownMenuItem asChild>
              <Link href="/dashboard/enrolled-courses">
                <GraduationCap className="mr-2 h-4 w-4" />
                <span>Enrolled Courses</span>
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem asChild>
            <Link href="/contact">
              <Calendar className="mr-2 h-4 w-4" />
              <span>Schedule</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/contact">
              <MessageSquare className="mr-2 h-4 w-4" />
              <span>Contact</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/dashboard/settings">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link
            href="https://github.com/AayushBharti/Zenith-Academy"
            target="_blank"
          >
            <Github className="mr-2 h-4 w-4" />
            <span>GitHub</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/about">
            <HelpCircle className="mr-2 h-4 w-4" />
            <span>About</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
