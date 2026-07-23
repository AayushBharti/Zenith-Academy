import { apiConnector } from "./api-connector";
import { err, ok, type Result } from "./result";

/**
 * Type-safe wrapper around apiConnector that returns a Result<T>.
 * Catches network/server errors so callers never need try/catch.
 */
export async function apiCall<T>(
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
  url: string,
  body?: unknown,
  headers?: Record<string, string>,
  params?: Record<string, unknown>
): Promise<Result<T>> {
  try {
    const response = await apiConnector(method, url, body, headers, params);
    const payload = response.data;

    if (!payload.success) {
      return err(payload.message ?? "Request failed");
    }

    return ok(payload.data as T);
  } catch (error: unknown) {
    const axiosErr = error as {
      response?: { data?: { message?: string } };
    };

    return err(
      axiosErr?.response?.data?.message ?? "An unexpected error occurred"
    );
  }
}
