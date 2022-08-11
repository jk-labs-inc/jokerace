import shallow from "zustand/shallow";
import Button from "@components/Button";
import DialogModal from "@components/DialogModal";
import FormField from "@components/FormField";
import FormTextarea from "@components/FormTextarea";
import TrackerDeployTransaction from "@components/TrackerDeployTransaction";
import { ROUTE_CONTEST_PROPOSAL } from "@config/routes";
import useSubmitProposal from "@hooks/useSubmitProposal";
import { Interweave } from "interweave";
import { UrlMatcher } from "interweave-autolink";
import Link from "next/link";
import { useRouter } from "next/router";
import { useStore as useStoreSubmitProposal } from "@hooks/useSubmitProposal/store";
import { useStore as useStoreContest } from "@hooks/useContest/store";
import { useEffect, useState } from "react";
import { CONTEST_STATUS } from "@helpers/contestStatus";
interface DialogModalSendProposalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const DialogModalSendProposal = (props: DialogModalSendProposalProps) => {
  const { asPath } = useRouter();
  //@ts-ignore
  const { sendProposal, isLoading, error, isSuccess } = useSubmitProposal();
  //@ts-ignore
  const { transactionData } = useStoreSubmitProposal();
  const {
    amountOfTokensRequiredToSubmitEntry,
    currentUserAvailableVotesAmount,
    listProposalsIds,
    currentUserProposalCount,
    contestMaxNumberSubmissionsPerUser,
    contestMaxProposalCount,
    contestStatus,
    contestPrompt,
  } = useStoreContest(
    state => ({
      //@ts-ignore
      contestPrompt: state.contestPrompt,
      //@ts-ignore
      currentUserAvailableVotesAmount: state.currentUserAvailableVotesAmount,
      //@ts-ignore
      contestMaxNumberSubmissionsPerUser: state.contestMaxNumberSubmissionsPerUser,
      //@ts-ignore
      contestMaxProposalCount: state.contestMaxProposalCount,
      //@ts-ignore
      currentUserProposalCount: state.currentUserProposalCount,
      //@ts-ignore
      listProposalsIds: state.listProposalsIds,
      //@ts-ignore
      amountOfTokensRequiredToSubmitEntry: state.amountOfTokensRequiredToSubmitEntry,
      //@ts-ignore
      contestStatus: state.contestStatus,
    }),
    shallow,
  );
  const [proposal, setProposal] = useState("");
  const [showForm, setShowForm] = useState(true);
  const [showDeploymentSteps, setShowDeploymentSteps] = useState(false);

  useEffect(() => {
    if (isSuccess) setShowForm(false);
    if (isLoading || error !== null) setShowForm(true);
    if (isLoading === true || error !== null || isSuccess === true) setShowDeploymentSteps(true);
  }, [isSuccess, isLoading, error]);

  useEffect(() => {
    if (props.isOpen === false && !isLoading) {
      setProposal("");
      setShowForm(true);
      setShowDeploymentSteps(false);
    }
  }, [props.isOpen, isLoading]);

  function onSubmitProposal(e: any) {
    e.preventDefault();
    sendProposal(proposal.trim());
  }

  function onClickSubmitAnotherProposal() {
    setProposal("");
    setShowForm(true);
    setShowDeploymentSteps(false);
  }

  return (
    <DialogModal title="Submit your proposal" {...props}>
      {showDeploymentSteps && (
        <div className="animate-appear mt-2 mb-4">
          <TrackerDeployTransaction isSuccess={isSuccess} isError={error !== null} isLoading={isLoading} />
        </div>
      )}

      {showDeploymentSteps && transactionData?.proposalId && (
        <div className="mt-2 mb-4 animate-appear relative">
          <Link
            href={{
              pathname: ROUTE_CONTEST_PROPOSAL,
              //@ts-ignore
              query: {
                chain: asPath.split("/")[2],
                address: asPath.split("/")[3],
                proposal: transactionData.proposalId,
              },
            }}
          >
            <a target="_blank">
              View proposal <span className="link">here</span>
            </a>
          </Link>
        </div>
      )}
      {error !== null && !isSuccess && contestStatus === CONTEST_STATUS.SUBMISSIONS_OPEN && (
        <>
          <Button onClick={onSubmitProposal} intent="neutral-outline" type="submit" className="mx-auto my-3">
            Try again
          </Button>
        </>
      )}

      {currentUserAvailableVotesAmount >= amountOfTokensRequiredToSubmitEntry &&
      currentUserProposalCount < contestMaxNumberSubmissionsPerUser &&
      listProposalsIds.length < contestMaxProposalCount &&
      contestStatus === CONTEST_STATUS.SUBMISSIONS_OPEN ? (
        <>
          {contestPrompt && (
            <p className="mb-4 text-neutral-12 leading-tight text-2xs font-medium with-link-highlighted">
              <Interweave content={contestPrompt} matchers={[new UrlMatcher("url")]} />
            </p>
          )}
          {showForm === true ? (
            <>
              <form className={isLoading === true ? "opacity-50 pointer-events-none" : ""} onSubmit={onSubmitProposal}>
                <FormField className="w-full">
                  <FormField.Label htmlFor="proposal" hasError={false}>
                    Your proposal
                  </FormField.Label>
                  <FormTextarea
                    hasError={false}
                    onChange={e => {
                      setProposal(e.currentTarget.value);
                    }}
                    value={proposal}
                    required
                    className="w-full min-h-[15ch]"
                    disabled={isLoading}
                    placeholder="What do you think ?"
                    name="proposal"
                    id="proposal"
                    aria-describedby="input-proposal-helpblock-1 input-proposal-helpblock-2"
                  />
                  <div className="mt-2 my-1">
                    <FormField.HelpBlock
                      className="min:not-sr-only text-2xs text-neutral-11"
                      id="input-contestaddress-helpblock-1"
                      hasError={false}
                    >
                      To submit media, input a link to the file online, starting in https:// and ending in .jpg, .png,
                      etc.
                    </FormField.HelpBlock>
                  </div>
                </FormField>
                <Button
                  disabled={proposal.trim().length === 0 || isLoading}
                  type="submit"
                  className={isLoading || error !== null ? "hidden" : "mt-3"}
                >
                  Submit!
                </Button>
              </form>
            </>
          ) : (
            <div className="flex pt-3 items-center justify-center animate-appear">
              <Button intent="neutral-outline" onClick={onClickSubmitAnotherProposal}>
                Submit another proposal
              </Button>
            </div>
          )}
        </>
      ) : (
        <>
          <p className="italic font-bold text-neutral-11">You can&apos;t submit more proposals.</p>
        </>
      )}
    </DialogModal>
  );
};

export default DialogModalSendProposal;
