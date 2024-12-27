"use client"

import { useMemo } from "react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

interface CourseStats {
  _id: string
  courseName: string
  totalRevenue: number
  totalStudents: number
}

interface DashboardChartProps {
  data: CourseStats[]
  dataKey: "totalRevenue" | "totalStudents"
}

export default function DashboardChart({ data, dataKey }: DashboardChartProps) {
  const chartData = useMemo(() => {
    return data.map((item) => ({
      name: item.courseName,
      [dataKey]: item[dataKey],
    }))
  }, [data, dataKey])

  return (
    <ResponsiveContainer width="100%" height={400}>
      <AreaChart
        data={chartData}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Area
          type="monotone"
          dataKey={dataKey}
          stroke="#8884d8"
          fill="#8884d8"
          fillOpacity={0.3}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
