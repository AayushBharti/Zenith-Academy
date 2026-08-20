"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@workspace/ui/components/chart";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import { GraduationCap } from "lucide-react";
import {
  Bar,
  BarChart,
  Cell,
  Label,
  Pie,
  PieChart,
  RadialBar,
  RadialBarChart,
  XAxis,
  YAxis,
} from "recharts";

interface CourseStats {
  _id: string;
  courseName: string;
  totalRevenue: number;
  totalStudents: number;
}

interface DashboardChartProps {
  data: CourseStats[];
  topPerformers: CourseStats[];
  formatCurrency: (amount: number) => string;
}

const COLORS = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
];

const revenueConfig = Object.fromEntries(
  COLORS.map((color, i) => [`course-${i}`, { label: `Course ${i + 1}`, color }])
) satisfies ChartConfig;

const studentsConfig = {
  students: { label: "Students", color: "var(--color-chart-2)" },
} satisfies ChartConfig;

const enrollmentConfig = {
  enrollment: { label: "Enrollment", color: "var(--color-chart-1)" },
} satisfies ChartConfig;

/** Formats currency in INR. */
function formatCurrency(n: number): string {
  if (n >= 100_000) return `₹${(n / 100_000).toFixed(1)}L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(1)}K`;
  return `₹${n}`;
}

export default function DashboardChart({
  data,
  topPerformers,
  formatCurrency: fmtCurrency,
}: DashboardChartProps) {
  const totalRevenue = data.reduce((s, c) => s + c.totalRevenue, 0);
  const totalStudents = data.reduce((s, c) => s + c.totalStudents, 0);

  // Pie data for revenue distribution
  const pieData = data.map((item, i) => ({
    name: item.courseName,
    value: item.totalRevenue,
    fill: COLORS[i % COLORS.length],
  }));

  // Horizontal bar data for students
  const barData = data
    .map((item) => ({
      name:
        item.courseName.length > 18
          ? `${item.courseName.slice(0, 18)}...`
          : item.courseName,
      students: item.totalStudents,
    }))
    .sort((a, b) => b.students - a.students);

  // Radial data for enrollment rate (students per course ratio)
  const maxStudents = Math.max(...data.map((c) => c.totalStudents), 1);
  const radialData = data.map((item, i) => ({
    name: item.courseName,
    enrollment: Math.round((item.totalStudents / maxStudents) * 100),
    fill: COLORS[i % COLORS.length],
  }));

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Revenue Distribution — Donut */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Revenue Split</CardTitle>
          <CardDescription>Distribution across courses</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            className="mx-auto aspect-square h-52"
            config={revenueConfig}
          >
            <PieChart>
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value) => formatCurrency(Number(value))}
                    hideLabel
                  />
                }
                cursor={false}
              />
              <Pie
                data={pieData}
                dataKey="value"
                innerRadius={60}
                nameKey="name"
                outerRadius={85}
                paddingAngle={3}
                strokeWidth={2}
              >
                {pieData.map((entry) => (
                  <Cell key={entry.name} style={{ fill: entry.fill }} />
                ))}
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          dominantBaseline="middle"
                          textAnchor="middle"
                          x={viewBox.cx}
                          y={viewBox.cy}
                        >
                          <tspan
                            className="fill-foreground font-bold text-xl"
                            x={viewBox.cx}
                            y={(viewBox.cy ?? 0) - 4}
                          >
                            {formatCurrency(totalRevenue)}
                          </tspan>
                          <tspan
                            className="fill-muted-foreground text-xs"
                            x={viewBox.cx}
                            y={(viewBox.cy ?? 0) + 16}
                          >
                            Total Revenue
                          </tspan>
                        </text>
                      );
                    }
                    return null;
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
          {/* Legend */}
          <div className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1">
            {pieData.map((entry) => (
              <div className="flex items-center gap-1.5" key={entry.name}>
                <span
                  className="inline-block size-2.5 rounded-full"
                  style={{ background: entry.fill }}
                />
                <span className="max-w-28 truncate text-muted-foreground text-xs">
                  {entry.name}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Students per course — Horizontal bars */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Students Enrolled</CardTitle>
          <CardDescription>
            {totalStudents} total across {data.length} courses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            className="aspect-auto h-52 w-full"
            config={studentsConfig}
          >
            <BarChart
              data={barData}
              layout="vertical"
              margin={{ top: 0, right: 8, bottom: 0, left: 0 }}
            >
              <YAxis
                axisLine={false}
                dataKey="name"
                tickLine={false}
                type="category"
                width={100}
              />
              <XAxis axisLine={false} tickLine={false} type="number" />
              <ChartTooltip content={<ChartTooltipContent />} cursor={false} />
              <Bar dataKey="students" radius={[0, 6, 6, 0]}>
                {barData.map((_entry, index) => (
                  <Cell
                    key={_entry.name}
                    style={{ fill: COLORS[index % COLORS.length] }}
                  />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Top Performers */}
      <Card className="flex flex-col shadow-xs">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Top Performers</CardTitle>
          <CardDescription>Highest earning courses</CardDescription>
        </CardHeader>
        <CardContent className="flex-1">
          {topPerformers.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-3/5">Course</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topPerformers.map((course) => (
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
                      {fmtCurrency(course.totalRevenue)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex h-full min-h-48 flex-col items-center justify-center text-center text-muted-foreground">
              <GraduationCap className="mb-2 h-10 w-10 opacity-20" />
              <p>No data available yet</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Enrollment Rate — Radial */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Course Popularity</CardTitle>
          <CardDescription>
            Relative enrollment rate across courses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            className="mx-auto aspect-auto h-48 w-full max-w-lg"
            config={enrollmentConfig}
          >
            <RadialBarChart
              cx="50%"
              cy="50%"
              data={radialData}
              endAngle={-45}
              innerRadius={30}
              outerRadius={110}
              startAngle={225}
            >
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value) => `${value}%`}
                    nameKey="name"
                  />
                }
                cursor={false}
              />
              <RadialBar
                background={{ style: { fill: "var(--color-muted)" } }}
                cornerRadius={6}
                dataKey="enrollment"
              >
                {radialData.map((entry) => (
                  <Cell key={entry.name} style={{ fill: entry.fill }} />
                ))}
              </RadialBar>
            </RadialBarChart>
          </ChartContainer>
          <div className="mt-1 flex flex-wrap justify-center gap-x-4 gap-y-1">
            {radialData.map((entry) => (
              <div className="flex items-center gap-1.5" key={entry.name}>
                <span
                  className="inline-block size-2.5 rounded-full"
                  style={{ background: entry.fill }}
                />
                <span className="text-muted-foreground text-xs">
                  {entry.name.length > 20
                    ? `${entry.name.slice(0, 20)}...`
                    : entry.name}{" "}
                  — {entry.enrollment}%
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
