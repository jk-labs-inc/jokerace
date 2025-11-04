import ButtonV3, { ButtonSize } from "@components/UI/ButtonV3";
import CreateRewardsPool from "@components/_pages/Create/pages/ContestRewards/components/CreatePool";
import CreateRewardsFundPool from "@components/_pages/Create/pages/ContestRewards/components/FundPool";
import { useFundPoolStore } from "@components/_pages/Create/pages/ContestRewards/components/FundPool/store";
import { useDeployContestStore } from "@hooks/useDeployContest/store";
import { useShallow } from "zustand/shallow";
import { useMediaQuery } from "react-responsive";
import { FC } from "react";

interface ConfigurationFormProps {
  onDeploy: () => void;
  isDeploying: boolean;
}

export const ConfigurationForm: FC<ConfigurationFormProps> = ({ onDeploy, isDeploying }) => {
  const { validateRewards } = useDeployContestStore(
    useShallow(state => ({
      validateRewards: state.validateRewards,
    })),
  );
  const { isError: isTokenWidgetError } = useFundPoolStore(
    useShallow(state => ({
      isError: state.isError,
    })),
  );
  const validation = validateRewards();
  const isDisabled = !validation.isValid || isTokenWidgetError || isDeploying;
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-col gap-4">
        <p className="hidden md:block text-2xl font-bold text-neutral-11">add rewards for voters</p>
        <div className="md:-ml-4 flex flex-col gap-4 w-full md:w-[440px] rounded-2xl md:rounded-4xl p-4 bg-primary-1 text-[16px] text-neutral-11">
          <p>
            it looks like the transaction to create a rewards pool didn’t go through—but luckily, you can create it
            below.
          </p>
          <p>
            the rewards pool will <b>self-fund.</b> as voters buy votes, 90% {isMobile ? "" : <br />}
            of their funds will go into the pool.{isMobile ? "" : <br />}
          </p>
          <p>voters on winners can claim their share of rewards.</p>
        </div>
      </div>
      <div className="flex flex-col gap-8">
        <CreateRewardsPool />
        <CreateRewardsFundPool />
      </div>
      <div>
        <ButtonV3
          size={ButtonSize.EXTRA_LARGE_LONG}
          onClick={onDeploy}
          isDisabled={isDisabled}
          colorClass="bg-gradient-purple text-[24px] rounded-[16px] font-bold text-true-black hover:scale-105 transition-transform duration-200 ease-in-out"
        >
          add rewards pool
        </ButtonV3>
      </div>
    </div>
  );
};
