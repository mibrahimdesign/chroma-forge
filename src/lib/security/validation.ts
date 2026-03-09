/**
 * Strict regex and parsing guards to prevent injection or DoS via malformed color strings.
 */

// Only allow letters, numbers, hash, comma, space, parentheses, and percent.
const SAFE_COLOR_PATTERN = /^[a-zA-Z0-9#,()%\s.]+$/;

export function isSafeColorString(input: string): boolean {
  if (typeof input !== "string") return false;
  // Prevent extremely long inputs that could cause regex DoS
  if (input.length > 50) return false;
  
  return SAFE_COLOR_PATTERN.test(input);
}

// Ensure object keys generated dynamically are safe
export function sanitizeKey(input: string): string {
  if (typeof input !== "string") return "primary";
  // Strip anything that isn't alphanumeric, dash, or underscore
  const sanitized = input.replace(/[^a-zA-Z0-9_-]/g, "");
  return sanitized || "primary";
}
