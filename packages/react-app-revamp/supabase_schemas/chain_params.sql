create table
  public.chain_params (
    id uuid not null default gen_random_uuid (),
    network_name character varying not null,
    min_cost_to_propose numeric not null,
    min_cost_to_vote numeric not null,
    constraint chain_params_pkey primary key (id)
  ) tablespace pg_default;