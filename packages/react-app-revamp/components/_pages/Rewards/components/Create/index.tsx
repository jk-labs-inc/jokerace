import { useDeployRewardsPool } from "@hooks/useDeployRewards";
import { useDeployRewardsStore } from "@hooks/useDeployRewards/store";
import CreateRewardsPoolSubmitButton from "./components/Buttons/Submit";
import CreateRewardsPoolRecipients from "./components/Recipients";

const CreateRewardsPool = () => {
  const { setCancel } = useDeployRewardsStore(state => state);

  const { deployRewardsPool } = useDeployRewardsPool();
  const onSubmitRewardsPool = () => {
    deployRewardsPool();
  };

  const onCancelCreateRewardsPool = () => {
    setCancel(true);
  };

  return (
    <div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <p className="text-[24px] font-bold text-primary-10">now let’s add rewards </p>
          <p className="-mt-[5px]">👉👈🤑</p>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-[16px]">
            a rewards pool incentivizes players, compensates winners, and is <br /> open for{" "}
            <span className="italic">anyone</span> to fund.
          </p>
          <p className="text-[16px]">
            it’s up to you whether you want to add one—but it’s easier to attract <br /> and retain a community if you
            do.{" "}
          </p>
        </div>
      </div>
      <div className="mt-12">
        <p className="text-[24px] font-bold text-primary-10">how should we distribute the rewards pool?</p>
      </div>
      <div className="mt-8">
        <CreateRewardsPoolRecipients />
      </div>

      <div className="mt-6">
        <CreateRewardsPoolSubmitButton onClick={onSubmitRewardsPool} onCancel={onCancelCreateRewardsPool} />
      </div>
    </div>
  );
};

export default CreateRewardsPool;
