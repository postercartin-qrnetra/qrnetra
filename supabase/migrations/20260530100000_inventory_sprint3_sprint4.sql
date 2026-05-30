-- Sprint 3/4: public scan gate, replacement/transfer tables, admin search helper

create table if not exists public.tag_replacements (
  id uuid primary key default gen_random_uuid (),
  old_tag_unit_id uuid not null references public.tag_units (id) on delete restrict,
  new_tag_unit_id uuid not null references public.tag_units (id) on delete restrict,
  qr_code_id uuid references public.qr_codes (id) on delete set null,
  replacement_reason text not null check (
    replacement_reason in ('lost', 'damaged', 'defective', 'upgrade')
  ),
  created_at timestamptz not null default now ()
);

create table if not exists public.tag_transfers (
  id uuid primary key default gen_random_uuid (),
  tag_unit_id uuid not null references public.tag_units (id) on delete cascade,
  from_user_id uuid not null references auth.users (id) on delete cascade,
  to_user_id uuid references auth.users (id) on delete set null,
  to_email text,
  status text not null default 'pending' check (status in ('pending', 'completed', 'cancelled')),
  created_at timestamptz not null default now (),
  completed_at timestamptz
);

alter table public.tag_replacements enable row level security;
alter table public.tag_transfers enable row level security;

-- Blocked public scan for locked/disabled physical tags
create or replace function public.get_tag_public_gate(p_slug text)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  clean_slug text;
  tag_status text;
begin
  clean_slug := nullif(trim(p_slug), '');
  if clean_slug is null then
    return jsonb_build_object('blocked', false);
  end if;

  select t.status
  into tag_status
  from public.tag_units t
  left join public.qr_codes c on c.id = t.qr_code_id
  where t.preset_slug = clean_slug
     or upper(c.slug) = upper(clean_slug)
  order by t.updated_at desc
  limit 1;

  if tag_status in ('locked', 'disabled') then
    return jsonb_build_object(
      'blocked', true,
      'reason', tag_status,
      'message', 'This tag is currently unavailable.'
    );
  end if;

  return jsonb_build_object('blocked', false);
end;
$$;

grant execute on function public.get_tag_public_gate(text) to anon, authenticated;

-- Admin inventory search (service role / security definer)
create or replace function public.search_tag_inventory(p_query text, p_limit int default 25)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  clean text;
  results jsonb;
begin
  clean := nullif(trim(p_query), '');
  if clean is null then
    return jsonb_build_object('ok', true, 'rows', '[]'::jsonb);
  end if;

  select coalesce(jsonb_agg(row_to_json(x)::jsonb), '[]'::jsonb)
  into results
  from (
    select
      t.public_tag_id,
      t.product_type,
      t.status,
      t.activation_code,
      t.order_id::text as order_id,
      p.name as profile_name,
      p.phone as profile_phone,
      coalesce(xj ->> 'vehicle_number', xj ->> 'pet_name', '') as search_detail
    from public.tag_units t
    left join public.qr_codes c on c.id = t.qr_code_id
    left join public.qr_profiles p on p.id = c.profile_id
    left join lateral (select coalesce(p.data_json, '{}'::jsonb) as xj) d on true
    where
      upper(t.public_tag_id) like '%' || upper(clean) || '%'
      or upper(t.activation_code) = upper(clean)
      or t.order_id::text = clean
      or upper(p.name) like '%' || upper(clean) || '%'
      or p.phone like '%' || clean || '%'
      or upper(coalesce(xj ->> 'vehicle_number', '')) like '%' || upper(clean) || '%'
      or upper(coalesce(xj ->> 'pet_name', '')) like '%' || upper(clean) || '%'
    order by t.created_at desc
    limit greatest(1, least(coalesce(p_limit, 25), 100))
  ) x;

  return jsonb_build_object('ok', true, 'rows', results);
end;
$$;

-- Only service role should call search in practice; grant to authenticated for admin UI using user JWT + app-level admin check before RPC
grant execute on function public.search_tag_inventory(text, int) to authenticated;
