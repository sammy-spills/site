"use client";

import { FormEvent, useMemo, useState } from "react";
import {
  invitees,
  type InviteeRecord,
  normalizeInviteCode,
} from "@/lib/rsvp/invitees";

type AttendanceStatus = "yes" | "no" | "maybe";
type RoomShare = "yes" | "no" | "no-preference";
type Accommodation = "yes" | "no";

const weddingRsvpEndpoint = process.env.NEXT_PUBLIC_WEDDING_RSVP_ENDPOINT;

async function sha256(input: string): Promise<string> {
  const encoded = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", encoded);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export function RSVPGate() {
  const inviteesByCode = useMemo(
    () => new Map(invitees.map((invitee) => [invitee.codeHash, invitee])),
    [],
  );

  const [inviteCode, setInviteCode] = useState("");
  const [gateError, setGateError] = useState("");
  const [invitee, setInvitee] = useState<InviteeRecord | null>(null);

  const [attendanceStatus, setAttendanceStatus] = useState<AttendanceStatus>("yes");
  const [dietaryRequirements, setDietaryRequirements] = useState("");
  const [accommodation, setAccommodation] = useState<Accommodation>("yes");
  const [roomShare, setRoomShare] = useState<RoomShare>("no-preference");
  const [email, setEmail] = useState("");
  const [transportation, setTransportation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitError, setSubmitError] = useState("");

  async function handleGateSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setGateError("");

    const normalizedCode = normalizeInviteCode(inviteCode);
    if (!normalizedCode) {
      setGateError("Please enter the invite code from your invitation.");
      return;
    }

    const codeHash = await sha256(normalizedCode);
    const inviteeMatch = inviteesByCode.get(codeHash);
    if (!inviteeMatch) {
      setGateError("Sorry, we couldn't find a matching invitation for that code.");
      return;
    }

    setInvitee(inviteeMatch);
  }

  async function handleRsvpSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError("");
    setSubmitMessage("");

    if (!invitee) {
      setSubmitError("Please unlock your invitation before submitting.");
      return;
    }

    if (!weddingRsvpEndpoint) {
      setSubmitError(
        "RSVP submission is not configured yet. Please contact the couple directly.",
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(weddingRsvpEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inviteeName: invitee.name,
          inviteeType: invitee.type,
          inviteCodeHash: invitee.codeHash,
          attendanceStatus,
          dietaryRequirements,
          accommodation: invitee.type === "guest" ? accommodation : null,
          roomShare: invitee.type === "guest" ? roomShare : null,
          email,
          transportation,
          submittedAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error(`RSVP submission failed with status ${response.status}`);
      }

      setSubmitMessage("Thanks! Your RSVP has been submitted.");
    } catch {
      setSubmitError("We couldn't submit your RSVP right now. Please try again shortly.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-12">
      <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h1 className="text-3xl font-semibold tracking-tight">Sam & Laura&apos;s Celebration</h1>
        <p className="mt-3 text-muted-foreground">
          Please enter your unique invite code to view your event details and RSVP.
        </p>
      </section>

      {!invitee ? (
        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-medium">Invitation access</h2>
          <form className="mt-4 space-y-4" onSubmit={handleGateSubmit}>
            <label className="flex flex-col gap-2 text-sm font-medium">
              Invite code
              <input
                autoComplete="off"
                className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                onChange={(event) => setInviteCode(event.target.value)}
                placeholder="e.g., FAM-2027-ALPHA"
                required
                value={inviteCode}
              />
            </label>
            {gateError ? <p className="text-sm text-destructive">{gateError}</p> : null}
            <button
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground"
              type="submit"
            >
              Continue
            </button>
          </form>
        </section>
      ) : (
        <>
          <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="text-xl font-medium">Welcome, {invitee.name}</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              You&apos;re viewing the {invitee.type === "family" ? "family" : "guest"} event plan.
            </p>

            {invitee.type === "family" ? (
              <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-[180px_1fr]">
                <dt className="font-medium text-muted-foreground">Date</dt>
                <dd>Saturday, June 12, 2027</dd>
                <dt className="font-medium text-muted-foreground">Family brunch</dt>
                <dd>Friday, June 11 at 11:00 AM - The Riverside Barn</dd>
                <dt className="font-medium text-muted-foreground">Ceremony</dt>
                <dd>St. Mary&apos;s Chapel, York at 2:00 PM</dd>
                <dt className="font-medium text-muted-foreground">Photos</dt>
                <dd>Immediate family photos from 3:15 PM</dd>
                <dt className="font-medium text-muted-foreground">Reception</dt>
                <dd>The Riverside Barn from 4:00 PM</dd>
              </dl>
            ) : (
              <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-[180px_1fr]">
                <dt className="font-medium text-muted-foreground">Date</dt>
                <dd>Saturday, June 12, 2027</dd>
                <dt className="font-medium text-muted-foreground">Ceremony</dt>
                <dd>St. Mary&apos;s Chapel, York at 2:00 PM</dd>
                <dt className="font-medium text-muted-foreground">Reception</dt>
                <dd>The Riverside Barn from 4:00 PM</dd>
                <dt className="font-medium text-muted-foreground">Accommodation</dt>
                <dd>Optional shared rooms are available near the venue.</dd>
                <dt className="font-medium text-muted-foreground">Dress code</dt>
                <dd>Formal / black tie optional</dd>
              </dl>
            )}
          </section>

          <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="text-xl font-medium">RSVP</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Please reply by March 1, 2027. Let us know if plans change after submitting.
            </p>

            <form className="mt-5 space-y-4" onSubmit={handleRsvpSubmit}>
              <label className="flex flex-col gap-2 text-sm font-medium">
                Attendance status
                <select
                  className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                  onChange={(event) => setAttendanceStatus(event.target.value as AttendanceStatus)}
                  value={attendanceStatus}
                >
                  <option value="yes">Yes, I&apos;ll be there</option>
                  <option value="no">No, I can&apos;t make it</option>
                  <option value="maybe">Maybe (I&apos;ll confirm soon)</option>
                </select>
              </label>

              <label className="flex flex-col gap-2 text-sm font-medium">
                Dietary requirements
                <textarea
                  className="min-h-24 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  onChange={(event) => setDietaryRequirements(event.target.value)}
                  placeholder="Allergies, intolerances, preferences"
                  value={dietaryRequirements}
                />
              </label>

              {invitee.type === "guest" ? (
                <>
                  <label className="flex flex-col gap-2 text-sm font-medium">
                    Happy to stay in provided accommodation?
                    <select
                      className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                      onChange={(event) => setAccommodation(event.target.value as Accommodation)}
                      value={accommodation}
                    >
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </label>

                  <label className="flex flex-col gap-2 text-sm font-medium">
                    Willing to share a room in provided accommodation?
                    <select
                      className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                      onChange={(event) => setRoomShare(event.target.value as RoomShare)}
                      value={roomShare}
                    >
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                      <option value="no-preference">No preference</option>
                    </select>
                  </label>
                </>
              ) : null}

              <label className="flex flex-col gap-2 text-sm font-medium">
                Primary email address
                <input
                  autoComplete="email"
                  className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  type="email"
                  value={email}
                />
              </label>

              <label className="flex flex-col gap-2 text-sm font-medium">
                How will you be arriving?
                <textarea
                  className="min-h-24 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  onChange={(event) => setTransportation(event.target.value)}
                  placeholder="Train, car, flight, etc."
                  required
                  value={transportation}
                />
              </label>

              {submitError ? <p className="text-sm text-destructive">{submitError}</p> : null}
              {submitMessage ? <p className="text-sm text-emerald-600">{submitMessage}</p> : null}

              <button
                className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground disabled:opacity-60"
                disabled={isSubmitting}
                type="submit"
              >
                {isSubmitting ? "Submitting..." : "Submit RSVP"}
              </button>
            </form>
          </section>
        </>
      )}
    </div>
  );
}
