import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import type { InviteeRecord } from "@/lib/rsvp/invitees";

export interface RsvpData {
  attendanceStatus: "yes" | "no" | "maybe";
  dietaryRequirements: string;
  accommodation: "yes" | "no" | null;
  roomShare: "yes" | "no" | "no-preference" | null;
  email: string;
  transportation: string | null;
}

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase (prevent re-initialization during HMR)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

function assertFirebaseConfigured() {
  if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
    throw new Error("Firebase Project ID is not configured.");
  }
}

export async function getInviteeByCodeHash(codeHash: string): Promise<InviteeRecord | null> {
  assertFirebaseConfigured();

  const inviteesRef = collection(db, "invitees");

  // Preferred shape: invitees/{codeHash}
  const byIdSnapshot = await getDoc(doc(inviteesRef, codeHash));
  if (byIdSnapshot.exists()) {
    const data = byIdSnapshot.data();

    if (data.active === false) {
      return null;
    }

    return {
      codeHash,
      name: data.name,
      type: data.type,
      active: data.active,
    };
  }

  // Backward-compatible fallback if docs are keyed by random IDs.
  const byFieldSnapshot = await getDocs(query(inviteesRef, where("codeHash", "==", codeHash), limit(1)));

  if (byFieldSnapshot.empty) {
    return null;
  }

  const data = byFieldSnapshot.docs[0]?.data();

  if (!data || data.active === false) {
    return null;
  }

  return {
    codeHash: data.codeHash,
    name: data.name,
    type: data.type,
    active: data.active,
  };
}

/**
 * Submits an RSVP to the Firestore 'rsvps' collection.
 *
 * @param invitee - The record of the invitee who is RSVPing.
 * @param data - The RSVP details provided by the user.
 * @throws Error if the submission fails.
 */
export async function submitRsvp(invitee: InviteeRecord, data: RsvpData): Promise<void> {
  assertFirebaseConfigured();

  try {
    await addDoc(collection(db, "rsvps"), {
      inviteeName: invitee.name,
      inviteeType: invitee.type,
      inviteCodeHash: invitee.codeHash,
      attendanceStatus: data.attendanceStatus,
      dietaryRequirements: data.dietaryRequirements,
      accommodation: data.accommodation,
      roomShare: data.roomShare,
      email: data.email,
      transportation: data.transportation,
      submittedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error adding RSVP document: ", error);
    throw error;
  }
}

/**
 * Retrieves the most recent RSVP for a given invitee code hash.
 *
 * @param inviteeCodeHash - The hash of the invitee's code.
 * @returns The most recent RSVP data or null if no submission is found.
 */
export async function getLatestRsvp(inviteeCodeHash: string): Promise<RsvpData | null> {
  assertFirebaseConfigured();

  try {
    const rsvpsRef = collection(db, "rsvps");
    const q = query(
      rsvpsRef,
      where("inviteCodeHash", "==", inviteeCodeHash),
      orderBy("submittedAt", "desc"),
      limit(1),
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null;
    }

    const rsvpDoc = querySnapshot.docs[0];
    const data = rsvpDoc.data();

    return {
      attendanceStatus: data.attendanceStatus,
      dietaryRequirements: data.dietaryRequirements,
      accommodation: data.accommodation,
      roomShare: data.roomShare,
      email: data.email,
      transportation: data.transportation,
    };
  } catch (error) {
    console.error("Error fetching latest RSVP: ", error);
    throw error;
  }
}
