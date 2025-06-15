
/**
 * Removes all Supabase and sb-* keys from localStorage and sessionStorage for a clean sign-out.
 */
export function cleanupAuthState() {
  // LocalStorage cleanup
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith("supabase.auth.") || key.includes("sb-")) {
      localStorage.removeItem(key);
    }
  });
  // SessionStorage cleanup
  Object.keys(sessionStorage).forEach((key) => {
    if (key.startsWith("supabase.auth.") || key.includes("sb-")) {
      sessionStorage.removeItem(key);
    }
  });
}
