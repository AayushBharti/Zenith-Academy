"use client";

import { useQuery } from "@tanstack/react-query";
import type { CategoryPageDetailsResponse as CategoryPageDetails } from "@workspace/shared-types";
import { apiCall } from "@/lib/api-call";
import { catalogData } from "@/lib/apis";
import { queryKeys } from "@/lib/query-keys";

/** Fetch catalog page data for a given category. */
export function useCatalogPageData(categoryId: string) {
  return useQuery({
    queryKey: queryKeys.catalog.page(categoryId),
    queryFn: async () => {
      const result = await apiCall<CategoryPageDetails>(
        "POST",
        catalogData.CATALOGPAGEDATA_API,
        { categoryId }
      );
      if (!result.ok) throw new Error(result.error);
      return result.data;
    },
    enabled: !!categoryId,
  });
}
