import ButtonV3, { ButtonSize } from "@components/UI/ButtonV3";
import { chains, config } from "@config/wagmi";
import { extractPathSegments } from "@helpers/extractPath";
import { formatBalance } from "@helpers/formatBalance";
import { switchChain } from "@wagmi/core";
import { usePathname } from "next/navigation";
import { formatUnits } from "viem";
import { useAccount } from "wagmi";

interface ButtonWithdrawErc20RewardProps {
  token: {
    balance: string;
    symbol: string;
  };
  handleWithdraw: () => Promise<void>;
  isLoading: boolean;
}

export const ButtonWithdraw = (props: ButtonWithdrawErc20RewardProps) => {
  const pathname = usePathname();
  const { chainId: userChainId } = useAccount();
  const { chainName } = extractPathSegments(pathname);
  const chainId = chains.find(chain => chain.name.toLowerCase().replace(" ", "") === chainName.toLowerCase())?.id;
  const { token, handleWithdraw, isLoading } = props;
  const isConnectedOnCorrectChain = chainId === userChainId;

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
          {formatBalance(token.balance)} <span className="uppercase">${token.symbol}</span>
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
