create table
  public.contests_v3 (
    created_at timestamp with time zone null default now(),
    start_at timestamp with time zone null,
    end_at timestamp with time zone null,
    address character varying null,
    author_address character varying null,
    network_name character varying null,
    vote_start_at timestamp with time zone null,
    featured boolean null,
    votingMerkleTree json null,
    submissionMerkleTree json null,
    title character varying null,
    type character varying null,
    summary character varying null,
    prompt character varying null,
    uuid uuid not null default gen_random_uuid (),
    votingMerkleRoot character varying null,
    submissionMerkleRoot character varying null,
    constraint contests_v3_pkey primary key (uuid)
  ) tablespace pg_default;