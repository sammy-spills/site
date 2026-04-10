"use client";

import Image from "next/image";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { ExternalLink } from "lucide-react";
import { getLatestRsvp, type RsvpData, submitRsvp } from "@/lib/rsvp/firestore";
import {
  invitees,
  type InviteeRecord,
  normalizeInviteCode,
} from "@/lib/rsvp/invitees";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

type AttendanceStatus = "yes" | "no" | "maybe";
type RoomShare = "yes" | "no" | "no-preference";
type Accommodation = "yes" | "no";
const venueMapUrl = "https://maps.app.goo.gl/qyo7KX7283WsTqxL7";

const unlockedInviteCookieName = "wedding_rsvp_unlocked_invite_hash";
const legacySubmissionsCookieName = "wedding_rsvp_submissions";
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

function clearCookieValue(name: string) {
  document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax`;
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

  const venueMapLinkClasses =
    "inline-flex items-center gap-1 font-medium text-primary underline underline-offset-4 transition-colors hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm";

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
  const [isLoadingExistingRsvp, setIsLoadingExistingRsvp] = useState(false);
  const latestRsvpRequestId = useRef(0);

  function resetFormToDefaults() {
    setAttendanceStatus("yes");
    setDietaryRequirements("");
    setAccommodation("yes");
    setRoomShare("no-preference");
    setEmail("");
    setTransportation("");
  }

  function populateFormFromRsvp(rsvp: RsvpData | null) {
    if (!rsvp) {
      resetFormToDefaults();
      setHasPreviouslySubmitted(false);
      return;
    }

    setAttendanceStatus(rsvp.attendanceStatus);
    setDietaryRequirements(rsvp.dietaryRequirements);
    setAccommodation(rsvp.accommodation ?? "yes");
    setRoomShare(rsvp.roomShare ?? "no-preference");
    setEmail(rsvp.email);
    setTransportation(rsvp.transportation ?? "");
    setHasPreviouslySubmitted(true);
  }

  async function loadLatestRsvp(unlockedInvitee: InviteeRecord) {
    const requestId = ++latestRsvpRequestId.current;
    setIsLoadingExistingRsvp(true);
    setSubmitError("");

    try {
      const latestRsvp = await getLatestRsvp(unlockedInvitee.codeHash);
      if (requestId !== latestRsvpRequestId.current) {
        return;
      }

      populateFormFromRsvp(latestRsvp);
    } catch (error) {
      if (requestId !== latestRsvpRequestId.current) {
        return;
      }

      console.error("Failed to load existing RSVP:", error);
      resetFormToDefaults();
      setHasPreviouslySubmitted(false);
      setSubmitError("We couldn't load your previous RSVP right now, but you can still submit the form.");
    } finally {
      if (requestId === latestRsvpRequestId.current) {
        setIsLoadingExistingRsvp(false);
      }
    }
  }

  useEffect(() => {
    clearCookieValue(legacySubmissionsCookieName);

    const unlockedInviteHash = getCookieValue(unlockedInviteCookieName);
    if (!unlockedInviteHash) {
      return;
    }

    const unlockedInvitee = inviteesByCode.get(unlockedInviteHash);
    if (!unlockedInvitee) {
      return;
    }

    setInvitee(unlockedInvitee);
    void loadLatestRsvp(unlockedInvitee);
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
    setSubmitMessage("");
    setSubmitError("");
    void loadLatestRsvp(inviteeMatch);
  }

  async function handleRsvpSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError("");
    setSubmitMessage("");

    if (!invitee) {
      setSubmitError("Please unlock your invitation before submitting.");
      return;
    }

    setIsSubmitting(true);

    try {
      await submitRsvp(invitee, {
        attendanceStatus,
        dietaryRequirements,
        accommodation: invitee.type === "guest" ? accommodation : null,
        roomShare: invitee.type === "guest" ? roomShare : null,
        email,
        transportation: transportation || null,
      });

      setHasPreviouslySubmitted(true);
      setSubmitMessage("Thanks! Your RSVP has been submitted.");
    } catch (error) {
      console.error("RSVP submission error:", error);
      setSubmitError("We couldn't submit your RSVP right now. Please try again shortly.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function resetInvitationAccess() {
    setInvitee(null);
    setInviteCode("");
    setGateError("");
    setSubmitMessage("");
    setSubmitError("");
    setHasPreviouslySubmitted(false);
    latestRsvpRequestId.current += 1;
    setIsLoadingExistingRsvp(false);
    resetFormToDefaults();
    clearCookieValue(unlockedInviteCookieName);
  }

  return (
    <div className="relative w-full pb-12">
      <div className="relative z-0">
        <div className="relative left-1/2 w-screen -translate-x-1/2">
          <Image
            alt="Laura, Sam and Maple"
            className="block h-auto w-full"
            height={3448}
            priority
            sizes="100vw"
            src="/picnic.webp"
            width={2736}
          />
        </div>
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 pt-8 xl:-mt-[clamp(1620px,calc(88vw+300px),2080px)] xl:pt-80px">
        <Card className="transition-colors">
          <CardHeader>
            <CardTitle className="text-3xl font-semibold tracking-tight">
              Laura & Sam&apos;s Wedding Celebration
            </CardTitle>
            <CardDescription className="text-base leading-relaxed">
              Please enter your unique invite code to view your event details and RSVP.
              <br />
              If you have any questions, email us at{" "}
              <a
                className={venueMapLinkClasses}
                href="mailto:rsvp@spillard.io?subject=Question%20About%20RSVP"
              >
                rsvp@spillard.io
              </a>
              .
            </CardDescription>
          </CardHeader>
        </Card>

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
                You&apos;re viewing the {invitee.type === "family" ? "family" : "guest"} event
                plan.
              </p>
              <button
                className="mt-4 inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-3 text-sm font-medium"
                onClick={resetInvitationAccess}
                type="button"
              >
                Enter a different invite code
              </button>

              {invitee.type === "family" ? (
                <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-[180px_1fr]">
                  <dt className="font-medium text-muted-foreground">Date</dt>
                  <dd>Saturday, June 26, 2027</dd>
                  <dt className="font-medium text-muted-foreground">Time</dt>
                  <dd>Arrive from 13:00 PM</dd>
                  <dt className="font-medium text-muted-foreground">Family Reception</dt>
                  <dd>
                    <a
                      className={venueMapLinkClasses}
                      href={venueMapUrl}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <span>The Old Rectory, Hammeringham, LN9 6PF</span>
                      <ExternalLink aria-hidden="true" className="size-3.5" />
                      <span className="sr-only">(opens in a new tab)</span>
                    </a>
                  </dd>
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
                  <dd>
                    <a
                      className={venueMapLinkClasses}
                      href={venueMapUrl}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <span>The Old Rectory, Hammeringham, LN9 6PF</span>
                      <ExternalLink aria-hidden="true" className="size-3.5" />
                      <span className="sr-only">(opens in a new tab)</span>
                    </a>
                  </dd>
                  <dt className="font-medium text-muted-foreground">Accommodation</dt>
                  <dd>
                    Glamping pods sleeping up to 4 people are available on-site.
                    <br />
                    Please indicate in the form below whether you would like to stay in one of
                    these, and whether you are willing to share with another couple. Breakfast
                    will be provided for those staying on-site.
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
              {isLoadingExistingRsvp ? (
                <p className="mt-3 text-sm text-muted-foreground">
                  Loading your latest RSVP details...
                </p>
              ) : null}
              <form className="mt-5 space-y-4" onSubmit={handleRsvpSubmit}>
                <label className="flex flex-col gap-2 text-sm font-medium">
                  Attendance status
                  <select
                    className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                    onChange={(event) =>
                      setAttendanceStatus(event.target.value as AttendanceStatus)
                    }
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
    </div>
  );
}
