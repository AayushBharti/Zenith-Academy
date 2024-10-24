"use client"

import Link from "next/link"
import { useProfileStore } from "@/store/useProfileStore"
import {
  CalendarIcon,
  Edit,
  MailIcon,
  PhoneIcon,
  User2Icon,
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export default function MyProfile() {
  const { user } = useProfileStore()

  if (!user) return null

  const profileCompleteness = calculateProfileCompleteness(user)

  return (
    <div className="container mx-auto py-10 space-y-6">
      <Card>
        <CardContent className="flex flex-col md:flex-row items-center justify-between p-6">
          <div className="flex flex-col md:flex-row items-center mb-4 md:mb-0">
            <Avatar className="h-24 w-24 md:mr-6 mb-4 md:mb-0">
              <AvatarImage
                src={user.image}
                alt={`${user.firstName}'s profile picture`}
              />
              <AvatarFallback>
                {user.firstName[0]}
                {user.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold">
                {user.firstName} {user.lastName}
              </h1>
              <p className="text-muted-foreground">{user.email}</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-2">
                <Badge>{user.accountType}</Badge>
                <Badge variant={user.active ? "default" : "destructive"}>
                  {user.active ? "Active" : "Inactive"}
                </Badge>
                <Badge variant={user.approved ? "default" : "secondary"}>
                  {user.approved ? "Approved" : "Pending Approval"}
                </Badge>
              </div>
            </div>
          </div>
          <Button asChild>
            <Link href="/dashboard/settings">
              <Edit className="mr-2 h-4 w-4" />
              Edit Profile
            </Link>
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Profile Completeness</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={profileCompleteness} className="w-full" />
            <p className="mt-2 text-sm text-muted-foreground">
              Your profile is {profileCompleteness}% complete
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>About Me</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {user.additionalDetails.about || "No information provided."}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center space-x-2">
              <MailIcon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{user.email}</span>
            </div>
            <div className="flex items-center space-x-2">
              <PhoneIcon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                {user.additionalDetails.contactNumber || "Not provided"}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Personal Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center space-x-2">
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">DOB:</span>
              <span className="text-sm">
                {user.additionalDetails.dateOfBirth || "Not provided"}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <User2Icon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Gender:</span>
              <span className="text-sm">
                {user.additionalDetails.gender || "Not provided"}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Member Since</span>
            <span className="text-sm">
              {new Date(user.createdAt).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Last Updated</span>
            <span className="text-sm">
              {new Date(user.updatedAt).toLocaleDateString()}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function calculateProfileCompleteness(user: any) {
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
