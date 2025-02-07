"use client"

import Link from "next/link"
import { notFound } from "next/navigation"
import { useProfileStore } from "@/store/use-profile-store"
import {
  BookOpenIcon,
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  Edit,
  MailIcon,
  PhoneIcon,
  User2Icon,
  XCircleIcon,
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"

export default function MyProfile() {
  const { user } = useProfileStore()

  if (!user) return notFound()

  const profileCompleteness = calculateProfileCompleteness(user)

  return (
    <div className="container mx-auto py-10 space-y-8">
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-r from-blue-800 to-purple-700 h-28" />
        <CardContent className="relative pt-16 pb-8 px-6">
          <Avatar className="absolute -top-16 left-6 h-32 w-32 border-4 border-white">
            <AvatarImage
              src={user.image}
              alt={`${user.firstName}'s profile picture`}
            />
            <AvatarFallback className="text-4xl">
              {user.firstName[0]}
              {user.lastName[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-1">
                {user.firstName} {user.lastName}
              </h1>
              <p className="text-muted-foreground">{user.email}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant="outline">{user.accountType}</Badge>
                <Badge variant={user.active ? "default" : "destructive"}>
                  {user.active ? "Active" : "Inactive"}
                </Badge>
                <Badge variant={user.approved ? "default" : "secondary"}>
                  {user.approved ? "Approved" : "Pending Approval"}
                </Badge>
              </div>
            </div>
            <Button asChild className="mt-4 md:mt-0">
              <Link href="/dashboard/settings">
                <Edit className="mr-2 h-4 w-4" />
                Edit Profile
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User2Icon className="mr-2 h-5 w-5" />
              About Me
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {user.additionalDetails.about || "No information provided."}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MailIcon className="mr-2 h-5 w-5" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center space-x-2">
              <MailIcon className="h-4 w-4 text-muted-foreground" />
              <span>{user.email}</span>
            </div>
            <div className="flex items-center space-x-2">
              <PhoneIcon className="h-4 w-4 text-muted-foreground" />
              <span>
                {user.additionalDetails.contactNumber || "Not provided"}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CalendarIcon className="mr-2 h-5 w-5" />
              Personal Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Date of Birth</span>
              <span className="text-sm">
                {user.additionalDetails.dateOfBirth || "Not provided"}
              </span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Gender</span>
              <span className="text-sm">
                {user.additionalDetails.gender || "Not provided"}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpenIcon className="mr-2 h-5 w-5" />
              Account Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Member Since</span>
              <span className="text-sm">
                {new Date(user.createdAt).toLocaleDateString()}
              </span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Last Updated</span>
              <span className="text-sm">
                {new Date(user.updatedAt).toLocaleDateString()}
              </span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Account Type</span>
              <span className="text-sm">{user.accountType}</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Account Status</span>
              <div className="flex items-center">
                {user.active ? (
                  <CheckCircleIcon className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <XCircleIcon className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span className="text-sm">
                  {user.active ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ClockIcon className="mr-2 h-5 w-5" />
            Profile Completeness
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={profileCompleteness} className="w-full" />
          <p className="mt-2 text-sm text-muted-foreground">
            Your profile is {profileCompleteness}% complete
          </p>
          {profileCompleteness < 100 && (
            <Button variant="link" asChild className="mt-2 p-0">
              <Link href="/dashboard/settings">Complete your profile</Link>
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function calculateProfileCompleteness(user: User) {
  const fields = [
    user.firstName,
    user.lastName,
    user.email,
    user.image,
    user.additionalDetails.about,
    user.additionalDetails.contactNumber,
    user.additionalDetails.gender,
    user.additionalDetails.dateOfBirth,
  ]
  const completedFields = fields.filter(Boolean).length
  return Math.round((completedFields / fields.length) * 100)
}
