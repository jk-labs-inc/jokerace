import Collapsible from "@components/UI/Collapsible";
import { ChevronUpIcon } from "@heroicons/react/outline";
import { useContestStore } from "@hooks/useContest/store";
import { Interweave } from "interweave";
import { UrlMatcher } from "interweave-autolink";
import moment from "moment";
import { FC, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";

interface ContestPromptModalProps {
  prompt: string;
  hidePrompt?: boolean;
}

const ContestPromptModal: FC<ContestPromptModalProps> = ({ prompt, hidePrompt = false }) => {
  const { isV3, votesClose } = useContestStore(state => state);
  const [isPromptOpen, setIsPromptOpen] = useState(moment().isBefore(votesClose) && !hidePrompt);
  const [contestType, contestTitle, contestPrompt] = prompt.split("|");

  useEffect(() => {
    setIsPromptOpen(!hidePrompt);
  }, [hidePrompt]);

  return (
    <>
      {isV3 ? (
        <div className="flex flex-col gap-4">
          <div className="flex gap-4 items-center">
            <p className="text-[24px] text-primary-10 font-bold">{contestTitle}</p>
            <div className="flex items-center px-4 leading-tight py-[1px] bg-neutral-10 rounded-[5px] text-true-black text-[16px] font-bold">
              {contestType}
            </div>
            <button
              onClick={() => setIsPromptOpen(!isPromptOpen)}
              className={`transition-transform duration-500 ease-in-out transform ${isPromptOpen ? "" : "rotate-180"}`}
            >
              <ChevronUpIcon height={30} />
            </button>
          </div>
          {isPromptOpen && (
            <div className="pl-5">
              <Collapsible isOpen={isPromptOpen}>
                <div className="border-l border-true-white ">
                  <div className="prose prose-invert pl-5">
                    <Interweave content={contestPrompt} matchers={[new UrlMatcher("url")]} />
                  </div>
                </div>
              </Collapsible>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <p className="text-[24px] text-neutral-11 font-bold">contest prompt</p>
            <button
              onClick={() => setIsPromptOpen(!isPromptOpen)}
              className={`transition-transform duration-500 ease-in-out transform ${isPromptOpen ? "" : "rotate-180"}`}
            >
              <ChevronUpIcon height={30} />
            </button>
          </div>

          <div className="pl-5">
            <Collapsible isOpen={isPromptOpen}>
              <div className="border-l border-true-white ">
                <div className="prose prose-invert pl-5 ">
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
                    {contestPrompt}
                  </ReactMarkdown>
                </div>
              </div>
            </Collapsible>
          </div>
        </div>
      )}
    </>
  );
};

export default ContestPromptModal;
