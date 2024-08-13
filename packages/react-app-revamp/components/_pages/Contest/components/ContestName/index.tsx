import { generateUrlContest } from "@helpers/share";
import { ContestStateEnum, useContestStateStore } from "@hooks/useContestState/store";
import Image from "next/image";
import { FC } from "react";
import CancelContest from "../CancelContest";

interface ContestNameProps {
  contestName: string;
  address: string;
  chainName: string;
}

const ContestName: FC<ContestNameProps> = ({ contestName, address, chainName }) => {
  const { contestState } = useContestStateStore(state => state);
  const isContestCanceled = contestState === ContestStateEnum.Canceled;

  return (
    <div className="flex items-center justify-between md:justify-normal md:gap-8">
      <div className="relative inline-block">
        <span className="text-[24px] md:text-[31px] font-sabo break-words">
          {isContestCanceled && (
            <span className="absolute inset-0 flex items-center overflow-hidden">
              <span className="w-full h-0.5 bg-gradient-purple"></span>
            </span>
          )}
          <span className={`relative z-10 bg-gradient-purple text-transparent bg-clip-text`}>{contestName}</span>
        </span>
      </div>
      <CancelContest />
      <div
        className="w-8 h-8 flex-shrink-0 flex md:hidden items-center justify-center rounded-[10px] border border-neutral-11 cursor-pointer"
        onClick={() =>
          navigator.share({
            url: generateUrlContest(address, chainName),
          })
        }
      >
        <Image src="/forward.svg" alt="share" width={15} height={13} />
      </div>
    </div>
  );
};

export default ContestName;
