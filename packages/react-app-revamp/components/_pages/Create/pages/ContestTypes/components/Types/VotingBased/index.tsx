import { FC } from "react";
import CreateContestTypesAdditionalInfo from "../../AdditionalInfo";
import CreateContestTypesCard from "../../Card";
import { ContestType } from "@components/_pages/Create/types";
import CreateContestTypesSplit from "../../Split";
import { useMediaQuery } from "react-responsive";

interface CreateContestTypesVotingBasedProps {
  isSelected: boolean;
  faqLink?: string;
  onClick?: (type: ContestType) => void;
}

const CreateContestTypesVotingBased: FC<CreateContestTypesVotingBasedProps> = ({ isSelected, onClick, faqLink }) => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  const tipMessage = () => {
    if (isMobile) {
      return (
        <>
          <b>tip: recommended for rewarding voters.</b> if you want to reward contestants, pick "anyone can play" so
          they can enter.
        </>
      );
    }

    return (
      <>
        <b>tip: recommended if you want to reward voters.</b> if you want to reward contestants,
        <br /> pick “anyone can play” so they can enter and win.
      </>
    );
  };

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
          <p className="text-neutral-9 text-[12px]">{tipMessage()}</p>
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
          <CreateContestTypesSplit />

          <li>
            read more in our{" "}
            <a href={faqLink} target="_blank" rel="noopener noreferrer" className="text-positive-11">
              faq
            </a>
          </li>
        </ul>
      </CreateContestTypesAdditionalInfo>
    </CreateContestTypesCard>
  );
};

export default CreateContestTypesVotingBased;
