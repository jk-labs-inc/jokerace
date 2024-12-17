import { parsePrompt } from "@components/_pages/Contest/components/Prompt/utils";
import { chains, config } from "@config/wagmi";
import { extractPathSegments } from "@helpers/extractPath";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { useContestStore } from "@hooks/useContest/store";
import { ContestStateEnum, useContestStateStore } from "@hooks/useContestState/store";
import useEditContestPrompt from "@hooks/useEditContestPrompt";
import { switchChain } from "@wagmi/core";
import { usePathname } from "next/navigation";
import { FC, useState } from "react";
import { useAccount } from "wagmi";
import EditContestPromptModal, { EditPrompt } from "./components/Modal";

interface EditContestPromptProps {
  canEditPrompt: boolean;
  prompt: string;
}

const EditContestPrompt: FC<EditContestPromptProps> = ({ canEditPrompt, prompt }) => {
  const { contestType, contestSummary, contestEvaluate, contestContactDetails, contestImageUrl } = parsePrompt(prompt);
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
  const [newPrompt, setNewPrompt] = useState<EditPrompt>({
    contestSummary,
    contestEvaluate,
    contestContactDetails,
  });

  if (!shouldRender) return null;

  const handleOpenModal = () => setIsEditContestNameModalOpen(true);

  const handleEditPrompt = (prompt: EditPrompt) => {
    setNewPrompt(prompt);
  };

  const handleSavePrompt = async () => {
    if (!contestChainId) return;

    if (!isOnCorrectChain) await switchChain(config, { chainId: contestChainId });

    const formattedPrompt = new URLSearchParams({
      type: contestType,
      imageUrl: contestImageUrl ?? "",
      summarize: newPrompt.contestSummary,
      evaluateVoters: newPrompt.contestEvaluate,
      contactDetails: newPrompt.contestContactDetails ?? "",
    }).toString();

    editPrompt(formattedPrompt);
  };

  return (
    <>
      <button onClick={handleOpenModal}>
        <PencilSquareIcon className="w-6 h-6 text-neutral-11 hover:text-neutral-10 transition-colors duration-300 ease-in-out" />
      </button>

      <EditContestPromptModal
        isOpen={isEditContestNameModalOpen}
        prompt={newPrompt}
        setIsCloseModal={setIsEditContestNameModalOpen}
        handleEditPrompt={handleEditPrompt}
        handleSavePrompt={handleSavePrompt}
      />
    </>
  );
};

export default EditContestPrompt;
