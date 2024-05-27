create table
  public.extensions (
    id uuid not null default gen_random_uuid (),
    name text not null,
    enabled boolean not null,
    constraint extensions_pkey primary key (id)
  ) tablespace pg_default;