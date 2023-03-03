import Button from "@components/Button";
import DialogModal from "@components/DialogModal";
import FormField from "@components/FormField";
import FormInput from "@components/FormInput";
import TrackerDeployTransaction from "@components/TrackerDeployTransaction";
import { RadioGroup } from "@headlessui/react";
import { CONTEST_STATUS } from "@helpers/contestStatus";
import useCastVotes from "@hooks/useCastVotes";
import { useCastVotesStore } from "@hooks/useCastVotes/store";
import { useStore as useStoreContest } from "@hooks/useContest/store";
import { useEffect, useState } from "react";
import shallow from "zustand/shallow";

interface DialogModalVoteForProposalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const DialogModalVoteForProposal = (props: DialogModalVoteForProposalProps) => {
  const { pickedProposal, transactionData, castPositiveAmountOfVotes, setCastPositiveAmountOfVotes } =
    useCastVotesStore(state => state);
  const { downvotingAllowed, listProposalsData, contestStatus, currentUserAvailableVotesAmount } = useStoreContest(
    state => ({
      //@ts-ignore
      downvotingAllowed: state.downvotingAllowed,
      //@ts-ignore
      currentUserAvailableVotesAmount: state.currentUserAvailableVotesAmount,
      //@ts-ignore
      listProposalsData: state.listProposalsData,
      //@ts-ignore
      contestStatus: state.contestStatus,
    }),
    shallow,
  );
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

  function onSubmitCastVotes(e: any) {
    e.preventDefault();
    castVotes(votesToCast, castPositiveAmountOfVotes);
  }

  return (
    <DialogModal title="Cast your votes" {...props}>
      {showDeploymentSteps && (
        <div className="animate-appear mt-2 mb-4">
          <TrackerDeployTransaction
            textError={error}
            isSuccess={isSuccess}
            isError={error !== null}
            isLoading={isLoading}
          />
        </div>
      )}

      {showDeploymentSteps && transactionData?.transactionHref && (
        <div className="my-2 animate-appear">
          <a rel="nofollow noreferrer" target="_blank" href={transactionData?.transactionHref}>
            View transaction <span className="link">here</span>
          </a>
        </div>
      )}

      {currentUserAvailableVotesAmount === 0 ||
        (showDeploymentSteps && transactionData?.transactionHref && (
          <div className="mt-2 mb-4 animate-appear">
            <Button onClick={() => props.setIsOpen(false)}>Go back</Button>
          </div>
        ))}

      {currentUserAvailableVotesAmount > 0 && error && !isSuccess && contestStatus === CONTEST_STATUS.VOTING_OPEN && (
        <>
          <Button onClick={onSubmitCastVotes} intent="neutral-outline" type="submit" className="mx-auto my-3">
            Try again
          </Button>
        </>
      )}

      {showForm && contestStatus === CONTEST_STATUS.VOTING_OPEN && currentUserAvailableVotesAmount > 0 && (
        <form className={isLoading === true ? "opacity-50 pointer-events-none" : ""} onSubmit={onSubmitCastVotes}>
          {downvotingAllowed === true && (
            <RadioGroup
              className="overflow-hidden text-xs font-medium mb-6 divide-i divide-neutral-4 flex rounded-full border-solid border border-neutral-4"
              value={castPositiveAmountOfVotes}
              onChange={setCastPositiveAmountOfVotes}
            >
              <RadioGroup.Option className="relative w-1/2 p-1 flex items-center justify-center" value={true}>
                {({ checked }) => (
                  <>
                    <span
                      className={`${
                        checked ? "bg-positive-9" : ""
                      } cursor-pointer absolute top-0 left-0 w-full h-full block`}
                    />
                    <span className={`cursor-pointer relative z-10 ${checked ? "text-positive-1 font-bold" : ""}`}>
                      Upvote
                    </span>
                  </>
                )}
              </RadioGroup.Option>
              <RadioGroup.Option className="relative w-1/2 p-1 flex items-center justify-center" value={false}>
                {({ checked }) => (
                  <>
                    <span
                      className={`${
                        checked ? "bg-positive-9" : ""
                      } cursor-pointer absolute top-0 left-0 w-full h-full block`}
                    />
                    <span className={`cursor-pointer relative z-10 ${checked ? "text-positive-1 font-bold" : ""}`}>
                      Downvote
                    </span>
                  </>
                )}
              </RadioGroup.Option>
            </RadioGroup>
          )}
          <FormField className="w-full">
            <FormField.Label
              htmlFor="votesToCast"
              hasError={votesToCast <= 0 || votesToCast > currentUserAvailableVotesAmount}
            >
              Cast votes
            </FormField.Label>
            <div className="flex items-center">
              {downvotingAllowed && (
                <span className="text-neutral-9 font-bold text-lg pie-1ex">
                  {castPositiveAmountOfVotes ? "+" : "-"}
                </span>
              )}
              <FormInput
                required
                type="number"
                placeholder="0"
                min={0}
                step={0.000000001}
                onChange={e => {
                  setVotesToCast(parseFloat(e.currentTarget.value));
                }}
                className="w-full"
                value={votesToCast}
                max={currentUserAvailableVotesAmount}
                aria-invalid={votesToCast <= 0 || votesToCast > currentUserAvailableVotesAmount ? "true" : "false"}
                name="votesToCast"
                id="votesToCast"
                disabled={isLoading}
                hasError={votesToCast <= 0 || votesToCast > currentUserAvailableVotesAmount}
                aria-describedby="input-votesToCast-helpblock-1 input-votesToCast-helpblock-2"
              />
            </div>
            <div className="mt-2 my-1">
              <FormField.HelpBlock
                className="min:not-sr-only text-2xs flex flex-col space-y-1 text-neutral-11"
                id="input-contestaddress-helpblock-1"
                hasError={votesToCast <= 0 || votesToCast > currentUserAvailableVotesAmount}
              >
                <span>Available: {currentUserAvailableVotesAmount}</span>
                {pickedProposal && (
                  <span>
                    Votes on submission: {new Intl.NumberFormat().format(listProposalsData[pickedProposal].votes)}{" "}
                  </span>
                )}
              </FormField.HelpBlock>
              <FormField.HelpBlock
                hasError={votesToCast <= 0 || votesToCast > currentUserAvailableVotesAmount}
                id="input-contestaddress-helpblock-2"
              >
                Your amount of votes must be positive and not superior to the number of voting tokens you hold.
              </FormField.HelpBlock>
            </div>
          </FormField>
          <Button
            disabled={votesToCast <= 0 || votesToCast > currentUserAvailableVotesAmount || isLoading}
            className={isLoading || error !== null ? "hidden" : "mt-3"}
            type="submit"
          >
            Vote!
          </Button>
        </form>
      )}
    </DialogModal>
  );
};

export default DialogModalVoteForProposal;
