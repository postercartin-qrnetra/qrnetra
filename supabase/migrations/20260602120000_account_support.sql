-- Account settings, support requests, track-order lookup, account deletion

-- -----------------------------------------------------------------------------
-- Extend public.profiles (account-level, distinct from qr_profiles)
-- -----------------------------------------------------------------------------
alter table public.profiles
  add column if not exists notification_prefs jsonb not null default jsonb_build_object(
    'scan_alerts', true,
    'emergency_alerts', true,
    'product_updates', false,
    'order_updates', true,
    'blog_updates', false
  ),
  add column if not exists account_status text not null default 'active' check (
    account_status in ('active', 'deactivated', 'pending_deletion')
  ),
  add column if not exists deletion_scheduled_at timestamptz,
  add column if not exists deleted_at timestamptz,
  add column if not exists avatar_url text;

comment on column public.profiles.notification_prefs is
  'Email notification toggles: scan_alerts, emergency_alerts, product_updates, order_updates, blog_updates.';

-- -----------------------------------------------------------------------------
-- Support / contact requests
-- -----------------------------------------------------------------------------
create type public.support_request_category as enum (
  'order',
  'activation',
  'lost_product',
  'wrong_scan_info',
  'technical',
  'refund',
  'general'
);

create type public.support_request_status as enum (
  'open',
  'closed'
);

create table public.support_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  category public.support_request_category not null default 'general',
  name text not null,
  email text not null,
  phone text,
  subject text not null,
  message text not null,
  order_number text,
  status public.support_request_status not null default 'open',
  created_at timestamptz not null default now()
);

create index support_requests_user_id_created_at_idx
  on public.support_requests (user_id, created_at desc);

alter table public.support_requests enable row level security;

create policy "support_requests_insert"
  on public.support_requests for insert
  to anon, authenticated
  with check (true);

create policy "support_requests_select_own"
  on public.support_requests for select
  to authenticated
  using (user_id = auth.uid());

-- -----------------------------------------------------------------------------
-- Public order tracking (contact must match order)
-- -----------------------------------------------------------------------------
create or replace function public.lookup_order_for_tracking (
  p_order_number text,
  p_contact text
) returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_order record;
  v_contact_clean text;
  v_digits text;
  v_activated boolean := false;
  v_product_title text;
begin
  v_contact_clean := lower(trim(coalesce(p_contact, '')));
  v_digits := regexp_replace(coalesce(p_contact, ''), '\D', '', 'g');

  if length(trim(coalesce(p_order_number, ''))) < 4 or v_contact_clean = '' then
    return jsonb_build_object('ok', false, 'error', 'invalid_input');
  end if;

  select
    o.id,
    o.order_number,
    o.payment_status,
    o.fulfillment_status,
    o.tracking_number,
    o.courier_name,
    o.qr_code_id,
    o.qr_slug,
    o.contact_email,
    o.contact_phone,
    o.created_at,
    o.shipped_at,
    o.delivered_at,
    p.title as product_title
  into v_order
  from public.orders o
  left join public.products p on p.id = o.product_id
  where upper(trim(o.order_number)) = upper(trim(p_order_number))
  limit 1;

  if not found then
    return jsonb_build_object('ok', false, 'error', 'not_found');
  end if;

  if not (
    (v_order.contact_email is not null and lower(trim(v_order.contact_email)) = v_contact_clean)
    or (
      v_digits <> ''
      and v_order.contact_phone is not null
      and right(regexp_replace(v_order.contact_phone, '\D', '', 'g'), 10) = right(v_digits, 10)
    )
  ) then
    return jsonb_build_object('ok', false, 'error', 'not_found');
  end if;

  v_product_title := v_order.product_title;

  if v_order.qr_code_id is not null then
    select exists (
      select 1
      from public.tag_units tu
      where tu.qr_code_id = v_order.qr_code_id
        and tu.activated_at is not null
    )
    or exists (
      select 1
      from public.qr_codes c
      where c.id = v_order.qr_code_id
        and c.status = 'active'
    )
    into v_activated;
  end if;

  return jsonb_build_object(
    'ok', true,
    'order_number', v_order.order_number,
    'payment_status', v_order.payment_status,
    'fulfillment_status', v_order.fulfillment_status,
    'tracking_number', v_order.tracking_number,
    'courier_name', v_order.courier_name,
    'product_title', v_product_title,
    'qr_slug', v_order.qr_slug,
    'activated', v_activated,
    'created_at', v_order.created_at,
    'shipped_at', v_order.shipped_at,
    'delivered_at', v_order.delivered_at
  );
end;
$$;

grant execute on function public.lookup_order_for_tracking (text, text) to anon;
grant execute on function public.lookup_order_for_tracking (text, text) to authenticated;

-- -----------------------------------------------------------------------------
-- Account deletion scheduling (soft-delete path)
-- -----------------------------------------------------------------------------
create or replace function public.schedule_account_deletion (p_user_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_user_id is distinct from auth.uid() then
    return jsonb_build_object('ok', false, 'error', 'forbidden');
  end if;

  update public.profiles
  set
    account_status = 'pending_deletion',
    deletion_scheduled_at = now() + interval '30 days',
    updated_at = now()
  where id = p_user_id;

  update public.qr_codes c
  set status = 'disabled'
  from public.qr_profiles p
  where p.id = c.profile_id
    and p.user_id = p_user_id
    and c.status = 'active';

  return jsonb_build_object('ok', true, 'deletion_scheduled_at', now() + interval '30 days');
end;
$$;

grant execute on function public.schedule_account_deletion (uuid) to authenticated;

create or replace function public.cancel_account_deletion (p_user_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_user_id is distinct from auth.uid() then
    return jsonb_build_object('ok', false, 'error', 'forbidden');
  end if;

  update public.profiles
  set
    account_status = 'active',
    deletion_scheduled_at = null,
    updated_at = now()
  where id = p_user_id;

  return jsonb_build_object('ok', true);
end;
$$;

grant execute on function public.cancel_account_deletion (uuid) to authenticated;

create or replace function public.deactivate_account (p_user_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_user_id is distinct from auth.uid() then
    return jsonb_build_object('ok', false, 'error', 'forbidden');
  end if;

  update public.profiles
  set account_status = 'deactivated', updated_at = now()
  where id = p_user_id;

  return jsonb_build_object('ok', true);
end;
$$;

grant execute on function public.deactivate_account (uuid) to authenticated;

create or replace function public.reactivate_account (p_user_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_user_id is distinct from auth.uid() then
    return jsonb_build_object('ok', false, 'error', 'forbidden');
  end if;

  update public.profiles
  set
    account_status = 'active',
    deletion_scheduled_at = null,
    updated_at = now()
  where id = p_user_id;

  return jsonb_build_object('ok', true);
end;
$$;

grant execute on function public.reactivate_account (uuid) to authenticated;

-- Respect owner notification preferences in scan emails
create or replace function public.get_finder_event_notify_context (
  p_qr_id uuid
) returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_profile record;
  v_notify boolean := true;
  v_owner_email text;
  v_prefs jsonb;
  v_scan boolean := true;
  v_emergency boolean := true;
begin
  select p.name, p.profile_type, p.user_id, c.slug
  into v_profile
  from public.qr_codes c
  join public.qr_profiles p on p.id = c.profile_id
  where c.id = p_qr_id;

  if not found then
    return null;
  end if;

  select coalesce(r.notify_owner_on_scan, true)
  into v_notify
  from public.qrs r
  where upper(r.public_slug) = upper(v_profile.slug)
  limit 1;

  select notification_prefs into v_prefs
  from public.profiles
  where id = v_profile.user_id;

  if v_prefs is not null then
    v_scan := coalesce((v_prefs ->> 'scan_alerts')::boolean, true);
    v_emergency := coalesce((v_prefs ->> 'emergency_alerts')::boolean, true);
  end if;

  select email into v_owner_email
  from auth.users
  where id = v_profile.user_id;

  return jsonb_build_object(
    'owner_email', v_owner_email,
    'notify_owner', coalesce(v_notify, true),
    'scan_alerts', v_scan,
    'emergency_alerts', v_emergency,
    'kind', v_profile.profile_type,
    'title', v_profile.name,
    'slug', v_profile.slug
  );
end;
$$;

grant execute on function public.get_finder_event_notify_context (uuid) to service_role;
