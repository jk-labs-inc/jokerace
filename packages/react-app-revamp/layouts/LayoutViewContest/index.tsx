import ContestParameters from "@components/Parameters";
import ContestRewards from "@components/Rewards";
import Button from "@components/UI/Button";
import ButtonV3 from "@components/UI/ButtonV3";
import EthereumAddress from "@components/UI/EtheuremAddress";
import Loader from "@components/UI/Loader";
import { useShowRewardsStore } from "@components/_pages/Create/pages/ContestDeploying";
import CreateContestRewards from "@components/_pages/Create/pages/ContestRewards";
import { ofacAddresses } from "@config/ofac-addresses/ofac-addresses";
import { ROUTE_CONTEST_PROPOSAL, ROUTE_VIEW_CONTEST } from "@config/routes";
import { ArrowLeftIcon } from "@heroicons/react/solid";
import { CastVotesWrapper } from "@hooks/useCastVotes/store";
import { useContest } from "@hooks/useContest";
import { ContestWrapper, useContestStore } from "@hooks/useContest/store";
import useContestEvents from "@hooks/useContestEvents";
import { ContestStatus, useContestStatusStore } from "@hooks/useContestStatus/store";
import { ContractFactoryWrapper } from "@hooks/useContractFactory";
import { DeleteProposalWrapper } from "@hooks/useDeleteProposal/store";
import { DeployRewardsWrapper } from "@hooks/useDeployRewards/store";
import { FundRewardsWrapper } from "@hooks/useFundRewards/store";
import { ProposalWrapper } from "@hooks/useProposal/store";
import { RewardsWrapper } from "@hooks/useRewards/store";
import { SubmitProposalWrapper } from "@hooks/useSubmitProposal/store";
import { UserWrapper } from "@hooks/useUser/store";
import { switchNetwork } from "@wagmi/core";
import { isBefore } from "date-fns";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { SkeletonTheme } from "react-loading-skeleton";
import { useAccount, useNetwork } from "wagmi";
import { getLayout as getBaseLayout } from "./../LayoutBase";
import ContestTab from "./Contest";
import ContestLayoutTabs, { Tab } from "./Tabs";

const LayoutViewContest = (props: any) => {
  const { query, asPath, pathname, reload } = useRouter();
  const account = useAccount({
    onConnect({ address }) {
      if (address != undefined && ofacAddresses.includes(address?.toString())) {
        location.href = "https://www.google.com/search?q=what+are+ofac+sanctions";
      }
    },
  });
  const { chain } = useNetwork();
  const showRewards = useShowRewardsStore(state => state.showRewards);
  const { isLoading, address, fetchContestInfo, isSuccess, error, retry, onSearch, chainId, chainName, setChainId } =
    useContest();

  const { submissionsOpen, votesClose, votesOpen, contestAuthorEthereumAddress, contestName } = useContestStore(
    state => state,
  );

  const { setContestStatus } = useContestStatusStore(state => state);
  const { displayReloadBanner } = useContestEvents();
  const [tab, setTab] = useState<Tab>(Tab.Contest);

  useEffect(() => {
    const now = moment();
    const formattedSubmissionOpen = moment(submissionsOpen);
    const formattedVotingOpen = moment(votesOpen);
    const formattedVotingClose = moment(votesClose);

    let timeoutId: NodeJS.Timeout;

    const setAndScheduleStatus = (status: ContestStatus, nextStatus: ContestStatus, nextTime: moment.Moment) => {
      setContestStatus(status);
      if (now.isBefore(nextTime)) {
        const msUntilNext = nextTime.diff(now);
        timeoutId = setTimeout(() => {
          setContestStatus(nextStatus);
        }, msUntilNext);
      }
    };

    if (now.isBefore(formattedSubmissionOpen)) {
      setAndScheduleStatus(ContestStatus.ContestOpen, ContestStatus.SubmissionOpen, formattedSubmissionOpen);
    } else if (now.isBefore(formattedVotingOpen)) {
      setAndScheduleStatus(ContestStatus.SubmissionOpen, ContestStatus.VotingOpen, formattedVotingOpen);
    } else if (now.isBefore(formattedVotingClose)) {
      setAndScheduleStatus(ContestStatus.VotingOpen, ContestStatus.VotingClosed, formattedVotingClose);
    } else {
      setContestStatus(ContestStatus.VotingClosed);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [submissionsOpen, votesOpen, votesClose]);

  useEffect(() => {
    fetchContestInfo();
  }, [chain?.id, chainId, asPath.split("/")[2], asPath.split("/")[3]]);

  useEffect(() => {
    if (account?.connector) {
      account?.connector.on("change", data => {
        //@ts-ignore
        setChainId(data?.chain?.id);
      });
    }
  }, [account?.connector]);

  const renderTabs = useMemo<ReactNode>(() => {
    switch (tab) {
      case Tab.Contest:
        return (
          <div className="animate-apppear">
            <ContestTab />
          </div>
        );
      case Tab.Rewards:
        return (
          <div className="mt-8 animate-appear">
            <ContestRewards />
          </div>
        );
      case Tab.Parameters:
        return (
          <div className="mt-8 animate-appear">
            <ContestParameters />
          </div>
        );
      default:
        break;
    }
  }, [tab]);

  return (
    <div className={`${isLoading ? "pointer-events-none" : ""} w-full px-7 lg:w-[700px] mx-auto`}>
      <div
        className={`md:pt-5 md:pb-20 flex flex-col ${
          pathname === ROUTE_CONTEST_PROPOSAL ? "md:col-span-12" : "md:col-span-9"
        }`}
      >
        {isLoading && (
          <div className="animate-appear">
            <Loader scale="page">Loading contest info...</Loader>
          </div>
        )}
        {account?.address && chain?.id !== chainId && votesClose && isBefore(new Date(), votesClose) && (
          <div className="animate-appear flex text-center items-center flex-col my-10 mx-auto text-neutral-11">
            <p className="font-bold text-[24px]">Looks like you&apos;re using the wrong network.</p>
            <p className="mt-2 mb-4 text-neutral-11 text-[16px]">
              You need to use {asPath.split("/")[2]} to interact with this contest.
            </p>
            <ButtonV3
              size="large"
              onClick={() => {
                switchNetwork?.({ chainId });
              }}
              color="bg-gradient-next"
            >
              Switch network
            </ButtonV3>
          </div>
        )}

        {
          <>
            {(account?.address && chain?.id !== chainId) === false && error && !isLoading && (
              <div className="my-6 md:my-0 animate-appear flex flex-col">
                <div className="bg-negative-1 py-4 px-5 rounded-md border-solid border border-negative-4">
                  <p className="text-sm font-bold text-negative-10 text-center">
                    Something went wrong while fetching this contest.
                  </p>
                </div>
                {error?.message === "CALL_EXCEPTION" ? (
                  <div className="animate-appear text-center my-3 space-y-3">
                    <p>
                      Looks like this contract doesn&apos;t exist on {chain?.name}. <br /> Try switching to another
                      network.
                    </p>
                  </div>
                ) : (
                  <Button
                    onClick={() => retry()}
                    className="mt-5 mb-8 w-full mx-auto py-1 xs:w-auto xs:min-w-fit-content"
                    intent="neutral-outline"
                  >
                    Try again
                  </Button>
                )}
              </div>
            )}

            <SkeletonTheme baseColor="#706f78" highlightColor="#FFE25B" duration={2}>
              {isSuccess && !error && !isLoading && (
                <>
                  {displayReloadBanner === true && (
                    <div className="w-full bg-true-black text-[16px] text-center flex flex-col sticky top-0 gap-1 z-10 border border-neutral-11 rounded-[10px] py-2 items-center shadow-timer-container">
                      <div className="flex flex-col">
                        <span>Let&apos;s refresh!</span>
                        <p className="font-normal">Looks like live updates were frozen.</p>
                      </div>
                      <ButtonV3 color="bg-gradient-create" onClick={() => reload()}>
                        Refresh
                      </ButtonV3>
                    </div>
                  )}
                  <div className="animate-appear pt-3 md:pt-0">
                    {pathname === ROUTE_CONTEST_PROPOSAL && (
                      <div>
                        <Link
                          className="text-neutral-12 hover:text-opacity-75 focus:underline flex items-center mb-2 text-2xs"
                          href={{
                            pathname: ROUTE_VIEW_CONTEST,
                            query: {
                              chain: query.chain,
                              address: query.address,
                            },
                          }}
                        >
                          <ArrowLeftIcon className="mie-1 w-4" />
                          Back to contest
                        </Link>
                      </div>
                    )}

                    <div className="flex flex-col mt-10">
                      <p className="text-[40px] text-primary-10 font-sabo">{contestName}</p>
                      <p className="text-[24px] text-primary-10 font-bold break-all">
                        by{" "}
                        <EthereumAddress
                          ethereumAddress={contestAuthorEthereumAddress}
                          shortenOnFallback
                          displayLensProfile={false}
                          textualVersion
                        />
                      </p>
                    </div>

                    <div className="mt-4 gap-3 flex flex-col">
                      <hr className="border-neutral-10" />
                      <ContestLayoutTabs
                        contestAddress={address}
                        chain={chainName ?? ""}
                        contestName={contestName}
                        onChange={tab => setTab(tab)}
                      />
                      <hr className="border-neutral-10" />
                    </div>

                    {renderTabs}

                    {props.children}

                    {showRewards && <CreateContestRewards />}
                  </div>
                </>
              )}
            </SkeletonTheme>
          </>
        }
      </div>
    </div>
  );
};

export const getLayout = (page: any) => {
  return getBaseLayout(
    <ErrorBoundary
      fallbackRender={({ error, resetErrorBoundary }) => (
        <div role="alert" className="container m-auto sm:text-center">
          <p className="text-2xl font-black mb-3 text-primary-10">Something went wrong</p>
          <p className="text-neutral-12 mb-6">{error?.message ?? error}</p>
          <Button onClick={resetErrorBoundary}>Try again</Button>
        </div>
      )}
    >
      <ContestWrapper>
        <ProposalWrapper>
          <UserWrapper>
            <SubmitProposalWrapper>
              <CastVotesWrapper>
                <DeleteProposalWrapper>
                  <ContractFactoryWrapper>
                    <DeployRewardsWrapper>
                      <RewardsWrapper>
                        <FundRewardsWrapper>
                          <LayoutViewContest>{page}</LayoutViewContest>
                        </FundRewardsWrapper>
                      </RewardsWrapper>
                    </DeployRewardsWrapper>
                  </ContractFactoryWrapper>
                </DeleteProposalWrapper>
              </CastVotesWrapper>
            </SubmitProposalWrapper>
          </UserWrapper>
        </ProposalWrapper>
      </ContestWrapper>
    </ErrorBoundary>,
  );
};
