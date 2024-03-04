import { useContestStore } from "@hooks/useContest/store";
import { BigNumber } from "ethers";
import { useAccount, useReadContract } from "wagmi";

export const useFetchUserVotesOnProposal = (contestAddress: string, proposalId: string) => {
  const { contestAbi } = useContestStore(state => state);
  const { address, chainId } = useAccount();
  const currentUserVotesOnProposal = useReadContract({
    address: contestAddress as `0x${string}`,
    abi: contestAbi,
    chainId: chainId,
    functionName: "proposalAddressVotes",
    args: [proposalId, address],
    query: {
      select: (data: unknown) => {
        const [positiveVotes, negativeVotes] = data as [BigNumber, BigNumber];

        const currentUserPositiveVotesOnProposal = BigNumber.from(positiveVotes);
        const currentUserNegativeVotesOnProposal = BigNumber.from(negativeVotes);
        const currentUserVotesOnProposal = currentUserPositiveVotesOnProposal.sub(currentUserNegativeVotesOnProposal);

        const currentUserVotesOnProposalFormatted = currentUserVotesOnProposal
          .div(BigNumber.from(10).pow(18))
          .toNumber();

        return currentUserVotesOnProposalFormatted;
      },
      enabled: !!contestAbi && !!proposalId && !!address,
    },
  });

  return { currentUserVotesOnProposal, refetch: currentUserVotesOnProposal.refetch };
};
