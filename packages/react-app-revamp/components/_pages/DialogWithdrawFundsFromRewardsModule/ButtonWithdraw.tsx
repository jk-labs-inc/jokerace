import ButtonV3, { ButtonSize } from "@components/UI/ButtonV3";
import { chains, config } from "@config/wagmi";
import { extractPathSegments } from "@helpers/extractPath";
import { formatBalance } from "@helpers/formatBalance";
import { transform } from "@helpers/transform";
import { TokenInfo } from "@hooks/useReleasableRewards";
import { useWithdrawReward } from "@hooks/useWithdrawRewards";
import { switchChain } from "@wagmi/core";
import { usePathname } from "next/navigation";
import { Abi } from "viem";
import { useAccount } from "wagmi";

interface ButtonWithdrawErc20RewardProps {
  token: TokenInfo;
  rewardsModuleAddress: string;
  rewardsAbi: Abi;
  onWithdrawStart?: (tokenAddress: string) => void;
  onWithdrawSuccess?: (tokenAddress: string) => void;
  onWithdrawError?: (tokenAddress: string) => void;
}

export const ButtonWithdraw = (props: ButtonWithdrawErc20RewardProps) => {
  const {
    token,
    rewardsModuleAddress: contractRewardsModuleAddress,
    rewardsAbi: abiRewardsModule,
    onWithdrawStart,
    onWithdrawSuccess,
    onWithdrawError,
  } = props;

  const pathname = usePathname();
  const { chainId: userChainId } = useAccount();
  const { chainName } = extractPathSegments(pathname);
  const chainId = chains.find(chain => chain.name.toLowerCase().replace(" ", "") === chainName.toLowerCase())?.id;
  const isConnectedOnCorrectChain = chainId === userChainId;
  const { handleWithdraw, isLoading } = useWithdrawReward(
    contractRewardsModuleAddress,
    abiRewardsModule,
    token.address,
    token.amount ?? 0n,
    token.decimals ?? 18,
    () => onWithdrawStart?.(token.address),
    () => onWithdrawSuccess?.(token.address),
    () => onWithdrawError?.(token.address),
  );

  const formattedAmount = formatBalance(transform(token.amount ?? 0n, token.address, token.decimals ?? 18).toString());

  const onHandleWithdraw = async () => {
    if (!chainId) return;

    if (!isConnectedOnCorrectChain) {
      await switchChain(config, { chainId });
    }

    handleWithdraw();
  };

  return (
    <li className="flex items-center">
      <section className="flex justify-between w-full">
        <p>
          {formattedAmount} <span className="uppercase">${token.symbol}</span>
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
