# Post-repair production inspection (2026-05-30)

## Migration history

All 13 local migrations aligned on remote after repair + push.

## Tables created

- inventory_batches
- tag_serial_counters
- tag_unit_events
- tag_replacements
- tag_transfers

## tag_units

Full column set including public_tag_id, qr_code_id, owner_user_id, preset_slug, product_type, etc.

## RPCs

- get_tag_by_public_id
- verify_tag_activation
- bind_tag_unit_to_qr_code
- get_unactivated_tag_for_slug
- get_tag_public_gate
- search_tag_inventory
- Updated get_tag_activation_context / bind_tag_unit_to_qr

## RLS

- tag_units_owner_select

## Physical product (20260527000000)

- orders: order_number, payment_status, fulfillment_status, qr_code_id present
- product_reviews table created (via migration)

## Smoke test data

Batch `2026-SMOKE-001`: 5 vehicle tags V-QRN-000001 … V-QRN-000005 (codes TEST01–TEST05 for QA only).
