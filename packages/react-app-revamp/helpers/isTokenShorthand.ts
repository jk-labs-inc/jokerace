import { TokenConfig } from "./tokens";

export const isTokenShorthand = (allTokens: TokenConfig[], value: string) => {
  const tokenShorthands = allTokens.map((token: { symbol: string }) => token.symbol);
  const normalizedValue = value.replace("$", ""); // Remove $ sign from the value

  return tokenShorthands?.includes(normalizedValue);
};
