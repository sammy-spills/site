"use client";

import Image from "next/image";
import React, { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { ExternalLink } from "lucide-react";
import { getLatestRsvp, type RsvpData, submitRsvp } from "@/lib/rsvp/firestore";
import {
  invitees,
  type InviteeRecord,
  normalizeInviteCode,
} from "@/lib/rsvp/invitees";
import { Card, CardDescription } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type AttendanceStatus = "yes" | "no" | "maybe";
type RoomShare = "yes" | "no";
type Accommodation = "yes" | "no";
type RSVPGateProps = {
  initialInviteCode?: string;
};
const venueMapUrl = "https://maps.app.goo.gl/qyo7KX7283WsTqxL7";

const FAQ_ITEMS = [
  {
    key: "dress-code",
    question: "What should I wear?",
    answer:
      'We have put the dress code as "garden party" as we hope to be outside in the garden. No colour schemes, chilled and informal vibes.',
  },
  {
    key: "day",
    question: "What to expect from the day?",
    answer: "Drinks, live music and food!",
  },
  {
    key: "parking",
    question: "Where to park?",
    answer: "There is a field over the road for those driving to the venue.",
  },
  {
    key: "plus-one",
    question: "Can I bring a plus one?",
    answer:
      "Named invitees are shown at the top of this page. If you have any questions about your specific invitation, please email us.",
  },
  {
    key: "indoor-outdoor",
    question: "Is it an outdoor or indoor event?",
    answer:
      "The day will be held outdoors but we will have a marquee in case the British weather does what it does best!",
  },
  {
    key: "end-time",
    question: "When will the party end?",
    answer:
      "We do not have an end time, but the band will be finished around 23:30.",
  },
];

const FAQ_GUESTS = [
  {
    key: "time",
    question: "What time shall I arrive?",
    answer:
      "The celebrations start at 14:30. If you are glamping, please feel free to arrive from 14:00 to get settled in.",
  },
  {
    key: "glamping",
    question: "What's the deal with the glamping?",
    answer: (
      <>
        To make life a little easier, we have arranged for a number of festival
        bell tents to be available at the house. The tents can sleep 4 people
        comfortably, with space to move around. Very much a “glamping”
        experience, the bell tents will have beds and be kitted out for everyone
        to be comfortable – me and Sam will be staying in one! We will have
        breakfast arranged for everyone on the Sunday morning. If you want to
        stay over in a bell tent, it would be £30pp to share.
        <br />
        If you wanted to stay, but did not feel comfortable sharing, please let
        us know using the form below!
      </>
    ),
  },
];

const isGuest = (invitee: InviteeRecord | null): boolean =>
  invitee?.type === "guest";

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

export function RSVPGate({ initialInviteCode = "" }: RSVPGateProps) {
  const inviteesByCode = useMemo(
    () => new Map(invitees.map((invitee) => [invitee.codeHash, invitee])),
    [],
  );

  const venueMapLinkClasses =
    "inline-flex items-center gap-1 font-medium text-primary underline underline-offset-4 transition-colors hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm";

  const [inviteCode, setInviteCode] = useState("");
  const [gateError, setGateError] = useState("");
  const [invitee, setInvitee] = useState<InviteeRecord | null>(null);

  const [attendanceStatus, setAttendanceStatus] =
    useState<AttendanceStatus>("yes");
  const [dietaryRequirements, setDietaryRequirements] = useState("");
  const [accommodation, setAccommodation] = useState<Accommodation>("yes");
  const [roomShare, setRoomShare] = useState<RoomShare>("yes");
  const [email, setEmail] = useState("");
  const [transportation, setTransportation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [hasPreviouslySubmitted, setHasPreviouslySubmitted] = useState(false);
  const [isLoadingExistingRsvp, setIsLoadingExistingRsvp] = useState(false);
  const latestRsvpRequestId = useRef(0);
  const desktopHeroCardRef = useRef<HTMLDivElement | null>(null);

  function resetFormToDefaults() {
    setAttendanceStatus("yes");
    setDietaryRequirements("");
    setAccommodation("yes");
    setRoomShare("yes");
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
    setRoomShare(rsvp.roomShare === "no-preference" ? "yes" : (rsvp.roomShare ?? "yes"));
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
      setSubmitError(
        "We couldn't load your previous RSVP right now, but you can still submit the form.",
      );
    } finally {
      if (requestId === latestRsvpRequestId.current) {
        setIsLoadingExistingRsvp(false);
      }
    }
  }

  async function unlockInviteCode(code: string): Promise<boolean> {
    setGateError("");

    const normalizedCode = normalizeInviteCode(code);
    if (!normalizedCode) {
      setGateError("Please enter the invite code from your invitation.");
      return false;
    }

    const codeHash = await sha256(normalizedCode);
    const inviteeMatch = inviteesByCode.get(codeHash);
    if (!inviteeMatch) {
      setInvitee(null);
      setGateError(
        "Sorry, we couldn't find a matching invitation for that code.",
      );
      return false;
    }

    setInvitee(inviteeMatch);
    setCookieValue(unlockedInviteCookieName, inviteeMatch.codeHash);
    setSubmitMessage("");
    setSubmitError("");
    void loadLatestRsvp(inviteeMatch);
    return true;
  }

  useEffect(() => {
    clearCookieValue(legacySubmissionsCookieName);

    const searchParamInviteCode =
      initialInviteCode ||
      new URLSearchParams(window.location.search).get("code") ||
      "";

    if (searchParamInviteCode.trim()) {
      setInviteCode(searchParamInviteCode);
      void unlockInviteCode(searchParamInviteCode);
      return;
    }

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
  }, [initialInviteCode, inviteesByCode]);

    useEffect(() => {
      let frameId = 0;

      function syncHeroScroll() {
        const heroCard = desktopHeroCardRef.current;
        if (!heroCard || !window.matchMedia("(min-width: 768px)").matches) {
          return;
        }

        const maxInternalScroll = heroCard.scrollHeight - heroCard.clientHeight;
        if (maxInternalScroll <= 0) {
          return;
        }

        // Scroll the card based on window scroll position
        heroCard.scrollTop = Math.min(maxInternalScroll, window.scrollY * 0.35);
      }

      function handleWindowScroll() {
        cancelAnimationFrame(frameId);
        frameId = window.requestAnimationFrame(syncHeroScroll);
      }

      function handleCardWheel(event: WheelEvent) {
        // Prevent manual scrolling of the card
        event.preventDefault();
      }

      const heroCard = desktopHeroCardRef.current;
      if (heroCard) {
        heroCard.addEventListener("wheel", handleCardWheel, { passive: false });
      }

      syncHeroScroll();
      window.addEventListener("scroll", handleWindowScroll, { passive: true });
      window.addEventListener("resize", handleWindowScroll);

      return () => {
        cancelAnimationFrame(frameId);
        window.removeEventListener("scroll", handleWindowScroll);
        window.removeEventListener("resize", handleWindowScroll);
        if (heroCard) {
          heroCard.removeEventListener("wheel", handleCardWheel);
        }
      };
    }, []);

  async function handleGateSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await unlockInviteCode(inviteCode);
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
        roomShare: invitee.type === "guest" && accommodation === "yes" ? roomShare : null,
        email,
        transportation: transportation || null,
      });

      setHasPreviouslySubmitted(true);
      setSubmitMessage("Thanks! Your RSVP has been submitted.");
    } catch (error) {
      console.error("RSVP submission error:", error);
      setSubmitError(
        "We couldn't submit your RSVP right now. Please try again shortly.",
      );
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
    <div className="mistral-prototype pb-12 -mx-6 md:-mx-10 lg:-mx-16">
      <div className="relative left-1/2 w-screen -translate-x-1/2 md:hidden">
        <div className="relative">
          <Image
            alt="Laura, Sam and Maple"
            className="block h-auto w-full"
            height={3448}
            priority
            sizes="100vw"
            src="/picnic.webp"
            width={2736}
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 px-4 pb-0">
            <div className="mx-auto w-full max-w-3xl">
              <h1 className="text-center font-display text-3xl tracking-tight text-white">
                Laura & Sam&apos;s Marriage Celebration
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto hidden w-full max-w-5xl px-4 pt-6 md:block">
        <Card
          className="relative mx-auto h-[70vh] max-h-[900px] min-h-[520px] w-full max-w-4xl overflow-x-hidden overflow-y-scroll scrollbar-hide py-0"
          ref={desktopHeroCardRef}
        >
          <Image
            alt="Laura, Sam and Maple"
            className="block h-auto w-full"
            height={3448}
            priority
            sizes="(min-width: 1024px) 80rem, 100vw"
            src="/picnic.webp"
            width={2736}
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 px-8 pb-8">
            <h1 className="text-center font-display font-bold text-5xl tracking-tight text-white">
              Laura & Sam&apos;s Marriage Celebration
            </h1>
          </div>
        </Card>
      </div>

      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 pt-8 md:pt-10">
        <CardDescription className="text-center text-lg leading-relaxed">
          Please enter your unique invite code to view your event details and
          RSVP.
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

        {!invitee ? (
          <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="text-xl font-display font-medium">
              Invitation access
            </h2>
            <form className="mt-4 space-y-4" onSubmit={handleGateSubmit}>
              <label className="flex flex-col gap-2 text-sm font-medium">
                Invite code
                <input
                  autoComplete="off"
                  className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                  onChange={(event) => setInviteCode(event.target.value)}
                  placeholder="e.g., AABB11"
                  required
                  value={inviteCode}
                />
              </label>
              {gateError ? (
                <p className="text-sm text-destructive">{gateError}</p>
              ) : null}
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
              <div className="text-center">
                <h2 className="text-3xl font-bold font-display text-primary">
                  Welcome, {invitee.name}
                </h2>
                <button
                  className="mt-4 inline-flex min-h-9 max-w-full items-center justify-center rounded-md border border-input bg-background px-5 py-2 text-center text-sm font-medium leading-snug"
                  onClick={resetInvitationAccess}
                  type="button"
                >
                  Filling out for someone else? Click here to enter a different
                  invite code
                </button>
              </div>

              {invitee.type === "family" ? (
                <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-[180px_1fr]">
                  <dt className="font-medium text-muted-foreground">Date</dt>
                  <dd>Saturday, June 26, 2027</dd>
                  <dt className="font-medium text-muted-foreground">Time</dt>
                  <dd>Arrive from 13:00 PM</dd>
                  <dt className="font-medium text-muted-foreground">Where</dt>
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
                  <dt className="font-medium text-muted-foreground">
                    Accommodation
                  </dt>
                  <dd>
                    We have sorted accommodation for all family members. Once
                    we've confirmed numbers, we will let you know the
                    arrangements. You do not need to book anything!
                  </dd>
                  <dt className="font-medium text-muted-foreground">
                    Dress code
                  </dt>
                  <dd>Garden Party Vibes</dd>
                </dl>
              ) : (
                <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-[180px_1fr]">
                  <dt className="font-medium text-muted-foreground">Date</dt>
                  <dd>Saturday, June 26, 2027</dd>
                  <dt className="font-medium text-muted-foreground">Time</dt>
                  <dd>Starts at 14:30 PM</dd>
                  <dt className="font-medium text-muted-foreground">Where</dt>
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
                  <dt className="font-medium text-muted-foreground">
                    Accommodation
                  </dt>
                  <dd>
                    We will have some festival bell tents set up. Please see the
                    FAQ below for more detail!
                  </dd>
                  <dt className="font-medium text-muted-foreground">
                    Dress code
                  </dt>
                  <dd>Garden Party Vibes</dd>
                </dl>
              )}
            </section>

            <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <Accordion>
                <AccordionItem key="faq">
                  <AccordionTrigger>
                    <h2 className="text-xl font-display font-semibold">FAQ</h2>
                  </AccordionTrigger>
                  <AccordionContent>
                    <Accordion>
                      {(isGuest(invitee)
                        ? [...FAQ_GUESTS, ...FAQ_ITEMS]
                        : FAQ_ITEMS
                      ).map((item) => (
                        <AccordionItem key={item.key}>
                          <AccordionTrigger>
                            <h2 className="text-sm font-medium leading-snug">
                              {item.question}
                            </h2>
                          </AccordionTrigger>
                          <AccordionContent className="text-muted-foreground text-sm leading-relaxed">
                            {item.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </section>

            <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h2 className="text-xl font-display font-semibold">RSVP</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Please reply by November 1, 2026. You can let us know if plans
                change by re-submitting the form, or emailing us at{" "}
                <a
                  className={venueMapLinkClasses}
                  href="mailto:rsvp@spillard.io"
                >
                  rsvp@spillard.io
                </a>
                .
              </p>
              {hasPreviouslySubmitted ? (
                <p className="mt-3 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                  We already have an RSVP from you, but you can resubmit this
                  form anytime to update your answers.
                </p>
              ) : null}
              {isLoadingExistingRsvp ? (
                <p className="mt-3 text-sm text-muted-foreground">
                  Loading your latest RSVP details...
                </p>
              ) : null}
              <form className="mt-5 space-y-4" onSubmit={handleRsvpSubmit}>
                <label className="flex flex-col gap-2 text-sm font-medium">
                  <p className="font-medium text-muted-foreground">
                    Attendance status
                  </p>
                  <select
                    className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                    onChange={(event) =>
                      setAttendanceStatus(
                        event.target.value as AttendanceStatus,
                      )
                    }
                    value={attendanceStatus}
                  >
                    <option value="yes">Yes, I&apos;ll be there</option>
                    <option value="no">No, I can&apos;t make it</option>
                  </select>
                </label>

                <label className="flex flex-col gap-2 text-sm font-medium">
                  <p className="font-medium text-muted-foreground">
                    Dietary requirements
                  </p>
                  <textarea
                    className="min-h-24 rounded-md border border-input bg-background px-3 py-2 text-sm"
                    onChange={(event) =>
                      setDietaryRequirements(event.target.value)
                    }
                    placeholder="Allergies, intolerances, preferences"
                    value={dietaryRequirements}
                  />
                </label>

                {invitee.type === "guest" ? (
                  <>
                    <label className="flex flex-col gap-2 text-sm font-medium">
                      <p className="font-medium text-muted-foreground">
                        Happy to stay in provided accommodation? (See FAQ above)
                      </p>
                      <select
                        className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                        onChange={(event) =>
                          setAccommodation(event.target.value as Accommodation)
                        }
                        value={accommodation}
                      >
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </select>
                    </label>

                    <label className="flex flex-col gap-2 text-sm font-medium">
                      <p className="font-medium text-muted-foreground">
                        Willing to share a bell tent in provided accommodation?
                      </p>
                      <select
                        className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                        onChange={(event) =>
                          setRoomShare(event.target.value as RoomShare)
                        }
                        value={roomShare}
                      >
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </select>
                    </label>

                    <label className="flex flex-col gap-2 text-sm font-medium">
                      <p className="font-medium text-muted-foreground">
                        How will you be arriving?
                      </p>
                      <textarea
                        className="min-h-24 rounded-md border border-input bg-background px-3 py-2 text-sm"
                        onChange={(event) =>
                          setTransportation(event.target.value)
                        }
                        placeholder={
                          "E.g. train, driving etc.\nIf lots of people are taking public transport, we may be able to arrange travel to the house as it is a very rural location!"
                        }
                        required
                        value={transportation}
                      />
                    </label>
                  </>
                ) : null}

                <label className="flex flex-col gap-2 text-sm font-medium">
                  <p className="font-medium text-muted-foreground">
                    Primary email address
                  </p>
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
                  <p
                    aria-live="assertive"
                    className="text-sm text-destructive"
                    role="alert"
                  >
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
