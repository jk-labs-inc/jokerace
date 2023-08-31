create table
  public.user_permissions (
    id uuid not null default gen_random_uuid (),
    allowlist_max_size integer not null,
    user_address character varying not null,
    constraint user_permissions_pkey primary key (id)
  ) tablespace pg_default;