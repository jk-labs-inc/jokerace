import MainHeaderMobileLayout from "@components/Header/MainHeader/MobileLayout";
import DialogModalV3 from "@components/UI/DialogModalV3";
import EthereumAddress from "@components/UI/EtheuremAddress";
import VotingWidget from "@components/Voting";
import ContestPrompt from "@components/_pages/Contest/components/Prompt";
import ContestProposal from "@components/_pages/Contest/components/Proposal";
import ListProposalVotes from "@components/_pages/ListProposalVotes";
import { Proposal } from "@components/_pages/ProposalContent";
import {
  generateFacebookShareUrlForSubmission,
  generateLensShareUrlForSubmission,
  generateLinkedInShareUrlForSubmission,
  generateTwitterShareUrlForSubmission,
  generateUrlSubmissions,
} from "@helpers/share";
import { ArrowLeftIcon } from "@heroicons/react/outline";
import { ContestStatus, useContestStatusStore } from "@hooks/useContestStatus/store";
import { ProposalVotesWrapper } from "@hooks/useProposalVotes/store";
import { useUserStore } from "@hooks/useUser/store";
import { useAccountModal, useConnectModal } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import { FC } from "react";
import { useAccount } from "wagmi";

interface SubmissionPageMobileLayoutProps {
  address: string;
  chain: string;
  proposalId: string;
  prompt: string;
  proposal: Proposal;
  onClose?: () => void;
  onVote?: (amount: number, isUpvote: boolean) => void;
  onConnectWallet?: () => void;
}

const SubmissionPageMobileLayout: FC<SubmissionPageMobileLayoutProps> = ({
  address,
  chain,
  proposalId,
  prompt,
  proposal,
  onClose,
  onVote,
  onConnectWallet,
}) => {
  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { openAccountModal } = useAccountModal();
  const { contestStatus } = useContestStatusStore(state => state);
  const { currentUserAvailableVotesAmount, currentUserTotalVotesAmount } = useUserStore(state => state);
  const outOfVotes = currentUserAvailableVotesAmount === 0 && currentUserTotalVotesAmount > 0;
  const isInPwaMode = window.matchMedia("(display-mode: standalone)").matches;

  return (
    <DialogModalV3 isOpen={true} title="submissionMobile" isMobile>
      <div className={`flex justify-between ${isInPwaMode ? "mt-0" : "mt-12"}`}>
        <ArrowLeftIcon width={24} onClick={onClose} />
        <div className="flex gap-2 self-end">
          <a
            className={`flex items-center  bg-neutral-12 rounded-full overflow-hidden w-8 h-8`}
            href={generateLensShareUrlForSubmission(address, chain, proposalId)}
            target="_blank"
          >
            <Image
              width={32}
              height={32}
              className="object-cover grayscale"
              src="/socials/lens-leaf.svg"
              alt="avatar"
            />
          </a>
          <a
            className={`flex items-center  bg-neutral-13 rounded-full overflow-hidden w-8 h-8`}
            href={generateTwitterShareUrlForSubmission(address, chain, proposalId)}
            target="_blank"
          >
            <Image
              width={28}
              height={28}
              className="object-cover m-auto"
              src="/socials/twitter-light.svg"
              alt="avatar"
            />
          </a>
          <a
            className={`flex items-center rounded-full overflow-hidden w-8 h-8`}
            href={generateFacebookShareUrlForSubmission(address, chain, proposalId)}
            target="_blank"
          >
            <Image
              width={30}
              height={30}
              className="object-cover m-auto grayscale"
              src="/socials/share-submission/facebook.svg"
              alt="avatar"
            />
          </a>
          <a
            className={`flex items-center   rounded-full overflow-hidden w-8 h-8`}
            href={generateLinkedInShareUrlForSubmission(address, chain, proposalId)}
            target="_blank"
          >
            <Image
              width={34}
              height={34}
              className="object-cover m-auto grayscale"
              src="/socials/share-submission/linkedin.svg"
              alt="avatar"
            />
          </a>

          <div
            className={`flex items-center bg-true-black rounded-full border-neutral-11 border overflow-hidden w-8 h-8`}
            onClick={() =>
              navigator.share({
                url: generateUrlSubmissions(address, chain, proposalId),
              })
            }
          >
            <Image src="/forward.svg" alt="share" className="object-cover m-auto" width={15} height={13} />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-8 mt-9">
        <div className="flex flex-col gap-4">
          <ContestPrompt type="modal" prompt={prompt} hidePrompt />
          <EthereumAddress ethereumAddress={proposal.authorEthereumAddress} shortenOnFallback={true} />
        </div>
        <ContestProposal proposal={proposal} contestStatus={contestStatus} />
        <div className="flex flex-col gap-8">
          {contestStatus === ContestStatus.VotingOpen && (
            <>
              <p className="text-neutral-11 text-[24px] font-bold">add votes</p>
              {isConnected ? (
                currentUserAvailableVotesAmount > 0 ? (
                  <VotingWidget amountOfVotes={currentUserAvailableVotesAmount} onVote={onVote} />
                ) : outOfVotes ? (
                  <p className="text-[16px] text-neutral-11">
                    looks like you’ve used up all your votes this contest <br />
                    feel free to try connecting another wallet to see if it has more votes!
                  </p>
                ) : (
                  <p className="text-[16px] text-neutral-11">
                    unfortunately your wallet didn’t qualify to vote in this contest <br />
                    feel free to try connecting another wallet!
                  </p>
                )
              ) : (
                <p className="text-[16px] font-bold text-neutral-11 mt-2">
                  <span className="text-positive-11 cursor-pointer" onClick={onConnectWallet}>
                    connect wallet
                  </span>{" "}
                  to see if you qualify
                </p>
              )}
            </>
          )}
          {proposal.votes > 0 && (
            <ProposalVotesWrapper>
              <ListProposalVotes proposalId={proposalId} />
            </ProposalVotesWrapper>
          )}
        </div>
        <div className="mt-12">
          <MainHeaderMobileLayout
            isConnected={isConnected}
            address={address}
            openAccountModal={openAccountModal}
            openConnectModal={openConnectModal}
          />
        </div>
      </div>
    </DialogModalV3>
  );
};

export default SubmissionPageMobileLayout;
