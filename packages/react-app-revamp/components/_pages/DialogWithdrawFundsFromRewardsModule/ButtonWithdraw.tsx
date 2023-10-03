import ButtonV3, { ButtonSize } from "@components/UI/ButtonV3";
import { toastLoading } from "@components/UI/Toast";
import { useWithdrawRewardStore } from "@hooks/useWithdrawRewards";
import { utils } from "ethers";

interface ButtonWithdrawErc20RewardProps {
  queryTokenBalance: any;
  contractWriteWithdraw: any;
  txWithdraw: any;
}

export const ButtonWithdraw = (props: ButtonWithdrawErc20RewardProps) => {
  const { queryTokenBalance, contractWriteWithdraw, txWithdraw } = props;
  const { setIsLoading } = useWithdrawRewardStore(state => state);

  if (queryTokenBalance.data.value === 0) return null;

  return (
    <li className="flex items-center">
      <section className="flex justify-between w-full md:w-[650px]">
        <p>
          {queryTokenBalance.data?.decimals <= 18
            ? parseFloat(utils.formatEther(queryTokenBalance.data?.value))
            : parseFloat(utils.formatUnits(queryTokenBalance.data?.value, queryTokenBalance.data.decimals))}{" "}
          <span className="uppercase">${queryTokenBalance?.data?.symbol}</span>
        </p>
        <ButtonV3
          isDisabled={txWithdraw.isLoading}
          size={ButtonSize.EXTRA_SMALL}
          colorClass="bg-gradient-withdraw"
          onClick={() => {
            setIsLoading(true);
            toastLoading("withdrawing funds...");
            contractWriteWithdraw.write();
          }}
        >
          Withdraw
        </ButtonV3>
      </section>
    </li>
  );
};

export default ButtonWithdraw;
