import { Switch } from "@headlessui/react";
import { useCreateRewardsStore } from "../../../../store";
import { useFundPoolStore } from "../../../FundPool/store";
import { useMediaQuery } from "react-responsive";

const CreateRewardsAddFundsToggle = () => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
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
    <div className="flex gap-4 items-center">
      <Switch
        checked={addFundsToRewards}
        onChange={onAddFundsChange}
        className="group relative flex w-12 h-6 cursor-pointer rounded-full bg-neutral-10 transition-colors duration-200 ease-in-out focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white data-[checked]:bg-secondary-11"
      >
        <span
          aria-hidden="true"
          className="pointer-events-none inline-block size-6 translate-x-0 rounded-full bg-neutral-11 ring-0 shadow-lg transition duration-200 ease-in-out group-data-[checked]:translate-x-7"
        />
      </Switch>
      <p className="text-[16px] text-neutral-11">{toggleLabel}</p>
    </div>
  );
};

export default CreateRewardsAddFundsToggle;
