import { ContestType } from "@components/_pages/Create/types";
import { FC, useMemo } from "react";
import CreateContestConfirmLayout from "../Layout";

interface CreateContestConfirmTypeProps {
  type: ContestType;
  step: number;
  onClick?: (stepIndex: number) => void;
}

const CreateContestConfirmType: FC<CreateContestConfirmTypeProps> = ({ step, type, onClick }) => {
  const enteringText = useMemo(() => {
    switch (type) {
      case ContestType.AnyoneCanPlay:
      case ContestType.VotingContest:
        return "you submit the entries";
    }
  }, [type]);

  const votingText = useMemo(() => {
    switch (type) {
      case ContestType.AnyoneCanPlay:
      case ContestType.VotingContest:
        return "anyone can vote";
    }
  }, [type]);

  return (
    <CreateContestConfirmLayout onClick={() => onClick?.(step)}>
      <div className="flex flex-col gap-2">
        <p className="text-neutral-9 text-[12px] font-bold uppercase">contest type</p>
        <p className="text-[16px] text-neutral-11 font-bold">{type}</p>
        <ul className="flex flex-col list-disc pl-6">
          <li className="text-[16px] text-neutral-11">{enteringText}</li>
          <li className="text-[16px] text-neutral-11">{votingText}</li>
        </ul>
      </div>
    </CreateContestConfirmLayout>
  );
};

export default CreateContestConfirmType;
