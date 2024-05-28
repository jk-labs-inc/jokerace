import shortenEthereumAddress from "@helpers/shortenEthereumAddress";
import { Charge } from "@hooks/useDeployContest/types";
import { FC } from "react";

interface ContestParametersEarningsProps {
  charge: Charge;
  contestAuthor: string;
  blockExplorerUrl?: string;
}

const ContestParametersEarnings: FC<ContestParametersEarningsProps> = ({ charge, blockExplorerUrl, contestAuthor }) => {
  const isCreatorSplitEnabled = charge.percentageToCreator > 0;
  const creatorSplitDestination = charge.splitFeeDestination.address
    ? charge.splitFeeDestination.address
    : contestAuthor;
  const blockExplorerAddressUrl = blockExplorerUrl ? `${blockExplorerUrl}/address/${creatorSplitDestination}` : "";

  const percentageToCreatorMessage = () => {
    if (charge.percentageToCreator === 50) {
      return "all earnings split 50/50 with JokeRace";
    } else {
      return `all earnings go to JokeRace`;
    }
  };
  return (
    <div className="flex flex-col gap-12">
      <p className="text-[20px] font-bold text-neutral-11">earnings</p>
      <ul className="pl-4 text-[16px] font-bold">
        <li className="list-disc">{percentageToCreatorMessage()}</li>
        {isCreatorSplitEnabled ? (
          <li className="list-disc">
            creator earnings go to{" "}
            <a
              className="underline cursor-pointer hover:text-positive-11 transition-colors duration-300"
              target="_blank"
              href={blockExplorerAddressUrl}
            >
              {shortenEthereumAddress(creatorSplitDestination)}
            </a>
          </li>
        ) : null}
      </ul>
    </div>
  );
};

export default ContestParametersEarnings;
