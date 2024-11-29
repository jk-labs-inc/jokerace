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
  imageUrl?: string;
}

const CreateFlowPromptPreview: FC<CreateFlowPromptPreviewProps> = ({
  summarize,
  evaluateVoters,
  contactDetails,
  imageUrl,
}) => {
  if (summarize.isEmpty && evaluateVoters.isEmpty && contactDetails.isEmpty) {
    return <p className="text-neutral-11 font-bold">no content!</p>;
  }

  return (
    <div className="prose prose-invert flex flex-col">
      {imageUrl && <img src={imageUrl} alt="preview" className="w-full h-auto" />}
      <Interweave content={summarize.content} matchers={[new UrlMatcher("url")]} />
      {!evaluateVoters.isEmpty && (
        <>
          <div className="bg-gradient-to-r from-neutral-7 w-full h-[1px] my-6"></div>
          <Interweave content={evaluateVoters.content} matchers={[new UrlMatcher("url")]} />
        </>
      )}
      {!contactDetails.isEmpty && (
        <div>
          <div className="bg-gradient-to-r from-neutral-7 w-full h-[1px] my-6"></div>
          <Interweave content={contactDetails.content} matchers={[new UrlMatcher("url")]} />
        </div>
      )}
    </div>
  );
};

export default CreateFlowPromptPreview;
