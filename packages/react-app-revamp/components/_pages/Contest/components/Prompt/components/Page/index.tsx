import { truncateText } from "@helpers/truncate";
import { useContestStore } from "@hooks/useContest/store";
import { Interweave } from "interweave";
import { UrlMatcher } from "interweave-autolink";
import Image from "next/image";
import { FC, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";

interface ContestPromptPageProps {
  prompt: string;
}

const ContestPromptPage: FC<ContestPromptPageProps> = ({ prompt }) => {
  const { isV3 } = useContestStore(state => state);
  const [isExpanded, setIsExpanded] = useState(false);
  const [maxHeight, setMaxHeight] = useState("0px");
  const contentRef = useRef<HTMLDivElement>(null);
  const [contestType, contestTitle, contestPrompt] = prompt.split("|");
  const truncatedPrompt = isV3 ? truncateText(contestPrompt, 100) : truncateText(prompt, 100);
  const displayReadMore = isV3 ? contestPrompt.length > 100 : prompt.length > 100;

  useEffect(() => {
    if (contentRef.current) {
      setMaxHeight(`${contentRef.current.scrollHeight}px`);
    }
  }, [contentRef, isExpanded]);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      {isV3 ? (
        <div className="flex flex-col gap-4">
          <div className="flex gap-4 items-center">
            <p className="text-[20px] md:text-[24px] text-primary-10 font-bold">{contestTitle}</p>
            <div className="hidden md:flex items-center px-4 leading-tight py-[1px] bg-neutral-10 rounded-[5px] text-true-black text-[16px] font-bold">
              {contestType}
            </div>
          </div>
          <div className="pl-5">
            <div className="border-l border-true-white">
              <div
                className=" overflow-hidden transition-max-height duration-500 ease-in-out"
                style={{ maxHeight: isExpanded ? maxHeight : "3em" }}
                ref={contentRef}
              >
                <div className="prose prose-invert pl-5">
                  <Interweave
                    content={isExpanded ? contestPrompt : truncatedPrompt}
                    matchers={[new UrlMatcher("url")]}
                  />
                </div>
              </div>
              {displayReadMore && (
                <div className="flex gap-1 items-center pl-5 mt-4 cursor-pointer" onClick={handleToggle}>
                  <p className="text-[16px] text-positive-11 font-bold">{isExpanded ? "Read Less" : "Read More"}</p>
                  <Image
                    src="/contest/chevron.svg"
                    width={24}
                    height={24}
                    alt="toggleRead"
                    className={`transition-transform duration-300 ${isExpanded ? "transform rotate-180 pt-0" : "pt-1"}`}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <p className="text-[24px] text-neutral-11 font-bold">contest prompt</p>
          </div>
          <div className="pl-5">
            <div className="border-l border-true-white">
              <div
                className="prose prose-invert pl-5 overflow-hidden transition-max-height duration-500 ease-in-out"
                style={{ maxHeight: isExpanded ? maxHeight : "3em" }}
                ref={contentRef}
              >
                <ReactMarkdown
                  rehypePlugins={[rehypeRaw, rehypeSanitize, remarkGfm]}
                  components={{
                    p: ({ node, children, ...props }) => (
                      <p {...props} className="text-[16px]">
                        {children}
                      </p>
                    ),
                    ul: ({ node, children, ...props }) => (
                      <ul {...props} className="list-disc list-inside  list-explainer">
                        {children}
                      </ul>
                    ),
                    li: ({ node, children, ...props }) => (
                      <li {...props} className="flex items-center">
                        {children}
                      </li>
                    ),
                  }}
                >
                  {prompt}
                </ReactMarkdown>
              </div>
              {displayReadMore && (
                <div className="flex gap-1 items-center pl-5 mt-4 cursor-pointer" onClick={handleToggle}>
                  <p className="text-[16px] text-positive-11 font-bold">{isExpanded ? "Read Less" : "Read More"}</p>
                  <Image
                    src="/contest/chevron.svg"
                    width={24}
                    height={24}
                    alt="toggleRead"
                    className={`transition-transform duration-300 ${isExpanded ? "transform rotate-180" : ""}`}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ContestPromptPage;
