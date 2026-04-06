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

## Wedding subdomain setup

The repo now includes a wedding page at `/wedding` that is intended to be served from
`wedding.spillard.io`.

### 1) Configure invitee access

1. Open `src/lib/wedding/invitees.ts`.
2. Create a unique invite code for each household/person and mark them as `family` or `guest`.
3. Add the SHA-256 hash of each code to `codeHash` (avoid storing plain invite codes in the repo).

Example command for generating a code hash:

```bash
echo -n "FAM-2027-ALPHA" | tr -d "[:space:]" | tr "[:lower:]" "[:upper:]" | shasum -a 256
```

### 2) Configure RSVP delivery

Set either:

- `NEXT_PUBLIC_FORMSPARK_FORM_ID` (recommended) to your FormSpark form ID. The site submits to
  `https://submit-form.com/<FORM_ID>` directly from the browser.
- `NEXT_PUBLIC_WEDDING_RSVP_ENDPOINT` to override the endpoint URL explicitly.

Both options use a client-side `fetch` request, so they work in static deployments such as GitHub
Pages.

### 3) DNS + hosting

Point `wedding.spillard.io` at the same deployment as `spillard.io`, and configure your host to
serve the `/wedding` route for that subdomain.

The page also sets no-index metadata and disallows `/wedding` in `robots.txt` as an additional
anti-indexing measure.
