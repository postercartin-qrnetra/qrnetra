-- Inventory activation system: batches, tag_units extensions, serial counters, RPCs.

-- -----------------------------------------------------------------------------
-- inventory_batches
-- -----------------------------------------------------------------------------
create table if not exists public.inventory_batches (
  id uuid primary key default gen_random_uuid (),
  batch_number text not null unique,
  product_type text not null check (
    product_type in (
      'vehicle_sticker',
      'pet_tag',
      'child_wristband',
      'child_bag_tag',
      'business_asset_tag'
    )
  ),
  quantity int not null check (quantity > 0),
  channel text not null default 'amazon' check (
    channel in ('amazon', 'flipkart', 'website', 'retail', 'distributor', 'internal')
  ),
  generated_by text,
  generated_at timestamptz not null default now ()
);

create index if not exists inventory_batches_product_type_idx
  on public.inventory_batches (product_type);

alter table public.inventory_batches enable row level security;

-- -----------------------------------------------------------------------------
-- Per-family serial counters
-- -----------------------------------------------------------------------------
create table if not exists public.tag_serial_counters (
  tag_family char(1) primary key check (tag_family in ('V', 'P', 'C', 'B')),
  last_serial int not null default 0
);

insert into public.tag_serial_counters (tag_family, last_serial)
values
  ('V', 0),
  ('P', 0),
  ('C', 0),
  ('B', 0)
on conflict (tag_family) do nothing;

-- -----------------------------------------------------------------------------
-- Extend tag_units
-- -----------------------------------------------------------------------------
alter table public.tag_units
  add column if not exists public_tag_id text,
  add column if not exists tag_family char(1) check (tag_family in ('V', 'P', 'C', 'B')),
  add column if not exists product_type text check (
    product_type is null
    or product_type in (
      'vehicle_sticker',
      'pet_tag',
      'child_wristband',
      'child_bag_tag',
      'business_asset_tag'
    )
  ),
  add column if not exists serial_number int,
  add column if not exists preset_slug text,
  add column if not exists owner_user_id uuid references auth.users (id) on delete set null,
  add column if not exists activated_at timestamptz,
  add column if not exists batch_id uuid references public.inventory_batches (id) on delete set null,
  add column if not exists hardware_type text not null default 'qr' check (
    hardware_type in ('qr', 'nfc', 'hybrid')
  ),
  add column if not exists premium_enabled boolean not null default false,
  add column if not exists premium_expires_at timestamptz,
  add column if not exists qr_code_id uuid references public.qr_codes (id) on delete set null,
  add column if not exists channel text;

-- Migrate legacy statuses before constraint swap
update public.tag_units
set status = case
  when status = 'available' then 'generated'
  when status = 'allocated' then 'reserved'
  when status = 'shipped' then 'printed'
  else status
end
where status in ('available', 'allocated', 'shipped');

alter table public.tag_units drop constraint if exists tag_units_status_check;

alter table public.tag_units
  add constraint tag_units_status_check check (
    status in (
      'generated',
      'printed',
      'reserved',
      'sold',
      'activated',
      'disabled',
      'locked',
      'transferred',
      'replaced'
    )
  );

-- Default new rows to generated
alter table public.tag_units alter column status set default 'generated';

create unique index if not exists tag_units_public_tag_id_unique
  on public.tag_units (public_tag_id)
  where public_tag_id is not null;

create unique index if not exists tag_units_preset_slug_unique
  on public.tag_units (preset_slug)
  where preset_slug is not null;

create index if not exists tag_units_status_product_type_idx
  on public.tag_units (status, product_type);

create index if not exists tag_units_batch_id_idx on public.tag_units (batch_id);

-- -----------------------------------------------------------------------------
-- Audit: tag_unit_events (Sprint 4 ready)
-- -----------------------------------------------------------------------------
create table if not exists public.tag_unit_events (
  id uuid primary key default gen_random_uuid (),
  tag_unit_id uuid not null references public.tag_units (id) on delete cascade,
  event_type text not null,
  actor_user_id uuid references auth.users (id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now ()
);

create index if not exists tag_unit_events_tag_unit_id_idx
  on public.tag_unit_events (tag_unit_id);

alter table public.tag_unit_events enable row level security;

-- Owners can read their physical tags
create policy "tag_units_owner_select"
  on public.tag_units for select
  using (owner_user_id = auth.uid());

-- -----------------------------------------------------------------------------
-- Helpers
-- -----------------------------------------------------------------------------
create or replace function public.normalize_public_tag_id(p_raw text)
returns text
language plpgsql
immutable
as $$
declare
  cleaned text;
begin
  cleaned := upper(trim(coalesce(p_raw, '')));
  cleaned := replace(cleaned, ' ', '');
  return nullif(cleaned, '');
end;
$$;

create or replace function public.product_type_to_tag_family(p_product_type text)
returns char(1)
language sql
immutable
as $$
  select case p_product_type
    when 'vehicle_sticker' then 'V'::char(1)
    when 'pet_tag' then 'P'::char(1)
    when 'child_wristband' then 'C'::char(1)
    when 'child_bag_tag' then 'B'::char(1)
    when 'business_asset_tag' then 'B'::char(1)
    else null
  end;
$$;

create or replace function public.format_public_tag_id(
  p_family char(1),
  p_serial int
)
returns text
language sql
immutable
as $$
  select p_family::text || '-QRN-' || lpad(p_serial::text, 6, '0');
$$;

-- -----------------------------------------------------------------------------
-- get_tag_by_public_id (anon + authenticated)
-- -----------------------------------------------------------------------------
create or replace function public.get_tag_by_public_id(p_public_tag_id text)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  clean_id text;
  t public.tag_units%rowtype;
  qc public.qr_codes%rowtype;
begin
  clean_id := public.normalize_public_tag_id(p_public_tag_id);

  if clean_id is null then
    return jsonb_build_object('ok', false, 'error', 'Tag ID is required.');
  end if;

  select * into t from public.tag_units where public_tag_id = clean_id limit 1;

  if not found then
    return jsonb_build_object('ok', false, 'error', 'Tag not found.');
  end if;

  if t.qr_code_id is not null then
    select * into qc from public.qr_codes where id = t.qr_code_id;
  end if;

  return jsonb_build_object(
    'ok', true,
    'public_tag_id', t.public_tag_id,
    'tag_family', t.tag_family,
    'product_type', t.product_type,
    'status', t.status,
    'preset_slug', t.preset_slug,
    'activated_at', t.activated_at,
    'qr_slug', qc.slug,
    'is_activatable', t.status in ('generated', 'printed', 'sold')
  );
end;
$$;

grant execute on function public.get_tag_by_public_id(text) to anon, authenticated;

-- -----------------------------------------------------------------------------
-- verify_tag_activation (authenticated) — before profile form
-- -----------------------------------------------------------------------------
create or replace function public.verify_tag_activation(
  p_public_tag_id text,
  p_activation_code text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  clean_id text;
  clean_code text;
  t public.tag_units%rowtype;
begin
  if auth.uid() is null then
    return jsonb_build_object('ok', false, 'error', 'Not authenticated.');
  end if;

  clean_id := public.normalize_public_tag_id(p_public_tag_id);
  clean_code := upper(trim(coalesce(p_activation_code, '')));

  if clean_id is null or clean_code = '' then
    return jsonb_build_object('ok', false, 'error', 'Tag ID and activation code are required.');
  end if;

  select * into t from public.tag_units where public_tag_id = clean_id limit 1;

  if not found then
    return jsonb_build_object('ok', false, 'error', 'Tag not found.');
  end if;

  if t.status = 'activated' then
    return jsonb_build_object('ok', false, 'error', 'This tag is already activated.', 'already_activated', true);
  end if;

  if t.status in ('disabled', 'locked', 'transferred', 'replaced', 'reserved') then
    return jsonb_build_object('ok', false, 'error', 'This tag cannot be activated right now.');
  end if;

  if upper(t.activation_code) <> clean_code then
    return jsonb_build_object('ok', false, 'error', 'Invalid activation code.');
  end if;

  return jsonb_build_object(
    'ok', true,
    'public_tag_id', t.public_tag_id,
    'product_type', t.product_type,
    'preset_slug', t.preset_slug
  );
end;
$$;

grant execute on function public.verify_tag_activation(text, text) to authenticated;

-- -----------------------------------------------------------------------------
-- bind_tag_unit_to_qr_code (authenticated)
-- -----------------------------------------------------------------------------
create or replace function public.bind_tag_unit_to_qr_code(
  p_public_tag_id text,
  p_activation_code text,
  p_qr_slug text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  clean_id text;
  clean_code text;
  clean_slug text;
  target_tag public.tag_units%rowtype;
  owned_code public.qr_codes%rowtype;
  prof public.qr_profiles%rowtype;
begin
  if auth.uid() is null then
    return jsonb_build_object('ok', false, 'error', 'Not authenticated.');
  end if;

  clean_id := public.normalize_public_tag_id(p_public_tag_id);
  clean_code := upper(trim(coalesce(p_activation_code, '')));
  clean_slug := nullif(trim(p_qr_slug), '');

  if clean_id is null or clean_code = '' or clean_slug is null then
    return jsonb_build_object('ok', false, 'error', 'Tag ID, activation code, and QR slug are required.');
  end if;

  select * into target_tag
  from public.tag_units
  where public_tag_id = clean_id
  for update;

  if not found then
    return jsonb_build_object('ok', false, 'error', 'Tag not found.');
  end if;

  if upper(target_tag.activation_code) <> clean_code then
    return jsonb_build_object('ok', false, 'error', 'Invalid activation code.');
  end if;

  select qc.*
  into owned_code
  from public.qr_codes qc
  inner join public.qr_profiles qp on qp.id = qc.profile_id
  where qc.slug = clean_slug
    and qp.user_id = auth.uid()
  limit 1;

  if not found then
    return jsonb_build_object('ok', false, 'error', 'QR profile not found in your account.');
  end if;

  if target_tag.status = 'activated' then
    if target_tag.qr_code_id = owned_code.id and target_tag.owner_user_id = auth.uid() then
      return jsonb_build_object('ok', true, 'status', 'activated', 'qr_slug', owned_code.slug);
    end if;
    return jsonb_build_object('ok', false, 'error', 'This tag has already been activated.');
  end if;

  if target_tag.status not in ('generated', 'printed', 'sold') then
    return jsonb_build_object('ok', false, 'error', 'This tag cannot be activated right now.');
  end if;

  update public.tag_units
  set
    status = 'activated',
    qr_code_id = owned_code.id,
    qr_id = null,
    owner_user_id = auth.uid(),
    activated_at = now(),
    updated_at = now()
  where id = target_tag.id;

  insert into public.tag_unit_events (tag_unit_id, event_type, actor_user_id, metadata)
  values (
    target_tag.id,
    'activated',
    auth.uid(),
    jsonb_build_object('qr_slug', owned_code.slug, 'qr_code_id', owned_code.id)
  );

  return jsonb_build_object(
    'ok', true,
    'status', 'activated',
    'qr_slug', owned_code.slug,
    'public_tag_id', target_tag.public_tag_id
  );
end;
$$;

grant execute on function public.bind_tag_unit_to_qr_code(text, text, text) to authenticated;

-- -----------------------------------------------------------------------------
-- Lookup unactivated tag by preset slug (public scan redirect)
-- -----------------------------------------------------------------------------
create or replace function public.get_unactivated_tag_for_slug(p_slug text)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  clean_slug text;
  t public.tag_units%rowtype;
begin
  clean_slug := nullif(trim(p_slug), '');
  if clean_slug is null then
    return jsonb_build_object('ok', false);
  end if;

  select * into t
  from public.tag_units
  where preset_slug = clean_slug
    and status in ('generated', 'printed', 'sold', 'reserved')
  limit 1;

  if not found or t.public_tag_id is null then
    return jsonb_build_object('ok', false);
  end if;

  return jsonb_build_object(
    'ok', true,
    'public_tag_id', t.public_tag_id,
    'status', t.status
  );
end;
$$;

grant execute on function public.get_unactivated_tag_for_slug(text) to anon, authenticated;

-- -----------------------------------------------------------------------------
-- Update legacy get_tag_activation_context (activation code lookup)
-- -----------------------------------------------------------------------------
create or replace function public.get_tag_activation_context(p_activation_code text)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  t public.tag_units%rowtype;
  qc public.qr_codes%rowtype;
  clean_code text;
  product_title text;
begin
  clean_code := upper(trim(coalesce(p_activation_code, '')));

  if clean_code = '' then
    return jsonb_build_object('ok', false, 'error', 'Activation code is required.');
  end if;

  select * into t from public.tag_units where upper(activation_code) = clean_code limit 1;

  if not found then
    return jsonb_build_object('ok', false, 'error', 'Activation code not found.');
  end if;

  if t.qr_code_id is not null then
    select * into qc from public.qr_codes where id = t.qr_code_id;
  elsif t.qr_id is not null then
    select qc.* into qc from public.qr_codes qc
    inner join public.qrs q on q.public_slug = qc.slug
    where q.id = t.qr_id
    limit 1;
  end if;

  product_title := case t.product_type
    when 'vehicle_sticker' then 'Vehicle QR Sticker'
    when 'pet_tag' then 'Pet QR Tag'
    when 'child_wristband' then 'Child Safety Wristband'
    when 'child_bag_tag' then 'Child School Bag Tag'
    when 'business_asset_tag' then 'Business Asset Tag'
    else 'QRNetra Tag'
  end;

  return jsonb_build_object(
    'ok', true,
    'activation_code', t.activation_code,
    'public_tag_id', t.public_tag_id,
    'status', t.status,
    'product_type', t.product_type,
    'product_title', product_title,
    'product_slug', t.product_type,
    'qr_slug', qc.slug
  );
end;
$$;

grant execute on function public.get_tag_activation_context(text) to authenticated;

-- Keep legacy bind for code-only flow during transition
create or replace function public.bind_tag_unit_to_qr(
  p_activation_code text,
  p_qr_slug text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  t public.tag_units%rowtype;
begin
  select * into t
  from public.tag_units
  where upper(activation_code) = upper(trim(p_activation_code))
  limit 1;

  if not found or t.public_tag_id is null then
    return jsonb_build_object(
      'ok', false,
      'error', 'Use activation code with a physical tag ID, or contact support.'
    );
  end if;

  return public.bind_tag_unit_to_qr_code(t.public_tag_id, p_activation_code, p_qr_slug);
end;
$$;

grant execute on function public.bind_tag_unit_to_qr(text, text) to authenticated;
