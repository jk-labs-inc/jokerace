import { Charge } from "@hooks/useDeployContest/types";
import { FC } from "react";
import { useAccount } from "wagmi";

interface ContestParametersEarningsProps {
  charge: Charge;
  contestAuthor: string;
  blockExplorerUrl?: string;
}

const ContestParametersEarnings: FC<ContestParametersEarningsProps> = ({ charge, blockExplorerUrl, contestAuthor }) => {
  const { address } = useAccount();

  //TODO: check this for 6.9
  // const renderEarningsSplitMessage = () => {
  //   const splitPercentage = charge.percentageToCreator;
  //   const percentageToJkLabs = 100 - splitPercentage;

  //   if (isCreatorSplit) {
  //     return <li className="text-[16px] list-disc normal-case">{percentageToJkLabs}% of charges go to jk labs inc.</li>;
  //   } else {
  //     return <li className="text-[16px] list-disc normal-case">all charges go to jk labs inc.</li>;
  //   }
  // };

  return (
    <div className="flex flex-col gap-8">
      <p className="text-[24px] text-neutral-11">charges</p>
      {/* TODO: check this for 6.9 */}
      <ul className="pl-4 text-[16px] text-neutral-9">all charges go to jk labs inc.</ul>
    </div>
  );
};

export default ContestParametersEarnings;
