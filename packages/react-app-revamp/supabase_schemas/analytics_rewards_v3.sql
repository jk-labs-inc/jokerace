create table public.analytics_rewards_v3 (
    uuid uuid not null default gen_random_uuid(),
    contest_address character varying not null,
    rewards_module_address character varying not null,
    network_name character varying not null,
    token_address character varying default null,
    amount_paid_in numeric null,   
    amount_paid_out numeric null,
    created_at int4 null,
    amount_withdrawn numeric null
    constraint analytics_rewards_v3_pkey primary key (uuid)
) tablespace pg_default;
