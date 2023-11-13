import { useContestStore } from "@hooks/useContest/store";
import moment from "moment";
import { FC, useEffect, useState } from "react";
import ContestPromptModalLegacyLayout from "./Layout/Legacy";
import ContestPromptModalV3Layout from "./Layout/V3";

interface ContestPromptModalProps {
  prompt: string;
  hidePrompt?: boolean;
}

const ContestPromptModal: FC<ContestPromptModalProps> = ({ prompt, hidePrompt = false }) => {
  const { isV3, votesClose } = useContestStore(state => state);
  const [isPromptOpen, setIsPromptOpen] = useState(moment().isBefore(votesClose) && !hidePrompt);
  const [contestType, contestTitle, contestSummary, contestEvalute] = prompt.split("|");

  useEffect(() => {
    setIsPromptOpen(!hidePrompt);
  }, [hidePrompt]);

  return (
    <>
      {isV3 ? (
        <ContestPromptModalV3Layout
          contestTitle={contestTitle}
          contestType={contestType}
          contestSummary={contestSummary}
          contestEvaluate={contestEvalute}
          isPromptOpen={isPromptOpen}
          setIsPromptOpen={setIsPromptOpen}
        />
      ) : (
        <ContestPromptModalLegacyLayout prompt={prompt} isPromptOpen={isPromptOpen} setIsPromptOpen={setIsPromptOpen} />
      )}
    </>
  );
};

export default ContestPromptModal;
