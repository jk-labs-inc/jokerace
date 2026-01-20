/* eslint-disable react/no-unescaped-entities */
import useContestConfigStore from "@hooks/useContestConfig/store";
import { ContestStatus, useContestStatusStore } from "@hooks/useContestStatus/store";
import { useSubmitQualification } from "@hooks/useUserSubmitQualification";
import { useWallet } from "@hooks/useWallet";
import { FC } from "react";
import Skeleton from "react-loading-skeleton";
import { useShallow } from "zustand/shallow";
import ContestPromptModal from "./components/Modal";
import ContestPromptPage from "./components/Page";

interface ContestPromptProps {
  prompt: string;
  type: "page" | "modal";
  hidePrompt?: boolean;
}

const ContestPrompt: FC<ContestPromptProps> = ({ prompt, type, hidePrompt = false }) => {
  const { isConnected, userAddress } = useWallet();
  const { contestConfig } = useContestConfigStore(state => state);
  const contestStatus = useContestStatusStore(useShallow(state => state.contestStatus));
  const isVotingOpenOrClosed =
    contestStatus === ContestStatus.VotingOpen || contestStatus === ContestStatus.VotingClosed;

  const { isLoading, isError } = useSubmitQualification({
    address: contestConfig.address,
    chainId: contestConfig.chainId,
    abi: contestConfig.abi,
    userAddress: userAddress,
    enabled: isConnected,
  });

  const renderQualifierMessage = () => {
    if (isVotingOpenOrClosed) return null;
    if (isLoading) {
      return <Skeleton height={16} width={200} baseColor="#706f78" highlightColor="#FFE25B" duration={1} />;
    } else if (isError) {
      return (
        <p className="text-[16px] text-negative-11 font-bold">
          ruh roh, we couldn't load your entry qualification state! please reload the page
        </p>
      );
    }
  };

  if (type === "page") {
    return (
      <div className="flex flex-col gap-8">
        <ContestPromptPage prompt={prompt} />
        {isConnected && renderQualifierMessage()}
      </div>
    );
  } else {
    return <ContestPromptModal prompt={prompt} hidePrompt={hidePrompt} />;
  }
};

export default ContestPrompt;
