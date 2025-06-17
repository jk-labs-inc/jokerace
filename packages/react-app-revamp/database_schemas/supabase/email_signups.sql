create table
  public.email_signups (
    id uuid not null default gen_random_uuid (),
    email_address character varying not null,
    user_address character varying null,
    date timestamp with time zone null,
    constraint email_signups_pkey primary key (id)
  ) tablespace pg_default;
