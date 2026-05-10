-- MVP: business kind, profile_extra JSON, scan device_type, public scan RPC with contact fields

alter table public.qrs drop constraint if exists qrs_kind_check;

alter table public.qrs
  add constraint qrs_kind_check check (
    kind in ('vehicle', 'child', 'pet', 'other', 'business')
  );

alter table public.qrs
  add column if not exists profile_extra jsonb not null default '{}';

alter table public.scan_events
  add column if not exists device_type text;

-- Finder-facing payload (phones exposed for MVP contact flows — slug is unguessable high-entropy)
create or replace function public.get_qr_for_public_scan (p_slug text)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  r public.qrs%rowtype;
  x jsonb;
begin
  select *
  into r
  from public.qrs
  where public_slug = p_slug
    and status = 'active';

  if not found then
    return null;
  end if;

  x := coalesce(r.profile_extra, '{}'::jsonb);

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
    ),
    'owner_phone', r.owner_phone,
    'whatsapp_phone', r.whatsapp_e164,
    'emergency_phone', nullif(trim(x ->> 'emergency_contact'), ''),
    'vet_phone', nullif(trim(x ->> 'vet_contact'), ''),
    'alternate_contact', nullif(trim(x ->> 'alternate_contact'), ''),
    'blood_group', nullif(trim(x ->> 'blood_group'), ''),
    'allergies', nullif(trim(x ->> 'allergies'), ''),
    'breed', nullif(trim(x ->> 'breed'), ''),
    'medical_notes', nullif(trim(x ->> 'medical_notes'), ''),
    'fleet_size', nullif(trim(x ->> 'fleet_size'), ''),
    'business_emergency', nullif(trim(x ->> 'emergency_number'), '')
  );
end;
$$;

grant execute on function public.get_qr_for_public_scan (text) to anon;
grant execute on function public.get_qr_for_public_scan (text) to authenticated;
