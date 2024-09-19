import { chains } from "@config/wagmi";
import { extractPathSegments } from "@helpers/extractPath";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { v4 as uuidV4 } from "uuid";
import { useShallow } from "zustand/react/shallow";
import { useFundPoolStore } from "../../store";
import { generateNativeToken } from "../../utils";
import TokenWidget from "./components";

const TokenWidgets = () => {
  const pathname = usePathname();
  const { chainName } = extractPathSegments(pathname);
  const selectedChain = chains.find(chain => chain.name.toLowerCase().replace(" ", "") === chainName.toLowerCase());
  const chainId = selectedChain?.id;
  const nativeCurrency = selectedChain?.nativeCurrency;
  const chainNativeCurrencySymbol = nativeCurrency?.symbol;
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
          ...generateNativeToken(nativeCurrency, chainNativeCurrencySymbol),
          amount: "0",
          id: uuidV4(),
        },
      ]);
    }
  }, [chainId, tokenWidgets.length, setTokenWidgets]);

  const handleAddMoreTokens = () => {
    setTokenWidgets([
      ...tokenWidgets,
      {
        ...generateNativeToken(nativeCurrency, chainNativeCurrencySymbol),
        amount: "0",
        id: uuidV4(),
      },
    ]);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-8">
        {tokenWidgets.map((widget, index) => (
          <TokenWidget key={index} tokenWidget={widget} index={index} />
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
