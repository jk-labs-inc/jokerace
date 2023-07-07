import ButtonV3 from "@components/UI/ButtonV3";
import { toastLoading } from "@components/UI/Toast";

interface ButtonWithdrawErc20RewardProps {
  queryTokenBalance: any;
  contractWriteWithdraw: any;
  txWithdraw: any;
}

export const ButtonWithdraw = (props: ButtonWithdrawErc20RewardProps) => {
  const { queryTokenBalance, contractWriteWithdraw, txWithdraw } = props;

  return (
    <>
      <ButtonV3
        disabled={contractWriteWithdraw.isLoading || txWithdraw.isLoading}
        size="large"
        color="bg-gradient-distribute"
        onClick={() => {
          toastLoading("withdrawing funds...");
          contractWriteWithdraw.write();
        }}
      >
        Withdraw all ${queryTokenBalance.data?.symbol}
      </ButtonV3>
      <p className="pt-2 text-2xs text-neutral-11 font-bold flex flex-wrap items-start">
        Rewards module {queryTokenBalance.data?.symbol} balance:{" "}
        {parseFloat(queryTokenBalance?.data?.formatted).toFixed(4)}
      </p>
    </>
  );
};

export default ButtonWithdraw;
