import Button from "@components/UI/Button";
import DialogModal from "@components/UI/DialogModal";
import DialogModalV3 from "@components/UI/DialogModalV3";
import EthereumAddress from "@components/UI/EtheuremAddress";
import EtheuremAddress from "@components/UI/EtheuremAddress";
import FormField from "@components/UI/FormField";
import FormInput from "@components/UI/FormInput";
import TrackerDeployTransaction from "@components/UI/TrackerDeployTransaction";
import VotingWidget from "@components/Voting";
import { RadioGroup } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/outline";
import useCastVotes from "@hooks/useCastVotes";
import { useCastVotesStore } from "@hooks/useCastVotes/store";
import { useContestStore } from "@hooks/useContest/store";
import { useProposalStore } from "@hooks/useProposal/store";
import useUser from "@hooks/useUser";
import { useUserStore } from "@hooks/useUser/store";
import LayoutContestPrompt from "@layouts/LayoutViewContest/Prompt";
import LayoutContestProposal from "@layouts/LayoutViewContest/Proposal";
import { FC, useEffect, useState } from "react";
import { Proposal } from "../ProposalContent";

interface DialogModalVoteForProposalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  proposal: Proposal;
}

export const DialogModalVoteForProposal: FC<DialogModalVoteForProposalProps> = (
  props: DialogModalVoteForProposalProps,
) => {
  const { pickedProposal, transactionData, castPositiveAmountOfVotes, setCastPositiveAmountOfVotes } =
    useCastVotesStore(state => state);
  const { downvotingAllowed, contestPrompt } = useContestStore(state => state);
  const { listProposalsData } = useProposalStore(state => state);
  const { currentUserAvailableVotesAmount } = useUserStore(state => state);
  const { updateCurrentUserVotes } = useUser();

  const { castVotes, isLoading, error, isSuccess } = useCastVotes();

  const [votesToCast, setVotesToCast] = useState(
    currentUserAvailableVotesAmount < 1 ? currentUserAvailableVotesAmount : 1,
  );
  const [showForm, setShowForm] = useState(true);
  const [showDeploymentSteps, setShowDeploymentSteps] = useState(false);

  useEffect(() => {
    if (isSuccess) setShowForm(false);
    if (isLoading || error) setShowForm(true);
    if (isLoading || error || isSuccess) setShowDeploymentSteps(true);
  }, [isSuccess, isLoading, error]);

  useEffect(() => {
    if (!props.isOpen && !isLoading) {
      setVotesToCast(currentUserAvailableVotesAmount < 1 ? currentUserAvailableVotesAmount : 1);
      setShowForm(true);
      setShowDeploymentSteps(false);
    }
  }, [props.isOpen, isLoading, currentUserAvailableVotesAmount]);

  function onSubmitCastVotes(amount: string, isPositive: boolean) {
    castVotes(parseFloat(amount), isPositive);
  }

  return (
    <DialogModalV3
      title="Cast your votes"
      isOpen={props.isOpen}
      setIsOpen={props.setIsOpen}
      className="xl:w-[1110px] 3xl:w-[1300px] h-[660px]"
    >
      <div className="flex flex-col gap-4 md:pl-[50px] lg:pl-[100px] mt-[120px]">
        <LayoutContestPrompt prompt={contestPrompt} hidePrompt />
        <EtheuremAddress
          ethereumAddress={props.proposal.authorEthereumAddress}
          shortenOnFallback={true}
          displayLensProfile={true}
        />

        <LayoutContestProposal proposal={props.proposal} />
        <VotingWidget
          amountOfVotes={currentUserAvailableVotesAmount}
          downvoteAllowed={downvotingAllowed}
          onVote={onSubmitCastVotes}
        />
      </div>
    </DialogModalV3>
  );
};

export default DialogModalVoteForProposal;
