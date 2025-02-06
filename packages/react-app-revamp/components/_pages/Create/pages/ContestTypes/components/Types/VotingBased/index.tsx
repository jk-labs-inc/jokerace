import { FC } from "react";
import CreateContestTypesAdditionalInfo from "../../AdditionalInfo";
import CreateContestTypesCard from "../../Card";
import { ContestType } from "@components/_pages/Create/types";

interface CreateContestTypesVotingBasedProps {
  isSelected: boolean;
  onClick?: (type: ContestType) => void;
}

const CreateContestTypesVotingBased: FC<CreateContestTypesVotingBasedProps> = ({ isSelected, onClick }) => {
  return (
    <CreateContestTypesCard isSelected={isSelected} onClick={() => onClick?.(ContestType.VotingContest)}>
      <p className="text-[20px] text-neutral-11 font-bold">voting contest 🗳️</p>

      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center relative">
          <div className="flex flex-col gap-2">
            <p className="text-[16px] text-neutral-11">you submit entries. anyone can vote.</p>
            <p className="text-[16px] text-neutral-9">
              perfect for debates, elections, reality <br />
              TV shows, community decisions, etc
            </p>
          </div>
          <img
            className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2"
            src="/create-flow/contest-types/voting-based.png"
            alt="voting based"
          />
        </div>
        <div className="p-2 bg-neutral-2 rounded-lg ">
          <p className="text-neutral-9 text-[12px]">
            note: <b>if you want to add a rewards pool for winners,</b> pick “anyone can play.” <br />
            otherwise the rewards just go to you if you’re the only one entering.
          </p>
        </div>
      </div>

      <CreateContestTypesAdditionalInfo>
        <ul className="flex flex-col gap-2 text-neutral-9 text-[16px] list-disc pl-4">
          <li className="font-bold">you’ll submit the entries during the entry period</li>
          <li className="font-bold">
            you'll set a charge <span className="italic">per vote</span> to vote in the contest
            <br />
            <span className="font-normal">this lets anyone vote without risk of botting</span>
          </li>
          <li className="font-bold">
            we'll split all charges with you 50/50 <br />{" "}
            <span className="font-normal">
              you can keep them, put them in a rewards pool for winners, or do any smart contract tomfoolery you like
            </span>
          </li>

          <li>
            read more in our <span className="text-positive-11">faq</span>
          </li>
        </ul>
      </CreateContestTypesAdditionalInfo>
    </CreateContestTypesCard>
  );
};

export default CreateContestTypesVotingBased;
