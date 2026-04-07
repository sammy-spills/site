import { readFile } from "node:fs/promises";
import process from "node:process";
import { initializeApp } from "firebase/app";
import { doc, getFirestore, serverTimestamp, setDoc } from "firebase/firestore";

/**
 * Usage:
 *   node scripts/seed-invitees.mjs ./scripts/invitees.seed.json
 *
 * Required env vars:
 *   NEXT_PUBLIC_FIREBASE_API_KEY
 *   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
 *   NEXT_PUBLIC_FIREBASE_PROJECT_ID
 *   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
 *   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
 *   NEXT_PUBLIC_FIREBASE_APP_ID
 */

const filePath = process.argv[2] ?? "./scripts/invitees.seed.json";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

for (const [key, value] of Object.entries(firebaseConfig)) {
  if (!value) {
    throw new Error(`Missing required environment variable for ${key}`);
  }
}

const raw = await readFile(filePath, "utf8");
const invitees = JSON.parse(raw);

if (!Array.isArray(invitees)) {
  throw new Error("Seed file must contain a JSON array.");
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let total = 0;
for (const invitee of invitees) {
  if (!invitee?.codeHash || !invitee?.name || !invitee?.type) {
    throw new Error(`Invalid invitee payload: ${JSON.stringify(invitee)}`);
  }

  await setDoc(
    doc(db, "invitees", invitee.codeHash),
    {
      codeHash: invitee.codeHash,
      name: invitee.name,
      type: invitee.type,
      active: invitee.active ?? true,
      updatedAt: serverTimestamp(),
      ...(invitee.createdAt ? {} : { createdAt: serverTimestamp() }),
    },
    { merge: true },
  );

  total += 1;
}

console.log(`Seeded/updated ${total} invitee records.`);
