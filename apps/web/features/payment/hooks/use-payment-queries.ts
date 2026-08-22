"use client";

import { useQuery } from "@tanstack/react-query";
import type {
  InstructorEarningsResponse,
  PaymentRecord,
} from "@workspace/shared-types";
import { apiCall } from "@/lib/api-call";
import { studentEndpoints } from "@/lib/apis";
import { queryKeys } from "@/lib/query-keys";

interface PaymentHistoryParams {
  status?: "pending" | "success" | "failed" | "refunded";
  limit?: number;
}

export function usePaymentHistory(params?: PaymentHistoryParams) {
  return useQuery({
    queryKey: queryKeys.payment.history(params),
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      if (params?.status) queryParams.set("status", params.status);
      if (params?.limit) queryParams.set("limit", params.limit.toString());

      const url = params
        ? `${studentEndpoints.PAYMENT_HISTORY_API}?${queryParams.toString()}`
        : studentEndpoints.PAYMENT_HISTORY_API;

      const result = await apiCall<PaymentRecord[]>("GET", url);
      if (!result.ok) throw new Error(result.error);
      return result.data;
    },
  });
}

export function useInstructorEarnings() {
  return useQuery({
    queryKey: queryKeys.payment.instructorEarnings(),
    queryFn: async () => {
      const result = await apiCall<InstructorEarningsResponse>(
        "GET",
        studentEndpoints.INSTRUCTOR_EARNINGS_API
      );
      if (!result.ok) throw new Error(result.error);
      return result.data;
    },
  });
}
