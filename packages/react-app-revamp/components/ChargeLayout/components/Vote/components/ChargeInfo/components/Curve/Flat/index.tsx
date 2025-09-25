import { useContestStore } from "@hooks/useContest/store";
import useContestConfigStore from "@hooks/useContestConfig/store";
import { formatEther } from "viem";
import { useShallow } from "zustand/shallow";

const ChargeInfoFlat = () => {
  const chainNativeCurrencySymbol = useContestConfigStore(
    useShallow(state => state.contestConfig.chainNativeCurrencySymbol),
  );
  const { charge } = useContestStore(
    useShallow(state => ({
      charge: state.charge,
    })),
  );
  const entryChargeFormatted = formatEther(BigInt(charge.type.costToVote));

  return (
    <p>
      {entryChargeFormatted} {chainNativeCurrencySymbol}
    </p>
  );
};

export default ChargeInfoFlat;
