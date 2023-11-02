import EthereumAddress from "@components/UI/EtheuremAddress";
import { toastError } from "@components/UI/Toast";
import { chains } from "@config/wagmi";
import { extractPathSegments } from "@helpers/extractPath";
import { formatNumber } from "@helpers/formatNumber";
import { useProposalVotes } from "@hooks/useProposalVotes";
import { useRouter } from "next/router";
import { FC, useEffect } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

interface ListProposalVotesProps {
  proposalId: string;
}

const VotersList: FC<{ votesPerAddress: any }> = ({ votesPerAddress }) => (
  <div className="flex flex-col gap-4 md:w-[350px]">
    {votesPerAddress &&
      Object.keys(votesPerAddress).map((address: string, index, self) => (
        <div
          key={address}
          className={`flex justify-between items-end text-[16px] font-bold pb-3 ${
            index !== self.length - 1 ? "border-b border-neutral-10" : ""
          }`}
        >
          <EthereumAddress ethereumAddress={address} shortenOnFallback={true} />
          <p>{formatNumber(votesPerAddress[address])} votes</p>
        </div>
      ))}
  </div>
);

const LoadingSkeleton: FC<{ count: number }> = ({ count }) => (
  <div className="flex flex-col gap-4 md:w-[350px]">
    {new Array(count).fill(null).map((_, index) => (
      <div key={index} className="flex justify-between items-center pb-3 border-b border-neutral-10">
        <div className="flex items-center gap-2">
          <Skeleton circle height={32} width={32} />
          <Skeleton width={100} height={16} className="mt-2" />
        </div>
        <Skeleton width={50} height={16} />
      </div>
    ))}
  </div>
);

export const ListProposalVotes: FC<ListProposalVotesProps> = ({ proposalId }) => {
  const { asPath } = useRouter();
  const { chainName, address } = extractPathSegments(asPath);
  const chainId = chains.filter(chain => chain.name.toLowerCase().replace(" ", "") === chainName)?.[0]?.id;
  const { votesData } = useProposalVotes(address, proposalId, chainId);

  useEffect(() => {
    if (!votesData) return;
  }, [votesData]);

  return (
    <SkeletonTheme baseColor="#706f78" highlightColor="#FFE25B" duration={1}>
      <div className="flex gap-4 items-center">
        <p className="text-[24px] text-neutral-11 font-bold">voters</p>
      </div>
      <div className="flex flex-col gap-5 mb-12 sm:mb-0">
        <div className="flex flex-col gap-4 md:w-[350px]">
          <VotersList votesPerAddress={votesData} />
        </div>
      </div>
    </SkeletonTheme>
  );
};

export default ListProposalVotes;
