"use client";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/alert";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Skeleton } from "@workspace/ui/components/skeleton";
import {
  BookOpen,
  DollarSign,
  LayoutDashboard,
  PlusCircle,
  TrendingUp,
  Users,
} from "lucide-react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { CourseCard } from "@/features/course/components/course-card";
import { useInstructorCourses } from "@/features/course/hooks/use-course-queries";
import { DashboardPageHeader } from "@/features/dashboard/components/dashboard-page-header";
import { useInstructorEarnings } from "@/features/payment/hooks/use-payment-queries";
import { useInstructorDashboard } from "@/features/profile/hooks/use-profile-queries";

const DashboardChart = dynamic(() => import("./dashboard-chart"), {
  ssr: false,
});

export default function InstructorDashboard() {
  const router = useRouter();

  const {
    data: dashboardData = [],
    isLoading: isDashboardLoading,
    error: dashboardError,
  } = useInstructorDashboard();

  const {
    data: courses = [],
    isLoading: isCoursesLoading,
    error: coursesError,
  } = useInstructorCourses();

  const {
    data: earningsData,
    isLoading: isEarningsLoading,
    error: earningsError,
  } = useInstructorEarnings();

  const isLoading = isDashboardLoading || isCoursesLoading || isEarningsLoading;
  const error = dashboardError || coursesError || earningsError;

  const totalEarnings = earningsData?.totalEarnings ?? 0;
  const totalStudents = dashboardData.reduce(
    (acc, course) => acc + course.totalStudents,
    0
  );
  const topPerformingCourses = [...dashboardData]
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .slice(0, 5);

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
        <AlertDescription>
          {error.message ||
            "Failed to fetch dashboard data. Please try again later."}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="container space-y-8 p-4 md:p-8">
      {/* --- Header --- */}
      <DashboardPageHeader
        description="Overview of your courses, revenue, and student performance."
        title="Analytics"
      >
        <Button
          animation="swap"
          className="shadow-xs"
          onClick={() => router.push("/dashboard/add-course")}
          size="lg"
        >
          <PlusCircle className="mr-2 h-5 w-5" />
          Create New Course
        </Button>
      </DashboardPageHeader>

      {/* --- Stats Grid --- */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          accentColor="blue"
          icon={<BookOpen className="h-5 w-5" />}
          title="Total Courses"
          value={courses.length}
        />
        <StatCard
          accentColor="emerald"
          icon={<Users className="h-5 w-5" />}
          title="Total Students"
          value={totalStudents}
        />
        <StatCard
          accentColor="indigo"
          icon={<DollarSign className="h-5 w-5" />}
          subtitle={
            earningsData?.totalTransactions
              ? `${earningsData.totalTransactions} payments`
              : undefined
          }
          title="Total Earnings"
          value={formatCurrency(totalEarnings)}
        />
        <StatCard
          accentColor="amber"
          icon={<TrendingUp className="h-5 w-5" />}
          title="Avg. Revenue / Course"
          value={
            courses.length > 0
              ? formatCurrency(totalEarnings / courses.length)
              : "₹0"
          }
        />
      </div>

      {/* --- Charts Grid --- */}
      <DashboardChart
        data={dashboardData}
        formatCurrency={formatCurrency}
        topPerformers={topPerformingCourses}
      />

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
            <Button animation="swap" onClick={() => router.push("/dashboard/add-course")}>
              Create Course
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {courses
              .sort(
                (a, b) =>
                  new Date(b.updatedAt ?? "").getTime() -
                  new Date(a.updatedAt ?? "").getTime()
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

const ACCENT_STYLES = {
  blue: {
    card: "border-blue-200/60 dark:border-blue-800/40",
    iconBg: "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400",
    bar: "bg-blue-500",
  },
  emerald: {
    card: "border-emerald-200/60 dark:border-emerald-800/40",
    iconBg:
      "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400",
    bar: "bg-emerald-500",
  },
  indigo: {
    card: "border-indigo-200/60 dark:border-indigo-800/40",
    iconBg:
      "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400",
    bar: "bg-indigo-500",
  },
  amber: {
    card: "border-amber-200/60 dark:border-amber-800/40",
    iconBg:
      "bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400",
    bar: "bg-amber-500",
  },
} as const;

function StatCard({
  title,
  value,
  icon,
  accentColor,
  subtitle,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  accentColor: keyof typeof ACCENT_STYLES;
  subtitle?: string;
}) {
  const styles = ACCENT_STYLES[accentColor];

  return (
    <Card className={`relative overflow-hidden ${styles.card}`}>
      <div className={`absolute top-0 left-0 h-1 w-full ${styles.bar}`} />
      <CardContent className="p-4 md:p-6">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 space-y-1">
            <p className="truncate font-medium text-muted-foreground text-xs md:text-sm">
              {title}
            </p>
            <p className="truncate font-bold text-xl md:text-2xl">{value}</p>
            <p className="truncate text-muted-foreground text-xs">
              {subtitle || "Lifetime"}
            </p>
          </div>
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${styles.iconBg}`}
          >
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function DashboardSkeleton() {
  return (
    <div className="container space-y-8 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-52" />
        <Skeleton className="h-10 w-40" />
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[...new Array(4)].map((_, i) => (
          <Skeleton className="h-28 rounded-xl" key={i} />
        ))}
      </div>
      <div className="grid gap-6 md:grid-cols-7">
        <Skeleton className="h-96 rounded-xl md:col-span-4" />
        <Skeleton className="h-96 rounded-xl md:col-span-3" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-8 w-40" />
        <div className="grid gap-6 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton className="h-72 rounded-xl" key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
