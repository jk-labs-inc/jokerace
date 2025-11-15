create table
  public.chain_params (
    id uuid not null default gen_random_uuid (),
    network_name character varying not null,
    jk_labs_split_destination character varying not null default '0xDc652C746A8F85e18Ce632d97c6118e8a52fa738'::character varying,
    default_cost_to_vote numeric null default 0.0001,
    constraint chain_params_pkey primary key (id)
  ) tablespace pg_default;
