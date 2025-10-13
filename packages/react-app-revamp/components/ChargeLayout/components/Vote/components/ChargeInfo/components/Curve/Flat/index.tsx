import useContestConfigStore from "@hooks/useContestConfig/store";
import { FC } from "react";
import { formatEther } from "viem";
import { useShallow } from "zustand/shallow";

interface ChargeInfoFlatProps {
  costToVote: string;
}

const ChargeInfoFlat: FC<ChargeInfoFlatProps> = ({ costToVote }) => {
  const chainNativeCurrencySymbol = useContestConfigStore(
    useShallow(state => state.contestConfig.chainNativeCurrencySymbol),
  );

  return (
    <p>
      {costToVote} {chainNativeCurrencySymbol}
    </p>
  );
};

export default ChargeInfoFlat;
