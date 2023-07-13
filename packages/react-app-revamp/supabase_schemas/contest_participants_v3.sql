create table
  public.contest_participants_v3 (
    contest_address character varying null,
    user_address character varying null,
    can_submit boolean null,
    num_votes numeric null,
    uuid uuid not null default gen_random_uuid (),
    network_name character varying null,
    constraint contest_participants_v3_pkey primary key (uuid)
  ) tablespace pg_default;