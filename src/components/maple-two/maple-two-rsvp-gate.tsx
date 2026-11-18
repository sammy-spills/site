"use client";

import Image from "next/image";
import type { FormEvent, ReactNode } from "react";
import { useEffect, useEffectEvent, useRef, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardDescription } from "@/components/ui/card";
import {
  claimMapleTwoInvite,
  clearMapleTwoInviteAccess,
  getMapleTwoRsvp,
  type MapleTwoAttendanceStatus,
  type MapleTwoInvitee,
  type MapleTwoRsvpData,
  restoreMapleTwoInviteAccess,
  submitMapleTwoRsvp,
} from "@/lib/maple-two/firestore";
import {
  hashMapleTwoInviteCode,
  normalizeMapleTwoInviteCode,
} from "@/lib/maple-two/invite-code";

const FAQ_ITEMS = [
  {
    key: "arrival-time",
    question: "What time should we arrive?",
    answer:
      "The party time is still TBC. We will update this page once it has been confirmed.",
  },
  {
    key: "parking",
    question: "Where should we park?",
    answer:
      "Parking and travel details are TBC and will be added before the party.",
  },
  {
    key: "food-and-drinks",
    question: "Will there be food and drinks?",
    answer:
      "Food and drink details are TBC. Please include any allergies or dietary requirements in your RSVP.",
  },
  {
    key: "dietary-requirements",
    question: "Can dietary requirements be accommodated?",
    answer:
      "Please tell us about any allergies, intolerances, or dietary requirements in the RSVP form and we will plan accordingly.",
  },
  {
    key: "additional-guests",
    question: "Can siblings or additional guests come?",
    answer:
      "Guest details are TBC. For now, include the total number of people you expect to attend in your RSVP.",
  },
  {
    key: "presents",
    question: "Should we bring a present?",
    answer: "Present guidance is TBC and will be added here soon.",
  },
  {
    key: "indoors-outdoors",
    question: "Will the party be indoors or outdoors?",
    answer:
      "The final setup is TBC. We will add weather and clothing guidance nearer the date.",
  },
  {
    key: "finish-time",
    question: "When will the party finish?",
    answer: "The finish time is TBC and will be confirmed here.",
  },
];

function removeInviteCodeFromUrl() {
  const url = new URL(window.location.href);
  url.searchParams.delete("code");
  window.history.replaceState(
    window.history.state,
    "",
    `${url.pathname}${url.search}${url.hash}`
  );
}

interface InvitationAccessBoundaryProps {
  children: ReactNode;
  gateError: string;
  hasInvitee: boolean;
  inviteCode: string;
  isCheckingInviteCode: boolean;
  isResettingInvitationAccess: boolean;
  isRestoringInvitationAccess: boolean;
  onInviteCodeChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
}

function InvitationAccessBoundary({
  children,
  gateError,
  hasInvitee,
  inviteCode,
  isCheckingInviteCode,
  isResettingInvitationAccess,
  isRestoringInvitationAccess,
  onInviteCodeChange,
  onSubmit,
}: InvitationAccessBoundaryProps) {
  if (isRestoringInvitationAccess) {
    return (
      <section className="border border-border bg-card p-6 shadow-sm">
        <p
          aria-live="polite"
          className="text-center text-muted-foreground text-sm"
        >
          Checking saved invitation access...
        </p>
      </section>
    );
  }

  if (hasInvitee) {
    return children;
  }

  const isBusy = isCheckingInviteCode || isResettingInvitationAccess;

  return (
    <section className="border border-border bg-card p-6 shadow-sm">
      <h2 className="font-display font-medium text-xl">Invitation access</h2>
      <form className="mt-4 space-y-4" onSubmit={onSubmit}>
        <label className="flex flex-col gap-2 font-medium text-sm">
          Invite code
          <input
            autoComplete="off"
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            disabled={isBusy}
            onChange={(event) => onInviteCodeChange(event.target.value)}
            placeholder="e.g., ABC123"
            required
            value={inviteCode}
          />
        </label>
        {gateError ? (
          <p aria-live="polite" className="text-destructive text-sm">
            {gateError}
          </p>
        ) : null}
        <button
          aria-disabled={isBusy}
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 font-medium text-primary-foreground text-sm"
          disabled={isBusy}
          type="submit"
        >
          {isCheckingInviteCode ? "Checking..." : "Continue"}
        </button>
      </form>
    </section>
  );
}

export function MapleTwoRsvpGate() {
  const [inviteCode, setInviteCode] = useState("");
  const [gateError, setGateError] = useState("");
  const [invitee, setInvitee] = useState<MapleTwoInvitee | null>(null);
  const [attendanceStatus, setAttendanceStatus] =
    useState<MapleTwoAttendanceStatus>("yes");
  const [partySize, setPartySize] = useState("1");
  const [dietaryRequirements, setDietaryRequirements] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [hasPreviouslySubmitted, setHasPreviouslySubmitted] = useState(false);
  const [isLoadingExistingRsvp, setIsLoadingExistingRsvp] = useState(false);
  const [isRestoringInvitationAccess, setIsRestoringInvitationAccess] =
    useState(true);
  const [isCheckingInviteCode, setIsCheckingInviteCode] = useState(false);
  const [isResettingInvitationAccess, setIsResettingInvitationAccess] =
    useState(false);
  const latestRsvpRequestId = useRef(0);
  const desktopHeroCardRef = useRef<HTMLDivElement | null>(null);

  function resetFormToDefaults() {
    setAttendanceStatus("yes");
    setPartySize("1");
    setDietaryRequirements("");
    setEmail("");
    setMessage("");
  }

  function populateFormFromRsvp(rsvp: MapleTwoRsvpData | null) {
    if (!rsvp) {
      resetFormToDefaults();
      setHasPreviouslySubmitted(false);
      return;
    }

    setAttendanceStatus(rsvp.attendanceStatus);
    setPartySize(rsvp.partySize?.toString() ?? "1");
    setDietaryRequirements(rsvp.dietaryRequirements);
    setEmail(rsvp.email);
    setMessage(rsvp.message);
    setHasPreviouslySubmitted(true);
  }

  async function loadExistingRsvp(unlockedInvitee: MapleTwoInvitee) {
    const requestId = ++latestRsvpRequestId.current;
    setIsLoadingExistingRsvp(true);
    setSubmitError("");

    try {
      const existingRsvp = await getMapleTwoRsvp(unlockedInvitee.codeHash);
      if (requestId !== latestRsvpRequestId.current) {
        return;
      }

      populateFormFromRsvp(existingRsvp);
    } catch (error) {
      if (requestId !== latestRsvpRequestId.current) {
        return;
      }

      console.error("Failed to load the Maple birthday RSVP:", error);
      resetFormToDefaults();
      setHasPreviouslySubmitted(false);
      setSubmitError(
        "We couldn't load your previous RSVP right now, but you can still submit the form."
      );
    } finally {
      if (requestId === latestRsvpRequestId.current) {
        setIsLoadingExistingRsvp(false);
      }
    }
  }

  async function unlockInviteCode(code: string): Promise<boolean> {
    setGateError("");

    const normalizedCode = normalizeMapleTwoInviteCode(code);
    if (!normalizedCode) {
      setGateError("Please enter the invite code from your invitation.");
      return false;
    }

    setIsCheckingInviteCode(true);

    try {
      const codeHash = await hashMapleTwoInviteCode(normalizedCode);
      const inviteeMatch = await claimMapleTwoInvite(codeHash);
      if (!inviteeMatch) {
        setInvitee(null);
        setGateError(
          "Sorry, we couldn't find a matching invitation for that code."
        );
        return false;
      }

      setInvitee(inviteeMatch);
      setSubmitMessage("");
      setSubmitError("");
      await loadExistingRsvp(inviteeMatch);
      return true;
    } catch (error) {
      console.error("Failed to check the Maple birthday invite code:", error);
      setInvitee(null);
      setGateError(
        "We couldn't check that invite code right now. Please try again shortly."
      );
      return false;
    } finally {
      setIsCheckingInviteCode(false);
    }
  }

  const restoreInvitationAccess = useEffectEvent(async () => {
    try {
      const searchParamInviteCode =
        new URLSearchParams(window.location.search).get("code") ?? "";

      if (searchParamInviteCode.trim()) {
        setInviteCode(searchParamInviteCode);
        const didUnlockInvite = await unlockInviteCode(searchParamInviteCode);
        removeInviteCodeFromUrl();
        if (didUnlockInvite) {
          return;
        }
      }

      const restoredInvitee = await restoreMapleTwoInviteAccess();
      if (!restoredInvitee) {
        return;
      }

      setInvitee(restoredInvitee);
      await loadExistingRsvp(restoredInvitee);
    } catch (error) {
      console.error(
        "Failed to restore Maple birthday invitation access:",
        error
      );
      setGateError(
        "We couldn't restore your invitation. Please enter your invite code again."
      );
    } finally {
      setIsRestoringInvitationAccess(false);
    }
  });

  useEffect(() => {
    restoreInvitationAccess().catch((error: unknown) => {
      console.error(
        "Failed to restore Maple birthday invitation access:",
        error
      );
    });
  }, []);

  useEffect(() => {
    let frameId = 0;

    function syncHeroScroll() {
      const heroCard = desktopHeroCardRef.current;
      if (!(heroCard && window.matchMedia("(min-width: 768px)").matches)) {
        return;
      }

      const maxInternalScroll = heroCard.scrollHeight - heroCard.clientHeight;
      if (maxInternalScroll <= 0) {
        return;
      }

      heroCard.scrollTop = Math.min(maxInternalScroll, window.scrollY * 0.35);
    }

    function handleWindowScroll() {
      cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(syncHeroScroll);
    }

    function handleCardWheel(event: WheelEvent) {
      event.preventDefault();
    }

    const heroCard = desktopHeroCardRef.current;
    heroCard?.addEventListener("wheel", handleCardWheel, { passive: false });
    syncHeroScroll();
    window.addEventListener("scroll", handleWindowScroll, { passive: true });
    window.addEventListener("resize", handleWindowScroll);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", handleWindowScroll);
      window.removeEventListener("resize", handleWindowScroll);
      heroCard?.removeEventListener("wheel", handleCardWheel);
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

    const parsedPartySize =
      attendanceStatus === "yes" ? Number(partySize) : null;
    if (
      parsedPartySize !== null &&
      (!Number.isInteger(parsedPartySize) ||
        parsedPartySize < 1 ||
        parsedPartySize > 50)
    ) {
      setSubmitError("Please enter a party size between 1 and 50.");
      return;
    }

    setIsSubmitting(true);

    try {
      await submitMapleTwoRsvp(invitee, {
        attendanceStatus,
        dietaryRequirements:
          attendanceStatus === "yes" ? dietaryRequirements : "",
        email,
        message,
        partySize: parsedPartySize,
      });
      setHasPreviouslySubmitted(true);
      setSubmitMessage("Thanks! Your RSVP has been submitted.");
    } catch (error) {
      console.error("Maple birthday RSVP submission error:", error);
      setSubmitError(
        "We couldn't submit your RSVP right now. Please try again shortly."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function resetInvitationAccess() {
    setInvitee(null);
    setInviteCode("");
    setGateError("");
    setSubmitMessage("");
    setSubmitError("");
    setHasPreviouslySubmitted(false);
    latestRsvpRequestId.current += 1;
    setIsLoadingExistingRsvp(false);
    resetFormToDefaults();
    setIsResettingInvitationAccess(true);

    try {
      await clearMapleTwoInviteAccess();
    } catch (error) {
      console.error("Failed to clear Maple birthday invitation access:", error);
      setGateError(
        "Your saved invitation couldn't be cleared, but you can still enter another code."
      );
    } finally {
      setIsResettingInvitationAccess(false);
    }
  }

  return (
    <div className="maple-two-page mistral-prototype -mx-6 pb-12 md:-mx-10 lg:-mx-16">
      <div className="relative left-1/2 w-screen -translate-x-1/2 md:hidden">
        <div className="relative">
          <Image
            alt="Maple with Laura and Sam"
            className="block h-auto w-full"
            height={3448}
            priority
            sizes="100vw"
            src="/maple_birthday.webp"
            width={2736}
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 px-4">
            <div className="mx-auto w-full max-w-3xl">
              <h1 className="text-center font-display text-3xl text-white tracking-tight">
                Maple&apos;s Second Birthday
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto hidden w-full max-w-5xl px-4 pt-6 md:block">
        <Card
          className="scrollbar-hide relative mx-auto h-[70vh] max-h-[900px] min-h-[520px] w-full max-w-4xl overflow-x-hidden overflow-y-scroll py-0"
          ref={desktopHeroCardRef}
        >
          <Image
            alt="Maple with Laura and Sam"
            className="block h-auto w-full"
            height={3448}
            priority
            sizes="(min-width: 1024px) 80rem, 100vw"
            src="/maple_birthday.webp"
            width={2736}
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 px-8 pb-8">
            <h1 className="text-center font-bold font-display text-5xl text-white tracking-tight">
              Maple&apos;s Second Birthday
            </h1>
          </div>
        </Card>
      </div>

      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 pt-8 md:pt-10">
        <CardDescription className="text-center text-lg leading-relaxed">
          Please enter your unique invite code to view the party details and
          RSVP. Contact details will be added soon.
        </CardDescription>

        <InvitationAccessBoundary
          gateError={gateError}
          hasInvitee={invitee !== null}
          inviteCode={inviteCode}
          isCheckingInviteCode={isCheckingInviteCode}
          isResettingInvitationAccess={isResettingInvitationAccess}
          isRestoringInvitationAccess={isRestoringInvitationAccess}
          onInviteCodeChange={setInviteCode}
          onSubmit={handleGateSubmit}
        >
          <section className="border border-border bg-card p-6 shadow-sm">
            <div className="text-center">
              <h2 className="font-bold font-display text-3xl text-primary">
                Welcome, {invitee?.name}
              </h2>
              <button
                className="mt-4 inline-flex min-h-9 max-w-full items-center justify-center rounded-md border border-input bg-background px-5 py-2 text-center font-medium text-sm leading-snug"
                disabled={isResettingInvitationAccess}
                onClick={resetInvitationAccess}
                type="button"
              >
                {isResettingInvitationAccess
                  ? "Clearing invitation..."
                  : "Filling out for someone else? Enter a different invite code"}
              </button>
            </div>

            <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-[180px_1fr]">
              <dt className="font-medium text-muted-foreground">Date</dt>
              <dd>TBC</dd>
              <dt className="font-medium text-muted-foreground">Time</dt>
              <dd>TBC</dd>
              <dt className="font-medium text-muted-foreground">Where</dt>
              <dd>TBC</dd>
              <dt className="font-medium text-muted-foreground">
                What to expect
              </dt>
              <dd>Birthday celebrations for Maple, with details TBC.</dd>
            </dl>
          </section>

          <section className="border border-border bg-card p-6 shadow-sm">
            <Accordion>
              <AccordionItem key="faq">
                <AccordionTrigger>
                  <h2 className="font-display font-semibold text-xl">FAQ</h2>
                </AccordionTrigger>
                <AccordionContent>
                  <Accordion>
                    {FAQ_ITEMS.map((item) => (
                      <AccordionItem key={item.key}>
                        <AccordionTrigger>
                          <h3 className="font-medium text-sm leading-snug">
                            {item.question}
                          </h3>
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

          <section className="border border-border bg-card p-6 shadow-sm">
            <h2 className="font-display font-semibold text-xl">RSVP</h2>
            <p className="mt-2 text-muted-foreground text-sm">
              The RSVP deadline is TBC. You can update your response at any time
              by resubmitting this form.
            </p>
            {hasPreviouslySubmitted ? (
              <p className="mt-3 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-emerald-700 text-sm">
                We already have an RSVP from you, but you can resubmit this form
                anytime to update your answers.
              </p>
            ) : null}
            {isLoadingExistingRsvp ? (
              <p className="mt-3 text-muted-foreground text-sm">
                Loading your latest RSVP details...
              </p>
            ) : (
              <form className="mt-5 space-y-4" onSubmit={handleRsvpSubmit}>
                <label className="flex flex-col gap-2 font-medium text-sm">
                  <span className="font-medium text-muted-foreground">
                    Attendance status
                  </span>
                  <select
                    className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                    onChange={(event) =>
                      setAttendanceStatus(
                        event.target.value as MapleTwoAttendanceStatus
                      )
                    }
                    value={attendanceStatus}
                  >
                    <option value="yes">Yes, we&apos;ll be there</option>
                    <option value="no">No, we can&apos;t make it</option>
                  </select>
                </label>

                {attendanceStatus === "yes" ? (
                  <>
                    <label className="flex flex-col gap-2 font-medium text-sm">
                      <span className="font-medium text-muted-foreground">
                        Number attending
                      </span>
                      <input
                        className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                        inputMode="numeric"
                        max="50"
                        min="1"
                        onChange={(event) => setPartySize(event.target.value)}
                        required
                        step="1"
                        type="number"
                        value={partySize}
                      />
                    </label>

                    <label className="flex flex-col gap-2 font-medium text-sm">
                      <span className="font-medium text-muted-foreground">
                        Dietary requirements
                      </span>
                      <textarea
                        className="min-h-24 rounded-md border border-input bg-background px-3 py-2 text-sm"
                        maxLength={2000}
                        onChange={(event) =>
                          setDietaryRequirements(event.target.value)
                        }
                        placeholder="Allergies, intolerances, preferences"
                        value={dietaryRequirements}
                      />
                    </label>
                  </>
                ) : null}

                <label className="flex flex-col gap-2 font-medium text-sm">
                  <span className="font-medium text-muted-foreground">
                    Primary email address
                  </span>
                  <input
                    autoComplete="email"
                    className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                    maxLength={320}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                    type="email"
                    value={email}
                  />
                </label>

                <label className="flex flex-col gap-2 font-medium text-sm">
                  <span className="font-medium text-muted-foreground">
                    Message (optional)
                  </span>
                  <textarea
                    className="min-h-24 rounded-md border border-input bg-background px-3 py-2 text-sm"
                    maxLength={2000}
                    onChange={(event) => setMessage(event.target.value)}
                    placeholder="Anything else you'd like us to know"
                    value={message}
                  />
                </label>

                {submitError ? (
                  <p
                    aria-live="assertive"
                    className="text-destructive text-sm"
                    role="alert"
                  >
                    {submitError}
                  </p>
                ) : null}
                {submitMessage ? (
                  <p aria-live="polite" className="text-emerald-600 text-sm">
                    {submitMessage}
                  </p>
                ) : null}

                <button
                  aria-disabled={isSubmitting}
                  className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 font-medium text-primary-foreground text-sm disabled:opacity-60"
                  disabled={isSubmitting}
                  type="submit"
                >
                  {isSubmitting ? "Submitting..." : "Submit RSVP"}
                </button>
              </form>
            )}
          </section>
        </InvitationAccessBoundary>
      </div>
    </div>
  );
}
