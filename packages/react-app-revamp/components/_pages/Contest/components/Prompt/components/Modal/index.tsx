import { useContestStore } from "@hooks/useContest/store";
import moment from "moment";
import { FC, useEffect, useState } from "react";
import ContestPromptModalLegacyLayout from "./components/Layout/Legacy";
import ContestPromptModalV3Layout from "./components/Layout/V3";
import { useShallow } from "zustand/react/shallow";

interface ContestPromptModalProps {
  prompt: string;
  hidePrompt?: boolean;
}

const ContestPromptModal: FC<ContestPromptModalProps> = ({ prompt, hidePrompt = false }) => {
  const { isV3, votesClose } = useContestStore(
    useShallow(state => ({
      isV3: state.isV3,
      votesClose: state.votesClose,
    })),
  );
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
