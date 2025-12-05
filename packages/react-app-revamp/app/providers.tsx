import { config } from "@config/wagmi";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ClientOnly } from "@tanstack/react-router";
import { FC, ReactNode } from "react";
import { WagmiProvider } from "wagmi";

type ProvidersProps = {
  children: ReactNode;
};

const queryClient = new QueryClient();

const Providers: FC<ProvidersProps> = ({ children }) => {
  return (
    <ClientOnly fallback={null}>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider theme={darkTheme()} modalSize="wide">
            {/* // TODO: toast container should actually be a portal, since it doesn't render over modal */}
            {children}
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </ClientOnly>
  );
};

export default Providers;
