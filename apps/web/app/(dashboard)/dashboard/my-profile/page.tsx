"use client";

import { Calendar, Edit, Mail, Phone, User } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useProfileStore } from "@/store/use-profile-store";

export default function MyProfile() {
  const { user } = useProfileStore();

  if (!user) return notFound();

  const profileCompleteness = calculateProfileCompleteness(user);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="font-bold text-2xl tracking-tight">My Profile</h1>
          <p className="text-muted-foreground text-sm">
            Manage your personal information and account settings.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/settings">
            <Edit className="mr-2 h-4 w-4" /> Edit Profile
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* --- Left Column: Identity & Status (Col-span-4) --- */}
        <div className="space-y-6 lg:col-span-4">
          {/* Identity Card */}
          <Card className="overflow-hidden border-border/60 shadow-xs">
            <div className="relative h-32 bg-linear-to-r from-violet-600 to-indigo-600">
              {/* Decorative background elements */}
              <div className="-mr-8 -mt-8 absolute top-0 right-0 h-24 w-24 rounded-full bg-white/10 blur-xl" />
              <div className="-ml-8 -mb-8 absolute bottom-0 left-0 h-24 w-24 rounded-full bg-white/10 blur-xl" />
            </div>
            <CardContent className="relative px-6 pt-0 pb-6">
              <div className="-mt-12 flex flex-col items-center text-center">
                <div className="relative">
                  <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
                    <AvatarImage className="object-cover" src={user.image} />
                    <AvatarFallback className="bg-muted text-2xl text-muted-foreground">
                      {user.firstName[0]}
                      {user.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <span
                    className={cn(
                      "absolute right-1 bottom-1 flex h-5 w-5 items-center justify-center rounded-full border-4 border-background",
                      user.active ? "bg-green-500" : "bg-red-500"
                    )}
                    title={user.active ? "Active" : "Inactive"}
                  >
                    <span className="sr-only">
                      {user.active ? "Active" : "Inactive"}
                    </span>
                  </span>
                </div>

                <div className="mt-4 space-y-1">
                  <h2 className="font-bold text-xl">
                    {user.firstName} {user.lastName}
                  </h2>
                  <p className="text-muted-foreground text-sm">{user.email}</p>
                </div>

                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  <Badge
                    className="px-3 py-1 font-medium capitalize"
                    variant="secondary"
                  >
                    {user.accountType.toLowerCase()}
                  </Badge>
                  <Badge
                    className={cn(
                      "px-3 py-1",
                      user.approved &&
                        "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400"
                    )}
                    variant={user.approved ? "outline" : "destructive"}
                  >
                    {user.approved ? "Verified" : "Unverified"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Health */}
          <Card className="border-border/60 shadow-xs">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="font-medium text-muted-foreground text-sm uppercase tracking-wide">
                  Profile Status
                </CardTitle>
                <span className="font-bold text-sm">
                  {profileCompleteness}%
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <Progress className="h-2" value={profileCompleteness} />

              {profileCompleteness < 100 && (
                <div className="mt-4 space-y-2 rounded-lg border border-border/50 bg-accent/50 p-3 text-xs">
                  <p className="font-medium text-foreground">
                    Pending Action Items:
                  </p>
                  <ul className="ml-1 list-inside list-disc space-y-1 text-muted-foreground">
                    {!user.image && <li>Upload profile picture</li>}
                    {!user.additionalDetails.about && (
                      <li>Add bio description</li>
                    )}
                    {!user.additionalDetails.contactNumber && (
                      <li>Add contact number</li>
                    )}
                    {!user.additionalDetails.dateOfBirth && (
                      <li>Add date of birth</li>
                    )}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Meta Details */}
          <Card className="border-border/60 shadow-xs">
            <CardContent className="space-y-4 p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" /> Joined
                </span>
                <span className="font-medium">
                  {new Date(user.createdAt).toLocaleDateString(undefined, {
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* --- Right Column: Details & Bio (Col-span-8) --- */}
        <div className="space-y-6 lg:col-span-8">
          {/* About Me */}
          <Card className="border-border/60 shadow-xs">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>About Me</CardTitle>
                  <CardDescription>
                    A brief introduction about your professional background.
                  </CardDescription>
                </div>
                {!user.additionalDetails.about && (
                  <Button asChild size="sm" variant="ghost">
                    <Link
                      className="text-primary hover:text-primary/80"
                      href="/dashboard/settings"
                    >
                      Add Bio
                    </Link>
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {user.additionalDetails.about ? (
                <p className="whitespace-pre-line text-muted-foreground text-sm leading-7">
                  {user.additionalDetails.about}
                </p>
              ) : (
                <div className="rounded-xl border-2 border-muted border-dashed bg-muted/30 py-8 text-center">
                  <p className="text-muted-foreground text-sm">
                    Your bio is currently empty.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Personal Details Grid */}
          <Card className="border-border/60 shadow-xs">
            <CardHeader>
              <CardTitle>Personal Details</CardTitle>
              <CardDescription>
                Your personal information and contact details.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
                <DetailItem label="First Name" value={user.firstName} />
                <DetailItem label="Last Name" value={user.lastName} />
                <DetailItem icon={Mail} label="Email" value={user.email} />
                <DetailItem
                  icon={Phone}
                  label="Phone Number"
                  placeholder="Add phone number"
                  value={user.additionalDetails.contactNumber}
                />
                <DetailItem
                  icon={Calendar}
                  label="Date of Birth"
                  placeholder="Add DOB"
                  value={user.additionalDetails.dateOfBirth}
                />
                <DetailItem
                  icon={User}
                  label="Gender"
                  placeholder="Add gender"
                  value={user.additionalDetails.gender}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// --- Helper Components ---

function DetailItem({
  label,
  value,
  icon: Icon,
  placeholder,
}: {
  label: string;
  value?: string | null;
  icon?: any;
  placeholder?: string;
}) {
  return (
    <div className="group -mx-3 space-y-1.5 rounded-lg p-3 transition-colors hover:bg-muted/50">
      <h4 className="flex items-center gap-2 font-medium text-muted-foreground text-xs uppercase tracking-wider">
        {Icon && <Icon className="h-3.5 w-3.5 opacity-70" />}
        {label}
      </h4>
      <div className="flex items-center justify-between">
        <p
          className={cn(
            "font-medium text-foreground text-sm",
            !value && "text-muted-foreground/60 italic"
          )}
        >
          {value || placeholder || "Not provided"}
        </p>
      </div>
    </div>
  );
}

function calculateProfileCompleteness(user: any) {
  const fields = [
    user.firstName,
    user.lastName,
    user.email,
    user.image,
    user?.additionalDetails?.about,
    user?.additionalDetails?.contactNumber,
    user?.additionalDetails?.gender,
    user?.additionalDetails?.dateOfBirth,
  ];
  // Filter out null, undefined, or empty strings
  const completedFields = fields.filter(
    (field) => field && field.trim() !== ""
  ).length;
  return Math.round((completedFields / fields.length) * 100);
}
