import { Switch } from "@headlessui/react";
import { useContestStore } from "@hooks/useContest/store";
import { useMediaQuery } from "react-responsive";
import { useCreateRewardsStore } from "../../../../store";
import { useFundPoolStore } from "../../../FundPool/store";
import { useShallow } from "zustand/shallow";

const CreateRewardsAddFundsToggle = () => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const anyoneCanVote = useContestStore(useShallow(state => state.anyoneCanVote));
  const { addFundsToRewards, setAddFundsToRewards } = useCreateRewardsStore(state => state);
  const { setTokenWidgets } = useFundPoolStore(state => state);
  const toggleLabel = isMobile ? "i want to fund the rewards pool" : "i want to personally fund the rewards pool";

  const onAddFundsChange = (checked: boolean) => {
    if (!checked) {
      setTokenWidgets([]);
    }
    setAddFundsToRewards?.(checked);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4 items-center">
        <Switch
          checked={addFundsToRewards}
          onChange={onAddFundsChange}
          className="group relative flex w-12 h-6 cursor-pointer rounded-full bg-neutral-10 transition-colors duration-200 ease-in-out focus:outline-none data-focus:outline-1 data-[focus]:outline-white data-checked:bg-secondary-11"
        >
          <span
            aria-hidden="true"
            className="pointer-events-none inline-block size-6 translate-x-0 rounded-full bg-neutral-11 ring-0 shadow-lg transition duration-200 ease-in-out group-data-checked:translate-x-7"
          />
        </Switch>
        <p className="text-[16px] text-neutral-11">{toggleLabel}</p>
      </div>
      {addFundsToRewards && anyoneCanVote && (
        <p className="text-[14px] text-neutral-10">
          note: since this contest lets anyone pay per vote, <br />
          people may buy votes to try to claim the rewards
        </p>
      )}
    </div>
  );
};

export default CreateRewardsAddFundsToggle;
