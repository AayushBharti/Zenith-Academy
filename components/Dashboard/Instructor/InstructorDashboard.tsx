"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { fetchInstructorCourses } from "@/services/courseDetailsService"
import { getInstructorDashboard } from "@/services/profileService"
import { useAuthStore } from "@/store/useAuthStore"
import {
  BookOpen,
  Clock,
  DollarSign,
  PlusIcon,
  TrendingUp,
  Users,
} from "lucide-react"

import { CourseDetails } from "@/types/course"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { CourseCard } from "../../Common/CourseCard"
import DashboardChart from "./DashboardChart"

interface CourseStats {
  _id: string
  courseName: string
  courseDescription: string
  totalRevenue: number
  totalStudents: number
}

export default function InstructorDashboard() {
  const [dashboardData, setDashboardData] = useState<CourseStats[]>([])
  const [courses, setCourses] = useState<CourseDetails[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { token } = useAuthStore()

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        setError("Authentication token is missing")
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        const [instructorDetails, instructorCourses] = await Promise.all([
          getInstructorDashboard(token),
          fetchInstructorCourses(token),
        ])

        setDashboardData(instructorDetails)
        setCourses(instructorCourses)
      } catch (error) {
        console.error("Error fetching data:", error)
        setError("Failed to fetch dashboard data. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [token])

  const { totalEarnings, totalStudents, topPerformingCourses } = useMemo(() => {
    const totalEarnings = dashboardData.reduce(
      (acc, course) => acc + course.totalRevenue,
      0
    )
    const totalStudents = dashboardData.reduce(
      (acc, course) => acc + course.totalStudents,
      0
    )
    const topPerformingCourses = [...dashboardData]
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, 5)

    return { totalEarnings, totalStudents, topPerformingCourses }
  }, [dashboardData])

  if (isLoading) {
    return <DashboardSkeleton />
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">Instructor Dashboard</h1>
        <Button
          onClick={() => router.push("/dashboard/add-course")}
          className="flex items-center gap-x-2"
        >
          <span>Add Course</span>
          <PlusIcon className="h-5 w-5" />
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <StatCard
          title="Total Courses"
          value={courses.length}
          icon={<BookOpen className="h-6 w-6" />}
        />
        <StatCard
          title="Total Students"
          value={totalStudents}
          icon={<Users className="h-6 w-6" />}
        />
        <StatCard
          title="Total Earnings"
          value={`₹${totalEarnings.toLocaleString()}`}
          icon={<DollarSign className="h-6 w-6" />}
        />
        <StatCard
          title="Avg. Revenue per Course"
          value={`₹${(totalEarnings / courses.length).toLocaleString()}`}
          icon={<TrendingUp className="h-6 w-6" />}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Performance Overview</CardTitle>
            <CardDescription>
              Visualize your revenue and student growth
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="revenue">
              <TabsList className="mb-4">
                <TabsTrigger value="revenue">Revenue</TabsTrigger>
                <TabsTrigger value="students">Students</TabsTrigger>
              </TabsList>
              <TabsContent value="revenue">
                <DashboardChart data={dashboardData} dataKey="totalRevenue" />
              </TabsContent>
              <TabsContent value="students">
                <DashboardChart data={dashboardData} dataKey="totalStudents" />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Performing Courses</CardTitle>
            <CardDescription>Based on total revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course Name</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead>Students</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topPerformingCourses.map((course) => (
                  <TableRow key={course._id}>
                    <TableCell>{course.courseName}</TableCell>
                    <TableCell>
                      ₹{course.totalRevenue.toLocaleString()}
                    </TableCell>
                    <TableCell>{course.totalStudents}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Your Courses</CardTitle>
            <CardDescription>Recently updated courses</CardDescription>
          </div>
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard/my-courses")}
          >
            View all courses
          </Button>
        </CardHeader>
        <CardContent>
          {courses.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              You haven't created any courses yet. Start by creating your first
              course!
            </p>
          ) : (
            <div className="grid gap-6 md:grid-cols-3">
              {courses
                .sort(
                  (a, b) =>
                    new Date(b.updatedAt).getTime() -
                    new Date(a.updatedAt).getTime()
                )
                .slice(0, 3)
                .map((course) => (
                  <CourseCard key={course._id} course={course} />
                ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string
  value: string | number
  icon: React.ReactNode
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  )
}

function DashboardSkeleton() {
  return (
    <div className="container mx-auto py-10 space-y-8">
      <Skeleton className="h-12 w-[250px]" />
      <div className="grid gap-6 md:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-[120px]" />
        ))}
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Skeleton className="h-[400px]" />
        <Skeleton className="h-[400px]" />
      </div>
      <Skeleton className="h-[300px]" />
    </div>
  )
}
