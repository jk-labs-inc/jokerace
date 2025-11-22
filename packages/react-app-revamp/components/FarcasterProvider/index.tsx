"use client";

import { sdk } from "@farcaster/miniapp-sdk";
import { createContext, FC, ReactNode, useContext, useEffect, useState } from "react";

interface FarcasterUser {
  fid: number;
  username: string;
  displayName: string;
  pfpUrl: string;
}

interface FarcasterContextType {
  user: FarcasterUser | null;
  isReady: boolean;
  isMiniApp: boolean;
}

const FarcasterContext = createContext<FarcasterContextType>({
  user: null,
  isReady: false,
  isMiniApp: false,
});

export const useFarcaster = () => useContext(FarcasterContext);

interface FarcasterProviderProps {
  children: ReactNode;
}

export const FarcasterProvider: FC<FarcasterProviderProps> = ({ children }) => {
  const [user, setUser] = useState<FarcasterUser | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isMiniApp, setIsMiniApp] = useState(false);

  useEffect(() => {
    const initFarcaster = async () => {
      try {
        // Check if running in a Farcaster Mini App context
        const url = new URL(window.location.href);
        const isMini = url.searchParams.get("miniApp") === "true" ||
                       window.location.pathname.includes("/mini");

        setIsMiniApp(isMini);

        if (isMini) {
          // Initialize Farcaster SDK
          await sdk.actions.ready();

          // Get user context from SDK
          const context = sdk.context;
          if (context?.user) {
            setUser({
              fid: context.user.fid,
              username: context.user.username || "",
              displayName: context.user.displayName || "",
              pfpUrl: context.user.pfpUrl || "",
            });
          }
        }

        setIsReady(true);
      } catch (error) {
        console.error("Failed to initialize Farcaster SDK:", error);
        setIsReady(true);
      }
    };

    initFarcaster();
  }, []);

  return (
    <FarcasterContext.Provider value={{ user, isReady, isMiniApp }}>
      {children}
    </FarcasterContext.Provider>
  );
};

export default FarcasterProvider;
