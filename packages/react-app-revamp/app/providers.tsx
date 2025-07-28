"use client";
import { config } from "@config/wagmi";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FC, ReactNode } from "react";
import { WagmiProvider, cookieToInitialState } from "wagmi";

type ProvidersProps = {
  cookie: string;
  children: ReactNode;
};

const Providers: FC<ProvidersProps> = ({ cookie, children }) => {
  const initialState = cookieToInitialState(config, cookie);

  const queryClient = new QueryClient();
  return (
    <WagmiProvider config={config} {...(initialState ? { initialState } : {})}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme()} modalSize="wide">
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default Providers;
