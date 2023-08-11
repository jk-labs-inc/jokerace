/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-children-prop */
import Collapsible from "@components/UI/Collapsible";
import MarkdownImage from "@components/UI/Markdown/components/MarkdownImage";
import MarkdownList from "@components/UI/Markdown/components/MarkdownList";
import MarkdownText from "@components/UI/Markdown/components/MarkdownText";
import MarkdownUnorderedList from "@components/UI/Markdown/components/MarkdownUnorderedList";
import { Proposal } from "@components/_pages/ProposalContent";
import { ChevronUpIcon } from "@heroicons/react/outline";
import { useContestStore } from "@hooks/useContest/store";
import { ContestStatus } from "@hooks/useContestStatus/store";
import { load } from "cheerio";
import moment from "moment";
import { FC, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";

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
  const truncatedContent = totalContent.length > 90 ? `${totalContent.substring(0, 90)}...` : totalContent;
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

  if (!collapsible) {
    return (
      <div className="flex flex-col gap-4">
        <ReactMarkdown
          className="markdown"
          components={{
            img: ({ node, ...props }) => <MarkdownImage imageSize="full" src={props.src ?? ""} />,
            p: ({ node, children, ...props }) => <MarkdownText children={children} props={props} />,
            ul: ({ node, children, ...props }) => <MarkdownUnorderedList children={children} props={props} />,
            li: ({ node, children, ...props }) => <MarkdownList children={children} props={props} />,
          }}
          rehypePlugins={[rehypeRaw, rehypeSanitize]}
        >
          {proposal.content}
        </ReactMarkdown>
        {contestStatus === ContestStatus.SubmissionOpen && (
          <p className="text-[16px] text-primary-10">voting opens {formattedVotesOpen}</p>
        )}
      </div>
    );
  }

  const CollapsibleContent = (
    <div>
      <Collapsible isOpen={isProposalOpen}>
        <ReactMarkdown
          className="markdown"
          components={{
            img: ({ node, ...props }) => <MarkdownImage imageSize="full" src={props.src ?? ""} />,
            p: ({ node, children, ...props }) => <MarkdownText children={children} props={props} />,
            ul: ({ node, children, ...props }) => <MarkdownUnorderedList children={children} props={props} />,
            li: ({ node, children, ...props }) => <MarkdownList children={children} props={props} />,
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
      {isOnlyImage && (
        <ReactMarkdown
          className="markdown"
          components={{
            img: ({ node, ...props }) => <MarkdownImage imageSize="full" src={props.src ?? ""} />,
          }}
          rehypePlugins={[rehypeRaw, rehypeSanitize]}
        >
          {imgTags}
        </ReactMarkdown>
      )}

      {isOnlyText && totalContent.length >= 90 ? (
        <>
          <div className="flex gap-4 items-center">
            <ReactMarkdown
              className="markdown"
              components={{
                p: ({ node, children, ...props }) => <MarkdownText children={children} props={props} />,
                ul: ({ node, children, ...props }) => <MarkdownUnorderedList children={children} props={props} />,
                li: ({ node, children, ...props }) => <MarkdownList children={children} props={props} />,
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
        <ReactMarkdown
          className="markdown"
          components={{
            p: ({ node, children, ...props }) => <MarkdownText children={children} props={props} />,
            ul: ({ node, children, ...props }) => <MarkdownUnorderedList children={children} props={props} />,
            li: ({ node, children, ...props }) => <MarkdownList children={children} props={props} />,
          }}
          rehypePlugins={[rehypeRaw, rehypeSanitize]}
        >
          {totalContent}
        </ReactMarkdown>
      )}

      {isImageAndText && (
        <>
          <div className="flex gap-4 items-center">
            <ReactMarkdown
              className="markdown"
              components={{
                img: ({ node, ...props }) => <MarkdownImage imageSize="full" src={props.src ?? ""} />,
                p: ({ node, children, ...props }) => <MarkdownText children={children} props={props} />,
                ul: ({ node, children, ...props }) => <MarkdownUnorderedList children={children} props={props} />,
                li: ({ node, children, ...props }) => <MarkdownList children={children} props={props} />,
              }}
              rehypePlugins={[rehypeRaw, rehypeSanitize]}
            >
              {truncatedContent}
            </ReactMarkdown>
            {arrowButton}
          </div>
          {CollapsibleContent}
        </>
      )}
    </div>
  );
};

export default LayoutContestProposal;
