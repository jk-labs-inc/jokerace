export const isR2Configured =
  import.meta.env.VITE_R2_ACCOUNT_ID !== "" &&
  import.meta.env.VITE_R2_ACCOUNT_ID &&
  import.meta.env.VITE_R2_ACCESS_KEY_ID !== "" &&
  import.meta.env.VITE_R2_ACCESS_KEY_ID &&
  import.meta.env.VITE_R2_SECRET_ACCESS_KEY !== "" &&
  import.meta.env.VITE_R2_SECRET_ACCESS_KEY;
