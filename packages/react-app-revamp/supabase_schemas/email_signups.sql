create table
  public.email_signups (
    id uuid not null default gen_random_uuid (),
    email_address character varying not null,
    user_address character varying null,
    constraint email_signups_pkey primary key (id),
    constraint email_signups_email_address_key unique (email_address)
  ) tablespace pg_default;