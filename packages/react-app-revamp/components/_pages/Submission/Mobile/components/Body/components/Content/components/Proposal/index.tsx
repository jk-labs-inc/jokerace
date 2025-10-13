import { transform } from "@components/_pages/Submission/Desktop/components/Body/components/Content/components/Description/helpers/transform";
import { useSubmissionPageStore } from "@components/_pages/Submission/store";
import { Interweave } from "interweave";
import { UrlMatcher } from "interweave-autolink";
import { useShallow } from "zustand/shallow";

const SubmissionPageMobileBodyContentProposal = () => {
  const proposalStaticData = useSubmissionPageStore(useShallow(state => state.proposalStaticData));

  if (!proposalStaticData) {
    return (
      <p className="text-[16px] text-negative-11 font-bold">
        ruh-roh! An error occurred when retrieving this proposal; try refreshing the page.
      </p>
    );
  }

  return (
    <Interweave
      className={`prose prose-invert overflow-hidden`}
      content={proposalStaticData.description}
      matchers={[new UrlMatcher("url")]}
      transform={transform}
    />
  );
};

export default SubmissionPageMobileBodyContentProposal;
