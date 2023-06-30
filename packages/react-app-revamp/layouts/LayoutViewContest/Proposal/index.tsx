/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-children-prop */
import Collapsible from "@components/UI/Collapsible";
import { Proposal } from "@components/_pages/ProposalContent";
import { ChevronUpIcon } from "@heroicons/react/outline";
import { FC, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import { load } from "cheerio";
import { ContestStatus, useContestStatusStore } from "@hooks/useContestStatus/store";
import { useContestStore } from "@hooks/useContest/store";
import moment from "moment";

interface LayoutContestProposalProps {
  proposal: Proposal;
  contestStatus?: ContestStatus;
  collapsible?: boolean;
  votingOpen?: Date;
}

const extractImageAndTextContent = (content: string) => {
  const $ = load(content);

  let imgTags = "";
  $("img").each((_, imgTag) => {
    imgTags += $.html(imgTag);
  });

  const textElements = $("p, div, span, pre, h1, h2, h3, h4, h5");
  let totalContent = "";
  textElements.each((_, element) => {
    totalContent += $(element).text();
  });

  return { imgTags, totalContent };
};

const LayoutContestProposal: FC<LayoutContestProposalProps> = ({ proposal, contestStatus, collapsible = true }) => {
  const votesOpen = useContestStore(state => state.votesOpen);
  const formattedVotesOpen = moment(votesOpen).format("MMMM Do, h:mm a");
  const [isProposalOpen, setIsProposalOpen] = useState(false);
  const { imgTags, totalContent } = extractImageAndTextContent(proposal.content);
  const truncatedContent = totalContent.length > 100 ? `${totalContent.substring(0, 90)}...` : totalContent;
  const isOnlyImage = imgTags.length > 0 && totalContent.length === 0;
  const isOnlyText = imgTags.length === 0 && totalContent.length > 0;
  const isImageAndText = imgTags.length > 0 && totalContent.length > 0;

  const arrowButton = (
    <button
      onClick={() => setIsProposalOpen(!isProposalOpen)}
      className={`transition-transform duration-500 ease-in-out transform ${isProposalOpen ? "" : "rotate-180"}`}
    >
      <ChevronUpIcon height={30} />
    </button>
  );

  const CollapsibleContent = (
    <div>
      <Collapsible isOpen={isProposalOpen}>
        <ReactMarkdown
          components={{
            img: ({ node, ...props }) => <img {...props} className="w-[350px]" alt="image" />,
            p: ({ node, children, ...props }) => (
              <p {...props} className="m-0 text-[16px]">
                {children}
              </p>
            ),
          }}
          rehypePlugins={[rehypeRaw, rehypeSanitize]}
        >
          {proposal.content}
        </ReactMarkdown>
      </Collapsible>
    </div>
  );

  return (
    <div className="flex flex-col gap-4">
      {isOnlyImage && collapsible && (
        <ReactMarkdown
          components={{
            img: ({ node, ...props }) => <img {...props} className="w-[350px]" alt="image" />,
          }}
          rehypePlugins={[rehypeRaw, rehypeSanitize]}
        >
          {imgTags}
        </ReactMarkdown>
      )}

      {isOnlyText &&
        (collapsible ? (
          <>
            <div className="flex gap-4 items-center">
              <ReactMarkdown
                components={{
                  p: ({ node, children, ...props }) => (
                    <p {...props} className="m-0 text-[16px]">
                      {children}
                    </p>
                  ),
                }}
                rehypePlugins={[rehypeRaw, rehypeSanitize]}
              >
                {truncatedContent}
              </ReactMarkdown>
              {arrowButton}
            </div>
            {CollapsibleContent}
          </>
        ) : (
          <>
            <ReactMarkdown
              components={{
                p: ({ node, children, ...props }) => (
                  <p {...props} className="m-0 text-[16px]">
                    {children}
                  </p>
                ),
              }}
              rehypePlugins={[rehypeRaw, rehypeSanitize]}
            >
              {totalContent}
            </ReactMarkdown>
            {contestStatus === ContestStatus.SubmissionOpen && (
              <p className="text-[16px] text-primary-10">voting opens {formattedVotesOpen}</p>
            )}
          </>
        ))}

      {isImageAndText &&
        (collapsible ? (
          <>
            <div className="flex gap-4 items-center">
              <ReactMarkdown
                components={{
                  img: ({ node, ...props }) => <img {...props} className="w-[350px]" alt="image" />,
                  p: ({ node, children, ...props }) => (
                    <p {...props} className="m-0 text-[16px]">
                      {children}
                    </p>
                  ),
                }}
                rehypePlugins={[rehypeRaw, rehypeSanitize]}
              >
                {truncatedContent}
              </ReactMarkdown>
              {arrowButton}
            </div>
            {CollapsibleContent}
          </>
        ) : (
          <>
            <ReactMarkdown
              components={{
                img: ({ node, ...props }) => <img {...props} className="w-[350px]" alt="image" />,
                p: ({ node, children, ...props }) => (
                  <p {...props} className="m-0 text-[16px]">
                    {children}
                  </p>
                ),
              }}
              rehypePlugins={[rehypeRaw, rehypeSanitize]}
            >
              {proposal.content}
            </ReactMarkdown>
            {contestStatus === ContestStatus.SubmissionOpen && (
              <p className="text-[16px] text-primary-10">voting opens {formattedVotesOpen}</p>
            )}
          </>
        ))}
    </div>
  );
};

export default LayoutContestProposal;
