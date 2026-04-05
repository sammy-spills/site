export type InviteeType = "family" | "guest";

export type InviteeRecord = {
  codeHash: string;
  name: string;
  type: InviteeType;
};

export const invitees: readonly InviteeRecord[] = [
  {
    // Example code: TEST-KEY
    codeHash: "316164c75800e7839d54cfc09b224513e729ac9a350c7cc11427a037928352ed",
    name: "Example Family Member",
    type: "family",
  },
  {
    // Example code: TEST-GUEST
    codeHash: "e5972d1d7ce6af31674839962939b8b32b39b114217895ff6667b64c5335ac6a",
    name: "Example Guest",
    type: "guest",
  },
] as const;

export function normalizeInviteCode(code: string): string {
  return code.trim().toUpperCase().replace(/\s+/g, "");
}
