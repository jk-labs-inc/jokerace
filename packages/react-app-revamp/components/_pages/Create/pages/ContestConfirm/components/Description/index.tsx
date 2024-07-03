import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { Prompt } from "@hooks/useDeployContest/store";
import { load } from "cheerio";
import { Interweave } from "interweave";
import { UrlMatcher } from "interweave-autolink";
import { FC, useState, useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import { Steps } from "../..";
import CreateContestConfirmLayout from "../Layout";

interface CreateContestConfirmDescriptionProps {
  prompt: Prompt;
  step: Steps;
  onClick?: (step: Steps) => void;
}

// most of the logic has been taken from the stackoverflow, as it is a bit complex to trim the html content
const trimHtmlContent = (html: string, maxLength: number) => {
  const $ = load(html);
  let trimmed = "";
  let remaining = "";
  let currentLength = 0;
  let isTrimming = true;

  const trimAtSentenceOrWord = (text: string, maxLen: number) => {
    if (text.length <= maxLen) return { trimmed: text, remaining: "" };

    // Try to find the end of a sentence within the maxLen
    let sentenceEnd = text.substring(0, maxLen).lastIndexOf(".");
    if (sentenceEnd === -1) sentenceEnd = text.substring(0, maxLen).lastIndexOf("!");
    if (sentenceEnd === -1) sentenceEnd = text.substring(0, maxLen).lastIndexOf("?");

    // If we found a sentence end, use that
    if (sentenceEnd !== -1 && sentenceEnd > maxLen * 0.5) {
      return {
        trimmed: text.substring(0, sentenceEnd + 1),
        remaining: text.substring(sentenceEnd + 1).trim(),
      };
    }

    // Otherwise, find the last space within maxLen
    const spaceIndex = text.substring(0, maxLen).lastIndexOf(" ");
    if (spaceIndex !== -1) {
      return {
        trimmed: text.substring(0, spaceIndex),
        remaining: text.substring(spaceIndex + 1).trim(),
      };
    }

    // If all else fails, just cut at maxLen
    return {
      trimmed: text.substring(0, maxLen),
      remaining: text.substring(maxLen).trim(),
    };
  };

  $("body")
    .contents()
    .each((_, element) => {
      if (isTrimming) {
        const text = $(element).text();
        if (currentLength + text.length <= maxLength) {
          trimmed += $.html(element);
          currentLength += text.length;
        } else {
          const { trimmed: trimmedPart, remaining: remainingPart } = trimAtSentenceOrWord(
            text,
            maxLength - currentLength,
          );
          if (element.type === "text") {
            trimmed += trimmedPart;
            remaining += remainingPart;
          } else {
            const $elem = $(element);
            $elem.text(trimmedPart);
            trimmed += $.html($elem);
            $elem.text(remainingPart);
            remaining += $.html($elem);
          }
          isTrimming = false;
        }
      } else {
        remaining += $.html(element);
      }
    });

  return { trimmed, remaining };
};

const CreateContestConfirmDescription: FC<CreateContestConfirmDescriptionProps> = ({ prompt, step, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const isMobileOrTablet = useMediaQuery({ query: "(max-width: 1024px)" });
  const [trimmedContent, setTrimmedContent] = useState("");
  const [remainingContent, setRemainingContent] = useState("");
  const [hasMoreContent, setHasMoreContent] = useState(false);

  useEffect(() => {
    const { trimmed, remaining } = trimHtmlContent(prompt.summarize, 100);
    setTrimmedContent(trimmed);
    setRemainingContent(remaining);
    setHasMoreContent(!!remaining || !!prompt.evaluateVoters || !!prompt.contactDetails);
  }, [prompt.summarize, prompt.evaluateVoters, prompt.contactDetails]);

  const toggleContent = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <CreateContestConfirmLayout onClick={() => onClick?.(step)} onHover={value => setIsHovered(value)}>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <div
            className={`text-[16px] normal-case ${
              isHovered || isExpanded || isMobileOrTablet ? "text-neutral-11 font-bold " : "text-neutral-14"
            } transition-color duration-300`}
          >
            <Interweave content={trimmedContent} matchers={[new UrlMatcher("url")]} />
          </div>
          {hasMoreContent && (
            <ChevronDownIcon
              className={`w-6 cursor-pointer transition-transform duration-300 ${
                isHovered || isExpanded || isMobileOrTablet ? "text-neutral-11" : "text-neutral-14"
              } ${isExpanded ? "rotate-180" : ""}`}
              onClick={toggleContent}
            />
          )}
        </div>
        {isExpanded && hasMoreContent && (
          <div className="prose prose-invert pl-4 flex flex-col">
            {remainingContent && (
              <>
                <Interweave content={remainingContent} matchers={[new UrlMatcher("url")]} />
                <div className="bg-gradient-to-r from-neutral-7 w-full h-[1px] my-6"></div>
              </>
            )}
            {prompt.evaluateVoters && (
              <>
                <Interweave content={prompt.evaluateVoters} matchers={[new UrlMatcher("url")]} />
                {prompt.contactDetails && <div className="bg-gradient-to-r from-neutral-7 w-full h-[1px] my-6"></div>}
              </>
            )}
            {prompt.contactDetails && <Interweave content={prompt.contactDetails} matchers={[new UrlMatcher("url")]} />}
          </div>
        )}
      </div>
    </CreateContestConfirmLayout>
  );
};

export default CreateContestConfirmDescription;
