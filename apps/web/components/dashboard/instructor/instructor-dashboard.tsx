"use client";

import {
  BookOpen,
  DollarSign,
  GraduationCap,
  LayoutDashboard,
  PlusCircle,
  TrendingUp,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchInstructorCourses } from "@/services/course-details-service";
import { getInstructorDashboard } from "@/services/profile-service";
import { useAuthStore } from "@/store/use-auth-store";
import type { CourseDetails } from "@/types/course";

// Import your existing components
import { CourseCard } from "../../common/course-card";
import DashboardChart from "./dashboard-chart";

interface CourseStats {
  _id: string;
  courseName: string;
  courseDescription: string;
  totalRevenue: number;
  totalStudents: number;
}

export default function InstructorDashboard() {
  const [dashboardData, setDashboardData] = useState<CourseStats[]>([]);
  const [courses, setCourses] = useState<CourseDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const { token } = useAuthStore();

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        setError("Authentication token is missing");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const [instructorDetails, instructorCourses] = await Promise.all([
          getInstructorDashboard(token),
          fetchInstructorCourses(token),
        ]);

        setDashboardData(instructorDetails);
        setCourses(instructorCourses);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch dashboard data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const { totalEarnings, totalStudents, topPerformingCourses } = useMemo(() => {
    const totalEarnings = dashboardData.reduce(
      (acc, course) => acc + course.totalRevenue,
      0
    );
    const totalStudents = dashboardData.reduce(
      (acc, course) => acc + course.totalStudents,
      0
    );
    const topPerformingCourses = [...dashboardData]
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, 5);

    return { totalEarnings, totalStudents, topPerformingCourses };
  }, [dashboardData]);

  // Helper for currency formatting
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-8 p-1">
      {/* --- Header --- */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-bold text-3xl tracking-tight">Dashboard</h1>
          <p className="mt-1 text-muted-foreground">
            Overview of your courses, revenue, and student performance.
          </p>
        </div>
        <Button
          className="shadow-xs"
          onClick={() => router.push("/dashboard/create-course")}
          size="lg"
        >
          <PlusCircle className="mr-2 h-5 w-5" />
          Create New Course
        </Button>
      </div>

      <Separator />

      {/* --- Stats Grid --- */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          className="border-blue-100 bg-blue-50/50 dark:border-blue-900/50 dark:bg-blue-900/10"
          icon={<BookOpen className="h-4 w-4 text-blue-600" />}
          title="Total Courses"
          value={courses.length}
        />
        <StatCard
          className="border-emerald-100 bg-emerald-50/50 dark:border-emerald-900/50 dark:bg-emerald-900/10"
          icon={<Users className="h-4 w-4 text-emerald-600" />}
          title="Total Students"
          value={totalStudents}
        />
        <StatCard
          className="border-indigo-100 bg-indigo-50/50 dark:border-indigo-900/50 dark:bg-indigo-900/10"
          icon={<DollarSign className="h-4 w-4 text-indigo-600" />}
          title="Total Earnings"
          value={formatCurrency(totalEarnings)}
        />
        <StatCard
          className="border-amber-100 bg-amber-50/50 dark:border-amber-900/50 dark:bg-amber-900/10"
          icon={<TrendingUp className="h-4 w-4 text-amber-600" />}
          title="Avg. Revenue / Course"
          value={
            courses.length > 0
              ? formatCurrency(totalEarnings / courses.length)
              : "₹0"
          }
        />
      </div>

      {/* --- Charts & Tables Grid --- */}
      <div className="grid gap-6 md:grid-cols-7">
        {/* Chart Section (Takes up 4 columns) */}
        <Card className="shadow-xs md:col-span-4">
          <CardHeader>
            <CardTitle>Performance Analytics</CardTitle>
            <CardDescription>
              Visualize your growth trends over time.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <Tabs className="space-y-4" defaultValue="revenue">
              <div className="flex items-center px-4">
                <TabsList>
                  <TabsTrigger value="revenue">Revenue</TabsTrigger>
                  <TabsTrigger value="students">Students</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent className="pl-2" value="revenue">
                <DashboardChart data={dashboardData} dataKey="totalRevenue" />
              </TabsContent>
              <TabsContent className="pl-2" value="students">
                <DashboardChart data={dashboardData} dataKey="totalStudents" />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Top Courses Section (Takes up 3 columns) */}
        <Card className="flex flex-col shadow-xs md:col-span-3">
          <CardHeader>
            <CardTitle>Top Performers</CardTitle>
            <CardDescription>
              Your highest earning courses this month.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            {topPerformingCourses.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[60%]">Course</TableHead>
                    <TableHead className="text-right">Revenue</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topPerformingCourses.map((course) => (
                    <TableRow key={course._id}>
                      <TableCell className="font-medium">
                        <div className="line-clamp-1" title={course.courseName}>
                          {course.courseName}
                        </div>
                        <div className="text-muted-foreground text-xs">
                          {course.totalStudents} Students
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-semibold text-emerald-600">
                        {formatCurrency(course.totalRevenue)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="flex h-full min-h-[200px] flex-col items-center justify-center text-center text-muted-foreground">
                <GraduationCap className="mb-2 h-10 w-10 opacity-20" />
                <p>No data available yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* --- Recent Courses Section --- */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-2xl tracking-tight">Recent Courses</h2>
          <Button
            className="text-primary hover:bg-primary/5 hover:text-primary/80"
            onClick={() => router.push("/dashboard/my-courses")}
            variant="ghost"
          >
            View all
          </Button>
        </div>

        {courses.length === 0 ? (
          <div className="fade-in-50 flex animate-in flex-col items-center justify-center rounded-xl border border-dashed p-8 text-center">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
              <LayoutDashboard className="h-10 w-10 text-primary" />
            </div>
            <h3 className="font-semibold text-lg">No courses created yet</h3>
            <p className="mx-auto mt-2 mb-6 max-w-sm text-muted-foreground">
              Start your journey by creating your first course and sharing your
              knowledge.
            </p>
            <Button onClick={() => router.push("/dashboard/create-course")}>
              Create Course
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {courses
              .sort(
                (a, b) =>
                  new Date(b.updatedAt).getTime() -
                  new Date(a.updatedAt).getTime()
              )
              .slice(0, 3)
              .map((course) => (
                <CourseCard course={course} key={course._id} />
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

// --- Sub Components ---

function StatCard({
  title,
  value,
  icon,
  className,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  className?: string;
}) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="font-medium text-muted-foreground text-sm">
          {title}
        </CardTitle>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-background/50">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="font-bold text-2xl">{value}</div>
        <p className="mt-1 text-muted-foreground text-xs">Lifetime stats</p>
      </CardContent>
    </Card>
  );
}

function DashboardSkeleton() {
  return (
    <div className="w-full space-y-8 p-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-[200px]" />
        <Skeleton className="h-10 w-[150px]" />
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton className="h-[120px] rounded-xl" key={i} />
        ))}
      </div>
      <div className="grid gap-6 md:grid-cols-7">
        <Skeleton className="h-[400px] rounded-xl md:col-span-4" />
        <Skeleton className="h-[400px] rounded-xl md:col-span-3" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-8 w-[150px]" />
        <div className="grid gap-6 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton className="h-[300px] rounded-xl" key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
