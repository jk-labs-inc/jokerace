import { Switch } from "@headlessui/react";
import { useCreateRewardsStore } from "../../../../store";
import { useMediaQuery } from "react-responsive";
import { FC } from "react";
import { Tooltip } from "react-tooltip";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { PERCENTAGE_TO_CREATOR_DEFAULT } from "constants/monetization";

interface CreateRewardsAddEarningsToggleProps {
  percentageToCreator: number;
}

const CreateRewardsAddEarningsToggle: FC<CreateRewardsAddEarningsToggleProps> = ({ percentageToCreator }) => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const { addEarningsToRewards, setAddEarningsToRewards } = useCreateRewardsStore(state => state);
  const tooltipId = "earnings-tooltip";
  const toggleLabel = isMobile
    ? `send ${percentageToCreator}% of charges to rewards pool`
    : `send ${percentageToCreator}% of all charges to the rewards pool`;

  return (
    <div className="flex gap-4 items-center">
      <Switch
        checked={addEarningsToRewards}
        onChange={setAddEarningsToRewards}
        className="group relative flex w-12 h-6 cursor-pointer rounded-full bg-neutral-10 transition-colors duration-200 ease-in-out focus:outline-none data-focus:outline-1 data-[focus]:outline-white data-checked:bg-secondary-11"
      >
        <span
          aria-hidden="true"
          className="pointer-events-none inline-block size-6 translate-x-0 rounded-full bg-neutral-11 ring-0 shadow-lg transition duration-200 ease-in-out group-data-checked:translate-x-7"
        />
      </Switch>
      <div className="flex items-center gap-2">
        <p className="text-[16px] text-neutral-11">{toggleLabel}</p>
        <InformationCircleIcon
          width={24}
          height={24}
          className="text-neutral-10"
          data-tooltip-id={tooltipId}
          data-tooltip-place="right"
        />
        <Tooltip
          id={tooltipId}
          className="max-w-56 p-2 opacity-100! z-50! border border-transparent rounded-lg earnings-tooltip focus:outline-none"
        >
          <div className="text-[12px] text-true-black">
            <b>
              you get {PERCENTAGE_TO_CREATOR_DEFAULT}% of all charges from <br />
              entries and votes.
            </b>{" "}
            turn the toggle on <br />
            to send these directly to rewards.
          </div>
        </Tooltip>
      </div>
    </div>
  );
};

export default CreateRewardsAddEarningsToggle;
