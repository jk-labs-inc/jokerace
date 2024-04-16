create table
  public.extensions (
    id uuid not null default gen_random_uuid (),
    name character varying not null,
    enabled boolean not null,
  ) tablespace pg_default;