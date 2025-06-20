import { FC } from "react";
import VotingQualifierBalance from "../../shared/Balance";
import { VotingQualifierType } from "../../types";

const VotingQualifierAllowlisted: FC = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <img src="/contest/ballot.svg" width={16} height={16} alt="timer" />
        <p className="text-[12px] md:text-[16px] uppercase text-neutral-9">my votes</p>
      </div>
      <VotingQualifierBalance type={VotingQualifierType.ALLOWLISTED} />
    </div>
  );
};

export default VotingQualifierAllowlisted;
