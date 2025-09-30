import VotingQualifierError from "@components/_pages/Contest/components/StickyCards/components/VotingQualifier/shared/Error";
import { formatBalance } from "@helpers/formatBalance";
import useContestConfigStore from "@hooks/useContestConfig/store";
import { FC } from "react";
import Skeleton from "react-loading-skeleton";
import { useBalance } from "wagmi";
import { useShallow } from "zustand/shallow";

interface MyVotesProps {
  userAddress: string;
  costToVote: bigint;
  onAddFunds?: () => void;
}

const MyVotes: FC<MyVotesProps> = ({ costToVote, userAddress, onAddFunds }) => {
  const chainId = useContestConfigStore(useShallow(state => state.contestConfig.chainId));
  const { data, isLoading, isError, refetch } = useBalance({
    address: userAddress as `0x${string}`,
    chainId: chainId,
  });
  const insufficientBalance = data ? data.value < costToVote : false;

  if (isLoading) return <Skeleton width={100} height={24} baseColor="#6A6A6A" highlightColor="#BB65FF" />;
  if (isError) return <VotingQualifierError onClick={() => refetch()} />;

  if (!data) return null;

  return (
    <div
      className={`flex justify-between pl-6 pr-2 items-center text-[16px] ${
        insufficientBalance ? "text-negative-11" : "text-neutral-11"
      } transition-colors duration-300`}
    >
      <p className="text-neutral-9 font-bold">
        balance: {formatBalance(data.formatted)} {data.symbol}
      </p>

      <button
        onClick={onAddFunds}
        className="w-24 h-6 flex items-center justify-center bg-positive-15 border border-positive-16 rounded-[40px] text-positive-11 font-bold hover:bg-positive-16 transition-colors duration-300 ease-in-out"
      >
        add funds
      </button>
    </div>
  );
};

export default MyVotes;
