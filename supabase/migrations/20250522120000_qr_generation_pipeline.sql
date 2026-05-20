-- QR generation pipeline: qr_profiles (emergency profile), qr_codes, scan_logs
-- Auth user rows remain in public.profiles (1:1 auth.users).

-- -----------------------------------------------------------------------------
-- qr_profiles — editable emergency profile per QR (user "profiles" table)
-- -----------------------------------------------------------------------------
create table if not exists public.qr_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  profile_type text not null check (
    profile_type in ('vehicle', 'child', 'pet', 'business')
  ),
  name text not null,
  phone text not null,
  slug text not null,
  status text not null default 'active' check (
    status in ('active', 'paused', 'disabled')
  ),
  data_json jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint qr_profiles_slug_unique unique (slug)
);

create index if not exists qr_profiles_user_id_idx on public.qr_profiles (user_id);
create index if not exists qr_profiles_slug_idx on public.qr_profiles (slug);

alter table public.qr_profiles enable row level security;

create policy "qr_profiles_owner_all"
  on public.qr_profiles for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- -----------------------------------------------------------------------------
-- qr_codes — dynamic QR record (URL only, no PII in QR payload)
-- -----------------------------------------------------------------------------
create table if not exists public.qr_codes (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.qr_profiles (id) on delete cascade,
  slug text not null,
  qr_url text not null,
  status text not null default 'active' check (
    status in ('active', 'paused', 'disabled')
  ),
  scans integer not null default 0 check (scans >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint qr_codes_slug_unique unique (slug)
);

create index if not exists qr_codes_profile_id_idx on public.qr_codes (profile_id);
create index if not exists qr_codes_slug_idx on public.qr_codes (slug);

alter table public.qr_codes enable row level security;

create policy "qr_codes_owner_select"
  on public.qr_codes for select
  using (
    exists (
      select 1 from public.qr_profiles p
      where p.id = profile_id and p.user_id = auth.uid()
    )
  );

create policy "qr_codes_owner_insert"
  on public.qr_codes for insert
  with check (
    exists (
      select 1 from public.qr_profiles p
      where p.id = profile_id and p.user_id = auth.uid()
    )
  );

create policy "qr_codes_owner_update"
  on public.qr_codes for update
  using (
    exists (
      select 1 from public.qr_profiles p
      where p.id = profile_id and p.user_id = auth.uid()
    )
  );

-- -----------------------------------------------------------------------------
-- scan_logs — append-only scan events
-- -----------------------------------------------------------------------------
create table if not exists public.scan_logs (
  id uuid primary key default gen_random_uuid(),
  qr_id uuid not null references public.qr_codes (id) on delete cascade,
  scanned_at timestamptz not null default now(),
  device text,
  ip_hash text
);

create index if not exists scan_logs_qr_id_scanned_at_idx
  on public.scan_logs (qr_id, scanned_at desc);

alter table public.scan_logs enable row level security;

create policy "scan_logs_owner_select"
  on public.scan_logs for select
  using (
    exists (
      select 1
      from public.qr_codes c
      join public.qr_profiles p on p.id = c.profile_id
      where c.id = qr_id and p.user_id = auth.uid()
    )
  );

create policy "scan_logs_anon_insert_active"
  on public.scan_logs for insert to anon
  with check (
    exists (
      select 1 from public.qr_codes c
      where c.id = qr_id and c.status = 'active'
    )
  );

create policy "scan_logs_auth_insert_active"
  on public.scan_logs for insert to authenticated
  with check (
    exists (
      select 1 from public.qr_codes c
      where c.id = qr_id and c.status = 'active'
    )
  );

-- Allow legacy qrs table to use paused status too
alter table public.qrs drop constraint if exists qrs_status_check;
alter table public.qrs
  add constraint qrs_status_check check (
    status in ('active', 'paused', 'disabled', 'expired')
  );

-- -----------------------------------------------------------------------------
-- Increment scan counter (security definer)
-- -----------------------------------------------------------------------------
create or replace function public.record_qr_scan (
  p_qr_id uuid,
  p_device text default null,
  p_ip_hash text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (select 1 from public.qr_codes where id = p_qr_id) then
    return;
  end if;

  insert into public.scan_logs (qr_id, device, ip_hash)
  values (p_qr_id, nullif(trim(p_device), ''), nullif(trim(p_ip_hash), ''));

  update public.qr_codes
  set scans = scans + 1
  where id = p_qr_id and status = 'active';
end;
$$;

grant execute on function public.record_qr_scan (uuid, text, text) to anon;
grant execute on function public.record_qr_scan (uuid, text, text) to authenticated;

-- -----------------------------------------------------------------------------
-- Public scan RPC — reads qr_codes + qr_profiles (falls back to legacy qrs)
-- -----------------------------------------------------------------------------
create or replace function public.get_qr_for_public_scan (p_slug text)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  c public.qr_codes%rowtype;
  p public.qr_profiles%rowtype;
  x jsonb;
  r public.qrs%rowtype;
begin
  -- New pipeline tables
  select *
  into c
  from public.qr_codes
  where upper(slug) = upper(p_slug)
  limit 1;

  if c.id is not null then
    select *
    into p
    from public.qr_profiles
    where id = c.profile_id;

  if p.id is not null then
    x := coalesce(p.data_json, '{}'::jsonb);

    return jsonb_build_object(
      'id', c.id,
      'slug', c.slug,
      'kind', p.profile_type,
      'status', c.status,
      'title', p.name,
      'message', nullif(trim(x ->> 'emergency_note'), ''),
      'vehicle_registration', nullif(trim(x ->> 'vehicle_number'), ''),
      'channels', jsonb_build_object(
        'call', true,
        'whatsapp', (x ? 'whatsapp' and nullif(trim(x ->> 'whatsapp'), '') is not null),
        'sms', false,
        'email', false
      ),
      'owner_phone', p.phone,
      'whatsapp_phone', nullif(trim(x ->> 'whatsapp'), ''),
      'alternate_contact', nullif(trim(x ->> 'alternate_contact'), ''),
      'emergency_phone', nullif(trim(x ->> 'emergency_contact'), ''),
      'blood_group', nullif(trim(x ->> 'blood_group'), ''),
      'allergies', nullif(trim(x ->> 'allergies'), ''),
      'parent_name', nullif(trim(x ->> 'parent_name'), ''),
      'school_name', nullif(trim(x ->> 'school_name'), ''),
      'emergency_instructions', nullif(trim(x ->> 'emergency_instructions'), ''),
      'breed', nullif(trim(x ->> 'breed'), ''),
      'vet_phone', nullif(trim(x ->> 'vet_contact'), ''),
      'medical_notes', nullif(trim(x ->> 'medical_notes'), ''),
      'reward_note', nullif(trim(x ->> 'reward_note'), ''),
      'fleet_size', nullif(trim(x ->> 'fleet_size'), ''),
      'business_emergency', nullif(trim(x ->> 'emergency_number'), ''),
      'asset_id', nullif(trim(x ->> 'asset_id'), ''),
      'department', nullif(trim(x ->> 'department'), ''),
      'escalation_contact', nullif(trim(x ->> 'escalation_contact'), '')
    );
    end if;
  end if;

  -- Legacy qrs fallback
  select *
  into r
  from public.qrs
  where upper(public_slug) = upper(p_slug);

  if not found then
    return null;
  end if;

  x := coalesce(r.profile_extra, '{}'::jsonb);

  return jsonb_build_object(
    'id', r.id,
    'slug', r.public_slug,
    'kind', r.kind,
    'status', r.status,
    'title', r.title,
    'message', r.finder_message,
    'vehicle_registration', r.vehicle_registration,
    'channels', jsonb_build_object(
      'call', r.channel_call,
      'whatsapp', r.channel_whatsapp,
      'sms', r.channel_sms,
      'email', r.channel_email
    ),
    'owner_phone', r.owner_phone,
    'whatsapp_phone', r.whatsapp_e164,
    'alternate_contact', nullif(trim(x ->> 'alternate_contact'), ''),
    'emergency_phone', nullif(trim(x ->> 'emergency_contact'), ''),
    'blood_group', nullif(trim(x ->> 'blood_group'), ''),
    'allergies', nullif(trim(x ->> 'allergies'), ''),
    'parent_name', nullif(trim(x ->> 'parent_name'), ''),
    'school_name', nullif(trim(x ->> 'school_name'), ''),
    'emergency_instructions', nullif(trim(x ->> 'emergency_instructions'), ''),
    'breed', nullif(trim(x ->> 'breed'), ''),
    'vet_phone', nullif(trim(x ->> 'vet_contact'), ''),
    'medical_notes', nullif(trim(x ->> 'medical_notes'), ''),
    'reward_note', nullif(trim(x ->> 'reward_note'), ''),
    'fleet_size', nullif(trim(x ->> 'fleet_size'), ''),
    'business_emergency', nullif(trim(x ->> 'emergency_number'), ''),
    'asset_id', nullif(trim(x ->> 'asset_id'), ''),
    'department', nullif(trim(x ->> 'department'), ''),
    'escalation_contact', nullif(trim(x ->> 'escalation_contact'), '')
  );
end;
$$;

grant execute on function public.get_qr_for_public_scan (text) to anon;
grant execute on function public.get_qr_for_public_scan (text) to authenticated;

create trigger qr_profiles_set_updated_at
  before update on public.qr_profiles
  for each row execute function public.set_updated_at ();

create trigger qr_codes_set_updated_at
  before update on public.qr_codes
  for each row execute function public.set_updated_at ();

comment on table public.qr_profiles is 'Emergency profile data per QR; editable without changing QR slug.';
comment on table public.qr_codes is 'Dynamic QR records; qr_url encodes only public scan path.';
comment on table public.scan_logs is 'Append-only finder scan log.';
