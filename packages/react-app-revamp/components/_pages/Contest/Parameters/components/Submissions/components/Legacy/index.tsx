import { EMPTY_MERKLE_ROOT } from "@components/_pages/Contest/Parameters/constants";
import { useContestStore } from "@hooks/useContest/store";
import Skeleton from "react-loading-skeleton";
import { useReadContract } from "wagmi";
import { useShallow } from "zustand/shallow";


const ContestParametersSubmissionsLegacy = () => {
  const { contestInfoData, contestAbi } = useContestStore(
    useShallow(state => ({
      contestInfoData: state.contestInfoData,
      contestAbi: state.contestAbi,
    })),
  );
  const {
    data: submissionMerkleRoot,
    isLoading: isLoadingSubmissionMerkleRoot,
    isError: isErrorSubmissionMerkleRoot,
    refetch: refetchSubmissionMerkleRoot,
  } = useReadContract({
    address: contestInfoData.contestAddress as `0x${string}`,
    chainId: contestInfoData.contestChainId,
    abi: contestAbi,
    functionName: "submissionMerkleRoot",
  });

  if (isLoadingSubmissionMerkleRoot) {
    return <Skeleton width={100} height={24} baseColor="#6A6A6A" highlightColor="#BB65FF" />;
  }

  if (isErrorSubmissionMerkleRoot) {
    return (
      <p className="text-[16px] text-negative-11">
        ruh-roh! we couldn't fetch submission details,{" "}
        <button onClick={() => refetchSubmissionMerkleRoot} className="text-neutral-11 font-bold">
          try again
        </button>
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <p className="text-[24px] text-neutral-11">entering</p>
      <ul className="pl-4 text-[16px] text-neutral-9">
        <li className="list-disc">
          {submissionMerkleRoot === EMPTY_MERKLE_ROOT ? "anyone can enter" : "entering was allowlisted"}
        </li>
      </ul>
    </div>
  );
};

export default ContestParametersSubmissionsLegacy;
