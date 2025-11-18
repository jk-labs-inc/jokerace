import { config } from "@config/wagmi";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { useContestStore } from "@hooks/useContest/store";
import useContestConfigStore from "@hooks/useContestConfig/store";
import { ContestStateEnum, useContestStateStore } from "@hooks/useContestState/store";
import useEditContestPrompt from "@hooks/useEditContestPrompt";
import useEditContestTitle from "@hooks/useEditContestTitle";
import useEditContestTitleAndImage from "@hooks/useEditContestTitleAndImage";
import { switchChain } from "@wagmi/core";
import { FC, useState } from "react";
import { useAccount } from "wagmi";
import { useShallow } from "zustand/shallow";
import { parsePrompt } from "../../../Prompt/utils";
import EditContestNameModal from "./components/Modal";
interface EditContestNameProps {
  contestName: string;
  contestPrompt: string;
  canEditTitle: boolean;
}

const EditContestName: FC<EditContestNameProps> = ({ contestName, contestPrompt, canEditTitle }) => {
  const { address, chain: accountChain } = useAccount();
  const { contestSummary, contestEvaluate, contestContactDetails, contestImageUrl } = parsePrompt(contestPrompt);
  const { contestConfig } = useContestConfigStore(useShallow(state => state));
  const isOnCorrectChain = accountChain?.name.toLowerCase() === contestConfig.chainName.toLowerCase();
  const { contestAuthorEthereumAddress } = useContestStore(state => state);
  const isAuthor = address === contestAuthorEthereumAddress;
  const { contestState } = useContestStateStore(state => state);
  const isCompletedOrCanceled =
    contestState === ContestStateEnum.Completed || contestState === ContestStateEnum.Canceled;
  const shouldRender = canEditTitle && !isCompletedOrCanceled && isAuthor;
  const [isEditContestNameModalOpen, setIsEditContestNameModalOpen] = useState(false);
  const { editTitle } = useEditContestTitle({
    contestAbi: contestConfig.abi,
    contestAddress: contestConfig.address,
  });
  const { editPrompt } = useEditContestPrompt({
    contestAbi: contestConfig.abi,
    contestAddress: contestConfig.address,
  });
  const { updateContestTitleAndImage } = useEditContestTitleAndImage({
    contestAbi: contestConfig.abi,
    contestAddress: contestConfig.address,
  });

  if (!shouldRender) return null;

  const handleOpenModal = () => setIsEditContestNameModalOpen(true);

  const handleEditContestNameAndImage = async (value: string, imageValue?: string) => {
    // early returns for validation
    if (!contestConfig.chainId) return;

    // ensure correct chain
    if (!isOnCorrectChain) {
      await switchChain(config, { chainId: contestConfig.chainId });
    }

    // create formatted prompt if image is being updated
    const getFormattedPrompt = (newImageUrl: string) => {
      return new URLSearchParams({
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
