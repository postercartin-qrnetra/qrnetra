-- Expand get_qr_for_public_scan to surface additional profile_extra fields
-- added in the universal onboarding form (parent_name, school_name,
-- emergency_instructions, reward_note, asset_id, department, escalation_contact)

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
    'id',                    r.id,
    'slug',                  r.public_slug,
    'kind',                  r.kind,
    'title',                 r.title,
    'message',               r.finder_message,
    'vehicle_registration',  r.vehicle_registration,
    'channels', jsonb_build_object(
      'call',      r.channel_call,
      'whatsapp',  r.channel_whatsapp,
      'sms',       r.channel_sms,
      'email',     r.channel_email
    ),
    'owner_phone',     r.owner_phone,
    'whatsapp_phone',  r.whatsapp_e164,
    -- vehicle / shared
    'alternate_contact',      nullif(trim(x ->> 'alternate_contact'), ''),
    -- child
    'emergency_phone',        nullif(trim(x ->> 'emergency_contact'), ''),
    'blood_group',            nullif(trim(x ->> 'blood_group'), ''),
    'allergies',              nullif(trim(x ->> 'allergies'), ''),
    'parent_name',            nullif(trim(x ->> 'parent_name'), ''),
    'school_name',            nullif(trim(x ->> 'school_name'), ''),
    'emergency_instructions', nullif(trim(x ->> 'emergency_instructions'), ''),
    -- pet
    'breed',          nullif(trim(x ->> 'breed'), ''),
    'vet_phone',      nullif(trim(x ->> 'vet_contact'), ''),
    'medical_notes',  nullif(trim(x ->> 'medical_notes'), ''),
    'reward_note',    nullif(trim(x ->> 'reward_note'), ''),
    -- business / fleet
    'fleet_size',         nullif(trim(x ->> 'fleet_size'), ''),
    'business_emergency', nullif(trim(x ->> 'emergency_number'), ''),
    'asset_id',           nullif(trim(x ->> 'asset_id'), ''),
    'department',         nullif(trim(x ->> 'department'), ''),
    'escalation_contact', nullif(trim(x ->> 'escalation_contact'), '')
  );
end;
$$;
