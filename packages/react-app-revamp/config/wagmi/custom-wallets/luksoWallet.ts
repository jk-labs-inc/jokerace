import { InjectedConnector } from "@wagmi/core";
import { luksoTestnet } from "../custom-chains/luksoTestnet";
import { lukso as luksoMainnet } from "../custom-chains/lukso";

export const luksoWallet = () => ({
  id: "Universal Profile",
  name: "Universal Profile",
  iconUrl: "https://wallet.universalprofile.cloud/assets/images/up-logo.png",
  iconBackground: "#646eb5",
  downloadUrls: {
    chrome: "https://chrome.google.com/webstore/detail/universal-profiles/abpickdkkbnbcoepogfhkhennhfhehfn?hl=en",
  },
  createConnector: () => {
    const connector = new InjectedConnector({
      chains: [luksoMainnet, luksoTestnet],
      options: {
        //@ts-ignore
        getProvider: () => (typeof window !== "undefined" && window.lukso ? window.lukso : undefined),
        name: "Universal Profile",
      },
    });

    return {
      connector,
    };
  },
});
