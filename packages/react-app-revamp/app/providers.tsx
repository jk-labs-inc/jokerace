"use client";

import { chains, transports } from "@config/wagmi";
import ParaWeb, { Environment, ParaProvider, TExternalWallet } from "@getpara/react-sdk";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FC, ReactNode } from "react";
import { cookieStorage, createStorage } from "wagmi";

type ProvidersProps = {
  children: ReactNode;
};

const PARA_API_KEY = process.env.NEXT_PUBLIC_PARA_API_KEY as string;
const PARA_ENVIRONMENT =
  process.env.NEXT_PUBLIC_APP_ENVIRONMENT === "development" ? Environment.BETA : Environment.PRODUCTION;

const para = new ParaWeb(PARA_ENVIRONMENT, PARA_API_KEY);

const queryClient = new QueryClient();

const EXTERNAL_WALLETS: TExternalWallet[] = [
  "METAMASK",
  "WALLETCONNECT",
  "COINBASE",
  "RAINBOW",
  "OKX",
  "RABBY",
  "PHANTOM",
  "ZERION",
  "SAFE",
];

const Providers: FC<ProvidersProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ParaProvider
        paraClientConfig={para}
        config={{
          appName: "JokeRace",
        }}
        paraModalConfig={{
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
          oAuthMethods: ["GOOGLE", "TWITTER", "DISCORD", "TELEGRAM"],
        }}
        externalWalletConfig={{
          wallets: EXTERNAL_WALLETS,
          evmConnector: {
            config: {
              chains: chains,
              transports: transports,
            },
          },
          walletConnect: {
            projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID as string,
          },
        }}
      >
        {children}
      </ParaProvider>
    </QueryClientProvider>
  );
};

export default Providers;
