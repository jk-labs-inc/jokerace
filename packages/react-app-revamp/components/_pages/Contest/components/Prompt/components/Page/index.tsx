import { useContestStore } from "@hooks/useContest/store";
import { FC } from "react";
import ContestPromptPageLegacyLayout from "./components/Layout/Legacy";
import ContestPromptPageV3Layout from "./components/Layout/V3";

interface ContestPromptPageProps {
  prompt: string;
}

const ContestPromptPage: FC<ContestPromptPageProps> = ({ prompt }) => {
  const { isV3 } = useContestStore(state => state);

  return (
    <>{isV3 ? <ContestPromptPageV3Layout prompt={prompt} /> : <ContestPromptPageLegacyLayout prompt={prompt} />}</>
  );
};

export default ContestPromptPage;
