"use client";
import { jokeraceTheme } from "@config/rainbowkit";
import { config } from "@config/wagmi";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FC, ReactNode } from "react";
import { State, WagmiProvider } from "wagmi";

type ProvidersProps = {
  children: ReactNode;
  initialState: State | undefined;
};

const Providers: FC<ProvidersProps> = ({ children, initialState }) => {
  const queryClient = new QueryClient();
  return (
    <WagmiProvider config={config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={jokeraceTheme} modalSize="wide">
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default Providers;
