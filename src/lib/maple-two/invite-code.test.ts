import { describe, expect, it } from "vitest";
import {
  hashMapleTwoInviteCode,
  normalizeMapleTwoInviteCode,
} from "@/lib/maple-two/invite-code";

const sha256Pattern = /^[a-f0-9]{64}$/;

describe("Maple birthday invite codes", () => {
  it("normalizes casing and whitespace", () => {
    expect(normalizeMapleTwoInviteCode("  ab c\t123 \n")).toBe("ABC123");
  });

  it("hashes equivalent normalized codes identically", async () => {
    const firstHash = await hashMapleTwoInviteCode("ab c123");
    const secondHash = await hashMapleTwoInviteCode(" ABC123 ");

    expect(firstHash).toBe(secondHash);
    expect(firstHash).toMatch(sha256Pattern);
  });
});
