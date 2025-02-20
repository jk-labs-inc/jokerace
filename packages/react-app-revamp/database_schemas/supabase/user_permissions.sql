create table
  public.user_permissions (
    id uuid not null default gen_random_uuid (),
    user_address character varying not null,
    allowlist_max_size integer not null,
    constraint user_permissions_pkey primary key (id)
  ) tablespace pg_default;