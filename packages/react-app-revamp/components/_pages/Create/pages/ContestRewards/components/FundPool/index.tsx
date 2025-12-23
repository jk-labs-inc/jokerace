import CreateSwitch from "@components/_pages/Create/components/Switch";
import { useDeployContestStore } from "@hooks/useDeployContest/store";
import { RainbowKitChain } from "@rainbow-me/rainbowkit/dist/components/RainbowKitProvider/RainbowKitChainContext";
import { useAccount } from "wagmi";
import { useShallow } from "zustand/shallow";
import TokenWidgets from "./components/TokenWidgets";

const CreateRewardsFundPool = () => {
  const { chain } = useAccount();
  const { addFundsToRewards, setAddFundsToRewards } = useDeployContestStore(
    useShallow(state => ({
      addFundsToRewards: state.addFundsToRewards,
      setAddFundsToRewards: state.setAddFundsToRewards,
    })),
  );

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-4 text-[16px] text-neutral-11">
        <CreateSwitch checked={addFundsToRewards} onChange={setAddFundsToRewards} />
        i’ll seed rewards (recommended: ~$100)
      </div>

      {addFundsToRewards && (
        <div className="flex flex-col gap-8">
          <TokenWidgets chain={chain as RainbowKitChain} />
        </div>
      )}
    </div>
  );
};

export default CreateRewardsFundPool;
