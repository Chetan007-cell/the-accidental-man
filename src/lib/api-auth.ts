/**
 * Shared API authorization helper for administrative endpoints.
 * Handles:
 * - Surrounding quotes in environment variables (e.g., ADMIN_API_KEY="secret")
 * - Bearer tokens ("Authorization: Bearer <secret>")
 * - Direct token headers ("Authorization: <secret>")
 * - Custom headers ("x-api-key: <secret>")
 * - Whitespace trimming
 */
export function verifyAdminAuth(request: Request): boolean {
  const rawSecret = process.env.ADMIN_API_KEY ?? process.env.CRON_SECRET;
  if (!rawSecret) return false;

  const normalizedSecret = rawSecret.trim().replace(/^["']|["']$/g, "");
  if (!normalizedSecret) return false;

  const authHeader = (request.headers.get("authorization") || "").trim();
  const apiKeyHeader = (request.headers.get("x-api-key") || "").trim();

  // Extract token from Bearer scheme or bare Authorization header
  let candidateToken = authHeader;
  if (candidateToken.toLowerCase().startsWith("bearer ")) {
    candidateToken = candidateToken.slice(7).trim();
  }

  const normalizedCandidate = candidateToken.replace(/^["']|["']$/g, "");
  const normalizedApiKey = apiKeyHeader.replace(/^["']|["']$/g, "");

  return (
    normalizedCandidate === normalizedSecret ||
    normalizedApiKey === normalizedSecret ||
    authHeader === `Bearer ${rawSecret}` ||
    apiKeyHeader === rawSecret
  );
}
