import { FC, useEffect } from "react";
import { v4 as uuidV4 } from "uuid";
import { Chain } from "viem";
import { useShallow } from "zustand/shallow";
import { useFundPoolStore } from "../../store";
import { generateNativeToken } from "../../utils";
import TokenWidget from "./components";
import { RainbowKitChain } from "@rainbow-me/rainbowkit/dist/components/RainbowKitProvider/RainbowKitChainContext";

interface TokenWidgetsProps {
  chain: RainbowKitChain;
}

const TokenWidgets: FC<TokenWidgetsProps> = ({ chain }) => {
  const { tokenWidgets, setTokenWidgets } = useFundPoolStore(
    useShallow(state => ({
      tokenWidgets: state.tokenWidgets,
      setTokenWidgets: state.setTokenWidgets,
    })),
  );

  useEffect(() => {
    if (tokenWidgets.length === 0) {
      setTokenWidgets([
        {
          ...generateNativeToken(chain?.nativeCurrency, chain?.nativeCurrency?.symbol),
          amount: "0",
          id: uuidV4(),
        },
      ]);
    }
  }, [chain, tokenWidgets.length, setTokenWidgets]);

  const handleAddMoreTokens = () => {
    setTokenWidgets([
      ...tokenWidgets,
      {
        ...generateNativeToken(chain?.nativeCurrency, chain?.nativeCurrency?.symbol),
        amount: "0",
        id: uuidV4(),
      },
    ]);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-8">
        {tokenWidgets.map((widget, index) => (
          <TokenWidget key={index} tokenWidget={widget} index={index} chain={chain} />
        ))}
      </div>
      <button
        className="text-positive-11 text-[16px] self-start pl-6 hover:text-positive-9 transition-colors duration-300 ease-in-out"
        onClick={handleAddMoreTokens}
      >
        + add more tokens
      </button>
    </div>
  );
};

export default TokenWidgets;
