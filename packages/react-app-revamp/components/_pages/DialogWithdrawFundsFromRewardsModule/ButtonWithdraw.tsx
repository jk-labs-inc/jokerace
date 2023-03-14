import Button from "@components/UI/Button";
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
  const { contestAuthorEthereumAddress } = useContestStore(state => state);

  return (
    <>
      <Button
        className="w-full xs:w-auto"
        intent={
          //@ts-ignore
          parseFloat(queryTokenBalance?.data?.formatted).toFixed(4) <= 0.0001 ? "ghost-primary" : "primary-outline"
        }
        onClick={() => contractWriteWithdraw.write()}
        isLoading={contractWriteWithdraw.isLoading || txWithdraw.isLoading}
        disabled={
          contestAuthorEthereumAddress !== accountData?.address ||
          //@ts-ignore
          parseFloat(queryTokenBalance?.data?.formatted).toFixed(4) <= 0.0001 ||
          txWithdraw.isLoading ||
          contractWriteWithdraw.isLoading ||
          contractWriteWithdraw.isSuccess ||
          txWithdraw.isSuccess
        }
      >
        {contractWriteWithdraw.isError || txWithdraw.isError
          ? "Try again"
          : txWithdraw.isSuccess
          ? `${queryTokenBalance?.data?.symbol} withdrawn successfully`
          : contractWriteWithdraw.isLoading || txWithdraw.isLoading
          ? "Withdrawing..."
          : `Withdraw all ${queryTokenBalance.data?.symbol}`}
      </Button>
      <p className="pt-2 text-2xs text-neutral-11 font-bold flex flex-wrap items-center">
        Rewards module {queryTokenBalance.data?.symbol} balance:{" "}
        {parseFloat(queryTokenBalance?.data?.formatted).toFixed(4)}
      </p>
    </>
  );
};

export default ButtonWithdraw;
