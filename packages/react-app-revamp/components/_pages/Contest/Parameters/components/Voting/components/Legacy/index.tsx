import { EMPTY_MERKLE_ROOT } from "@components/_pages/Contest/Parameters/constants";
import useContestConfigStore from "@hooks/useContestConfig/store";
import Skeleton from "react-loading-skeleton";
import { useReadContract } from "wagmi";
import { useShallow } from "zustand/shallow";
import ContestParametersVotingPrice from "../../../VotingPrice";

const ContestParametersVotingLegacy = () => {
  const { contestConfig } = useContestConfigStore(useShallow(state => state));
  const {
    data: votingMerkleRoot,
    isLoading: isLoadingVotingMerkleRoot,
    isError: isErrorVotingMerkleRoot,
    refetch: refetchVotingMerkleRoot,
  } = useReadContract({
    address: contestConfig.address,
    chainId: contestConfig.chainId,
    abi: contestConfig.abi,
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
