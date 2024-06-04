/* eslint-disable @next/next/no-img-element */
import TokenSearchModal, { TokenSearchModalType } from "@components/TokenSearchModal";
import { chains } from "@config/wagmi";
import { extractPathSegments } from "@helpers/extractPath";
import { FilteredToken } from "@hooks/useTokenList";
import { usePathname } from "next/navigation";
import { useState } from "react";
import CreateRewardsNavigation from "../../components/Buttons/Navigation";
import { useCreateRewardsStore } from "../../store";
import AddTokenWidget from "./components/AddTokenWidget";

const CreateRewardsFundPool = () => {
  const pathname = usePathname();
  const { chainName } = extractPathSegments(pathname);
  const selectedChain = chains.find(chain => chain.name.toLowerCase().replace(" ", "") === chainName.toLowerCase());
  const chainNativeCurrencySymbol = selectedChain?.nativeCurrency.symbol;
  const { currentStep } = useCreateRewardsStore(state => state);
  const [isTokenSearchModalOpen, setIsTokenSearchModalOpen] = useState(false);
  const [selectedToken, setSelectedToken] = useState<FilteredToken | null>(null);

  const handleSelectedToken = (token: FilteredToken) => {
    if (token.symbol === chainNativeCurrencySymbol) {
      setSelectedToken(null);
      setIsTokenSearchModalOpen(false);
      return;
    }

    setSelectedToken(token);
    setIsTokenSearchModalOpen(false);
  };

  return (
    <div className="flex flex-col gap-16 animate-swingInLeft">
      <div className="flex flex-col gap-4">
        <p className="text-[24px] font-bold text-true-white">time to have fun(ds)</p>
        <p className="text-[16px] text-neutral-11">now let’s fund your rewards pool.</p>
        <p className="text-[16px] text-neutral-11">just leave blank if you’d rather add funds later.</p>
      </div>

      <AddTokenWidget
        selectedToken={selectedToken}
        selectedChain={selectedChain}
        isTokenSearchModalOpen={isTokenSearchModalOpen}
        onOpenTokenSearchModal={setIsTokenSearchModalOpen}
      />

      <CreateRewardsNavigation step={currentStep} />
      <TokenSearchModal
        type={TokenSearchModalType.ERC20}
        chains={[{ label: chainName, value: chainName }]}
        isOpen={isTokenSearchModalOpen}
        onClose={() => setIsTokenSearchModalOpen(false)}
        onSelectToken={handleSelectedToken}
        hideChains
      />
    </div>
  );
};

export default CreateRewardsFundPool;
