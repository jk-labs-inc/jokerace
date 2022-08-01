import shallow from "zustand/shallow";
import Button from "@components/Button";
import DialogModal from "@components/DialogModal";
import FormField from "@components/FormField";
import FormInput from "@components/FormInput";
import { useStore as useStoreContest } from "@hooks/useContest/store";
import { useStore as useStoreCastVotes } from "@hooks/useCastVotes/store";
import { useEffect, useState } from "react";
import TrackerDeployTransaction from "@components/TrackerDeployTransaction";
import useCastVotes from "@hooks/useCastVotes";
import { CONTEST_STATUS } from "@helpers/contestStatus";

interface DialogModalVoteForProposalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const DialogModalVoteForProposal = (props: DialogModalVoteForProposalProps) => {
  const { pickedProposal, transactionData } = useStoreCastVotes(
    state => ({
      //@ts-ignore
      pickedProposal: state.pickedProposal,
      //@ts-ignore
      transactionData: state.transactionData,
    }),
    shallow,
  );
  const { listProposalsData, contestStatus, currentUserAvailableVotesAmount } = useStoreContest(
    state => ({
      //@ts-ignore
      currentUserAvailableVotesAmount: state.currentUserAvailableVotesAmount,
      //@ts-ignore
      listProposalsData: state.listProposalsData,
      //@ts-ignore
      contestStatus: state.contestStatus,
    }),
    shallow,
  );
  //@ts-ignore
  const { castVotes, isLoading, error, isSuccess } = useCastVotes();

  const [votesToCast, setVotesToCast] = useState(1);
  const [showForm, setShowForm] = useState(true);
  const [showDeploymentSteps, setShowDeploymentSteps] = useState(false);
  useEffect(() => {
    if (isSuccess) setShowForm(false);
    if (isLoading || error !== null) setShowForm(true);
    if (isLoading === true || error !== null || isSuccess === true) setShowDeploymentSteps(true);
  }, [isSuccess, isLoading, error]);

  useEffect(() => {
    if (props.isOpen === false && !isLoading) {
      setVotesToCast(1);
      setShowForm(true);
      setShowDeploymentSteps(false);
    }
  }, [props.isOpen, isLoading]);

  function onSubmitCastVotes(e: any) {
    e.preventDefault();
    castVotes(votesToCast);
  }

  return (
    <DialogModal title="Cast your votes" {...props}>
      {showDeploymentSteps && (
        <div className="animate-appear mt-2 mb-4">
          <TrackerDeployTransaction isSuccess={isSuccess} isError={error !== null} isLoading={isLoading} />
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

      {currentUserAvailableVotesAmount > 0 &&
        error !== null &&
        !isSuccess &&
        contestStatus === CONTEST_STATUS.VOTING_OPEN && (
          <>
            <Button onClick={onSubmitCastVotes} intent="neutral-outline" type="submit" className="mx-auto my-3">
              Try again
            </Button>
          </>
        )}

      {showForm === true && contestStatus === CONTEST_STATUS.VOTING_OPEN && currentUserAvailableVotesAmount > 0 && (
        <form className={isLoading === true ? "opacity-50 pointer-events-none" : ""} onSubmit={onSubmitCastVotes}>
          <FormField className="w-full">
            <FormField.Label
              htmlFor="votesToCast"
              hasError={votesToCast <= 0 || votesToCast > currentUserAvailableVotesAmount}
            >
              Add votes
            </FormField.Label>
            <FormInput
              required
              type="number"
              placeholder="0"
              min={0}
              step={0.000000001}
              onChange={e => {
                setVotesToCast(parseFloat(e.currentTarget.value));
              }}
              value={votesToCast}
              max={currentUserAvailableVotesAmount}
              aria-invalid={votesToCast <= 0 || votesToCast > currentUserAvailableVotesAmount ? "true" : "false"}
              name="votesToCast"
              id="votesToCast"
              disabled={isLoading}
              hasError={votesToCast <= 0 || votesToCast > currentUserAvailableVotesAmount === true}
              aria-describedby="input-votesToCast-helpblock-1 input-votesToCast-helpblock-2"
            />
            <div className="mt-2 my-1">
              <FormField.HelpBlock
                className="min:not-sr-only text-2xs flex flex-col space-y-1 text-neutral-11"
                id="input-contestaddress-helpblock-1"
                hasError={votesToCast <= 0 || votesToCast > currentUserAvailableVotesAmount}
              >
                <span>Available: {currentUserAvailableVotesAmount}</span>
                {pickedProposal !== null && (
                  <span>
                    Votes on submission: {new Intl.NumberFormat().format(listProposalsData[pickedProposal].votes)}{" "}
                  </span>
                )}
              </FormField.HelpBlock>
              <FormField.HelpBlock
                hasError={votesToCast <= 0 || votesToCast > currentUserAvailableVotesAmount === true}
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
