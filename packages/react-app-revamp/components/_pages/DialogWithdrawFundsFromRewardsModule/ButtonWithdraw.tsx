import ButtonV3 from "@components/UI/ButtonV3";
import { toastLoading } from "@components/UI/Toast";
import { utils } from "ethers";

interface ButtonWithdrawErc20RewardProps {
  queryTokenBalance: any;
  contractWriteWithdraw: any;
  txWithdraw: any;
}

export const ButtonWithdraw = (props: ButtonWithdrawErc20RewardProps) => {
  const { queryTokenBalance, contractWriteWithdraw, txWithdraw } = props;

  return (
    <section className="flex justify-between w-[350px] animate-appear">
      <p className="animate-appear">
        {queryTokenBalance.data?.decimals <= 18
          ? parseFloat(utils.formatEther(queryTokenBalance.data?.value))
          : parseFloat(utils.formatUnits(queryTokenBalance.data?.value, queryTokenBalance.data.decimals))}{" "}
        <span className="uppercase">${queryTokenBalance?.data?.symbol}</span>
      </p>
      <ButtonV3
        disabled={contractWriteWithdraw.isLoadi1ng || txWithdraw.isLoading}
        size="extraSmall"
        color="bg-gradient-withdraw"
        onClick={() => {
          toastLoading("withdrawing funds...");
          contractWriteWithdraw.write();
        }}
      >
        Withdraw
      </ButtonV3>
    </section>
  );
};

export default ButtonWithdraw;
