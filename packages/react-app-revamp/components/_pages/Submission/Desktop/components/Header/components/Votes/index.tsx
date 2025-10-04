import { formatNumberAbbreviated } from "@helpers/formatNumber";
import { ordinalize } from "@helpers/ordinalize";
import useContestConfigStore from "@hooks/useContestConfig/store";
import useProposalVotes from "@hooks/useProposalVotes";
import { motion } from "motion/react";
import AnimatedVoteText from "./components/AnimatedVoteText";

const SubmissionPageDesktopVotes = () => {
  const { contestConfig, proposalId } = useContestConfigStore(state => state);
  const { votes, rank, isTied, isLoading, isError } = useProposalVotes({
    contestAddress: contestConfig.address,
    proposalId: proposalId,
    chainId: contestConfig.chainId,
    abi: contestConfig.abi,
  });

  if (isLoading) {
    return (
      <div className="relative w-40 h-8 bg-neutral-16 border border-positive-13 rounded-2xl overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-40 h-8 bg-neutral-16 border border-positive-13 rounded-2xl flex items-center justify-center">
        <span className="text-positive-14 text-base font-bold">error</span>
      </div>
    );
  }

  if (votes === 0) return null;

  //TODO: check ties
  return (
    <div className="min-w-[200px] h-8 bg-neutral-16 border border-positive-13 rounded-2xl flex items-center justify-center px-4">
      <AnimatedVoteText votes={votes}>
        {rank > 0 ? (
          <>
            {rank}
            <sup>{ordinalize(rank).suffix}</sup> place | {formatNumberAbbreviated(votes)}{" "}
            {votes === 1 ? "vote" : "votes"}
          </>
        ) : (
          `${formatNumberAbbreviated(votes)} ${votes === 1 ? "vote" : "votes"}`
        )}
      </AnimatedVoteText>
    </div>
  );
};

export default SubmissionPageDesktopVotes;
