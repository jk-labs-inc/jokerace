create table public.analytics_contest_participants_v3 (
    uuid uuid not null default gen_random_uuid(),
    contest_address character varying not null,
    user_address character varying not null,
    network_name character varying not null,
    created_at int4 null,
    proposal_id character varying,
    vote_amount int4 NULL,
    constraint analytics_contest_participants_v3_pkey primary key (uuid)
) tablespace pg_default;
