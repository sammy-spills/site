export type InviteeType = "family" | "guest";

export type InviteeRecord = {
  codeHash: string;
  name: string;
  type: InviteeType;
  active?: boolean;
};

export function normalizeInviteCode(code: string): string {
  return code.trim().toUpperCase().replace(/\s+/g, "");
}
