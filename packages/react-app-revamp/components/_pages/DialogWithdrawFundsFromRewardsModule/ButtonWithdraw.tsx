import ButtonV3, { ButtonSize } from "@components/UI/ButtonV3";
import { chains, config } from "@config/wagmi";
import { extractPathSegments } from "@helpers/extractPath";
import { formatBalance } from "@helpers/formatBalance";
import { useWithdrawReward, useWithdrawRewardStore } from "@hooks/useWithdrawRewards";
import { switchChain } from "@wagmi/core";
import { usePathname } from "next/navigation";
import { Abi } from "viem";
import { useAccount } from "wagmi";
import { ERC20Token } from "../RewardsDistributionTable/components";

interface ButtonWithdrawErc20RewardProps {
  token: ERC20Token;
  rewardsModuleAddress: string;
  rewardsAbi: Abi;
}

export const ButtonWithdraw = (props: ButtonWithdrawErc20RewardProps) => {
  const { token, rewardsModuleAddress: contractRewardsModuleAddress, rewardsAbi: abiRewardsModule } = props;
  const pathname = usePathname();
  const { chainId: userChainId } = useAccount();
  const { chainName } = extractPathSegments(pathname);
  const chainId = chains.find(chain => chain.name.toLowerCase().replace(" ", "") === chainName.toLowerCase())?.id;
  const isConnectedOnCorrectChain = chainId === userChainId;
  const { handleWithdraw } = useWithdrawReward(
    contractRewardsModuleAddress,
    abiRewardsModule,
    token.contractAddress,
    token.tokenBalance,
  );
  const { isLoading } = useWithdrawRewardStore(state => state);

  const onHandleWithdraw = () => {
    if (!chainId) return;

    if (!isConnectedOnCorrectChain) {
      switchChain(config, { chainId });
    }

    handleWithdraw();
  };

  return (
    <li className="flex items-center">
      <section className="flex justify-between w-full">
        <p>
          {formatBalance(token.tokenBalance)} <span className="uppercase">${token.tokenSymbol}</span>
        </p>
        <ButtonV3
          isDisabled={isLoading}
          size={ButtonSize.EXTRA_SMALL}
          colorClass="bg-gradient-withdraw"
          onClick={onHandleWithdraw}
        >
          Withdraw
        </ButtonV3>
      </section>
    </li>
  );
};

export default ButtonWithdraw;
