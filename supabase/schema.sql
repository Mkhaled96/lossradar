-- ============================================================
-- NEXUR FLEET — Multi-Tenant SaaS Schema
-- Owner → Admin → Client role hierarchy with RLS
-- ============================================================

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ============================================================
-- 1. ROLES ENUM
-- ============================================================
create type user_role as enum ('owner', 'admin', 'client');
create type upload_status as enum ('pending', 'approved', 'rejected');

-- ============================================================
-- 2. PROFILES (extends Supabase auth.users)
-- ============================================================
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role user_role not null default 'client',
  -- granular permissions for admins, set by owner (e.g. {"can_create_clients": true, "can_upload": true, "can_approve": false})
  permissions jsonb default '{}'::jsonb,
  created_by uuid references profiles(id), -- who created this account (owner/admin)
  created_at timestamptz default now()
);

-- ============================================================
-- 3. CLIENTS (each client = one tenant)
-- ============================================================
create table clients (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  -- the client's own auth user (the person who logs in as this client)
  user_id uuid references profiles(id) on delete set null,
  -- unique identifier used as the tenant key inside Google Sheet rows
  client_code text unique not null,
  created_by uuid references profiles(id),
  created_at timestamptz default now()
);

-- ============================================================
-- 4. PROJECTS (belongs to a client)
-- ============================================================
create table projects (
  id uuid primary key default uuid_generate_v4(),
  client_id uuid references clients(id) on delete cascade not null,
  name text not null,
  progress int default 0 check (progress between 0 and 100),
  created_by uuid references profiles(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- 5. UPLOADS (client-submitted files/links awaiting approval)
-- ============================================================
create table uploads (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid references projects(id) on delete cascade not null,
  client_id uuid references clients(id) on delete cascade not null,
  file_url text, -- excel file URL (e.g. Supabase Storage)
  sheet_link text, -- or a Google Sheet link
  status upload_status default 'pending',
  uploaded_by uuid references profiles(id),
  reviewed_by uuid references profiles(id),
  reviewed_at timestamptz,
  created_at timestamptz default now()
);

-- ============================================================
-- 6. FLEET_DATA (synced rows from Google Sheet, tagged per client)
-- ============================================================
create table fleet_data (
  id uuid primary key default uuid_generate_v4(),
  client_id uuid references clients(id) on delete cascade not null,
  project_id uuid references projects(id) on delete set null,
  -- raw row data from the sheet, kept flexible
  row_data jsonb not null,
  sheet_row_id text, -- original row identifier from Google Sheet, for dedup
  synced_at timestamptz default now()
);

create unique index fleet_data_dedup on fleet_data (client_id, sheet_row_id);

-- ============================================================
-- 7. HELPER FUNCTIONS (used inside RLS policies)
-- ============================================================

-- returns the role of the currently logged-in user
create or replace function auth_role() returns user_role as $$
  select role from profiles where id = auth.uid();
$$ language sql stable security definer;

-- returns the client_id linked to the currently logged-in user (if they are a client)
create or replace function auth_client_id() returns uuid as $$
  select id from clients where user_id = auth.uid();
$$ language sql stable security definer;

-- ============================================================
-- 8. ENABLE RLS
-- ============================================================
alter table profiles enable row level security;
alter table clients enable row level security;
alter table projects enable row level security;
alter table uploads enable row level security;
alter table fleet_data enable row level security;

-- ============================================================
-- 9. POLICIES — PROFILES
-- ============================================================
create policy "owner_full_access_profiles" on profiles
  for all using (auth_role() = 'owner');

create policy "admin_view_all_profiles" on profiles
  for select using (auth_role() = 'admin');

create policy "user_view_own_profile" on profiles
  for select using (id = auth.uid());

-- ============================================================
-- 10. POLICIES — CLIENTS
-- ============================================================
create policy "owner_full_access_clients" on clients
  for all using (auth_role() = 'owner');

create policy "admin_manage_clients" on clients
  for all using (
    auth_role() = 'admin'
    and coalesce((select permissions->>'can_create_clients' from profiles where id = auth.uid())::boolean, false)
  );

create policy "client_view_own_record" on clients
  for select using (user_id = auth.uid());

-- ============================================================
-- 11. POLICIES — PROJECTS
-- ============================================================
create policy "owner_full_access_projects" on projects
  for all using (auth_role() = 'owner');

create policy "admin_manage_projects" on projects
  for all using (auth_role() = 'admin');

create policy "client_view_own_projects" on projects
  for select using (client_id = auth_client_id());

-- ============================================================
-- 12. POLICIES — UPLOADS
-- ============================================================
create policy "owner_full_access_uploads" on uploads
  for all using (auth_role() = 'owner');

create policy "admin_review_uploads" on uploads
  for all using (auth_role() = 'admin');

create policy "client_manage_own_uploads" on uploads
  for select using (client_id = auth_client_id());

create policy "client_insert_own_uploads" on uploads
  for insert with check (client_id = auth_client_id());

-- ============================================================
-- 13. POLICIES — FLEET_DATA
-- ============================================================
create policy "owner_full_access_fleet_data" on fleet_data
  for all using (auth_role() = 'owner');

create policy "admin_manage_fleet_data" on fleet_data
  for all using (auth_role() = 'admin');

create policy "client_view_own_fleet_data" on fleet_data
  for select using (client_id = auth_client_id());

-- ============================================================
-- 14. AUTO-UPDATE updated_at on projects
-- ============================================================
create or replace function set_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_projects_updated_at
  before update on projects
  for each row execute function set_updated_at();
