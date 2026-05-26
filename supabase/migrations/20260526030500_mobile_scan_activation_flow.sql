-- Mobile scan + activation helpers for physical tag onboarding.

create or replace function public.get_tag_activation_context(p_activation_code text)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  t public.tag_units%rowtype;
  s public.skus%rowtype;
  p public.products%rowtype;
  q public.qrs%rowtype;
  clean_code text;
begin
  clean_code := nullif(trim(p_activation_code), '');

  if clean_code is null then
    return jsonb_build_object(
      'ok', false,
      'error', 'Activation code is required.'
    );
  end if;

  select *
  into t
  from public.tag_units
  where activation_code = clean_code
  limit 1;

  if not found then
    return jsonb_build_object(
      'ok', false,
      'error', 'Activation code not found.'
    );
  end if;

  if t.sku_id is not null then
    select *
    into s
    from public.skus
    where id = t.sku_id;
  end if;

  if s.product_id is not null then
    select *
    into p
    from public.products
    where id = s.product_id;
  end if;

  if t.qr_id is not null then
    select *
    into q
    from public.qrs
    where id = t.qr_id;
  end if;

  return jsonb_build_object(
    'ok', true,
    'activation_code', t.activation_code,
    'status', t.status,
    'sku_label', s.label,
    'product_title', p.title,
    'product_slug', p.slug,
    'qr_slug', q.public_slug
  );
end;
$$;

grant execute on function public.get_tag_activation_context(text) to authenticated;

create or replace function public.bind_tag_unit_to_qr(
  p_activation_code text,
  p_qr_slug text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  clean_code text;
  clean_slug text;
  target_tag public.tag_units%rowtype;
  owned_qr public.qrs%rowtype;
begin
  clean_code := nullif(trim(p_activation_code), '');
  clean_slug := nullif(trim(p_qr_slug), '');

  if auth.uid() is null then
    return jsonb_build_object(
      'ok', false,
      'error', 'Not authenticated.'
    );
  end if;

  if clean_code is null or clean_slug is null then
    return jsonb_build_object(
      'ok', false,
      'error', 'Activation code and QR slug are required.'
    );
  end if;

  select *
  into owned_qr
  from public.qrs
  where public_slug = clean_slug
    and owner_user_id = auth.uid()
  limit 1;

  if not found then
    return jsonb_build_object(
      'ok', false,
      'error', 'The QR to activate was not found in your account.'
    );
  end if;

  select *
  into target_tag
  from public.tag_units
  where activation_code = clean_code
  for update;

  if not found then
    return jsonb_build_object(
      'ok', false,
      'error', 'Activation code not found.'
    );
  end if;

  if target_tag.status = 'activated' then
    if target_tag.qr_id = owned_qr.id then
      return jsonb_build_object(
        'ok', true,
        'status', 'activated',
        'qr_slug', owned_qr.public_slug
      );
    end if;

    return jsonb_build_object(
      'ok', false,
      'error', 'This physical tag has already been activated.'
    );
  end if;

  if target_tag.status not in ('available', 'allocated', 'shipped') then
    return jsonb_build_object(
      'ok', false,
      'error', 'This physical tag cannot be activated right now.'
    );
  end if;

  update public.tag_units
  set
    status = 'activated',
    qr_id = owned_qr.id,
    updated_at = now()
  where id = target_tag.id;

  return jsonb_build_object(
    'ok', true,
    'status', 'activated',
    'qr_slug', owned_qr.public_slug
  );
end;
$$;

grant execute on function public.bind_tag_unit_to_qr(text, text) to authenticated;
