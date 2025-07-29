import { Interweave } from "interweave";
import { UrlMatcher } from "interweave-autolink";
import { FC } from "react";

type Prompt = {
  content: string;
  isEmpty: boolean;
};

interface CreateFlowPromptPreviewProps {
  summarize: Prompt;
  evaluateVoters: Prompt;
  contactDetails: Prompt;
}

const CreateFlowPromptPreview: FC<CreateFlowPromptPreviewProps> = ({ summarize, evaluateVoters, contactDetails }) => {
  if (summarize.isEmpty && evaluateVoters.isEmpty && contactDetails.isEmpty) {
    return <p className="text-neutral-11 font-bold">no content!</p>;
  }

  return (
    <div className="prose prose-invert flex flex-col">
      <Interweave content={summarize.content} matchers={[new UrlMatcher("url")]} />
      {!evaluateVoters.isEmpty && (
        <>
          <div className="bg-linear-to-r from-neutral-7 w-full h-px my-6"></div>
          <Interweave content={evaluateVoters.content} matchers={[new UrlMatcher("url")]} />
        </>
      )}
      {!contactDetails.isEmpty && (
        <div>
          <div className="bg-linear-to-r from-neutral-7 w-full h-px my-6"></div>
          <Interweave content={contactDetails.content} matchers={[new UrlMatcher("url")]} />
        </div>
      )}
    </div>
  );
};

export default CreateFlowPromptPreview;
