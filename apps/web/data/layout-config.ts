/** Route prefixes where the global navbar and footer are hidden. */
export const CHROME_HIDDEN_PREFIXES = [
  "/dashboard",
  "/login",
  "/signup",
  "/verify-email",
  "/forgot-password",
  "/update-password",
];

/** Check if a pathname should hide global chrome (navbar/footer). */
export function isChromeHidden(pathname: string): boolean {
  return CHROME_HIDDEN_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}
