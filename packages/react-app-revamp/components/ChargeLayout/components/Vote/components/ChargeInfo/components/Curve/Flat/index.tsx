import { useContestStore } from "@hooks/useContest/store";
import { formatEther } from "viem";
import { useShallow } from "zustand/shallow";

const ChargeInfoFlat = () => {
  const { charge, contestInfoData } = useContestStore(
    useShallow(state => ({
      charge: state.charge,
      contestInfoData: state.contestInfoData,
    })),
  );
  const entryChargeFormatted = formatEther(BigInt(charge.type.costToVote));

  return (
    <p>
      {entryChargeFormatted} {contestInfoData.contestChainNativeCurrencySymbol}
    </p>
  );
};

export default ChargeInfoFlat;
