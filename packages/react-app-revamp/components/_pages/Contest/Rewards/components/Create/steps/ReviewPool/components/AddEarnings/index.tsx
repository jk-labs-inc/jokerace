import { Switch } from "@headlessui/react";
import { useCreateRewardsStore } from "../../../../store";

const CreateRewardsAddEarningsToggle = () => {
  const { addEarningsToRewards, setAddEarningsToRewards } = useCreateRewardsStore(state => state);

  return (
    <div className="flex gap-4 items-center">
      <Switch
        checked={addEarningsToRewards}
        onChange={setAddEarningsToRewards}
        className="group relative flex w-12 h-6 cursor-pointer rounded-full bg-neutral-10 transition-colors duration-200 ease-in-out focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white data-[checked]:bg-secondary-11"
      >
        <span
          aria-hidden="true"
          className="pointer-events-none inline-block size-6 translate-x-0 rounded-full bg-neutral-11 ring-0 shadow-lg transition duration-200 ease-in-out group-data-[checked]:translate-x-7"
        />
      </Switch>
      <p className="text-[16px] text-neutral-11">send all my earnings to the rewards pool.</p>
    </div>
  );
};

export default CreateRewardsAddEarningsToggle;
