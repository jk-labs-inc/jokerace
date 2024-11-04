import { chains, config } from "@config/wagmi";
import { extractPathSegments } from "@helpers/extractPath";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { useContestStore } from "@hooks/useContest/store";
import { ContestStateEnum, useContestStateStore } from "@hooks/useContestState/store";
import { usePathname } from "next/navigation";
import { FC, useState } from "react";
import { useAccount } from "wagmi";
import EditContestPromptModal from "./components/Modal";
import { parsePrompt } from "@components/_pages/Contest/components/Prompt/utils";
import useEditContestPrompt from "@hooks/useEditContestPrompt";
import { switchChain } from "@wagmi/core";

interface EditContestPromptProps {
  canEditPrompt: boolean;
  prompt: string;
}

const EditContestPrompt: FC<EditContestPromptProps> = ({ canEditPrompt, prompt }) => {
  const { contestType, contestSummary, contestEvaluate, contestContactDetails } = parsePrompt(prompt);
  const { address, chain: accountChain } = useAccount();
  const pathname = usePathname();
  const { address: contestAddress, chainName: contestChainName } = extractPathSegments(pathname ?? "");
  const isOnCorrectChain = accountChain?.name.toLowerCase() === contestChainName.toLowerCase();
  const contestChainId = chains.find(chain => chain.name.toLowerCase() === contestChainName.toLowerCase())?.id;
  const { contestAuthorEthereumAddress, contestAbi } = useContestStore(state => state);
  const isAuthor = address === contestAuthorEthereumAddress;
  const { contestState } = useContestStateStore(state => state);
  const isCompletedOrCanceled =
    contestState === ContestStateEnum.Completed || contestState === ContestStateEnum.Canceled;
  const shouldRender = canEditPrompt && !isCompletedOrCanceled && isAuthor;
  const [isEditContestNameModalOpen, setIsEditContestNameModalOpen] = useState(false);
  const { editPrompt } = useEditContestPrompt({
    contestAbi,
    contestAddress,
  });
  const [newPrompt, setNewPrompt] = useState({
    summaryContent: contestSummary,
    evaluateContent: contestEvaluate,
    contactDetailsContent: contestContactDetails,
  });

  if (!shouldRender) return null;

  const handleOpenModal = () => setIsEditContestNameModalOpen(true);

  const handleEditPrompt = (newPrompt: {
    summaryContent: string;
    evaluateContent: string;
    contactDetailsContent: string;
  }) => {
    setNewPrompt(newPrompt);
  };

  const handleSavePrompt = async () => {
    if (!contestChainId) return;

    if (!isOnCorrectChain) await switchChain(config, { chainId: contestChainId });

    const formattedPrompt = `${contestType}|${newPrompt.summaryContent}|${newPrompt.evaluateContent}|${newPrompt.contactDetailsContent}`;

    editPrompt(formattedPrompt);
  };

  return (
    <>
      <button onClick={handleOpenModal}>
        <PencilSquareIcon className="w-6 h-6 text-neutral-11 hover:text-neutral-10 transition-colors duration-300 ease-in-out" />
      </button>

      <EditContestPromptModal
        prompt={newPrompt}
        isOpen={isEditContestNameModalOpen}
        setIsCloseModal={setIsEditContestNameModalOpen}
        handleEditPrompt={handleEditPrompt}
        handleSavePrompt={handleSavePrompt}
      />
    </>
  );
};

export default EditContestPrompt;
