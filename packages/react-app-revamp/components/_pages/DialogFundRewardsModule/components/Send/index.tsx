import Button from "@components/UI/Button";
import { Chain } from "@wagmi/core";
import React, { FC } from "react";

interface FundRewardsProps {
  balance: any;
  isLoading: boolean;
  isConnected: boolean;
  chain:
    | (Chain & {
        unsupported?: boolean;
      })
    | undefined;
  data: () => {
    isErc20?: boolean;
    amount?: number;
  } | null;
  isValid: () => boolean;
}

const FundRewards: FC<FundRewardsProps> = ({ isValid, isLoading, isConnected, chain, data, balance }) => {
  const isErc20InsufficientBalance =
    (data()?.amount ?? 0) >
    (balance?.data?.decimals === 18
      ? balance?.data?.formatted
      : 10 ** (18 - balance?.data?.decimals) * balance?.data?.formatted);

  const isButtonDisabled = !isValid() || isLoading || !isConnected || chain?.unsupported || isErc20InsufficientBalance;

  return (
    <Button className="sm:w-fit-content" isLoading={isLoading} disabled={isButtonDisabled} type="submit">
      Send
    </Button>
  );
};

export default FundRewards;
