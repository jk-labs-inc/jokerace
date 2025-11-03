import { useContestStore } from "@hooks/useContest/store";
import { useAccount } from "wagmi";
import { useShallow } from "zustand/shallow";
import ContestDeployRewardsUnderConstruction from "./components/UnderConstruction";

const ContestDeployRewards = () => {
  const { address: connectedAccountAddress } = useAccount();
  const contestAuthorEthereumAddress = useContestStore(useShallow(state => state.contestAuthorEthereumAddress));
  const isCreator = connectedAccountAddress === contestAuthorEthereumAddress;

  if (!isCreator) {
    return (
      <div className="mt-6 md:mt-12">
        <ContestDeployRewardsUnderConstruction />
      </div>
    );
  }

  return (
    <div className="mt-6 md:mt-12">
      <h1>Deploy Rewards</h1>
    </div>
  );
};

export default ContestDeployRewards;
