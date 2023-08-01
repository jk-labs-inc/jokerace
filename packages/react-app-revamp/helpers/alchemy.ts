export const isAlchemyConfigured = !!(
  process.env.NEXT_PUBLIC_ALCHEMY_KEY !== "" && process.env.NEXT_PUBLIC_ALCHEMY_KEY
);
