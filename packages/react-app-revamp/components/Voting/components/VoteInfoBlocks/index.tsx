import VotingQualifierError from "@components/_pages/Contest/components/StickyCards/components/VotingQualifier/shared/Error";
import ChargeInfo from "@components/ChargeLayout/components/Vote/components/ChargeInfo";
import MyVotes from "@components/ChargeLayout/components/Vote/components/MyVotes";
import TotalCharge from "@components/ChargeLayout/components/Vote/components/TotalCharge";
import useContestConfigStore from "@hooks/useContestConfig/store";
import { FC } from "react";
import Skeleton from "react-loading-skeleton";
import { useReadContract } from "wagmi";
import { useShallow } from "zustand/shallow";
import { VoteInfoBlocksProps } from "./types";

const VoteInfoBlocks: FC<VoteInfoBlocksProps> = props => {
  const contestConfig = useContestConfigStore(useShallow(state => state.contestConfig));
  const {
    data: costToVote,
    isLoading,
    isError,
    refetch,
  } = useReadContract({
    address: contestConfig.address,
    abi: contestConfig.abi,
    chainId: contestConfig.chainId,
    functionName: "costToVote",
    query: {
      select: data => {
        return data as bigint;
      },
    },
  });

  if (isLoading) return <Skeleton width={100} height={24} baseColor="#6A6A6A" highlightColor="#BB65FF" />;
  if (isError) return <VotingQualifierError onClick={() => refetch()} />;

  if (!costToVote) return null;

  switch (props.type) {
    case "my-votes":
      return <MyVotes userAddress={props.userAddress} costToVote={costToVote} onAddFunds={props.onAddFunds} />;
    case "charge-info":
      return <ChargeInfo costToVote={costToVote} />;
    case "total-charge":
      return <TotalCharge costToVote={costToVote} amountOfVotes={props.amountOfVotes} />;
    default:
      return null;
  }
};

export default VoteInfoBlocks;
