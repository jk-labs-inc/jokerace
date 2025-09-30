import useContestConfigStore from "@hooks/useContestConfig/store";
import { FC } from "react";
import { formatEther } from "viem";
import { useShallow } from "zustand/shallow";

interface ChargeInfoFlatProps {
  costToVote: bigint;
}

const ChargeInfoFlat: FC<ChargeInfoFlatProps> = ({ costToVote }) => {
  const chainNativeCurrencySymbol = useContestConfigStore(
    useShallow(state => state.contestConfig.chainNativeCurrencySymbol),
  );
  const entryChargeFormatted = formatEther(costToVote);

  return (
    <p>
      {entryChargeFormatted} {chainNativeCurrencySymbol}
    </p>
  );
};

export default ChargeInfoFlat;
