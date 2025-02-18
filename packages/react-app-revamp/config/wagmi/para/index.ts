import { GetParaOpts, getParaWallet, OAuthMethod } from "@getpara/rainbowkit-wallet";
import { Environment } from "@getpara/web-sdk";

const PARA_API_KEY = process.env.NEXT_PUBLIC_PARA_API_KEY as string;
const PARA_ENVIRONMENT =
  process.env.NEXT_PUBLIC_PARA_ENVIRONMENT === "development" ? Environment.BETA : Environment.PRODUCTION;

export const isParaWalletConfigured = !!PARA_API_KEY && !!PARA_ENVIRONMENT;

export const paraWalletOpts: GetParaOpts = {
  para: {
    environment: PARA_ENVIRONMENT,
    apiKey: PARA_API_KEY,
  },
  appName: "JokeRace",
  oAuthMethods: [OAuthMethod.GOOGLE, OAuthMethod.TWITTER, OAuthMethod.DISCORD, OAuthMethod.TELEGRAM],
  theme: {
    foregroundColor: "#2D3648",
    backgroundColor: "#FFFFFF",
    accentColor: "#0066CC",
    darkForegroundColor: "#E8EBF2",
    darkBackgroundColor: "#1A1F2B",
    darkAccentColor: "#4D9FFF",
    mode: "dark",
    borderRadius: "none",
    font: "Inter",
  },
};

export const paraWallet = getParaWallet(paraWalletOpts);
