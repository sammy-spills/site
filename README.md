# Portfolio Starter

This repository contains a stripped-back personal site starter with the original author content removed.

## Development

```bash
bun install
bun run dev
```

## Build

```bash
bun run build
```

## RSVP invitees (Firestore)

Invitees are expected to live in the `invitees` Firestore collection (document ID = invite code hash).

1. Copy `scripts/invitees.seed.example.json` to `scripts/invitees.seed.json`.
2. Fill in your real invitees in `scripts/invitees.seed.json`.
3. Ensure Firebase env vars are set.
4. Run:

```bash
bun run seed:invitees
```

A starter Firestore rules draft is included in `firestore.rules`.
