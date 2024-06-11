import ButtonV3, { ButtonSize } from "@components/UI/ButtonV3";
import { formatBalance } from "@helpers/formatBalance";
import { formatUnits } from "viem";

interface ButtonWithdrawErc20RewardProps {
  token: {
    balance: string;
    symbol: string;
  };
  handleWithdraw: () => Promise<void>;
  isLoading: boolean;
}

export const ButtonWithdraw = (props: ButtonWithdrawErc20RewardProps) => {
  const { token, handleWithdraw, isLoading } = props;

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
          onClick={handleWithdraw}
        >
          Withdraw
        </ButtonV3>
      </section>
    </li>
  );
};

export default ButtonWithdraw;
