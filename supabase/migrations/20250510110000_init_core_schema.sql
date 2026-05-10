-- QRNetra core schema: profiles, commerce primitives, qrs, scan_events, RLS, public scan RPC

-- -----------------------------------------------------------------------------
-- Extensions
-- -----------------------------------------------------------------------------
create extension if not exists "pgcrypto";

-- -----------------------------------------------------------------------------
-- profiles (1:1 with auth.users)
-- -----------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own"
  on public.profiles for select
  using (id = auth.uid());

create policy "profiles_insert_own"
  on public.profiles for insert
  with check (id = auth.uid());

create policy "profiles_update_own"
  on public.profiles for update
  using (id = auth.uid())
  with check (id = auth.uid());

-- -----------------------------------------------------------------------------
-- products & skus (catalog)
-- -----------------------------------------------------------------------------
create table public.products (
  id uuid primary key default gen_random_uuid (),
  slug text not null unique,
  title text not null,
  description text,
  price_paise integer not null check (price_paise >= 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now ()
);

alter table public.products enable row level security;

create policy "products_public_read_active"
  on public.products for select
  using (is_active = true);

create table public.skus (
  id uuid primary key default gen_random_uuid (),
  product_id uuid not null references public.products (id) on delete cascade,
  sku_code text not null unique,
  label text not null,
  created_at timestamptz not null default now ()
);

alter table public.skus enable row level security;

create policy "skus_public_read"
  on public.skus for select
  using (
    exists (
      select 1 from public.products p
      where p.id = product_id and p.is_active = true
    )
  );

-- -----------------------------------------------------------------------------
-- orders & tag inventory
-- -----------------------------------------------------------------------------
create table public.orders (
  id uuid primary key default gen_random_uuid (),
  user_id uuid references auth.users (id) on delete set null,
  razorpay_order_id text,
  status text not null default 'pending' check (
    status in ('pending', 'paid', 'failed', 'refunded', 'cancelled')
  ),
  total_paise integer not null default 0 check (total_paise >= 0),
  currency text not null default 'INR',
  created_at timestamptz not null default now (),
  updated_at timestamptz not null default now ()
);

alter table public.orders enable row level security;

create policy "orders_select_own"
  on public.orders for select
  using (user_id = auth.uid());

create policy "orders_insert_own"
  on public.orders for insert
  with check (user_id = auth.uid());

create policy "orders_update_own"
  on public.orders for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create table public.order_items (
  id uuid primary key default gen_random_uuid (),
  order_id uuid not null references public.orders (id) on delete cascade,
  sku_id uuid not null references public.skus (id),
  quantity integer not null default 1 check (quantity > 0),
  unit_price_paise integer not null check (unit_price_paise >= 0)
);

alter table public.order_items enable row level security;

create policy "order_items_via_order"
  on public.order_items for select
  using (
    exists (
      select 1 from public.orders o
      where o.id = order_id and o.user_id = auth.uid()
    )
  );

create policy "order_items_insert_via_order"
  on public.order_items for insert
  with check (
    exists (
      select 1 from public.orders o
      where o.id = order_id and o.user_id = auth.uid()
    )
  );

create policy "order_items_update_via_order"
  on public.order_items for update
  using (
    exists (
      select 1 from public.orders o
      where o.id = order_id and o.user_id = auth.uid()
    )
  );

create table public.tag_units (
  id uuid primary key default gen_random_uuid (),
  sku_id uuid references public.skus (id),
  activation_code text not null unique,
  status text not null default 'available' check (
    status in ('available', 'allocated', 'shipped', 'activated')
  ),
  order_id uuid references public.orders (id) on delete set null,
  qr_id uuid,
  created_at timestamptz not null default now (),
  updated_at timestamptz not null default now ()
);

alter table public.tag_units enable row level security;
-- No anon/authenticated policies: fulfillment uses service role or future admin role.

-- -----------------------------------------------------------------------------
-- qrs (dynamic QR profiles)
-- -----------------------------------------------------------------------------
create table public.qrs (
  id uuid primary key default gen_random_uuid (),
  owner_user_id uuid not null references auth.users (id) on delete cascade,
  public_slug text not null unique,
  kind text not null check (kind in ('vehicle', 'child', 'pet', 'other')),
  status text not null default 'active' check (status in ('active', 'disabled', 'expired')),
  title text,
  finder_message text,
  vehicle_registration text,
  channel_call boolean not null default true,
  channel_whatsapp boolean not null default true,
  channel_sms boolean not null default true,
  channel_email boolean not null default false,
  notify_owner_on_scan boolean not null default true,
  owner_phone text,
  whatsapp_e164 text,
  owner_email text,
  created_at timestamptz not null default now (),
  updated_at timestamptz not null default now ()
);

alter table public.qrs enable row level security;

create policy "qrs_owner_all"
  on public.qrs for all
  using (owner_user_id = auth.uid())
  with check (owner_user_id = auth.uid());

alter table public.tag_units
  add constraint tag_units_qr_fk
  foreign key (qr_id) references public.qrs (id) on delete set null;

-- -----------------------------------------------------------------------------
-- scan_events
-- -----------------------------------------------------------------------------
create table public.scan_events (
  id uuid primary key default gen_random_uuid (),
  qr_id uuid not null references public.qrs (id) on delete cascade,
  created_at timestamptz not null default now (),
  ip_hash text,
  user_agent text,
  geo_hint text
);

create index scan_events_qr_id_created_at_idx on public.scan_events (qr_id, created_at desc);

alter table public.scan_events enable row level security;

create policy "scan_events_owner_select"
  on public.scan_events for select
  using (
    exists (
      select 1 from public.qrs q
      where q.id = qr_id and q.owner_user_id = auth.uid()
    )
  );

create policy "scan_events_anon_insert_active_qr"
  on public.scan_events for insert to anon
  with check (
    exists (
      select 1 from public.qrs q
      where q.id = qr_id and q.status = 'active'
    )
  );

create policy "scan_events_auth_insert_active_qr"
  on public.scan_events for insert to authenticated
  with check (
    exists (
      select 1 from public.qrs q
      where q.id = qr_id and q.status = 'active'
    )
  );

-- -----------------------------------------------------------------------------
-- Public scan RPC (no PII in response)
-- -----------------------------------------------------------------------------
create or replace function public.get_qr_for_public_scan (p_slug text)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  r public.qrs%rowtype;
begin
  select *
  into r
  from public.qrs
  where public_slug = p_slug
    and status = 'active';

  if not found then
    return null;
  end if;

  return jsonb_build_object(
    'id', r.id,
    'slug', r.public_slug,
    'kind', r.kind,
    'title', r.title,
    'message', r.finder_message,
    'vehicle_registration', r.vehicle_registration,
    'channels', jsonb_build_object(
      'call', r.channel_call,
      'whatsapp', r.channel_whatsapp,
      'sms', r.channel_sms,
      'email', r.channel_email
    )
  );
end;
$$;

grant execute on function public.get_qr_for_public_scan (text) to anon;
grant execute on function public.get_qr_for_public_scan (text) to authenticated;

-- -----------------------------------------------------------------------------
-- Auth: create profile row on signup
-- -----------------------------------------------------------------------------
create or replace function public.handle_new_user ()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id)
  values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user ();

-- -----------------------------------------------------------------------------
-- updated_at helper
-- -----------------------------------------------------------------------------
create or replace function public.set_updated_at ()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at ();

create trigger orders_set_updated_at
  before update on public.orders
  for each row execute function public.set_updated_at ();

create trigger tag_units_set_updated_at
  before update on public.tag_units
  for each row execute function public.set_updated_at ();

create trigger qrs_set_updated_at
  before update on public.qrs
  for each row execute function public.set_updated_at ();

comment on table public.qrs is 'Owner-managed QR profiles; use get_qr_for_public_scan for finder-facing data.';
comment on table public.scan_events is 'Append-only scan logs; coarse geo only.';
