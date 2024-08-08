import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import { Prompt } from "@hooks/useDeployContest/store";
import { Interweave } from "interweave";
import { UrlMatcher } from "interweave-autolink";
import { FC, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { Steps } from "../..";
import CreateContestConfirmLayout from "../Layout";

interface CreateContestConfirmDescriptionProps {
  prompt: Prompt;
  step: Steps;
  onClick?: (step: Steps) => void;
}

const CreateContestConfirmDescription: FC<CreateContestConfirmDescriptionProps> = ({ prompt, step, onClick }) => {
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
            {isExpanded ? "Description" : "Show full description"}
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
          <div
            className={`prose prose-invert pl-4 flex flex-col ${
              isHovered || isMobileOrTablet ? "text-neutral-11" : "text-neutral-14"
            } transition-color duration-300`}
          >
            <Interweave content={prompt.summarize} matchers={[new UrlMatcher("url")]} />
            {prompt.evaluateVoters && (
              <>
                <div className="bg-gradient-to-r from-neutral-7 w-full h-[1px] my-6"></div>
                <Interweave content={prompt.evaluateVoters} matchers={[new UrlMatcher("url")]} />
              </>
            )}
            {prompt.contactDetails && (
              <>
                <div className="bg-gradient-to-r from-neutral-7 w-full h-[1px] my-6"></div>
                <Interweave content={prompt.contactDetails} matchers={[new UrlMatcher("url")]} />
              </>
            )}
          </div>
        )}
      </div>
    </CreateContestConfirmLayout>
  );
};

export default CreateContestConfirmDescription;
