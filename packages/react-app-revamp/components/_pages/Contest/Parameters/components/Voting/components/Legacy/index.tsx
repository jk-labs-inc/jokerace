import { useContestStore } from "@hooks/useContest/store";
import ContestParametersVotingPrice from "../../../VotingPrice";
import { useShallow } from "zustand/shallow";
import { useReadContract } from "wagmi";
import Skeleton from "react-loading-skeleton";
import { EMPTY_MERKLE_ROOT } from "@components/_pages/Contest/Parameters/constants";

const ContestParametersVotingLegacy = () => {
  const { contestInfoData, contestAbi } = useContestStore(
    useShallow(state => ({
      contestInfoData: state.contestInfoData,
      contestAbi: state.contestAbi,
    })),
  );
  const {
    data: votingMerkleRoot,
    isLoading: isLoadingVotingMerkleRoot,
    isError: isErrorVotingMerkleRoot,
    refetch: refetchVotingMerkleRoot,
  } = useReadContract({
    address: contestInfoData.contestAddress as `0x${string}`,
    chainId: contestInfoData.contestChainId,
    abi: contestAbi,
    functionName: "votingMerkleRoot",
  });

  if (isLoadingVotingMerkleRoot) {
    return <Skeleton width={100} height={24} baseColor="#6A6A6A" highlightColor="#BB65FF" />;
  }

  if (isErrorVotingMerkleRoot) {
    return (
      <p className="text-[16px] text-negative-11">
        ruh-roh! we couldn't fetch voting details,{" "}
        <button onClick={() => refetchVotingMerkleRoot} className="text-neutral-11 font-bold">
          try again
        </button>
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <p className="text-[24px] text-neutral-11">voting</p>
      <ul className="pl-4 text-[16px] text-neutral-9">
        <>
          <li className="list-disc">
            {votingMerkleRoot === EMPTY_MERKLE_ROOT ? "anyone can vote" : "voting was allowlisted"}
          </li>
          <ContestParametersVotingPrice />
        </>
      </ul>
    </div>
  );
};

export default ContestParametersVotingLegacy;
