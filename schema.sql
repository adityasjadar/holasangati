-- ============================================================================
-- HolaSangathi (ಹೊಲಸಂಗಾತಿ) — Karnataka Agri Platform
-- Supabase / PostgreSQL schema, RLS policies, and helper functions.
-- Run this whole file once in the Supabase SQL editor on a fresh project.
-- ============================================================================

create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------------------
-- PROFILES  (public, non-sensitive fields only — phone lives in profiles_private)
-- ----------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('farmer','worker','owner','admin')),
  full_name text not null,
  district text not null,
  taluk text not null,
  village text not null,
  preferred_language text not null default 'kn' check (preferred_language in ('kn','en')),
  latitude double precision,
  longitude double precision,
  status text not null default 'active' check (status in ('active','suspended')),
  created_at timestamptz not null default now()
);

create index idx_profiles_district on public.profiles(district);
create index idx_profiles_taluk on public.profiles(taluk);
create index idx_profiles_role on public.profiles(role);

-- Sensitive contact info kept separate so it is never selectable by other users directly.
create table public.profiles_private (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  phone text not null unique
);

-- ----------------------------------------------------------------------------
-- WORKER PROFILES
-- ----------------------------------------------------------------------------
create table public.worker_profiles (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  work_types text[] not null default '{}',
  workers_available int not null default 1 check (workers_available >= 1),
  availability_text text,
  description text,
  is_active boolean not null default true,
  updated_at timestamptz not null default now()
);

create index idx_worker_profiles_work_types on public.worker_profiles using gin (work_types);
create index idx_worker_profiles_active on public.worker_profiles(is_active);

-- ----------------------------------------------------------------------------
-- MACHINERY
-- ----------------------------------------------------------------------------
create table public.machinery (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  machine_type text not null check (machine_type in ('tractor','rotavator','cultivator','harvester','seed_drill','sprayer','tiller','other')),
  machine_name text not null,
  description text,
  price numeric(10,2) not null check (price >= 0),
  price_unit text not null check (price_unit in ('hour','acre','day')),
  district text not null,
  taluk text not null,
  village text not null,
  latitude double precision,
  longitude double precision,
  available_from date,
  available_to date,
  image_url text,
  status text not null default 'active' check (status in ('active','paused','deleted')),
  created_at timestamptz not null default now()
);

create index idx_machinery_district on public.machinery(district);
create index idx_machinery_taluk on public.machinery(taluk);
create index idx_machinery_type on public.machinery(machine_type);
create index idx_machinery_status on public.machinery(status);
create index idx_machinery_owner on public.machinery(owner_id);

-- ----------------------------------------------------------------------------
-- REQUIREMENTS  (farmer postings)
-- ----------------------------------------------------------------------------
create table public.requirements (
  id uuid primary key default gen_random_uuid(),
  farmer_id uuid not null references public.profiles(id) on delete cascade,
  requirement_type text not null check (requirement_type in ('workers','tractor','harvester','other_machine')),
  work_type text,
  machine_type text,
  village text not null,
  taluk text not null,
  district text not null,
  required_date date not null,
  quantity text not null,
  description text,
  contact_preference text not null default 'call' check (contact_preference in ('call','request')),
  status text not null default 'open' check (status in ('open','fulfilled','cancelled')),
  created_at timestamptz not null default now()
);

create index idx_requirements_district on public.requirements(district);
create index idx_requirements_status on public.requirements(status);
create index idx_requirements_farmer on public.requirements(farmer_id);

-- ----------------------------------------------------------------------------
-- CONTACT REQUESTS  (safe contact flow — phone only revealed after acceptance)
-- ----------------------------------------------------------------------------
create table public.contact_requests (
  id uuid primary key default gen_random_uuid(),
  from_user uuid not null references public.profiles(id) on delete cascade,
  to_user uuid not null references public.profiles(id) on delete cascade,
  listing_type text not null check (listing_type in ('worker','machinery','requirement')),
  listing_id uuid,
  message text,
  status text not null default 'pending' check (status in ('pending','accepted','declined')),
  created_at timestamptz not null default now(),
  constraint no_self_contact check (from_user <> to_user)
);

create index idx_contact_requests_to on public.contact_requests(to_user);
create index idx_contact_requests_from on public.contact_requests(from_user);

-- ----------------------------------------------------------------------------
-- REVIEWS  (only insertable once a contact_request was accepted between the two users)
-- ----------------------------------------------------------------------------
create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  reviewer_id uuid not null references public.profiles(id) on delete cascade,
  reviewed_user_id uuid not null references public.profiles(id) on delete cascade,
  contact_request_id uuid references public.contact_requests(id) on delete set null,
  rating int not null check (rating between 1 and 5),
  review text,
  created_at timestamptz not null default now(),
  constraint no_self_review check (reviewer_id <> reviewed_user_id)
);

create index idx_reviews_reviewed_user on public.reviews(reviewed_user_id);

-- ----------------------------------------------------------------------------
-- REPORTS
-- ----------------------------------------------------------------------------
create table public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.profiles(id) on delete cascade,
  reported_user_id uuid not null references public.profiles(id) on delete cascade,
  reason text not null check (reason in ('fake_profile','wrong_info','bad_behavior','suspicious','other')),
  description text,
  status text not null default 'open' check (status in ('open','reviewed','dismissed')),
  created_at timestamptz not null default now(),
  constraint no_self_report check (reporter_id <> reported_user_id)
);

create index idx_reports_status on public.reports(status);

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Is the current user an admin? (security definer so it can read profiles
-- even though the caller's own RLS session might not otherwise see role='admin' rows)
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin' and p.status = 'active'
  );
$$;

-- Reveal a phone number ONLY if there is an accepted contact_request between
-- the caller and the target user. This is the only path to phone numbers.
create or replace function public.get_contact_phone(target_user uuid)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  phone_out text;
begin
  if not exists (
    select 1 from public.contact_requests cr
    where cr.status = 'accepted'
      and ((cr.from_user = auth.uid() and cr.to_user = target_user)
        or (cr.to_user = auth.uid() and cr.from_user = target_user))
  ) then
    raise exception 'No accepted contact request with this user yet.';
  end if;

  select pp.phone into phone_out from public.profiles_private pp where pp.user_id = target_user;
  return phone_out;
end;
$$;

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================
alter table public.profiles enable row level security;
alter table public.profiles_private enable row level security;
alter table public.worker_profiles enable row level security;
alter table public.machinery enable row level security;
alter table public.requirements enable row level security;
alter table public.contact_requests enable row level security;
alter table public.reviews enable row level security;
alter table public.reports enable row level security;

-- profiles: anyone signed in can see active directory profiles; owner can always see/edit own row.
create policy profiles_select on public.profiles for select
  using (status = 'active' or id = auth.uid() or public.is_admin());
create policy profiles_insert_own on public.profiles for insert
  with check (id = auth.uid());
create policy profiles_update_own on public.profiles for update
  using (id = auth.uid() or public.is_admin())
  with check (id = auth.uid() or public.is_admin());
create policy profiles_delete_own on public.profiles for delete
  using (id = auth.uid() or public.is_admin());

-- profiles_private: only the owner can read/write their own phone. No public select policy at all.
create policy profiles_private_select_own on public.profiles_private for select
  using (user_id = auth.uid() or public.is_admin());
create policy profiles_private_insert_own on public.profiles_private for insert
  with check (user_id = auth.uid());
create policy profiles_private_update_own on public.profiles_private for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- worker_profiles: public can see active ones; owner (the worker) manages their own.
create policy worker_profiles_select on public.worker_profiles for select
  using (is_active = true or user_id = auth.uid() or public.is_admin());
create policy worker_profiles_upsert_own on public.worker_profiles for insert
  with check (user_id = auth.uid());
create policy worker_profiles_update_own on public.worker_profiles for update
  using (user_id = auth.uid() or public.is_admin())
  with check (user_id = auth.uid() or public.is_admin());
create policy worker_profiles_delete_own on public.worker_profiles for delete
  using (user_id = auth.uid() or public.is_admin());

-- machinery: public can see active listings; owner manages their own (any status).
create policy machinery_select on public.machinery for select
  using (status = 'active' or owner_id = auth.uid() or public.is_admin());
create policy machinery_insert_own on public.machinery for insert
  with check (owner_id = auth.uid());
create policy machinery_update_own on public.machinery for update
  using (owner_id = auth.uid() or public.is_admin())
  with check (owner_id = auth.uid() or public.is_admin());
create policy machinery_delete_own on public.machinery for delete
  using (owner_id = auth.uid() or public.is_admin());

-- requirements: public can see open ones; farmer manages their own (any status).
create policy requirements_select on public.requirements for select
  using (status = 'open' or farmer_id = auth.uid() or public.is_admin());
create policy requirements_insert_own on public.requirements for insert
  with check (farmer_id = auth.uid());
create policy requirements_update_own on public.requirements for update
  using (farmer_id = auth.uid() or public.is_admin())
  with check (farmer_id = auth.uid() or public.is_admin());
create policy requirements_delete_own on public.requirements for delete
  using (farmer_id = auth.uid() or public.is_admin());

-- contact_requests: only the two participants can see a request; only the recipient can update its status.
create policy contact_requests_select on public.contact_requests for select
  using (from_user = auth.uid() or to_user = auth.uid() or public.is_admin());
create policy contact_requests_insert on public.contact_requests for insert
  with check (from_user = auth.uid());
create policy contact_requests_update on public.contact_requests for update
  using (to_user = auth.uid() or public.is_admin())
  with check (to_user = auth.uid() or public.is_admin());

-- reviews: readable by everyone (no PII in them); insertable only if a real
-- accepted contact_request exists between reviewer and reviewed user.
create policy reviews_select on public.reviews for select using (true);
create policy reviews_insert on public.reviews for insert
  with check (
    reviewer_id = auth.uid()
    and exists (
      select 1 from public.contact_requests cr
      where cr.status = 'accepted'
        and cr.id = contact_request_id
        and ((cr.from_user = auth.uid() and cr.to_user = reviewed_user_id)
          or (cr.to_user = auth.uid() and cr.from_user = reviewed_user_id))
    )
  );

-- reports: reporter can see & create their own; admins see everything (is_admin() check above already covers admins via select policy below).
create policy reports_select on public.reports for select
  using (reporter_id = auth.uid() or public.is_admin());
create policy reports_insert on public.reports for insert
  with check (reporter_id = auth.uid());
create policy reports_update_admin on public.reports for update
  using (public.is_admin())
  with check (public.is_admin());

-- ============================================================================
-- FIRST ADMIN ACCOUNT
-- After a user has registered normally through the app (so a row exists in
-- public.profiles), promote them to admin by running, in the SQL editor:
--
--   update public.profiles set role = 'admin' where id =
--     (select id from auth.users where email = 'PHONE_PSEUDO_EMAIL_HERE');
--
-- See README.md "First admin account" section for the exact pseudo-email format.
-- ============================================================================
