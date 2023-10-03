import { FC } from "react";
import ContestPromptModal from "./components/Modal";
import ContestPromptPage from "./components/Page";

interface ContestPromptProps {
  prompt: string;
  type: "page" | "modal";
  hidePrompt?: boolean;
}

const ContestPrompt: FC<ContestPromptProps> = ({ prompt, type, hidePrompt = false }) => {
  if (type === "page") {
    return <ContestPromptPage prompt={prompt} />;
  } else {
    return <ContestPromptModal prompt={prompt} hidePrompt={hidePrompt} />;
  }
};

export default ContestPrompt;
