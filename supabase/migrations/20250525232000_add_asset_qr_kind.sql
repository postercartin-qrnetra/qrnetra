-- Allow personal asset QR profiles in the unified qr_profiles model
-- while keeping legacy qrs fallback reads working during migration.

alter table public.qr_profiles
  drop constraint if exists qr_profiles_profile_type_check;

alter table public.qr_profiles
  add constraint qr_profiles_profile_type_check check (
    profile_type in ('vehicle', 'child', 'pet', 'asset', 'business')
  );

alter table public.qrs
  drop constraint if exists qrs_kind_check;

alter table public.qrs
  add constraint qrs_kind_check check (
    kind in ('vehicle', 'child', 'pet', 'asset', 'other', 'business')
  );
