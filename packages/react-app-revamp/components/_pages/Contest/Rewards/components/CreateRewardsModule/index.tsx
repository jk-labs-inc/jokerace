import { compareVersions } from "compare-versions";
import { FC } from "react";
import CreateRewards from "../Create";

interface CreateRewardsModuleProps {
  version: string;
  contestMaxProposalCount: number;
  downvotingAllowed: boolean;
  sortingEnabled: boolean;
}

const CreateRewardsModule: FC<CreateRewardsModuleProps> = ({
  version,
  contestMaxProposalCount,
  downvotingAllowed,
  sortingEnabled,
}) => {
  if (version) {
    if (compareVersions(version, "4.1") == -1) {
      if (contestMaxProposalCount > 100) {
        return (
          <p className="text-[16px]">
            For this contest, you cannot create a rewards module; the maximum number of submissions for the contest must
            be <b>100</b> or less in order to be able to create a rewards module.
          </p>
        );
      }
    } else if (compareVersions(version, "4.1") >= 0) {
      if (downvotingAllowed || !sortingEnabled) {
        return (
          <p className="text-[16px]">
            For this contest, you cannot create a rewards module; in order to create rewards module, you need to disable
            downvoting in the creation process.
          </p>
        );
      }
    }
  }

  return <CreateRewards />;
};

export default CreateRewardsModule;
