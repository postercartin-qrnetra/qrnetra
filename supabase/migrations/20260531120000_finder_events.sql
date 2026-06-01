-- Finder interaction events: typed scan/contact tracking for public scan flow

create type public.finder_event_type as enum (
  'PROFILE_VIEWED',
  'REASON_SELECTED',
  'CALL_CLICKED',
  'WHATSAPP_CLICKED',
  'EMERGENCY_CLICKED',
  'LOCATION_SHARED'
);

create table public.finder_events (
  id uuid primary key default gen_random_uuid(),
  qr_id uuid not null references public.qr_codes (id) on delete cascade,
  slug text not null,
  event_type public.finder_event_type not null,
  reason text,
  device text,
  browser text,
  country text,
  city text,
  latitude double precision,
  longitude double precision,
  ip_hash text,
  created_at timestamptz not null default now()
);

create index finder_events_qr_id_created_at_idx
  on public.finder_events (qr_id, created_at desc);

create index finder_events_event_type_created_at_idx
  on public.finder_events (event_type, created_at desc);

create index finder_events_profile_viewed_rate_idx
  on public.finder_events (qr_id, ip_hash, created_at desc)
  where event_type = 'PROFILE_VIEWED';

alter table public.finder_events enable row level security;

create policy "finder_events_owner_select"
  on public.finder_events for select
  to authenticated
  using (
    exists (
      select 1
      from public.qr_codes c
      join public.qr_profiles p on p.id = c.profile_id
      where c.id = finder_events.qr_id
        and p.user_id = auth.uid()
    )
  );

-- Resolve qr_codes.id from slug or direct id (handles legacy qrs.id passthrough)
create or replace function public.resolve_qr_code_id (
  p_qr_id uuid,
  p_slug text
) returns uuid
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_id uuid;
begin
  select id into v_id
  from public.qr_codes
  where id = p_qr_id;

  if v_id is not null then
    return v_id;
  end if;

  select id into v_id
  from public.qr_codes
  where upper(slug) = upper(nullif(trim(p_slug), ''));

  return v_id;
end;
$$;

-- Rate-limit check: PROFILE_VIEWED email within last hour for same qr + ip
create or replace function public.should_notify_profile_viewed (
  p_qr_id uuid,
  p_ip_hash text
) returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select not exists (
    select 1
    from public.finder_events
    where qr_id = p_qr_id
      and event_type = 'PROFILE_VIEWED'
      and (
        p_ip_hash is null
        or ip_hash is not distinct from nullif(trim(p_ip_hash), '')
      )
      and created_at > now() - interval '1 hour'
    limit 1
  );
$$;

grant execute on function public.should_notify_profile_viewed (uuid, text) to service_role;

create or replace function public.record_finder_event (
  p_qr_id uuid,
  p_slug text,
  p_event_type public.finder_event_type,
  p_reason text default null,
  p_device text default null,
  p_browser text default null,
  p_country text default null,
  p_city text default null,
  p_latitude double precision default null,
  p_longitude double precision default null,
  p_ip_hash text default null
) returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_qr_id uuid;
  v_status text;
  v_event_id uuid;
  v_should_notify boolean := false;
begin
  v_qr_id := public.resolve_qr_code_id(p_qr_id, p_slug);

  if v_qr_id is null then
    return jsonb_build_object('ok', false, 'error', 'qr_not_found');
  end if;

  select status into v_status
  from public.qr_codes
  where id = v_qr_id;

  if v_status is distinct from 'active' then
    return jsonb_build_object('ok', false, 'error', 'qr_not_active');
  end if;

  if p_event_type = 'PROFILE_VIEWED' then
    v_should_notify := public.should_notify_profile_viewed(v_qr_id, p_ip_hash);
  else
    v_should_notify := true;
  end if;

  insert into public.finder_events (
    qr_id,
    slug,
    event_type,
    reason,
    device,
    browser,
    country,
    city,
    latitude,
    longitude,
    ip_hash
  ) values (
    v_qr_id,
    coalesce(nullif(trim(p_slug), ''), (select slug from public.qr_codes where id = v_qr_id)),
    p_event_type,
    nullif(trim(p_reason), ''),
    nullif(trim(p_device), ''),
    nullif(trim(p_browser), ''),
    nullif(trim(p_country), ''),
    nullif(trim(p_city), ''),
    p_latitude,
    p_longitude,
    nullif(trim(p_ip_hash), '')
  )
  returning id into v_event_id;

  if p_event_type = 'PROFILE_VIEWED' then
    update public.qr_codes
    set scans = scans + 1
    where id = v_qr_id;
  end if;

  return jsonb_build_object(
    'ok', true,
    'event_id', v_event_id,
    'qr_id', v_qr_id,
    'should_notify', v_should_notify
  );
end;
$$;

grant execute on function public.resolve_qr_code_id (uuid, text) to anon;
grant execute on function public.resolve_qr_code_id (uuid, text) to authenticated;
grant execute on function public.record_finder_event (
  uuid, text, public.finder_event_type, text, text, text, text, text,
  double precision, double precision, text
) to anon;
grant execute on function public.record_finder_event (
  uuid, text, public.finder_event_type, text, text, text, text, text,
  double precision, double precision, text
) to authenticated;

-- Owner notification context for a finder event
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

  select email into v_owner_email
  from auth.users
  where id = v_profile.user_id;

  return jsonb_build_object(
    'owner_email', v_owner_email,
    'notify_owner', coalesce(v_notify, true),
    'kind', v_profile.profile_type,
    'title', v_profile.name,
    'slug', v_profile.slug
  );
end;
$$;

grant execute on function public.get_finder_event_notify_context (uuid) to service_role;

create or replace function public.get_owner_scan_stats (
  p_user_id uuid
) returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_qr_ids uuid[];
  v_total bigint;
  v_today bigint;
  v_calls bigint;
  v_whatsapp bigint;
  v_emergency bigint;
  v_recent jsonb;
begin
  select coalesce(array_agg(c.id), '{}')
  into v_qr_ids
  from public.qr_codes c
  join public.qr_profiles p on p.id = c.profile_id
  where p.user_id = p_user_id;

  if v_qr_ids = '{}' then
    return jsonb_build_object(
      'total_scans', 0,
      'today_scans', 0,
      'call_clicks', 0,
      'whatsapp_clicks', 0,
      'emergency_clicks', 0,
      'recent_events', '[]'::jsonb
    );
  end if;

  select count(*) into v_total
  from public.finder_events
  where qr_id = any (v_qr_ids)
    and event_type = 'PROFILE_VIEWED';

  select count(*) into v_today
  from public.finder_events
  where qr_id = any (v_qr_ids)
    and event_type = 'PROFILE_VIEWED'
    and created_at >= date_trunc('day', now() at time zone 'utc');

  select count(*) into v_calls
  from public.finder_events
  where qr_id = any (v_qr_ids)
    and event_type = 'CALL_CLICKED';

  select count(*) into v_whatsapp
  from public.finder_events
  where qr_id = any (v_qr_ids)
    and event_type = 'WHATSAPP_CLICKED';

  select count(*) into v_emergency
  from public.finder_events
  where qr_id = any (v_qr_ids)
    and event_type = 'EMERGENCY_CLICKED';

  select coalesce(jsonb_agg(row_to_json(ev)::jsonb), '[]'::jsonb)
  into v_recent
  from (
    select
      fe.id,
      fe.event_type,
      fe.reason,
      fe.device,
      fe.browser,
      fe.country,
      fe.city,
      fe.latitude,
      fe.longitude,
      fe.created_at,
      c.slug,
      p.name as tag_title,
      p.profile_type as kind
    from public.finder_events fe
    join public.qr_codes c on c.id = fe.qr_id
    join public.qr_profiles p on p.id = c.profile_id
    where fe.qr_id = any (v_qr_ids)
    order by fe.created_at desc
    limit 50
  ) ev;

  return jsonb_build_object(
    'total_scans', v_total,
    'today_scans', v_today,
    'call_clicks', v_calls,
    'whatsapp_clicks', v_whatsapp,
    'emergency_clicks', v_emergency,
    'recent_events', v_recent
  );
end;
$$;

grant execute on function public.get_owner_scan_stats (uuid) to authenticated;

create or replace function public.get_owner_finder_events (
  p_user_id uuid,
  p_limit int default 100,
  p_offset int default 0
) returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_qr_ids uuid[];
  v_events jsonb;
  v_total bigint;
begin
  select coalesce(array_agg(c.id), '{}')
  into v_qr_ids
  from public.qr_codes c
  join public.qr_profiles p on p.id = c.profile_id
  where p.user_id = p_user_id;

  if v_qr_ids = '{}' then
    return jsonb_build_object('events', '[]'::jsonb, 'total', 0);
  end if;

  select count(*) into v_total
  from public.finder_events
  where qr_id = any (v_qr_ids);

  select coalesce(jsonb_agg(row_to_json(ev)::jsonb), '[]'::jsonb)
  into v_events
  from (
    select
      fe.id,
      fe.event_type,
      fe.reason,
      fe.device,
      fe.browser,
      fe.country,
      fe.city,
      fe.latitude,
      fe.longitude,
      fe.created_at,
      c.slug,
      p.name as tag_title,
      p.profile_type as kind
    from public.finder_events fe
    join public.qr_codes c on c.id = fe.qr_id
    join public.qr_profiles p on p.id = c.profile_id
    where fe.qr_id = any (v_qr_ids)
    order by fe.created_at desc
    limit greatest(p_limit, 1)
    offset greatest(p_offset, 0)
  ) ev;

  return jsonb_build_object('events', v_events, 'total', v_total);
end;
$$;

grant execute on function public.get_owner_finder_events (uuid, int, int) to authenticated;

-- Extend get_qr_for_public_scan with new profile fields
create or replace function public.get_qr_for_public_scan (p_slug text) returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  c record;
  p record;
  r record;
  x jsonb;
begin
  select *
  into c
  from public.qr_codes
  where upper(slug) = upper(p_slug)
    and status = 'active'
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
        'vehicle_type', nullif(trim(x ->> 'vehicle_type'), ''),
        'finder_instructions', nullif(trim(x ->> 'finder_instructions'), ''),
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
        'medical_notes', nullif(trim(x ->> 'medical_notes'), ''),
        'parent_name', nullif(trim(x ->> 'parent_name'), ''),
        'school_name', nullif(trim(x ->> 'school_name'), ''),
        'class_name', nullif(trim(x ->> 'class_name'), ''),
        'teacher_contact', nullif(trim(x ->> 'teacher_contact'), ''),
        'emergency_instructions', nullif(trim(x ->> 'emergency_instructions'), ''),
        'owner_name', nullif(trim(x ->> 'owner_name'), ''),
        'breed', nullif(trim(x ->> 'breed'), ''),
        'pet_color', nullif(trim(x ->> 'pet_color'), ''),
        'vet_phone', nullif(trim(x ->> 'vet_contact'), ''),
        'reward_note', nullif(trim(x ->> 'reward_note'), ''),
        'fleet_size', nullif(trim(x ->> 'fleet_size'), ''),
        'business_emergency', nullif(trim(x ->> 'emergency_number'), ''),
        'asset_id', nullif(trim(x ->> 'asset_id'), ''),
        'department', nullif(trim(x ->> 'department'), ''),
        'escalation_contact', nullif(trim(x ->> 'escalation_contact'), ''),
        'responsible_person', coalesce(
          nullif(trim(x ->> 'responsible_person'), ''),
          nullif(trim(x ->> 'owner_name'), ''),
          p.name
        )
      );
    end if;
  end if;

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
    'vehicle_type', nullif(trim(x ->> 'vehicle_type'), ''),
    'finder_instructions', nullif(trim(x ->> 'finder_instructions'), ''),
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
    'medical_notes', nullif(trim(x ->> 'medical_notes'), ''),
    'parent_name', nullif(trim(x ->> 'parent_name'), ''),
    'school_name', nullif(trim(x ->> 'school_name'), ''),
    'class_name', nullif(trim(x ->> 'class_name'), ''),
    'teacher_contact', nullif(trim(x ->> 'teacher_contact'), ''),
    'emergency_instructions', nullif(trim(x ->> 'emergency_instructions'), ''),
    'owner_name', nullif(trim(x ->> 'owner_name'), ''),
    'breed', nullif(trim(x ->> 'breed'), ''),
    'pet_color', nullif(trim(x ->> 'pet_color'), ''),
    'vet_phone', nullif(trim(x ->> 'vet_contact'), ''),
    'reward_note', nullif(trim(x ->> 'reward_note'), ''),
    'fleet_size', nullif(trim(x ->> 'fleet_size'), ''),
    'business_emergency', nullif(trim(x ->> 'emergency_number'), ''),
    'asset_id', nullif(trim(x ->> 'asset_id'), ''),
    'department', nullif(trim(x ->> 'department'), ''),
    'escalation_contact', nullif(trim(x ->> 'escalation_contact'), ''),
    'responsible_person', coalesce(
      nullif(trim(x ->> 'responsible_person'), ''),
      nullif(trim(x ->> 'owner_name'), ''),
      r.title
    )
  );
end;
$$;

grant execute on function public.get_qr_for_public_scan (text) to anon;
grant execute on function public.get_qr_for_public_scan (text) to authenticated;

comment on table public.finder_events is 'Typed finder interactions on public scan pages.';
