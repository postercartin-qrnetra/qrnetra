# Pre-repair production inspection (2026-05-30)

## Migration history (remote)

- 20250510110000 init_core_schema
- 20250511120000 qrs_mvp_public_phones
- 20260520204100 expand_profile_extra_fields
- 20260520210102 qr_generation_pipeline
- 20260520210151 qr_pipeline_functions
- 20260526155917 mobile_scan_activation_flow

## Inventory tables

| Table | Exists |
|-------|--------|
| tag_units | Yes (legacy columns only) |
| inventory_batches | No |
| tag_serial_counters | No |
| tag_unit_events | No |
| tag_replacements | No |
| tag_transfers | No |

## Inventory RPCs (pre-repair)

- get_tag_activation_context
- bind_tag_unit_to_qr

## tag_units triggers

- tag_units_set_updated_at
- FK RI triggers

## tag_units RLS policies

- None

## Notes

- `supabase db dump` failed (Docker not running). Schema snapshot via MCP only.
