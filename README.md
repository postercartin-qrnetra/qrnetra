# QRNetra

Privacy-first QR safety tags for vehicles, kids, pets, and fleets. Built on Next.js 16 (App Router), Tailwind v4, and Supabase.

## Local development

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run dev
```

Open http://localhost:3000.

If you want a fully offline stack, start Supabase locally with `npx supabase start` (Docker required) and point `.env.local` at `http://127.0.0.1:54321`.

## Deploying to Vercel

The single most common cause of "Internal Server Error" on a fresh Vercel deploy is **missing environment variables**. `.env.local` is gitignored on purpose, so the values you use locally do **not** travel to Vercel.

### 1. Set environment variables in Vercel

In **Project → Settings → Environment Variables**, add the following for all three environments (Production, Preview, Development):

| Name | Value | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://<project-ref>.supabase.co` | From Supabase dashboard → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJ...` (anon, **not** service role) | From Supabase dashboard → Settings → API |
| `NEXT_PUBLIC_SITE_URL` | `https://your-domain.com` | Optional on Vercel (auto-uses `NEXT_PUBLIC_VERCEL_URL`). **Never** set to `localhost` in Production/Preview. |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJ...` (server only) | Only required if you add admin scripts or webhooks |

> Do **not** copy your local `127.0.0.1:54321` URL into Vercel.

### 2. Configure Supabase Auth redirects

In **Supabase → Authentication → URL Configuration**:

1. **Site URL** — your production domain (e.g. `https://your-domain.com`), **not** `http://localhost:3000`.
2. **Redirect URLs** — add every callback origin you use:

```
http://localhost:3000/auth/callback
https://your-domain.com/auth/callback
https://*.vercel.app/auth/callback
```

If Site URL or Redirect URLs still point at localhost, Google OAuth will send users to `http://localhost:3000/?code=…` even from production.

Replace `your-domain.com` with your real Vercel/custom domain. If you use Google OAuth, also enable the Google provider in **Authentication → Providers** and add the same production callback URL to the Google Cloud OAuth client **Authorized redirect URIs** (Supabase shows the exact URI in the provider settings).

### 3. Run database migrations

```bash
npx supabase link --project-ref <project-ref>
npx supabase db push
```

This applies the two migrations in [supabase/migrations/](supabase/migrations/): the core schema and the MVP additions (`profile_extra`, `device_type`, `business` kind).

### 4. Deploy

```bash
git push          # Vercel auto-deploys
```

Or trigger a deploy from the Vercel dashboard. The build runs `next build` (no lint step) and should complete in ~5s on Vercel's infrastructure.

## Production safety features

- **`src/proxy.ts`** — Next.js 16 proxy (formerly middleware) refreshes Supabase sessions on every protected request. Skips `/_next/*`, static assets, `/api/*`, `/auth/callback`, and `/s/[slug]` so public scan pages work without auth cookies.
- **Env-safe Supabase clients** — `createClient()` and `createPublicServerClient()` return `null` (not throw) when env vars are missing, so a misconfigured deploy renders a friendly banner instead of a bare "Internal Server Error".
- **Global error boundaries** — `src/app/error.tsx`, `src/app/global-error.tsx`, and `src/app/not-found.tsx` catch unhandled runtime errors and surface a friendly UI plus an error digest for log correlation.

## Project structure

```
src/
  app/
    (marketing)/         # public landing + policy pages
    (auth)/login/        # sign-in / sign-up
    (dashboard)/         # auth-gated owner dashboard
    (shop)/              # storefront (stub)
    create/              # 2-step QR onboarding flow
    s/[slug]/            # public scan page (anonymous)
    api/scan/            # scan event ingest
    auth/callback/       # Supabase OAuth code exchange
    error.tsx            # in-tree error boundary
    global-error.tsx     # root-layout error boundary
    not-found.tsx        # 404 page
  components/            # client + server components
  lib/
    supabase/            # browser, server, proxy, public-server clients
    onboarding/          # localStorage helpers + safe-next redirect guard
    qr/                  # slug generation, kind enum, public payload type
  proxy.ts               # Next.js 16 proxy (was middleware)
supabase/
  migrations/            # SQL migrations
```

## Scripts

```bash
npm run dev       # next dev (Turbopack)
npm run build     # next build
npm start         # next start (production mode)
npm run lint      # eslint
```
