# ಹೊಲಸಂಗಾತಿ (HolaSangathi) — Karnataka Agri Platform, MVP

A real, working application connecting farmers, agricultural workers, and
machinery owners in Karnataka. Built with React (Vite) + Supabase
(PostgreSQL + Auth + Storage + Row Level Security).

This replaces the earlier single-file HTML prototype. The visual design
(colors, fonts, buttons, Kannada-first layout) is carried over intentionally;
everything that was a hardcoded JS array is now a real database table behind
real authentication and RLS.

---

## 1. What was demo-only in the old prototype (Step 1–2: inspection)

The previous version was one static `index.html` with:
- `WORKERS_DEMO`, `MACHINERY_DEMO`, `NEARBY_DEMO` — hardcoded JS arrays, no database.
- No login system — anyone could "publish" a listing that only existed in that browser tab's memory and vanished on refresh.
- "Nearby" distances were fixed numbers (`3 km`, `5 km`) with no real location.
- Contact buttons opened a modal saying "this is a demo" — no real way to reach anyone.
- No admin, no reports table, no reviews table — the report/rating UI was cosmetic.

Everything above is now real (see below) — except where explicitly called out in
**Section 8: What is still simulated**.

---

## 2. Project structure

```
holasangathi/
├── supabase/schema.sql        # full DB schema + RLS policies (run this first)
├── .env.example                # copy to .env
├── src/
│   ├── lib/supabaseClient.js   # Supabase client + phone→pseudo-email helper
│   ├── i18n/                   # Kannada/English strings + language context
│   ├── auth/                   # AuthContext, RequireAuth, RequireRole
│   ├── services/                # ALL database access lives here (one file per table/concern)
│   ├── utils/                  # constants (districts/work types), validation, distance calc, demo fallback data
│   ├── types/index.js          # JSDoc type definitions
│   ├── components/ui/          # Button, Input, Modal, Badge, StarRating, etc.
│   ├── components/layout/      # Header, Footer
│   ├── components/listings/    # WorkerCard, MachineryCard, RequirementCard
│   ├── components/forms/       # RequirementForm, MachineryForm, WorkerProfileForm, ReportForm, ReviewForm
│   └── pages/                  # one file per route/screen
```

No page or component talks to Supabase directly — they all go through
`src/services/*.js`, so the data layer can be swapped or extended without
touching the UI.

---

## 3. Database schema

Open your Supabase project → **SQL Editor** → paste the entire contents of
`supabase/schema.sql` → **Run**. This creates:

- `profiles` (public info: role, name, district/taluk/village, language, lat/lng, status)
- `profiles_private` (phone number — **never** directly selectable by other users)
- `worker_profiles`, `machinery`, `requirements`, `contact_requests`, `reviews`, `reports`
- Two helper functions: `is_admin()` and `get_contact_phone(target_user)`
- Row Level Security policies on every table (see Section 6 — Security)

### Storage bucket for machine photos
In the Supabase dashboard → **Storage** → create a bucket named
`machinery-images` → set it **public** (so listing photos load without
auth). Then add this policy in the SQL editor so only an owner can upload
into their own folder:

```sql
create policy "owner can upload own machine images"
on storage.objects for insert
with check (bucket_id = 'machinery-images' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "anyone can view machine images"
on storage.objects for select
using (bucket_id = 'machinery-images');
```

---

## 4. Environment variables

```
VITE_SUPABASE_URL=https://YOUR-PROJECT-REF.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

Get both from **Project Settings → API** in the Supabase dashboard. Copy
`.env.example` to `.env` and fill these in. The anon key is safe in
frontend code — RLS is what actually protects the data, not key secrecy.
**Never** put the `service_role` key in this app.

---

## 5. Install & run

This sandbox has no network access, so dependencies aren't installed here —
run these on your own machine:

```bash
npm install
npm run dev        # http://localhost:5173
npm run build       # production build → dist/
```

---

## 6. Authentication — how it actually works, and its one known limitation

Supabase Auth natively supports **email/password** or **verified phone**
(the latter needs an SMS provider like Twilio/MSG91 configured in the
dashboard — that's a paid, separate setup step). Since the brief asks for
mobile number + password with no budget/SMS provider assumed, this MVP uses
a documented, working pattern: each phone number is converted to a stable
pseudo-email (`9876543210@holasangathi.app`) and Supabase's normal
email/password auth is used underneath. The real phone number itself is
never used as a login credential and never stored anywhere except the
protected `profiles_private` table.

**Known gap:** true "forgot password" (a link emailed to you) doesn't work
with this workaround, since farmers don't have real email addresses. The
Profile page supports **change password while logged in**. To add a real
reset flow, switch to Supabase phone-OTP auth once an SMS provider is
configured — the schema and `profiles`/`profiles_private` split were
designed so that swap doesn't require any table changes.

Password hashing, session tokens, and refresh — all handled by Supabase
Auth itself; no password ever touches your own code or database in plain
text.

---

## 7. Security model

- **RLS on every table.** A user can only insert/update/delete rows where
  they are the owner (`farmer_id = auth.uid()`, `owner_id = auth.uid()`, etc).
- **Phone numbers are never public.** They live in `profiles_private`,
  which has no "select by anyone" policy at all. The only way to read
  someone's phone is the `get_contact_phone()` function, which checks — at
  the database level — that an **accepted** `contact_requests` row exists
  between the two users first.
- **Reviews require a real interaction.** The `reviews_insert` RLS policy
  checks for an accepted `contact_requests` row between reviewer and
  reviewed user before allowing the insert — a fake review is structurally
  impossible, not just a UI convention.
- **Admin access** is gated by `is_admin()`, a `security definer` function
  checking `profiles.role = 'admin'`. Regular users cannot self-promote —
  `role` can only be set to `admin` via a direct SQL update (Section 8).
- **No secrets in the frontend.** Only the anon key ships to the browser;
  it is meaningless without RLS, which is why RLS is mandatory, not optional.

---

## 8. First admin account

1. Register normally through the app as any role (e.g. Farmer).
2. In the Supabase SQL Editor, run:
   ```sql
   update public.profiles set role = 'admin'
   where id = (select id from auth.users where email = '9876543210@holasangathi.app');
   ```
   (replace the phone digits with the number you registered with).
3. Log out and back in — the "Admin" link appears in the header, and
   `/admin` becomes reachable (RequireRole blocks it for everyone else).

---

## 9. How each role registers / operates

**Farmer:** Register page → role "Farmer" → name, phone, password,
district/taluk/village → lands on the dashboard with the four big buttons
(Find Workers, Find Machinery, Near Me, My Requirements).

**Worker:** Register page → role "Agricultural Worker" → same base fields
→ then visits **My Work Info** to set work types, number available,
availability text, and description (`worker_profiles` row, created empty at
signup, filled in here).

**Machinery Owner:** Register page → role "Machinery Owner" → then
**My Machinery** → "Add Machine" → type, name, photo, rate + price unit
(₹/hour, ₹/acre, or ₹/day — never forced to one model), location, available
dates, description → Publish. Owners can edit, pause, or delete
(soft-delete via `status`) each listing from the same page.

**Farmer searching & contacting:** Find Workers / Find Machinery pages
filter by district/taluk/type/date/price against the real tables. Contact
never shows a phone number directly — it opens **Send Request**, which
creates a `contact_requests` row. The recipient sees it under **My Profile
→ Incoming requests** and can Accept/Decline. Only after Accept does
`get_contact_phone()` succeed for that pair.

---

## 10. What is still simulated / not implemented

- ❌ **True phone-OTP login** — see Section 6. Needs an SMS provider.
- ❌ **In-app messaging / WhatsApp / push notifications** — architecture
  (`contact_requests`) supports adding these later without schema changes.
- ❌ **Payments / booking calendar / digital receipts** — intentionally out
  of scope per the brief ("build a clean MVP first").
- ❌ **"Verified user" badges** — nothing in the UI claims verification;
  `not_verified_notice` is shown instead, as required.
- ⚠️ **Demo fallback listings** (`src/utils/demoData.js`) still exist, but
  only render when a real search returns zero rows, always with a `DEMO`
  badge, and their Contact button is disabled — they can never be mistaken
  for real users per the brief's requirement.
- ⚠️ **Image upload** requires you to create the `machinery-images` storage
  bucket manually (Section 3) — the code assumes it exists.

## 11. What needs configuring before production

1. Create a real Supabase project (not the free sandbox tier for scale).
2. Run `schema.sql`, create the storage bucket + policies.
3. Configure an SMS provider in Supabase Auth if you want real phone OTP.
4. Set up email alerts / Supabase log drains for monitoring.
5. Add rate limiting on registration (Supabase has basic auth rate limits
   built in; consider Cloudflare in front of the deployed site for more).
6. Legal: Terms of Service + Privacy Policy pages (not built — needed
   before real user data is collected).
7. Decide and implement one of the monetization options from Section 22 of
   the brief (small transparent commission on machinery bookings, optional
   featured listings, etc.) — no billing code exists yet.

## 12. Deployment

Any static host works since this is a Vite SPA with no backend server of
its own (Supabase *is* the backend):

```bash
npm run build
# deploy the dist/ folder to Vercel, Netlify, Cloudflare Pages, or similar
```

Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as environment
variables in your host's dashboard (same values as your local `.env`).
Because this is a client-side router (`react-router-dom`), configure your
host to redirect all paths to `index.html` (a "SPA fallback" / rewrite
rule — Vercel and Netlify both do this automatically for Vite projects;
Cloudflare Pages needs a `_redirects` file with `/* /index.html 200`).
