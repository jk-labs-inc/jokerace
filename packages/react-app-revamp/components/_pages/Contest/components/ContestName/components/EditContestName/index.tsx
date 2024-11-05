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

interface EditContestNameProps {
  contestName: string;
  canEditTitle: boolean;
}

const EditContestName: FC<EditContestNameProps> = ({ contestName, canEditTitle }) => {
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
  const shouldRender = canEditTitle && !isCompletedOrCanceled && isAuthor;
  const [isEditContestNameModalOpen, setIsEditContestNameModalOpen] = useState(false);
  const { editTitle } = useEditContestTitle({
    contestAbi,
    contestAddress,
  });

  if (!shouldRender) return null;

  const handleOpenModal = () => setIsEditContestNameModalOpen(true);

  const handleEditContestName = async (value: string) => {
    if (!contestChainId) return;

    if (!isOnCorrectChain) await switchChain(config, { chainId: contestChainId });
    editTitle(value);
  };

  return (
    <>
      <button onClick={handleOpenModal}>
        <PencilSquareIcon className="w-6 h-6 text-neutral-11 hover:text-neutral-10 transition-colors duration-300 ease-in-out" />
      </button>

      <EditContestNameModal
        contestName={contestName}
        isOpen={isEditContestNameModalOpen}
        setIsCloseModal={setIsEditContestNameModalOpen}
        handleEditContestName={handleEditContestName}
      />
    </>
  );
};

export default EditContestName;
