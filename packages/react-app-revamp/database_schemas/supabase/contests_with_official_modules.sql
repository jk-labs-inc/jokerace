create table
  public.contests_with_official_modules (
    id uuid not null default gen_random_uuid (),
    network_name character varying not null,
    address character varying not null,
    type character varying not null,
    constraint contests_with_official_modules_pkey primary key (id),
    constraint contests_with_official_modules_address_network_name_type_key unique (address, network_name, type)
  ) tablespace pg_default;