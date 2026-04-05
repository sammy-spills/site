export type InviteeType = "family" | "guest";

export type InviteeRecord = {
  codeHash: string;
  name: string;
  type: InviteeType;
};

export const invitees: readonly InviteeRecord[] = [
  {
    // Example code: FAM-2027-ALPHA
    codeHash: "a80f7f4f0a4f754d50d132a6d89b33798f34ca8ac98a6ed5b188756f9754a8c5",
    name: "Example Family Member",
    type: "family",
  },
  {
    // Example code: GST-2027-BRAVO
    codeHash: "4b97e9ca9bb4bcf0d5a9d0fda2e7b062f94995e929149fbf61d40fd0de5f8ce4",
    name: "Example Guest",
    type: "guest",
  },
] as const;

export function normalizeInviteCode(code: string): string {
  return code.trim().toUpperCase().replace(/\s+/g, "");
}
