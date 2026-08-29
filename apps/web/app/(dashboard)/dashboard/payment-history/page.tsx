"use client";

import { Badge } from "@workspace/ui/components/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { Wallet } from "lucide-react";
import { useState } from "react";
import { DashboardPageHeader } from "@/features/dashboard/components/dashboard-page-header";
import { EmptyState } from "@/features/dashboard/components/empty-state";
import { usePaymentHistory } from "@/features/payment/hooks/use-payment-queries";

export default function PaymentHistoryPage() {
  const [statusFilter, setStatusFilter] = useState<
    "all" | "pending" | "success" | "failed" | "refunded"
  >("all");

  const { data: payments, isLoading } = usePaymentHistory(
    statusFilter === "all" ? undefined : { status: statusFilter }
  );

  const getStatusColor = (
    status: string
  ): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case "success":
        return "default";
      case "pending":
        return "secondary";
      case "failed":
        return "destructive";
      case "refunded":
        return "outline";
      default:
        return "outline";
    }
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount / 100);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          {[...new Array(3)].map((_, i) => (
            <Skeleton className="h-48 w-full rounded-xl" key={i} />
          ))}
        </div>
      );
    }

    if (!payments || payments.length === 0) {
      return (
        <EmptyState
          description="You have not made any payments yet. When you do, they will appear here."
          icon={Wallet}
          title="No Payment History"
        />
      );
    }

    return (
      <div className="space-y-4">
        {payments.map((payment) => (
          <Card className="border-border/60 shadow-sm" key={payment._id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    Order #{payment.razorpay_order_id.slice(-8)}
                    <Badge variant={getStatusColor(payment.status)}>
                      {payment.status}
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    {formatDate(payment.createdAt)}
                  </CardDescription>
                </div>
                <div className="text-right">
                  <p className="font-bold text-2xl">
                    {formatCurrency(payment.amount)}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {payment.currency}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="mb-2 font-medium text-sm">Courses:</p>
                  <div className="grid gap-3 md:grid-cols-2">
                    {payment.courses.map((course) => (
                      <div
                        className="flex items-center gap-3 rounded-lg border p-3"
                        key={course._id}
                      >
                        <img
                          alt={course.courseName}
                          className="size-16 rounded object-cover"
                          src={course.thumbnail}
                        />
                        <div className="flex-1">
                          <p className="font-medium">{course.courseName}</p>
                          <p className="text-muted-foreground text-sm">
                            {formatCurrency(course.price * 100)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {payment.razorpay_payment_id && (
                  <div className="rounded-lg bg-muted p-3">
                    <p className="text-sm">
                      <span className="font-medium">Payment ID:</span>{" "}
                      {payment.razorpay_payment_id}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="container space-y-8 p-4 md:p-8">
      <DashboardPageHeader
        description="View all your payment transactions"
        title="Payment History"
      >
        <Select
          onValueChange={(value: string) =>
            setStatusFilter(
              value as "all" | "pending" | "success" | "failed" | "refunded"
            )
          }
          value={statusFilter}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="success">Success</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
            <SelectItem value="refunded">Refunded</SelectItem>
          </SelectContent>
        </Select>
      </DashboardPageHeader>

      {renderContent()}
    </div>
  );
}
