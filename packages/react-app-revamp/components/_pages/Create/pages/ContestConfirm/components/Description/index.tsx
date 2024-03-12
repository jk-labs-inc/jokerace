import { ChevronDownIcon } from "@heroicons/react/outline";
import { Prompt } from "@hooks/useDeployContest/store";
import { load } from "cheerio";
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
  const [isExpanded, setIsExpanded] = useState(false);
  const isMobileOrTablet = useMediaQuery({ query: "(max-width: 1024px)" });

  const convertSummarizePrompt = () => {
    const cheerio = load(prompt.summarize);
    const text = cheerio.text();

    return text.trim().length > 100 ? `${text.trim().slice(0, 100)}...` : text.trim();
  };

  const toggleContent = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <CreateContestConfirmLayout onClick={() => onClick?.(step)} onHover={value => setIsHovered(value)}>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <p
            className={`text-[16px] normal-case ${
              isHovered || isExpanded || isMobileOrTablet ? "text-neutral-11 font-bold " : "text-neutral-14"
            } transition-color duration-300`}
          >
            {convertSummarizePrompt()}
          </p>
          <ChevronDownIcon
            className={`w-6 cursor-pointer transition-transform duration-300 ${
              isHovered || isExpanded || isMobileOrTablet ? "text-neutral-11" : "text-neutral-14"
            } ${isExpanded ? "rotate-180" : ""}`}
            onClick={toggleContent}
          />
        </div>
        {isExpanded ? (
          <div className="prose prose-invert pl-4 flex flex-col">
            <Interweave content={prompt.summarize} matchers={[new UrlMatcher("url")]} />

            <div className="bg-gradient-to-r from-neutral-7 w-full h-[1px] my-6"></div>
            <Interweave content={prompt.evaluateVoters} matchers={[new UrlMatcher("url")]} />
            {prompt.contactDetails ? (
              <>
                <div className="bg-gradient-to-r from-neutral-7 w-full h-[1px] my-6"></div>
                <Interweave content={prompt.contactDetails} matchers={[new UrlMatcher("url")]} />
              </>
            ) : null}
          </div>
        ) : null}
      </div>
    </CreateContestConfirmLayout>
  );
};

export default CreateContestConfirmDescription;
