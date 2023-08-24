export const isR2Configured =
  process.env.NEXT_PUBLIC_R2_ACCOUNT_ID !== "" &&
  process.env.NEXT_PUBLIC_R2_ACCOUNT_ID &&
  process.env.NEXT_PUBLIC_R2_ACCESS_KEY_ID !== "" &&
  process.env.NEXT_PUBLIC_R2_ACCESS_KEY_ID &&
  process.env.NEXT_PUBLIC_R2_SECRET_ACCESS_KEY !== "" &&
  process.env.NEXT_PUBLIC_R2_SECRET_ACCESS_KEY &&
  process.env.NEXT_PUBLIC_MERKLE_TREES_BUCKET !== "" &&
  process.env.NEXT_PUBLIC_MERKLE_TREES_BUCKET;
