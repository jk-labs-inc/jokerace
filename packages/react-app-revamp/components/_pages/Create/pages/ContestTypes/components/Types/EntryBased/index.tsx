import { FC } from "react";
import CreateContestTypesAdditionalInfo from "../../AdditionalInfo";
import CreateContestTypesCard from "../../Card";
import { ContestType } from "@components/_pages/Create/types";
import CreateContestTypesSplit from "../../Split";

interface CreateContestTypesEntryBasedProps {
  isSelected: boolean;
  faqLink?: string;
  onClick?: (type: ContestType) => void;
}

const CreateContestTypesEntryBased: FC<CreateContestTypesEntryBasedProps> = ({ isSelected, onClick, faqLink }) => {
  return (
    <CreateContestTypesCard isSelected={isSelected} onClick={() => onClick?.(ContestType.EntryContest)}>
      <p className="text-[20px] text-neutral-11 font-bold">entry contest ✍️</p>

      <div className="flex justify-between items-center relative">
        <div className="flex flex-col gap-2">
          <p className="text-[16px] text-neutral-11">anyone can enter. voting is allowlisted.</p>
          <p className="text-[16px] text-neutral-9">
            perfect for meme/tweet/art <br />
            contests, hackathons, grants, etc.
          </p>
        </div>
        <img
          className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2"
          src="/create-flow/contest-types/entry-based.png"
          alt="entry based"
        />
      </div>
      <CreateContestTypesAdditionalInfo>
        <ul className="flex flex-col gap-2 text-neutral-9 text-[16px] list-disc pl-4">
          <li className="font-bold">you'll set a charge to enter the contest</li>
          <li className="font-bold">
            you’ll allowlist voters, who pay a small charge to vote
            <br />
            <span className="font-normal">
              you can manually allowlist up to 100k addresses with a spreadsheet—or use presets for certain communities
            </span>
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

export default CreateContestTypesEntryBased;
