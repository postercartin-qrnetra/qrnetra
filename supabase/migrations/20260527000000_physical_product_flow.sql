-- Physical product purchase, review, and fulfillment schema upgrades.

alter table public.products
  add column if not exists short_description text not null default '',
  add column if not exists sale_price_paise integer check (sale_price_paise is null or sale_price_paise >= 0),
  add column if not exists primary_category text not null default 'vehicles' check (
    primary_category in ('vehicles', 'pets', 'kids', 'assets')
  ),
  add column if not exists profile_kind text not null default 'vehicle' check (
    profile_kind in ('vehicle', 'pet', 'child', 'asset')
  ),
  add column if not exists profile_variant text not null default 'vehicle' check (
    profile_variant in ('vehicle', 'pet', 'child_wristband', 'child_school_bag')
  ),
  add column if not exists gallery_images jsonb not null default '[]'::jsonb,
  add column if not exists tags_json jsonb not null default '[]'::jsonb,
  add column if not exists features_json jsonb not null default '[]'::jsonb,
  add column if not exists specifications_json jsonb not null default '[]'::jsonb,
  add column if not exists delivery_info_json jsonb not null default '[]'::jsonb,
  add column if not exists faq_json jsonb not null default '[]'::jsonb,
  add column if not exists shipping_weight_grams integer not null default 0 check (shipping_weight_grams >= 0),
  add column if not exists sort_order integer not null default 0;

create sequence if not exists public.order_number_seq start 1001;

create or replace function public.generate_order_number()
returns text
language plpgsql
as $$
begin
  return 'QRN-' || lpad(nextval('public.order_number_seq')::text, 7, '0');
end;
$$;

alter table public.orders
  add column if not exists order_number text,
  add column if not exists product_id uuid references public.products (id) on delete set null,
  add column if not exists sku_id uuid references public.skus (id) on delete set null,
  add column if not exists qr_code_id uuid references public.qr_codes (id) on delete set null,
  add column if not exists qr_slug text,
  add column if not exists payment_status text not null default 'pending_payment' check (
    payment_status in ('pending_payment', 'paid', 'failed', 'refunded')
  ),
  add column if not exists fulfillment_status text not null default 'pending' check (
    fulfillment_status in ('pending', 'processing', 'printed', 'packed', 'shipped', 'delivered', 'cancelled')
  ),
  add column if not exists payment_id text,
  add column if not exists payment_signature text,
  add column if not exists tracking_number text,
  add column if not exists courier_name text,
  add column if not exists amount_paise integer not null default 0 check (amount_paise >= 0),
  add column if not exists contact_email text,
  add column if not exists contact_phone text,
  add column if not exists shipping_address_json jsonb not null default '{}'::jsonb,
  add column if not exists paid_at timestamptz,
  add column if not exists shipped_at timestamptz,
  add column if not exists delivered_at timestamptz,
  add column if not exists cancelled_at timestamptz;

update public.orders
set
  order_number = coalesce(order_number, public.generate_order_number()),
  amount_paise = case when amount_paise = 0 then total_paise else amount_paise end
where order_number is null or amount_paise = 0;

alter table public.orders
  alter column order_number set default public.generate_order_number();

create unique index if not exists orders_order_number_idx on public.orders (order_number);
create index if not exists orders_product_id_idx on public.orders (product_id);
create index if not exists orders_qr_code_id_idx on public.orders (qr_code_id);
create index if not exists orders_payment_status_idx on public.orders (payment_status, fulfillment_status);

create table if not exists public.product_reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  product_id uuid not null references public.products (id) on delete cascade,
  order_id uuid references public.orders (id) on delete set null,
  rating integer not null check (rating between 1 and 5),
  review_title text not null,
  review_text text not null,
  reviewer_name text not null,
  created_at timestamptz not null default now(),
  constraint product_reviews_one_review_per_order unique (order_id)
);

create index if not exists product_reviews_product_created_idx
  on public.product_reviews (product_id, created_at desc);

alter table public.product_reviews enable row level security;

grant select on public.product_reviews to anon;
grant select, insert on public.product_reviews to authenticated;

create policy "product_reviews_public_read"
  on public.product_reviews for select
  to anon, authenticated
  using (true);

create policy "product_reviews_insert_purchased"
  on public.product_reviews for insert
  to authenticated
  with check (
    user_id = (select auth.uid())
    and exists (
      select 1
      from public.orders o
      where o.id = order_id
        and o.user_id = (select auth.uid())
        and o.product_id = product_id
        and o.payment_status = 'paid'
    )
  );

insert into public.products (
  slug,
  title,
  description,
  short_description,
  price_paise,
  sale_price_paise,
  primary_category,
  profile_kind,
  profile_variant,
  gallery_images,
  tags_json,
  features_json,
  specifications_json,
  delivery_info_json,
  faq_json,
  shipping_weight_grams,
  sort_order,
  is_active
)
values
  (
    'vehicle-qr-sticker',
    'Vehicle QR Sticker',
    'A premium weather-ready sticker for cars, bikes, and everyday vehicle parking that permanently links to your QRNetra dashboard profile.',
    'Parking and emergency contact sticker linked permanently to your QRNetra dashboard.',
    29900 / 100,
    null,
    'vehicles',
    'vehicle',
    'vehicle',
    '["/products/vehicle-qr-sticker/main.svg","/products/vehicle-qr-sticker/detail-1.svg","/products/vehicle-qr-sticker/detail-2.svg"]'::jsonb,
    '["vehicle","parking","wrong parking","dashboard-linked"]'::jsonb,
    '["Permanent dynamic QR linked to your dashboard","Wrong parking and emergency contact ready","Weather-resistant print finish","Editable owner details with no reprint required"]'::jsonb,
    '[{"label":"Format","value":"Vehicle adhesive sticker"},{"label":"Use case","value":"Wrong parking and emergency contact"},{"label":"QR destination","value":"Permanent QRNetra public profile"},{"label":"Linked profile","value":"Vehicle owner dashboard profile"}]'::jsonb,
    '["Ships within 1 business day after successful payment","Estimated delivery in 3-5 business days across India","Tracking updates appear in your QRNetra dashboard order page"]'::jsonb,
    '[{"question":"Where should I place the sticker?","answer":"For best scanability, place it on the inside lower corner of the windshield or another clean visible surface on the vehicle."},{"question":"Will I need to buy another sticker if I change my phone number?","answer":"No. The physical sticker keeps the same QR permanently while your dashboard lets you update contact and emergency details later."}]'::jsonb,
    50,
    1,
    true
  ),
  (
    'pet-collar-qr-tag',
    'Pet Collar QR Tag',
    'A collar-ready recovery tag that permanently connects your pet''s physical tag to a QRNetra dashboard profile.',
    'Collar-ready QR tag for pet recovery, owner contact, and vet-aware details.',
    49900 / 100,
    null,
    'pets',
    'pet',
    'pet',
    '["/products/pet-collar-qr-tag/main.svg","/products/pet-collar-qr-tag/detail-1.svg","/products/pet-collar-qr-tag/detail-2.svg"]'::jsonb,
    '["pet","collar","recovery","vet details"]'::jsonb,
    '["Permanent dashboard-linked collar tag","Supports pet, owner, and vet information","Finder-friendly lost-pet scan flow","Reusable profile even if details change later"]'::jsonb,
    '[{"label":"Format","value":"Collar QR tag"},{"label":"Use case","value":"Pet recovery and owner contact"},{"label":"QR destination","value":"Permanent QRNetra pet profile"},{"label":"Linked profile","value":"Pet dashboard profile"}]'::jsonb,
    '["Ships within 1 business day after payment confirmation","Estimated delivery in 3-5 business days across India","Order tracking becomes visible in your dashboard after dispatch"]'::jsonb,
    '[{"question":"Can I update the pet information later?","answer":"Yes. The tag keeps the same QR while you can update owner, vet, breed, or reward details from your dashboard anytime."},{"question":"Does this work only for dogs?","answer":"No. The tag works for dogs, cats, and other pets that use a collar or harness-compatible attachment."}]'::jsonb,
    30,
    2,
    true
  ),
  (
    'child-safety-wristband',
    'Child Safety Wristband',
    'A child safety wristband built for travel, outings, public events, and daily protection. The QR is permanently linked to your child''s QRNetra profile.',
    'Child safety wristband with a permanent QR linked to parent and emergency details.',
    39900 / 100,
    null,
    'kids',
    'child',
    'child_wristband',
    '["/products/child-safety-wristband/main.svg","/products/child-safety-wristband/detail-1.svg","/products/child-safety-wristband/detail-2.svg"]'::jsonb,
    '["child","wristband","travel","emergency"]'::jsonb,
    '["Permanent QR linked to a child safety profile","Fast parent and emergency contact access","Works well for travel and public outings","Child details remain editable after delivery"]'::jsonb,
    '[{"label":"Format","value":"Child safety wristband"},{"label":"Use case","value":"Travel, outings, events, child safety"},{"label":"QR destination","value":"Permanent QRNetra child profile"},{"label":"Linked profile","value":"Child dashboard profile"}]'::jsonb,
    '["Made-to-order print after successful payment","Estimated delivery in 3-5 business days across India","Shipping updates and tracking stay available in your dashboard"]'::jsonb,
    '[{"question":"When is the wristband best used?","answer":"It is ideal for travel, crowded outings, malls, theme parks, and any place where a quick guardian contact path matters."},{"question":"Can medical or allergy information be updated later?","answer":"Yes. The linked child safety profile remains editable from your dashboard after purchase."}]'::jsonb,
    20,
    3,
    true
  ),
  (
    'child-school-bag-tag',
    'Child School Bag Tag',
    'A school-ready QR tag designed for daily bag use. It permanently connects to your child''s QRNetra profile so school, class, parent, and emergency details can change over time.',
    'School bag QR tag linked permanently to a child safety dashboard profile.',
    39900 / 100,
    null,
    'kids',
    'child',
    'child_school_bag',
    '["/products/child-school-bag-tag/main.svg","/products/child-school-bag-tag/detail-1.svg","/products/child-school-bag-tag/detail-2.svg"]'::jsonb,
    '["school","bag","child","guardian"]'::jsonb,
    '["Permanent QR linked to a child school profile","Parent, school, and emergency contact fields","Built for everyday school bag attachment","Editable profile without reprinting the tag"]'::jsonb,
    '[{"label":"Format","value":"School bag QR tag"},{"label":"Use case","value":"Daily school carry and guardian contact"},{"label":"QR destination","value":"Permanent QRNetra child profile"},{"label":"Linked profile","value":"Child dashboard profile"}]'::jsonb,
    '["Printed after payment confirmation and packed within 1 business day","Estimated delivery in 3-5 business days across India","Dashboard order page shows tracking once dispatched"]'::jsonb,
    '[{"question":"Can I include school and class information?","answer":"Yes. The school bag tag flow supports school name, class, and teacher contact details in addition to parent and emergency information."},{"question":"Will the QR still work after the school year changes?","answer":"Yes. The printed QR stays the same while you can update class, teacher, and school information from the dashboard later."}]'::jsonb,
    30,
    4,
    true
  )
on conflict (slug) do update
set
  title = excluded.title,
  description = excluded.description,
  short_description = excluded.short_description,
  price_paise = excluded.price_paise,
  sale_price_paise = excluded.sale_price_paise,
  primary_category = excluded.primary_category,
  profile_kind = excluded.profile_kind,
  profile_variant = excluded.profile_variant,
  gallery_images = excluded.gallery_images,
  tags_json = excluded.tags_json,
  features_json = excluded.features_json,
  specifications_json = excluded.specifications_json,
  delivery_info_json = excluded.delivery_info_json,
  faq_json = excluded.faq_json,
  shipping_weight_grams = excluded.shipping_weight_grams,
  sort_order = excluded.sort_order,
  is_active = excluded.is_active;

insert into public.skus (product_id, sku_code, label)
select p.id, 'QRN-VEH-STICKER-001', 'Vehicle QR Sticker'
from public.products p
where p.slug = 'vehicle-qr-sticker'
on conflict (sku_code) do update set label = excluded.label
;

insert into public.skus (product_id, sku_code, label)
select p.id, 'QRN-PET-TAG-001', 'Pet Collar QR Tag'
from public.products p
where p.slug = 'pet-collar-qr-tag'
on conflict (sku_code) do update set label = excluded.label
;

insert into public.skus (product_id, sku_code, label)
select p.id, 'QRN-CHILD-WRIST-001', 'Child Safety Wristband'
from public.products p
where p.slug = 'child-safety-wristband'
on conflict (sku_code) do update set label = excluded.label
;

insert into public.skus (product_id, sku_code, label)
select p.id, 'QRN-CHILD-BAG-001', 'Child School Bag Tag'
from public.products p
where p.slug = 'child-school-bag-tag'
on conflict (sku_code) do update set label = excluded.label
;

insert into public.product_reviews (product_id, rating, review_title, review_text, reviewer_name, created_at)
select p.id, r.rating, r.review_title, r.review_text, r.reviewer_name, r.created_at
from public.products p
cross join (
  values
    (5, 'Perfect for daily parking', 'Received my vehicle sticker in 4 days. QR works perfectly and someone contacted me when my car lights were left on.', 'Rahul S.', '2026-05-01'::timestamptz),
    (5, 'Exactly what I wanted', 'Much better than leaving my phone number on the dashboard. The linked QR profile looks premium and easy to update.', 'Priya M.', '2026-04-22'::timestamptz),
    (4, 'Clean print quality', 'Sticker quality is solid and the QR scans fast from a normal phone camera.', 'Amit V.', '2026-04-18'::timestamptz),
    (5, 'Useful apartment parking solution', 'Security staff can now reach me quickly without calling random flat numbers.', 'Neeraj K.', '2026-04-11'::timestamptz),
    (5, 'Works as promised', 'Setup was smooth and I liked seeing the QR immediately in my dashboard before paying.', 'Divya R.', '2026-04-02'::timestamptz)
) as r(rating, review_title, review_text, reviewer_name, created_at)
where p.slug = 'vehicle-qr-sticker'
  and not exists (
    select 1 from public.product_reviews pr
    where pr.product_id = p.id
      and pr.review_title = r.review_title
      and pr.reviewer_name = r.reviewer_name
  );

create or replace function public.get_qr_for_public_scan (p_slug text)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  c public.qr_codes%rowtype;
  p public.qr_profiles%rowtype;
  x jsonb;
  r public.qrs%rowtype;
begin
  select *
  into c
  from public.qr_codes
  where upper(slug) = upper(p_slug)
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
        'vet_phone', nullif(trim(x ->> 'vet_contact'), ''),
        'reward_note', nullif(trim(x ->> 'reward_note'), ''),
        'fleet_size', nullif(trim(x ->> 'fleet_size'), ''),
        'business_emergency', nullif(trim(x ->> 'emergency_number'), ''),
        'asset_id', nullif(trim(x ->> 'asset_id'), ''),
        'department', nullif(trim(x ->> 'department'), ''),
        'escalation_contact', nullif(trim(x ->> 'escalation_contact'), '')
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
    'vet_phone', nullif(trim(x ->> 'vet_contact'), ''),
    'reward_note', nullif(trim(x ->> 'reward_note'), ''),
    'fleet_size', nullif(trim(x ->> 'fleet_size'), ''),
    'business_emergency', nullif(trim(x ->> 'emergency_number'), ''),
    'asset_id', nullif(trim(x ->> 'asset_id'), ''),
    'department', nullif(trim(x ->> 'department'), ''),
    'escalation_contact', nullif(trim(x ->> 'escalation_contact'), '')
  );
end;
$$;

grant execute on function public.get_qr_for_public_scan (text) to anon;
grant execute on function public.get_qr_for_public_scan (text) to authenticated;

insert into public.product_reviews (product_id, rating, review_title, review_text, reviewer_name, created_at)
select p.id, r.rating, r.review_title, r.review_text, r.reviewer_name, r.created_at
from public.products p
cross join (
  values
    (5, 'Best pet tag we have tried', 'Feels much more useful than a plain metal tag because the profile can include pet notes and an emergency contact.', 'Nisha P.', '2026-05-05'::timestamptz),
    (5, 'Very easy to set up', 'The collar tag arrived quickly and the QR profile was already ready in my dashboard by the time I paid.', 'Farhan T.', '2026-04-18'::timestamptz),
    (5, 'Finder flow is clear', 'I tested the public page myself and it is very clear for anyone who finds our dog.', 'Ritu A.', '2026-04-09'::timestamptz),
    (4, 'Good daily wear option', 'The tag feels light enough for regular walks and the QR stayed scannable.', 'Megha S.', '2026-04-01'::timestamptz),
    (5, 'Worth the premium', 'I mainly bought it for the editable profile and vet contact support, and it delivered.', 'Akhil P.', '2026-03-26'::timestamptz)
) as r(rating, review_title, review_text, reviewer_name, created_at)
where p.slug = 'pet-collar-qr-tag'
  and not exists (
    select 1 from public.product_reviews pr
    where pr.product_id = p.id
      and pr.review_title = r.review_title
      and pr.reviewer_name = r.reviewer_name
  );

insert into public.product_reviews (product_id, rating, review_title, review_text, reviewer_name, created_at)
select p.id, r.rating, r.review_title, r.review_text, r.reviewer_name, r.created_at
from public.products p
cross join (
  values
    (5, 'Excellent for travel days', 'We used it on a family trip and liked knowing the same QR can be updated later if our contact details change.', 'Monika G.', '2026-05-07'::timestamptz),
    (4, 'Useful and reassuring', 'The wristband setup flow was simple and the QR profile appeared in the dashboard immediately after creation.', 'Karan D.', '2026-04-20'::timestamptz),
    (5, 'Good for crowded events', 'We bought it for a public event and it gave us real peace of mind.', 'Ishita N.', '2026-04-13'::timestamptz),
    (5, 'Comfortable enough for a full day', 'My child kept it on for the whole day without fuss and the QR scan opened fast.', 'Rhea M.', '2026-04-07'::timestamptz),
    (4, 'Great idea executed well', 'I would recommend it to parents who travel or attend crowded outings with kids.', 'Sanjay K.', '2026-03-28'::timestamptz)
) as r(rating, review_title, review_text, reviewer_name, created_at)
where p.slug = 'child-safety-wristband'
  and not exists (
    select 1 from public.product_reviews pr
    where pr.product_id = p.id
      and pr.review_title = r.review_title
      and pr.reviewer_name = r.reviewer_name
  );

insert into public.product_reviews (product_id, rating, review_title, review_text, reviewer_name, created_at)
select p.id, r.rating, r.review_title, r.review_text, r.reviewer_name, r.created_at
from public.products p
cross join (
  values
    (5, 'Ideal for school routines', 'The bag tag format is perfect for everyday school use and I like that class details can be updated later.', 'Sneha R.', '2026-05-09'::timestamptz),
    (5, 'Setup was very smooth', 'We created the child profile first, then finished the address and payment flow without having to repeat information.', 'Aparna V.', '2026-04-24'::timestamptz),
    (5, 'Useful for school transport', 'The school and class fields make this much better than a generic QR tag for children.', 'Nitin J.', '2026-04-16'::timestamptz),
    (4, 'Good print quality', 'The tag looks neat on the school bag and the QR scans instantly.', 'Meera T.', '2026-04-06'::timestamptz),
    (5, 'Very parent-friendly flow', 'I liked that the QR appeared in the dashboard immediately and the order tracking was easy to follow.', 'Lakshmi P.', '2026-03-30'::timestamptz)
) as r(rating, review_title, review_text, reviewer_name, created_at)
where p.slug = 'child-school-bag-tag'
  and not exists (
    select 1 from public.product_reviews pr
    where pr.product_id = p.id
      and pr.review_title = r.review_title
      and pr.reviewer_name = r.reviewer_name
  );
