export const isR2Configured =
  process.env.R2_ACCESS_KEY_ID !== "" &&
  process.env.R2_ACCESS_KEY_ID &&
  process.env.R2_SECRET_ACCESS_KEY !== "" &&
  process.env.R2_SECRET_ACCESS_KEY;
