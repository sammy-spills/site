export function normalizeMapleTwoInviteCode(code: string): string {
  return code.trim().toUpperCase().replace(/\s+/g, "");
}

export async function hashMapleTwoInviteCode(code: string): Promise<string> {
  const normalizedCode = normalizeMapleTwoInviteCode(code);
  const encoded = new TextEncoder().encode(normalizedCode);
  const digest = await crypto.subtle.digest("SHA-256", encoded);

  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}
