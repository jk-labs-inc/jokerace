create table public.analytics_contest_participants_v3 (
    uuid uuid not null default gen_random_uuid(),
    contest_address character varying not null,
    user_address character varying not null,
    network_name character varying not null,
    times_proposed integer default 0,
    times_voted integer default 0,
    constraint analytics_contest_participants_v3_pkey primary key (uuid)
) tablespace pg_default;
