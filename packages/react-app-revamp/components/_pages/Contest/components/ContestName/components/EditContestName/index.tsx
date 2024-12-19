import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { useContestStore } from "@hooks/useContest/store";
import { ContestStateEnum, useContestStateStore } from "@hooks/useContestState/store";
import { FC, useState } from "react";
import { useAccount } from "wagmi";
import EditContestNameModal from "./components/Modal";
import useEditContestTitle from "@hooks/useEditContestTitle";
import { usePathname } from "next/navigation";
import { extractPathSegments } from "@helpers/extractPath";
import { switchChain } from "@wagmi/core";
import { chains, config } from "@config/wagmi";
import useEditContestPrompt from "@hooks/useEditContestPrompt";
import { parsePrompt } from "../../../Prompt/utils";
import useEditContestTitleAndImage from "@hooks/useEditContestTitleAndImage";

interface EditContestNameProps {
  contestName: string;
  contestPrompt: string;
  canEditTitle: boolean;
}

const EditContestName: FC<EditContestNameProps> = ({ contestName, contestPrompt, canEditTitle }) => {
  const { address, chain: accountChain } = useAccount();
  const pathname = usePathname();
  const { contestType, contestSummary, contestEvaluate, contestContactDetails, contestImageUrl } =
    parsePrompt(contestPrompt);
  const { address: contestAddress, chainName: contestChainName } = extractPathSegments(pathname ?? "");
  const isOnCorrectChain = accountChain?.name.toLowerCase() === contestChainName.toLowerCase();
  const contestChainId = chains.find(chain => chain.name.toLowerCase() === contestChainName.toLowerCase())?.id;
  const { contestAuthorEthereumAddress, contestAbi } = useContestStore(state => state);
  const isAuthor = address === contestAuthorEthereumAddress;
  const { contestState } = useContestStateStore(state => state);
  const isCompletedOrCanceled =
    contestState === ContestStateEnum.Completed || contestState === ContestStateEnum.Canceled;
  const shouldRender = canEditTitle && !isCompletedOrCanceled && isAuthor;
  const [isEditContestNameModalOpen, setIsEditContestNameModalOpen] = useState(false);
  const { editTitle } = useEditContestTitle({
    contestAbi,
    contestAddress,
  });
  const { editPrompt } = useEditContestPrompt({
    contestAbi,
    contestAddress,
  });
  const { updateContestTitleAndImage } = useEditContestTitleAndImage({
    contestAbi,
    contestAddress,
  });

  if (!shouldRender) return null;

  const handleOpenModal = () => setIsEditContestNameModalOpen(true);

  const handleEditContestNameAndImage = async (value: string, imageValue?: string) => {
    // early returns for validation
    if (!contestChainId) return;

    // ensure correct chain
    if (!isOnCorrectChain) {
      await switchChain(config, { chainId: contestChainId });
    }

    // create formatted prompt if image is being updated
    const getFormattedPrompt = (newImageUrl: string) => {
      return new URLSearchParams({
        type: contestType,
        imageUrl: newImageUrl,
        summarize: contestSummary,
        evaluateVoters: contestEvaluate,
        contactDetails: contestContactDetails,
      }).toString();
    };

    const isTitleChanged = value !== contestName;
    const isImageChanged = imageValue !== contestImageUrl;

    // handle both title and image changes
    if (isTitleChanged && isImageChanged) {
      const formattedPrompt = getFormattedPrompt(imageValue ?? "");
      await updateContestTitleAndImage(value, formattedPrompt);

      return;
    }

    // handle individual changes
    if (isTitleChanged) {
      await editTitle(value);
    }

    if (isImageChanged) {
      const formattedPrompt = getFormattedPrompt(imageValue ?? "");
      await editPrompt(formattedPrompt);
    }
  };

  return (
    <>
      <button onClick={handleOpenModal}>
        <PencilSquareIcon className="w-6 h-6 text-neutral-11 hover:text-neutral-10 transition-colors duration-300 ease-in-out" />
      </button>

      <EditContestNameModal
        contestName={contestName}
        contestImageUrl={contestImageUrl}
        isOpen={isEditContestNameModalOpen}
        setIsCloseModal={setIsEditContestNameModalOpen}
        handleEditContestNameAndImage={handleEditContestNameAndImage}
      />
    </>
  );
};

export default EditContestName;
