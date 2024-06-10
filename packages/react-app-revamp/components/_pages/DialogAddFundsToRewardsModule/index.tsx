import TokenSearchModal, { TokenSearchModalType } from "@components/TokenSearchModal";
import ButtonV3, { ButtonSize } from "@components/UI/ButtonV3";
import DialogModalV3 from "@components/UI/DialogModalV3";
import MultiStepToast, { ToastMessage } from "@components/UI/MultiStepToast";
import { chains, config } from "@config/wagmi";
import { extractPathSegments } from "@helpers/extractPath";
import { useContestStore } from "@hooks/useContest/store";
import useFundRewardsModule from "@hooks/useFundRewards";
import { FilteredToken } from "@hooks/useTokenList";
import { switchChain } from "@wagmi/core";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { useAccount } from "wagmi";
import AddTokenWidget from "../Contest/Rewards/components/Create/steps/FundPool/components/AddTokenWidget";
import { useFundPoolStore } from "../Contest/Rewards/components/Create/steps/FundPool/store";

interface DialogAddFundsToRewardsModuleProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

export const DialogAddFundsToRewardsModule = (props: DialogAddFundsToRewardsModuleProps) => {
  const { ...dialogProps } = props;
  const pathname = usePathname();
  const { chainName } = extractPathSegments(pathname);
  const { chainId: userChainId } = useAccount();
  const { rewardsModuleAddress } = useContestStore(state => state);
  const selectedChain = chains.find(chain => chain.name.toLowerCase().replace(" ", "") === chainName.toLowerCase());
  const isConnectedOnCorrectChain = selectedChain?.id === userChainId;
  const chainNativeCurrencySymbol = selectedChain?.nativeCurrency.symbol;
  const [isTokenSearchModalOpen, setIsTokenSearchModalOpen] = useState(false);
  const [selectedToken, setSelectedToken] = useState<FilteredToken | null>(null);
  const { tokens, setTokens } = useFundPoolStore(state => state);
  const { sendFundsToRewardsModuleV3 } = useFundRewardsModule();
  const toastIdRef = useRef<string | number | null>(null);

  const handleSelectedToken = (token: FilteredToken) => {
    if (token.symbol === chainNativeCurrencySymbol) {
      setSelectedToken(null);
      setIsTokenSearchModalOpen(false);
      return;
    }

    setSelectedToken(token);
    setIsTokenSearchModalOpen(false);
  };

  const fundPool = async () => {
    setTokens([]);
    const populatedRewardsPromises = tokens.map(async token => {
      return {
        ...token,
        tokenAddress: token.address,
        rewardsContractAddress: rewardsModuleAddress,
        amount: token.amount,
        decimals: token.decimals,
      };
    });

    const populatedRewards = (await Promise.all(populatedRewardsPromises)).filter(Boolean);
    const promises = sendFundsToRewardsModuleV3(populatedRewards);

    // Don't proceed if promises is empty
    if (!promises || promises.length === 0) {
      return;
    }

    const statusMessages: ToastMessage[] = populatedRewards.map((reward, index) => ({
      message: `Funding reward ${index + 1}/${populatedRewards.length}...`,
      successMessage: `Funded reward ${index + 1}!`,
      status: "pending" as "pending",
    }));

    toastIdRef.current = toast(
      <MultiStepToast
        messages={statusMessages}
        promises={promises}
        toastIdRef={toastIdRef}
        completionMessage="All rewards have been funded!"
      />,
      {
        position: "bottom-center",
        bodyClassName: "text-[16px] font-bold",
        autoClose: false,
        icon: false,
      },
    );
  };

  const onFundPool = () => {
    if (!isConnectedOnCorrectChain) {
      if (!selectedChain) return;
      switchChain(config, { chainId: selectedChain.id });
    }

    fundPool();
  };

  return (
    <DialogModalV3
      title="add rewards to module"
      {...dialogProps}
      className="w-full md:w-auto"
      closeButtonSize={{
        width: 24,
        height: 24,
      }}
    >
      <div className="flex flex-col gap-12 items-center mt-8 animate-appear">
        <AddTokenWidget
          selectedToken={selectedToken}
          selectedChain={selectedChain}
          isTokenSearchModalOpen={isTokenSearchModalOpen}
          onOpenTokenSearchModal={setIsTokenSearchModalOpen}
          addTokenButtonPlacement="left"
        />

        <ButtonV3
          colorClass="text-[20px] bg-gradient-distribute rounded-[40px] font-bold text-true-black hover:scale-105 transition-transform duration-200 ease-in-out"
          size={ButtonSize.EXTRA_LARGE}
          isDisabled={!tokens.length}
          onClick={onFundPool}
        >
          submit funds
        </ButtonV3>
      </div>

      <TokenSearchModal
        type={TokenSearchModalType.ERC20}
        chains={[{ label: chainName, value: chainName }]}
        isOpen={isTokenSearchModalOpen}
        onClose={() => setIsTokenSearchModalOpen(false)}
        onSelectToken={handleSelectedToken}
        hideChains
      />
    </DialogModalV3>
  );
};

export default DialogAddFundsToRewardsModule;
