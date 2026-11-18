import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, signInAnonymously, signOut, type User } from "firebase/auth";
import {
  deleteDoc,
  doc,
  getDoc,
  getFirestore,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

export type MapleTwoAttendanceStatus = "yes" | "no";

export interface MapleTwoInvitee {
  codeHash: string;
  name: string;
}

export interface MapleTwoRsvpData {
  attendanceStatus: MapleTwoAttendanceStatus;
  dietaryRequirements: string;
  email: string;
  message: string;
  partySize: number | null;
}

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const mapleTwoAccessCollection = "maple-two-rsvp-access";
const mapleTwoInviteCollection = "maple-two-invites";
const mapleTwoRsvpCollection = "maple-two-rsvps";

function assertFirebaseConfigured() {
  if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
    throw new Error("Firebase Project ID is not configured.");
  }
}

function isPermissionDenied(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error.code === "permission-denied" ||
      error.code === "firestore/permission-denied")
  );
}

function getMapleTwoAccessDocument(userId: string) {
  return doc(db, mapleTwoAccessCollection, userId);
}

function getMapleTwoInviteDocument(inviteCodeHash: string) {
  return doc(db, mapleTwoInviteCollection, inviteCodeHash);
}

async function getOrCreateMapleTwoUser(): Promise<User> {
  await auth.authStateReady();
  if (auth.currentUser) {
    return auth.currentUser;
  }

  const credential = await signInAnonymously(auth);
  return credential.user;
}

async function readMapleTwoInvite(
  inviteCodeHash: string
): Promise<MapleTwoInvitee | null> {
  const snapshot = await getDoc(getMapleTwoInviteDocument(inviteCodeHash));
  if (!snapshot.exists()) {
    return null;
  }

  const data = snapshot.data();
  if (typeof data.name !== "string" || !data.name.trim()) {
    throw new Error("Stored Maple birthday invite has an invalid name.");
  }

  return {
    codeHash: inviteCodeHash,
    name: data.name,
  };
}

export async function claimMapleTwoInvite(
  inviteCodeHash: string
): Promise<MapleTwoInvitee | null> {
  assertFirebaseConfigured();
  const user = await getOrCreateMapleTwoUser();

  try {
    await setDoc(getMapleTwoAccessDocument(user.uid), {
      claimedAt: serverTimestamp(),
      eventId: "maple-two",
      inviteHash: inviteCodeHash,
    });
  } catch (error) {
    if (isPermissionDenied(error)) {
      return null;
    }
    throw error;
  }

  return readMapleTwoInvite(inviteCodeHash);
}

export async function restoreMapleTwoInviteAccess(): Promise<MapleTwoInvitee | null> {
  assertFirebaseConfigured();
  await auth.authStateReady();

  const user = auth.currentUser;
  if (!user) {
    return null;
  }

  const snapshot = await getDoc(getMapleTwoAccessDocument(user.uid));
  if (!snapshot.exists()) {
    return null;
  }

  const data = snapshot.data();
  if (data.eventId !== "maple-two" || typeof data.inviteHash !== "string") {
    return null;
  }

  return readMapleTwoInvite(data.inviteHash);
}

export async function clearMapleTwoInviteAccess(): Promise<void> {
  assertFirebaseConfigured();
  await auth.authStateReady();

  const user = auth.currentUser;
  if (!user) {
    return;
  }

  try {
    await deleteDoc(getMapleTwoAccessDocument(user.uid));
  } finally {
    await signOut(auth);
  }
}

export async function getMapleTwoRsvp(
  inviteeCodeHash: string
): Promise<MapleTwoRsvpData | null> {
  assertFirebaseConfigured();

  const snapshot = await getDoc(
    doc(db, mapleTwoRsvpCollection, inviteeCodeHash)
  );
  if (!snapshot.exists()) {
    return null;
  }

  const data = snapshot.data();
  if (data.attendanceStatus !== "yes" && data.attendanceStatus !== "no") {
    throw new Error("Stored Maple birthday RSVP has an invalid status.");
  }

  return {
    attendanceStatus: data.attendanceStatus,
    dietaryRequirements:
      typeof data.dietaryRequirements === "string"
        ? data.dietaryRequirements
        : "",
    email: typeof data.email === "string" ? data.email : "",
    message: typeof data.message === "string" ? data.message : "",
    partySize:
      typeof data.partySize === "number" && data.partySize > 0
        ? data.partySize
        : null,
  };
}

export async function submitMapleTwoRsvp(
  invitee: MapleTwoInvitee,
  data: MapleTwoRsvpData
): Promise<void> {
  assertFirebaseConfigured();

  await setDoc(doc(db, mapleTwoRsvpCollection, invitee.codeHash), {
    ...data,
    eventId: "maple-two",
    inviteCodeHash: invitee.codeHash,
    inviteeName: invitee.name,
    submittedAt: serverTimestamp(),
  });
}
