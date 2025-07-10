import Comments from "@components/Comments";
import Onramp from "@components/Onramp";
import { ButtonSize } from "@components/UI/ButtonV3";
import DialogModalV3 from "@components/UI/DialogModalV3";
import Tabs from "@components/UI/Tabs";
import VotingWidget from "@components/Voting";
import ContestProposal from "@components/_pages/Contest/components/Prompt/Proposal";
import { chains, config } from "@config/wagmi";
import { extractPathSegments } from "@helpers/extractPath";
import { getNativeTokenSymbol } from "@helpers/nativeToken";
import { getTotalCharge } from "@helpers/totalCharge";
import useCastVotes from "@hooks/useCastVotes";
import { useContestStore } from "@hooks/useContest/store";
import { ContestStatus, useContestStatusStore } from "@hooks/useContestStatus/store";
import useDeleteProposal from "@hooks/useDeleteProposal";
import { VoteType } from "@hooks/useDeployContest/types";
import { useProposalStore } from "@hooks/useProposal/store";
import { useProposalVotes } from "@hooks/useProposalVotes";
import { useUserStore } from "@hooks/useUser/store";
import { switchChain } from "@wagmi/core";
import { compareVersions } from "compare-versions";
import { COMMENTS_VERSION, ProposalData } from "lib/proposal";
import { usePathname } from "next/navigation";
import { FC, useCallback, useEffect, useState } from "react";
import SimpleBar from "simplebar-react";
import { useAccount } from "wagmi";
import DialogMaxVotesAlert from "../DialogMaxVotesAlert";
import ListProposalVotes from "../ListProposalVotes";
import DialogModalProposalHeader from "./components/Header";
import DialogModalProposalVoteCountdown from "./components/VoteCountdown";
import { useShallow } from "zustand/shallow";
import useCurrentPricePerVoteWithRefetch from "@hooks/useCurrentPricePerVoteWithRefetch";
import { useConnectModal } from "@rainbow-me/rainbowkit";

interface DialogModalProposalProps {
  contestInfo: {
    address: string;
    chain: string;
    chainId: number;
    version: string;
  };
  isOpen: boolean;
  prompt: string;
  proposalId: string;
  proposalData: ProposalData | null;
  isProposalLoading: boolean;
  isProposalError: boolean;
  setIsOpen?: (isOpen: boolean) => void;
  onClose?: () => void;
  onVote?: (amount: number) => void;
  onPreviousEntry?: () => void;
  onNextEntry?: () => void;
  onConnectWallet?: () => void;
}

enum DialogTab {
  Voters = "Voters",
  Comments = "Comments",
}

const DialogModalProposal: FC<DialogModalProposalProps> = ({
  contestInfo,
  isOpen,
  setIsOpen,
  prompt,
  proposalData,
  proposalId,
  isProposalLoading,
  isProposalError,
  onClose,
  onVote,
  onPreviousEntry,
  onNextEntry,
  onConnectWallet,
}) => {
  const asPath = usePathname();
  const { chainName } = extractPathSegments(asPath ?? "");
  const {
    canDeleteProposal,
    deleteProposal,
    isLoading: isDeleteLoading,
    isSuccess: isDeleteSuccess,
  } = useDeleteProposal();
  const contestStatus = useContestStatusStore(useShallow(state => state.contestStatus));
  const { isConnected, address: userAddress, chainId: userChainId } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { isSuccess } = useCastVotes();
  const { listProposalsIds } = useProposalStore(state => state);
  const stringifiedProposalsIds = listProposalsIds.map(id => id.toString());
  const currentIndex = stringifiedProposalsIds.indexOf(proposalId);
  const totalProposals = listProposalsIds.length;
  const { charge, votesOpen, votesClose, contestAuthorEthereumAddress, contestAbi, anyoneCanVote } = useContestStore(
    useShallow(state => ({
      charge: state.charge,
      votesOpen: state.votesOpen,
      votesClose: state.votesClose,
      contestAuthorEthereumAddress: state.contestAuthorEthereumAddress,
      contestAbi: state.contestAbi,
      anyoneCanVote: state.anyoneCanVote,
    })),
  );
  const isPayPerVote = charge?.voteType === VoteType.PerVote;
  const { currentUserAvailableVotesAmount, currentUserTotalVotesAmount } = useUserStore(state => state);
  const outOfVotes = currentUserAvailableVotesAmount === 0 && currentUserTotalVotesAmount > 0;
  const commentsAllowed = compareVersions(contestInfo.version, COMMENTS_VERSION) == -1 ? false : true;
  const chainCurrencySymbol = chains.find(chain => chain.id === contestInfo.chainId)?.nativeCurrency?.symbol;
  const [activeTab, setActiveTab] = useState<DialogTab>(DialogTab.Voters);
  const dialogTabs = Object.values(DialogTab);
  const { addressesVoted } = useProposalVotes(contestInfo.address, proposalId, contestInfo.chainId);
  const [showMaxVoteConfirmation, setShowMaxVoteConfirmation] = useState(false);
  const [pendingVote, setPendingVote] = useState<{ amount: number } | null>(null);
  const [totalCharge, setTotalCharge] = useState("");
  const nativeToken = getNativeTokenSymbol(chainName);
  const [showOnrampModal, setShowOnrampModal] = useState(false);
  const allowDelete = canDeleteProposal(
    userAddress,
    contestAuthorEthereumAddress,
    proposalData?.proposal?.authorEthereumAddress ?? "",
    contestStatus,
  );
  const isUserOnCorrectChain = userChainId === contestInfo.chainId;
  const {
    currentPricePerVote,
    isLoading: isCurrentPricePerVoteLoading,
    isError: isCurrentPricePerVoteError,
    isPreloading: isCurrentPricePerVotePreloading,
    isRefetching: isCurrentPricePerVoteRefetching,
    isRefetchError: isCurrentPricePerVoteRefetchError,
  } = useCurrentPricePerVoteWithRefetch({
    address: contestInfo.address,
    abi: contestAbi,
    chainId: contestInfo.chainId,
    version: contestInfo.version,
    votingClose: votesClose,
  });
  const earlyReturn =
    isCurrentPricePerVoteLoading ||
    isCurrentPricePerVoteError ||
    isCurrentPricePerVotePreloading ||
    isCurrentPricePerVoteRefetching ||
    isCurrentPricePerVoteRefetchError ||
    !currentPricePerVote;

  const tabsOptionalInfo = {
    ...(addressesVoted?.length > 0 && { [DialogTab.Voters]: addressesVoted.length }),
    ...(proposalData?.numberOfComments && { [DialogTab.Comments]: proposalData.numberOfComments }),
  };

  useEffect(() => {
    if (isSuccess) setIsOpen?.(false);
  }, [isSuccess, setIsOpen]);

  useEffect(() => {
    if (isDeleteSuccess) setIsOpen?.(false);
  }, [isDeleteSuccess, setIsOpen]);

  const onSubmitCastVotes = useCallback(
    (amount: number) => {
      if (earlyReturn) {
        return;
      }

      if (amount === currentUserAvailableVotesAmount && isPayPerVote) {
        setShowMaxVoteConfirmation(true);
        setPendingVote({ amount });
        setTotalCharge(getTotalCharge(amount, currentPricePerVote));
        return;
      }

      onVote?.(amount);
    },
    [currentUserAvailableVotesAmount, isPayPerVote, currentPricePerVote, onVote],
  );

  const confirmMaxVote = () => {
    if (pendingVote) {
      onVote?.(pendingVote.amount);
      setShowMaxVoteConfirmation(false);
      setPendingVote(null);
    }
  };

  const cancelMaxVote = () => {
    setShowMaxVoteConfirmation(false);
    setPendingVote(null);
  };

  const handleDeleteProposal = async () => {
    if (!isUserOnCorrectChain) {
      await switchChain(config, { chainId: contestInfo.chainId });
    }

    await deleteProposal([proposalId]);
  };

  if (isProposalError) {
    return (
      <DialogModalV3
        title="Proposal"
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        className="xl:w-[1000px] 3xl:w-[800px]"
        onClose={onClose}
      >
        {" "}
        <div
          className="flex flex-col gap-8 md:pl-[50px] lg:pl-[100px] mt-[20px] md:mt-[60px] pb-[60px]"
          id="custom-modal"
        >
          <p className="text-[16px] text-negative-11 font-bold">
            ruh-roh! An error occurred when retrieving this proposal; try refreshing the page.
          </p>
        </div>
      </DialogModalV3>
    );
  }

  return (
    <DialogModalV3 title="Proposal" isOpen={isOpen} setIsOpen={setIsOpen} className="xl:w-[1200px]" onClose={onClose}>
      <div className="flex flex-col h-full" id="custom-modal">
        <div className={`flex items-center justify-between pb-4 border-b border-neutral-2`}>
          {isProposalLoading ? (
            <p className="loadingDots font-sabo text-[18px] text-neutral-9">loading submission info</p>
          ) : (
            <DialogModalProposalHeader
              proposalData={proposalData}
              currentIndex={currentIndex}
              totalProposals={totalProposals}
              isProposalLoading={isProposalLoading}
              allowDelete={allowDelete}
              onPreviousEntry={onPreviousEntry}
              onNextEntry={onNextEntry}
              onDeleteProposal={handleDeleteProposal}
            />
          )}
        </div>

        <div className="flex flex-1">
          <div className="w-[60%] xl:w-[800px]">
            <div className="h-[calc(90vh-180px)] w-full">
              {proposalData?.proposal && (
                <SimpleBar style={{ maxHeight: "100%", height: "100%" }} className="h-full" autoHide={false}>
                  <div className="py-4 pr-6 h-full">
                    <ContestProposal
                      proposal={proposalData.proposal}
                      contestStatus={contestStatus}
                      proposalId={proposalId}
                      displaySocials
                    />
                  </div>
                </SimpleBar>
              )}
            </div>
          </div>

          <div className="w-[40%] xl:w-[400px] h-[calc(90vh-180px)] overflow-hidden border-l border-neutral-2">
            <div className="flex flex-col h-full">
              {contestStatus === ContestStatus.VotingOpen ? (
                <div className="border-b border-neutral-2 py-4 pl-4">
                  {showOnrampModal ? (
                    <div className="pr-1">
                      <Onramp
                        chain={chainName ?? ""}
                        asset={chainCurrencySymbol ?? ""}
                        onGoBack={() => setShowOnrampModal(false)}
                      />
                    </div>
                  ) : showMaxVoteConfirmation ? (
                    <DialogMaxVotesAlert
                      token={nativeToken ?? ""}
                      totalCost={totalCharge}
                      onConfirm={confirmMaxVote}
                      onCancel={cancelMaxVote}
                      buttonSize={ButtonSize.FULL}
                    />
                  ) : !isConnected ? (
                    <button className="text-[16px] text-neutral-11" onClick={openConnectModal}>
                      <span className="text-positive-11 font-bold">connect your wallet</span>{" "}
                      {anyoneCanVote ? "to add votes" : "to see if you qualify"}
                    </button>
                  ) : outOfVotes ? (
                    <p className="text-[16px] text-neutral-11">
                      looks like you've used up all your votes this contest <br />
                      feel free to try connecting another wallet to see if it has more votes!
                    </p>
                  ) : (
                    <VotingWidget
                      proposalId={proposalId}
                      amountOfVotes={currentUserAvailableVotesAmount}
                      onVote={onSubmitCastVotes}
                      onAddFunds={() => {
                        setShowOnrampModal(true);
                      }}
                    />
                  )}
                </div>
              ) : (
                contestStatus === ContestStatus.SubmissionOpen &&
                votesOpen && <DialogModalProposalVoteCountdown votesOpen={votesOpen} />
              )}
              <div className="flex flex-col flex-1 h-0 min-h-0">
                <div className="pt-4 pl-4">
                  <Tabs
                    tabs={dialogTabs}
                    activeTab={activeTab}
                    onChange={tab => setActiveTab(tab as DialogTab)}
                    optionalInfo={Object.keys(tabsOptionalInfo).length > 0 ? tabsOptionalInfo : undefined}
                  />
                </div>

                <div className="flex-1 overflow-auto pt-4 pl-4">
                  {activeTab === DialogTab.Voters && (
                    <div className="h-full">
                      {proposalData?.proposal?.votes && proposalData?.proposal?.votes > 0 ? (
                        <ListProposalVotes proposalId={proposalId} votedAddresses={proposalData?.votedAddresses} />
                      ) : (
                        <div className="flex flex-col gap-5">
                          <p className="text-[16px] text-neutral-11 font-bold">no one has voted on this entry yet!</p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === DialogTab.Comments && (
                    <div className="h-full">
                      {commentsAllowed && proposalData ? (
                        <Comments
                          contestAddress={contestInfo.address}
                          contestChainId={contestInfo.chainId}
                          proposalId={proposalId}
                          numberOfComments={proposalData?.numberOfComments}
                        />
                      ) : null}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DialogModalV3>
  );
};

export default DialogModalProposal;
