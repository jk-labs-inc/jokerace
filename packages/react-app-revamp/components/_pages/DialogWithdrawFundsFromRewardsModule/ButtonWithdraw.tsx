import Button from "@components/UI/Button";
import ButtonV3 from "@components/UI/ButtonV3";
import { ofacAddresses } from "@config/ofac-addresses/ofac-addresses";
import { useContestStore } from "@hooks/useContest/store";
import { useAccount } from "wagmi";

interface ButtonWithdrawErc20RewardProps {
  queryTokenBalance: any;
  contractWriteWithdraw: any;
  txWithdraw: any;
}

export const ButtonWithdraw = (props: ButtonWithdrawErc20RewardProps) => {
  const { queryTokenBalance, contractWriteWithdraw, txWithdraw } = props;
  const accountData = useAccount({
    onConnect({ address }) {
      if (address != undefined && ofacAddresses.includes(address?.toString())) {
        location.href = "https://www.google.com/search?q=what+are+ofac+sanctions";
      }
    },
  });

  return (
    <>
      <ButtonV3 size="large" color="bg-gradient-distribute" onClick={() => contractWriteWithdraw.write()}>
        {contractWriteWithdraw.isError || txWithdraw.isError
          ? "Try again"
          : txWithdraw.isSuccess
          ? `${queryTokenBalance?.data?.symbol} withdrawn successfully`
          : contractWriteWithdraw.isLoading || txWithdraw.isLoading
          ? "Withdrawing..."
          : `Withdraw all ${queryTokenBalance.data?.symbol}`}
      </ButtonV3>
      <p className="pt-2 text-2xs text-neutral-11 font-bold flex flex-wrap items-start">
        Rewards module {queryTokenBalance.data?.symbol} balance:{" "}
        {parseFloat(queryTokenBalance?.data?.formatted).toFixed(4)}
      </p>
    </>
  );
};

export default ButtonWithdraw;
