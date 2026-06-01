-- Scan context: timezone, region, location source + owner stats improvements

alter table public.finder_events
  add column if not exists scanner_timezone text,
  add column if not exists region text,
  add column if not exists location_source text
    check (location_source is null or location_source in ('ip', 'gps'));

comment on column public.finder_events.scanner_timezone is
  'IANA timezone from finder browser at event time.';
comment on column public.finder_events.region is
  'State/region from IP geo lookup.';
comment on column public.finder_events.location_source is
  'ip = city/country from IP; gps = finder shared coordinates.';

-- Future: masked_call_enabled, sms_alerts, push_enabled, plan_tier
alter table public.qr_profiles
  add column if not exists settings_json jsonb not null default '{}'::jsonb;

comment on column public.qr_profiles.settings_json is
  'Reserved for premium features: masked_call, sms, push, plan_tier, ownership transfer.';

drop function if exists public.record_finder_event (
  uuid,
  text,
  public.finder_event_type,
  text,
  text,
  text,
  text,
  text,
  double precision,
  double precision,
  text
);

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
  p_ip_hash text default null,
  p_scanner_timezone text default null,
  p_region text default null,
  p_location_source text default null
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
    ip_hash,
    scanner_timezone,
    region,
    location_source
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
    nullif(trim(p_ip_hash), ''),
    nullif(trim(p_scanner_timezone), ''),
    nullif(trim(p_region), ''),
    nullif(trim(p_location_source), '')
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

grant execute on function public.record_finder_event (
  uuid, text, public.finder_event_type, text, text, text, text, text,
  double precision, double precision, text, text, text, text
) to anon;
grant execute on function public.record_finder_event (
  uuid, text, public.finder_event_type, text, text, text, text, text,
  double precision, double precision, text, text, text, text
) to authenticated;

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
  v_top_location text;
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
      'top_location', null,
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
    and created_at >= date_trunc('day', now() at time zone 'Asia/Kolkata')
      at time zone 'Asia/Kolkata';

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

  select coalesce(
    nullif(trim(concat_ws(', ', mode_row.city, mode_row.country)), ''),
    null
  )
  into v_top_location
  from (
    select fe.city, fe.country, count(*) as cnt
    from public.finder_events fe
    where fe.qr_id = any (v_qr_ids)
      and fe.event_type = 'PROFILE_VIEWED'
      and fe.created_at > now() - interval '30 days'
      and (fe.city is not null or fe.country is not null)
    group by fe.city, fe.country
    order by cnt desc
    limit 1
  ) mode_row;

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
      fe.region,
      fe.scanner_timezone,
      fe.location_source,
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
    'top_location', v_top_location,
    'recent_events', v_recent
  );
end;
$$;

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
      fe.region,
      fe.scanner_timezone,
      fe.location_source,
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
