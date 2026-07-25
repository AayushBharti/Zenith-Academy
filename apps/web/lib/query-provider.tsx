"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { getQueryClient } from "./query-client";

/** Provides the TanStack Query client to the React tree. */
export function QueryProvider({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
