import ContestImage from "@components/_pages/Contest/components/ContestImage";
import { Prompt } from "@hooks/useDeployContest/store";
import { FC, useState } from "react";
import CreateContestConfirmLayout from "../Layout";
import { Steps } from "../..";
import { useMediaQuery } from "react-responsive";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";

interface CreateContestConfirmImageProps {
  imageUrl: string;
  step: Steps;
  onClick?: (step: Steps) => void;
}

const CreateContestConfirmImage: FC<CreateContestConfirmImageProps> = ({ imageUrl, step, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const isMobileOrTablet = useMediaQuery({ query: "(max-width: 1024px)" });
  const toggleContent = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <CreateContestConfirmLayout onClick={() => onClick?.(step)} onHover={value => setIsHovered(value)}>
      <div className="flex flex-col gap-4">
        <div className={`flex items-center ${isExpanded ? "justify-between" : "gap-2"}`}>
          <div
            className={`text-[16px] normal-case ${
              isHovered || isMobileOrTablet ? "text-neutral-11 font-bold" : "text-neutral-14"
            } transition-color duration-300`}
          >
            {isExpanded ? "contest image" : "Show full contest image"}
          </div>
          {isExpanded ? (
            <ChevronUpIcon
              className={`w-6 cursor-pointer ${isHovered || isMobileOrTablet ? "text-neutral-11" : "text-neutral-14"}`}
              onClick={toggleContent}
            />
          ) : (
            <ChevronDownIcon
              className={`w-6 cursor-pointer ${isHovered || isMobileOrTablet ? "text-neutral-11" : "text-neutral-14"}`}
              onClick={toggleContent}
            />
          )}
        </div>
        {isExpanded && (
          <div className="w-full md:w-[768px]">{imageUrl ? <ContestImage imageUrl={imageUrl} /> : null}</div>
        )}
      </div>
    </CreateContestConfirmLayout>
  );
};

export default CreateContestConfirmImage;
