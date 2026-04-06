"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  invitees,
  type InviteeRecord,
  normalizeInviteCode,
} from "@/lib/rsvp/invitees";

type AttendanceStatus = "yes" | "no" | "maybe";
type RoomShare = "yes" | "no" | "no-preference";
type Accommodation = "yes" | "no";

const formSparkFormId = process.env.NEXT_PUBLIC_FORMSPARK_FORM_ID;
const configuredRsvpEndpoint = process.env.NEXT_PUBLIC_WEDDING_RSVP_ENDPOINT;
const weddingRsvpEndpoint =
  configuredRsvpEndpoint ??
  (formSparkFormId ? `https://submit-form.com/${formSparkFormId}` : undefined);
const unlockedInviteCookieName = "wedding_rsvp_unlocked_invite_hash";
const submissionsCookieName = "wedding_rsvp_submissions";
const cookieMaxAgeSeconds = 60 * 60 * 24 * 365;

function getCookieValue(name: string): string | null {
  const cookie = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(`${name}=`));
  if (!cookie) {
    return null;
  }

  return decodeURIComponent(cookie.split("=")[1] ?? "");
}

function setCookieValue(name: string, value: string) {
  document.cookie = `${name}=${encodeURIComponent(value)}; Max-Age=${cookieMaxAgeSeconds}; Path=/; SameSite=Lax`;
}

function getSubmissionMap(): Record<string, string> {
  const value = getCookieValue(submissionsCookieName);
  if (!value) {
    return {};
  }

  try {
    const parsed = JSON.parse(value) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return {};
    }

    return Object.fromEntries(
      Object.entries(parsed).filter(
        (entry): entry is [string, string] => typeof entry[1] === "string",
      ),
    );
  } catch {
    return {};
  }
}

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
  const [hasPreviouslySubmitted, setHasPreviouslySubmitted] = useState(false);

  useEffect(() => {
    const unlockedInviteHash = getCookieValue(unlockedInviteCookieName);
    if (!unlockedInviteHash) {
      return;
    }

    const unlockedInvitee = inviteesByCode.get(unlockedInviteHash);
    if (!unlockedInvitee) {
      return;
    }

    setInvitee(unlockedInvitee);
    const submissionMap = getSubmissionMap();
    setHasPreviouslySubmitted(Boolean(submissionMap[unlockedInvitee.codeHash]));
  }, [inviteesByCode]);

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
    setCookieValue(unlockedInviteCookieName, inviteeMatch.codeHash);
    const submissionMap = getSubmissionMap();
    setHasPreviouslySubmitted(Boolean(submissionMap[inviteeMatch.codeHash]));
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
          Accept: "application/json",
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

      const submissionMap = getSubmissionMap();
      submissionMap[invitee.codeHash] = new Date().toISOString();
      setCookieValue(submissionsCookieName, JSON.stringify(submissionMap));
      setHasPreviouslySubmitted(true);
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
        <h1 className="text-3xl font-semibold tracking-tight">Laura & Sam&apos;s Wedding Celebration</h1>
        <p className="mt-3 text-muted-foreground">
          Please enter your unique invite code to view your event details and RSVP.<br />If you have any questions, email us at: <a href="mailto:rsvp@spillard.io?subject=Question%20About%20RSVP">rsvp@spillard.io</a>
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
                <dd>Saturday, June 26, 2027</dd>
                <dt className="font-medium text-muted-foreground">Time</dt>
                <dd>Arrive from 13:00 PM</dd>
                <dt className="font-medium text-muted-foreground">Family Reception</dt>
                <dd><a href="https://maps.app.goo.gl/qyo7KX7283WsTqxL7">The Old Rectory, Hammeringham, LN9 6PF</a></dd>
                <dt className="font-medium text-muted-foreground">Main Reception</dt>
                <dd>Guests will arrive from 14:30 PM</dd>
                <dt className="font-medium text-muted-foreground">Dress code</dt>
                <dd>Garden Party Vibes</dd>
              </dl>
            ) : (
              <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-[180px_1fr]">
                <dt className="font-medium text-muted-foreground">Date</dt>
                <dd>Saturday, June 26, 2027</dd>
                <dt className="font-medium text-muted-foreground">Time</dt>
                <dd>Starts at 14:30 PM</dd>
                <dt className="font-medium text-muted-foreground">Reception</dt>
                <dd><a href="https://maps.app.goo.gl/qyo7KX7283WsTqxL7">The Old Rectory, Hammeringham, LN9 6PF</a></dd>
                <dt className="font-medium text-muted-foreground">Accommodation</dt>
                <dd>
		  Glamping pods sleeping up to 4 people are available on-site.<br />
		  Please indicate in the form below whether you would like to stay in one of these, and whether you are willing to share with another couple. Breakfast will be provided for those staying on-site.
		</dd>
                <dt className="font-medium text-muted-foreground">Dress code</dt>
                <dd>Garden Party Vibes</dd>
              </dl>
            )}
          </section>

          <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="text-xl font-medium">RSVP</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Please reply by March 1, 2027. Let us know if plans change after submitting.
            </p>
            {hasPreviouslySubmitted ? (
              <p className="mt-3 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                We already have an RSVP from you, but you can resubmit this form anytime to
                update your answers.
              </p>
            ) : null}

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
                    Happy to stay in provided accommodation? (See details above)
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
                    Willing to share a pod in provided accommodation?
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

		  <label className="flex flex-col gap-2 text-sm font-medium">
                How will you be arriving?
                <textarea
                  className="min-h-24 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  onChange={(event) => setTransportation(event.target.value)}
                  placeholder={"E.g. train, driving etc.\nIf lots of people are taking public transport, we may be able to arrange travel to the house as it is a very rural location!"}
                  required
                  value={transportation}
                />
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

              {submitError ? (
                <p aria-live="assertive" className="text-sm text-destructive" role="alert">
                  {submitError}
                </p>
              ) : null}
              {submitMessage ? (
                <p aria-live="polite" className="text-sm text-emerald-600">
                  {submitMessage}
                </p>
              ) : null}

              <button
                aria-disabled={isSubmitting}
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
