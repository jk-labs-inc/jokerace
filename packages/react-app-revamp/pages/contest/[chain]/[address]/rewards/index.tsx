import Button from "@components/UI/Button";
import Loader from "@components/UI/Loader";
import DialogCheckBalanceRewardsModule from "@components/_pages/DialogCheckBalanceRewardsModule";
import DialogFundRewardsModule from "@components/_pages/DialogFundRewardsModule";
import DialogWithdrawFundsFromRewardsModule from "@components/_pages/DialogWithdrawFundsFromRewardsModule";
import ButtonWithdrawERC20Reward from "@components/_pages/DialogWithdrawFundsFromRewardsModule/ButtonWithdrawERC20Reward";
import ButtonWithdrawNativeReward from "@components/_pages/DialogWithdrawFundsFromRewardsModule/ButtonWithdrawNativeReward";
import RewardsWinner from "@components/_pages/RewardsWinner";
import { ofacAddresses } from "@config/ofac-addresses/ofac-addresses";
import { chains } from "@config/wagmi";
import { Tab } from "@headlessui/react";
import { useStore as useStoreContest } from "@hooks/useContest/store";
import { FundRewardsWrapper, useFundRewardsStore } from "@hooks/useFundRewards/store";
import { useRewardsModule } from "@hooks/useRewards";
import { RewardsWrapper, useRewardsStore } from "@hooks/useRewards/store";
import { getLayout as getLayoutContest } from "@layouts/LayoutViewContest";
import { isBefore } from "date-fns";
import Head from "next/head";
import { useRouter } from "next/router";
import { Fragment, useEffect, useState } from "react";
import { useAccount, useNetwork } from "wagmi";
interface PageProps {
  address: string;
}

const Page = (props: PageProps) => {
  const { address } = props;
  const { votesClose, isSuccess, isLoading, contestName, supportsRewardsModule } = useStoreContest((state: any) => ({
    votesClose: state.votesClose,
    isLoading: state.isLoading,
    contestName: state.contestName,
    isSuccess: state.isSuccess,
    supportsRewardsModule: state.supportsRewardsModule,
  }));

  const rewardsStore = useRewardsStore(state => state);
  const fundRewardsStore = useFundRewardsStore(state => state);
  const { getContestRewardsModule } = useRewardsModule();
  const [isWithdrawnFundsDialogOpen, setIsWithdrawFundsDialogOpen] = useState(false);
  const [isDialogCheckBalanceOpen, setIsDialogCheckBalanceOpen] = useState(false);
  const currentAccount = useAccount({
    onConnect({ address }) {
      if (address != undefined && ofacAddresses.includes(address?.toString())) {
        location.href = "https://www.google.com/search?q=what+are+ofac+sanctions";
      }
    },
  });
  const { chain } = useNetwork();
  const { asPath } = useRouter();

  useEffect(() => {
    if (supportsRewardsModule) getContestRewardsModule();
  }, [supportsRewardsModule]);

  console.log({ rewardsStore });
  console.log({ fundRewardsStore });

  return (
    <>
      <Head>
        <title>Contest {contestName ? contestName : ""} rewards - JokeDAO</title>
        <meta name="description" content="JokeDAO is an open-source, collaborative decision-making platform." />
      </Head>
      <h1 className="sr-only">Rewards of contest {contestName ? contestName : address} </h1>
      {!isLoading && isSuccess && (
        <>
          {!supportsRewardsModule ? (
            <>
              <p className="p-3 mt-4 rounded-md bg-primary-1 text-primary-10 border-primary-4 mb-5 text-sm font-bold">
                This contest doesn&apos;t support rewards.
              </p>
            </>
          ) : (
            <>
              {rewardsStore.isLoading && (
                <>
                  <Loader scale="component">Loading rewards module...</Loader>
                </>
              )}
              {rewardsStore.isSuccess && (
                <>
                  {isBefore(new Date(), new Date(votesClose)) && (
                    <p className="animate-appear p-3 mt-4 rounded-md bg-primary-1 text-primary-10 border-primary-4 mb-5 text-sm font-bold">
                      Contest must end to send rewards.
                    </p>
                  )}
                  <div className="animate-appear flex flex-col gap-4 p-3 rounded-md border border-solid border-neutral-4 text-sm">
                    <p className="overflow-hidden text-start sm:text-center text-ellipsis">
                      Rewards module contract address: <br />
                      <a
                        className="link"
                        href={`${rewardsStore?.rewards?.blockExplorers?.url}/address/${rewardsStore?.rewards?.contractAddress}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {rewardsStore?.rewards?.contractAddress}
                      </a>
                      <br />
                      {"Note: this code has not been audited yet, but can be verified on our "}
                      <a
                        className="link"
                        href="https://github.com/JokeDAO/JokeDaoV2Dev"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        GitHub
                      </a>
                      .
                    </p>
                    <div className="flex sm:justify-center flex-wrap gap-3">
                      {rewardsStore?.rewards?.creator === currentAccount?.address && (
                        <>
                          <Button
                            className="w-full 2xs:w-fit-content"
                            onClick={() => fundRewardsStore.setIsModalOpen(true)}
                            scale="sm"
                            intent="primary-outline"
                          >
                            💸 Add funds&nbsp; <span className="sr-only xs:not-sr-only">to pool</span>
                          </Button>
                          <Button
                            className="w-full 2xs:w-fit-content"
                            scale="sm"
                            intent="neutral-outline"
                            onClick={() => setIsWithdrawFundsDialogOpen(true)}
                          >
                            🤑 Withdraw funds&nbsp; <span className="sr-only xs:not-sr-only">from pool</span>
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col animate-appear pt-4 space-y-8">
                    <ul className="space-y-6">
                      {rewardsStore?.rewards?.payees?.map((payee: any) => (
                        <li className="animate-appear" key={`rank-${`${payee}`}`}>
                          <RewardsWinner
                            chainId={
                              chains.filter(
                                chain => chain.name.toLowerCase().replace(" ", "") === asPath.split("/")?.[2],
                              )?.[0]?.id
                            }
                            payee={payee}
                            erc20Tokens={rewardsStore.rewards.balance}
                            contractRewardsModuleAddress={rewardsStore.rewards.contractAddress}
                            abiRewardsModule={rewardsStore.rewards.abi}
                            totalShares={rewardsStore.rewards.totalShares}
                          />
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="pt-12 flex flex-col items-center gap-1 justify-center animate-appear">
                    <p className="text-neutral-10 text-xs">Don&apos;t see a token you&apos;re expecting?</p>
                    <Button
                      className="w-full 2xs:w-fit-content"
                      onClick={() => setIsDialogCheckBalanceOpen(true)}
                      scale="sm"
                      intent="ghost-neutral"
                    >
                      💰 Check it manually
                    </Button>
                  </div>
                  <DialogCheckBalanceRewardsModule
                    isOpen={isDialogCheckBalanceOpen}
                    setIsOpen={setIsDialogCheckBalanceOpen}
                  />
                  <DialogFundRewardsModule
                    setIsOpen={fundRewardsStore.setIsModalOpen}
                    isOpen={fundRewardsStore.isModalOpen}
                  />
                  <DialogWithdrawFundsFromRewardsModule
                    isOpen={isWithdrawnFundsDialogOpen}
                    setIsOpen={setIsWithdrawFundsDialogOpen}
                  >
                    <Tab.Group>
                      <Tab.List className="animate-appear overflow-hidden text-xs font-medium mb-6 divide-i divide-neutral-4 flex rounded-full border-solid border border-neutral-4">
                        {["ERC20", chain?.nativeCurrency?.symbol].map(tab => (
                          <Tab key={tab} as={Fragment}>
                            {({ selected }) => (
                              /* Use the `selected` state to conditionally style the selected tab. */
                              <button
                                className={`normal-case p-1 w-1/2 text-center
                ${selected ? "bg-positive-9 text-positive-1 font-bold" : ""}`}
                              >
                                {tab}
                              </button>
                            )}
                          </Tab>
                        ))}
                      </Tab.List>
                      <Tab.Panels>
                        <Tab.Panel>
                          {rewardsStore?.rewards?.balance?.length ? (
                            <ul className="flex flex-col items-center space-y-6">
                              {rewardsStore?.rewards?.balance?.map((token: { contractAddress: string }) => (
                                <li
                                  className="flex flex-col items-center"
                                  key={`withdraw-erc20-${token.contractAddress}`}
                                >
                                  <ButtonWithdrawERC20Reward
                                    contractRewardsModuleAddress={rewardsStore.rewards.contractAddress}
                                    abiRewardsModule={rewardsStore.rewards.abi}
                                    tokenAddress={token.contractAddress}
                                  />
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <>
                              <p className="italic animate-appear text-neutral-11">
                                No balance found for ERC20 tokens.
                              </p>
                            </>
                          )}
                        </Tab.Panel>
                        <Tab.Panel className="flex flex-col items-center">
                          <ButtonWithdrawNativeReward
                            contractRewardsModuleAddress={rewardsStore.rewards.contractAddress}
                            abiRewardsModule={rewardsStore.rewards.abi}
                          />
                        </Tab.Panel>
                      </Tab.Panels>
                    </Tab.Group>
                  </DialogWithdrawFundsFromRewardsModule>
                </>
              )}
            </>
          )}
        </>
      )}
    </>
  );
};

const REGEX_ETHEREUM_ADDRESS = /^0x[a-fA-F0-9]{40}$/;

export async function getStaticPaths() {
  return { paths: [], fallback: true };
}

export async function getStaticProps({ params }: any) {
  const { chain, address } = params;
  if (
    !REGEX_ETHEREUM_ADDRESS.test(address) ||
    chains.filter(c => c.name.toLowerCase().replace(" ", "") === chain).length === 0
  ) {
    return { notFound: true };
  }

  try {
    return {
      props: {
        address,
      },
    };
  } catch (error) {
    console.error(error);
    return { notFound: true };
  }
}

export const getLayout = (page: any) => {
  return getLayoutContest(
    <RewardsWrapper>
      <FundRewardsWrapper>{page}</FundRewardsWrapper>
    </RewardsWrapper>,
  );
};
Page.getLayout = getLayout;

export default Page;
