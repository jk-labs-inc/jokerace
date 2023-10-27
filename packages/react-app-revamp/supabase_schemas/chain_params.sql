create table 
  public.chain_params (
    uuid uuid not null default gen_random_uuid (),
    network_name character not null,
    min_cost_to_propose numeric not null 
) tablespace pg_default;