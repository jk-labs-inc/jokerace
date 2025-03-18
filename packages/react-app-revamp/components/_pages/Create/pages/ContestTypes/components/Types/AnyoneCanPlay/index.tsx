import { ContestType } from "@components/_pages/Create/types";
import { FC } from "react";
import CreateContestTypesAdditionalInfo from "../../AdditionalInfo";
import CreateContestTypesCard from "../../Card";
import CreateContestTypesSplit from "../../Split";

interface CreateContestTypesAnyoneCanPlayProps {
  isSelected: boolean;
  faqLink?: string;
  onClick?: (type: ContestType) => void;
}

const CreateContestTypesAnyoneCanPlay: FC<CreateContestTypesAnyoneCanPlayProps> = ({
  isSelected,
  onClick,
  faqLink,
}) => {
  return (
    <CreateContestTypesCard isSelected={isSelected} onClick={() => onClick?.(ContestType.AnyoneCanPlay)}>
      <p className="text-[20px] text-neutral-11 font-bold">anyone can play 👯</p>
      <div className="flex justify-between items-center relative">
        <div className="flex flex-col gap-2">
          <p className="text-[16px] text-neutral-11">anyone can enter. anyone can vote.</p>
          <p className="text-[16px] text-neutral-9">
            perfect for leaderboards, community <br />
            awards, monetized product hunt, etc
          </p>
        </div>
        <img
          className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2"
          src="/create-flow/contest-types/anyone-can-play.png"
          alt="anyone can play"
        />
      </div>

      <CreateContestTypesAdditionalInfo>
        <ul className="flex flex-col gap-2 text-neutral-9 text-[16px] list-disc pl-4">
          <li className="font-bold">you'll set a charge to enter the contest</li>
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

export default CreateContestTypesAnyoneCanPlay;
